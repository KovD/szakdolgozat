using System.Text.RegularExpressions;
using Server_2_0.Data;
using Server_2_0.DTOS;
using Server_2_0.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Server_2_0.endpoints.QuizEndpoints
{
    public static class QuizEndpoints
    {
        private static string GenerateRandomCode(QuizWebContext db, int length = 6)
        {
            const string chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
            var random = new Random();
            string baseCode = new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            int counter = 0;
            string finalCode;
            do
            {
                finalCode = $"{baseCode}-{counter:D3}";
                counter++;
            } while (db.Quizes.Any(q => q.Code == finalCode));

            return finalCode;
        }

        public static WebApplication RegisterQuizEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/quiz");
            
            group.MapPost("/PostQuiz", [Authorize](AddQuiz Quiz, QuizWebContext db, HttpContext context) =>
            {
                var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
                string Gencode = GenerateRandomCode(db);
                if (userIdClaim == null)
                {
                    return Results.Unauthorized();
                }

                int userId = int.Parse(userIdClaim.Value);

                var user = db.Users.Find(userId);

                if (Quiz == null)
                {
                    return Results.BadRequest();
                }
                
                QuizEntity newQuiz = new()
                {
                    QuizName = Quiz.Allprops.Title,
                    Code = Gencode,
                    Creation = DateTime.Now,
                    Timer = Quiz.Allprops.Timer,
                    Infinite = Quiz.Allprops.Infinite,
                    UserId = userId,
                    User = user
                };

                db.Quizes.Add(newQuiz);
                db.SaveChanges();

                foreach (var prop in Quiz.Allprops.Props)
                {
                    PropEntity newProp = new()
                    {
                    QuizID = newQuiz.Id,
                    PropName = prop.Title,
                    Type = prop.Type,
                    Quiz = db.Quizes.Find(newQuiz.Id)
                    };

                    db.Props.Add(newProp);
                    db.SaveChanges();
                }

                foreach (var Questions in Quiz.DataQuestions)
                {
                    QuestionEntity NewQuestion = new()
                    {
                        Question = Questions.Title,
                        QuizID = newQuiz.Id,
                        Quiz = newQuiz,
                        Amount = Questions.Amount ?? 100
                    };

                    db.Questions.Add(NewQuestion);
                    db.SaveChanges();

                    foreach (var WrongAnswers in Questions.WrongAnswers)
                    {
                        WrongAnswersEntity NewWrongAnswer = new()
                        {
                            QuestionID = NewQuestion.Id,
                            WrongAnswer = WrongAnswers,
                            Quiz = NewQuestion
                        };

                        db.WrongAnswers.Add(NewWrongAnswer);
                        db.SaveChanges();
                    }


                    foreach (var RightAnswer in Questions.CorrectAnswer)
                    {
                        RightAnswersEntity NewCorrectAnswer = new()
                        {
                            QuestionID = NewQuestion.Id,
                            RightAnswer = RightAnswer,
                            Quiz = NewQuestion
                        };

                        db.RightAnswers.Add(NewCorrectAnswer);
                        db.SaveChanges();
                    }
                }

                foreach (var Tags in Quiz.Tags)
                {
                    TagsEntity NewTag = new()
                    {
                        QuizID = newQuiz.Id,
                        Name = Tags.TagName,
                        Value = Tags.Value,
                        Quiz = newQuiz
                    };

                    db.Tags.Add(NewTag);
                    db.SaveChanges();
                }

                return Results.Ok(Gencode);
            });
            
            group.MapGet("/GetQuiz/{code}", (string code, QuizWebContext db) =>
            {
                var Quiz = db.Quizes.FirstOrDefault(q => q.Code == code);
                if (Quiz == null)
                {
                    return Results.NotFound();
                }

                int ID = Quiz.Id;
                Random rng = new Random();


                var Questions = db.Questions
                    .Where(q => q.QuizID == ID)
                    .AsEnumerable()
                    .OrderBy(q => rng.Next())
                    .ToArray();

                TagsEntity[] Tags = db.Tags.Where(t => t.QuizID == ID).ToArray();
                PropEntity[] Props = db.Props.Where(p => p.QuizID == ID).ToArray();
                
                SendbackQuiz SendBack = new()
                {
                    Title = Quiz.QuizName,
                    Timer = Quiz.Timer,
                    Infinite = Quiz.Infinite,
                    ID = ID
                };


                SendBack.Tags.AddRange(Tags.Select(t => new TagsDto 
                { 
                    Id = t.Name, 
                    Value = t.Value 
                }));

                SendBack.Props.AddRange(Props.Select(p => new OptPropsDto
                {
                    Value = p.PropName,
                    Type = p.Type
                }));


                foreach (var Question in Questions)
                {
                    var NewQuestion = new QuestionsDto
                    {
                        id = Question.Id,
                        Question = Question.Question
                    };

                    int Amount = Question.Amount;
                    var RightAnswers = db.RightAnswers
                        .Where(r => r.QuestionID == Question.Id)
                        .ToArray();
                    var WrongAnswers = db.WrongAnswers
                        .Where(w => w.QuestionID == Question.Id)
                        .ToArray();

                    var allAnswers = new List<AnswersDto>();
                    if (RightAnswers.Length > 0)
                    {
                        var correct = RightAnswers[rng.Next(RightAnswers.Length)];
                        allAnswers.Add(new AnswersDto 
                        { 
                            id = correct.Id, 
                            Value = correct.RightAnswer 
                        });
                    }

                    var wrongsToAdd = (Amount == 0 || Amount > WrongAnswers.Length + 1)
                        ? WrongAnswers
                        : WrongAnswers.OrderBy(x => rng.Next())
                                    .Take(Amount - 1);

                    allAnswers.AddRange(wrongsToAdd.Select(w => new AnswersDto
                    {
                        id = w.Id,
                        Value = w.WrongAnswer
                    }));

                    NewQuestion.Answers.AddRange(allAnswers
                        .OrderBy(a => rng.Next()));

                    SendBack.Questions.Add(NewQuestion);
                }

                return Results.Ok(SendBack);
            });

            group.MapGet("/GetQuizWithID/{id}", (int id, QuizWebContext db) =>
            {
                var Quiz = db.Quizes.FirstOrDefault(q => q.Id == id);
                if (Quiz == null)
                {
                    return Results.NotFound("Nem tom");
                }

                int ID = Quiz.Id;
                Random rng = new Random();


                var Questions = db.Questions
                    .Where(q => q.QuizID == ID)
                    .AsEnumerable()
                    .OrderBy(q => rng.Next())
                    .ToArray();

                TagsEntity[] Tags = db.Tags.Where(t => t.QuizID == ID).ToArray();
                PropEntity[] Props = db.Props.Where(p => p.QuizID == ID).ToArray();
                
                SendbackQuiz SendBack = new()
                {
                    Title = Quiz.QuizName,
                    Timer = Quiz.Timer,
                    Infinite = Quiz.Infinite,
                    ID = ID
                };


                SendBack.Tags.AddRange(Tags.Select(t => new TagsDto 
                { 
                    Id = t.Name, 
                    Value = t.Value 
                }));

                SendBack.Props.AddRange(Props.Select(p => new OptPropsDto
                {
                    Value = p.PropName,
                    Type = p.Type
                }));


                foreach (var Question in Questions)
                {
                    var NewQuestion = new QuestionsDto
                    {
                        id = Question.Id,
                        Question = Question.Question
                    };

                    int Amount = Question.Amount;
                    var RightAnswers = db.RightAnswers
                        .Where(r => r.QuestionID == Question.Id)
                        .ToArray();
                    var WrongAnswers = db.WrongAnswers
                        .Where(w => w.QuestionID == Question.Id)
                        .ToArray();

                    var allAnswers = new List<AnswersDto>();
                    if (RightAnswers.Length > 0)
                    {
                        var correct = RightAnswers[rng.Next(RightAnswers.Length)];
                        allAnswers.Add(new AnswersDto 
                        { 
                            id = correct.Id, 
                            Value = correct.RightAnswer 
                        });
                    }

                    var wrongsToAdd = (Amount == 0 || Amount > WrongAnswers.Length + 1)
                        ? WrongAnswers
                        : WrongAnswers.OrderBy(x => rng.Next())
                                    .Take(Amount - 1);

                    allAnswers.AddRange(wrongsToAdd.Select(w => new AnswersDto
                    {
                        id = w.Id,
                        Value = w.WrongAnswer
                    }));

                    NewQuestion.Answers.AddRange(allAnswers
                        .OrderBy(a => rng.Next()));

                    SendBack.Questions.Add(NewQuestion);
                }
                return Results.Ok(SendBack);
            });

            group.MapDelete("/DeleteQuiz/{id}", (int id, QuizWebContext db) =>
            {
                var quiz = db.Quizes.FirstOrDefault(q => q.Id == id);
                
                if (quiz == null)
                {
                    return Results.NotFound("Quiz not found.");
                }

                db.Quizes.Remove(quiz);
                db.SaveChanges();

                return Results.Ok("Quiz deleted successfully.");
            });

            group.MapGet("/GetMyQuizes", [Authorize](QuizWebContext db, HttpContext context) =>{
                var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
                int userId = int.Parse(userIdClaim.Value);
                if (userIdClaim == null)
                {
                    return Results.Unauthorized();
                }

                var quizzesWithFillers = db.Quizes
                .Where(q => q.UserId == userId)
                .Select(q => new
                {
                    QuizName = q.QuizName,
                    QuizID = q.Id,
                    quizCode = q.Code,
                    IsInfinite = q.Infinite,
                    Fillers = db.Fillers
                        .Where(f => f.QuizId == q.Id)
                        .Select(f => new
                        {
                            Score = f.Points,
                            Properties = db.FillerProps
                                .Where(fp => fp.fillerID == f.Id)
                                .Select(fp => new
                                {
                                    Name = fp.name,
                                    Value = fp.value
                                })
                                .ToList()
                        })
                        .ToList()
                })
                .ToList();

                return Results.Ok(quizzesWithFillers);
            });
            
            group.MapGet("/GetQuizDetails/{id}", (int id, QuizWebContext db) =>
            {
                var quiz = db.Quizes
                    .Include(q => q.Props)
                    .Include(q => q.Tags)
                    .Include(q => q.Questions)
                        .ThenInclude(q => q.RightAnswers)
                    .Include(q => q.Questions)
                        .ThenInclude(q => q.WrongAnswers)
                    .FirstOrDefault(q => q.Id == id);

                if (quiz == null)
                {
                    return Results.NotFound("A kvíz nem található.");
                }

                var quizDetails = new QuizDetailsDTO(
                    quiz.Id,
                    quiz.QuizName,
                    quiz.Code,
                    quiz.Creation,
                    quiz.Timer,
                    quiz.Infinite,
                    quiz.Props.Select(p => new PropDTO(p.PropName, p.Type)).ToList(),
                    quiz.Tags.Select(t => new TagDTO(t.Name, t.Value)).ToList(),
                    quiz.Questions.Select(q => new QuestionDetailsDTO(
                        q.Id,
                        q.Question,
                        q.Amount,
                        q.RightAnswers.Select(ra => ra.RightAnswer).ToList(),
                        q.WrongAnswers.Select(wa => wa.WrongAnswer).ToList()
                    )).ToList()
                );

                return Results.Ok(quizDetails);
            });

            group.MapPut("/UpdateQuiz", [Authorize] async (UpdateQuizDTO updateData, QuizWebContext db, HttpContext context) =>
            {
                var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Results.Unauthorized();

                int userId = int.Parse(userIdClaim.Value);

                var existingQuiz = await db.Quizes
                    .Include(q => q.Props)
                    .Include(q => q.Tags)
                    .Include(q => q.Questions)
                        .ThenInclude(q => q.RightAnswers)
                    .Include(q => q.Questions)
                        .ThenInclude(q => q.WrongAnswers)
                    .FirstOrDefaultAsync(q => q.Id == updateData.quizID);

                if (existingQuiz.UserId != userId)
                    return Results.Forbid();

                using var transaction = await db.Database.BeginTransactionAsync();

                    db.Props.RemoveRange(existingQuiz.Props);
                    db.Tags.RemoveRange(existingQuiz.Tags);
                    foreach (var question in existingQuiz.Questions)
                    {
                        db.RightAnswers.RemoveRange(question.RightAnswers);
                        db.WrongAnswers.RemoveRange(question.WrongAnswers);
                    }
                    db.Questions.RemoveRange(existingQuiz.Questions);


                    existingQuiz.QuizName = updateData.QuizData.Allprops.Title;
                    existingQuiz.Timer = updateData.QuizData.Allprops.Timer;
                    existingQuiz.Infinite = updateData.QuizData.Allprops.Infinite;


                    foreach (var propDto in updateData.QuizData.Allprops.Props)
                    {
                        db.Props.Add(new PropEntity
                        {
                            QuizID = existingQuiz.Id,
                            Quiz = existingQuiz,
                            PropName = propDto.Title,
                            Type = propDto.Type
                        });
                    }


                    foreach (var tagDto in updateData.QuizData.Tags)
                    {
                        db.Tags.Add(new TagsEntity
                        {
                            QuizID = existingQuiz.Id,
                            Quiz = existingQuiz,
                            Name = tagDto.TagName,
                            Value = tagDto.Value
                        });
                    }


                    foreach (var questionDto in updateData.QuizData.DataQuestions)
                    {
                        var newQuestion = new QuestionEntity
                        {
                            QuizID = existingQuiz.Id,
                            Question = questionDto.Title,
                            Amount = questionDto.Amount ?? 100,
                            Quiz = existingQuiz
                        };
                        db.Questions.Add(newQuestion);
                        await db.SaveChangesAsync();

                        foreach (var correctAnswer in questionDto.CorrectAnswer)
                        {
                            db.RightAnswers.Add(new RightAnswersEntity
                            {
                                Quiz = newQuestion,
                                QuestionID = newQuestion.Id,
                                RightAnswer = correctAnswer
                            });
                        }

                        foreach (var wrongAnswer in questionDto.WrongAnswers)
                        {
                            db.WrongAnswers.Add(new WrongAnswersEntity
                            {
                                Quiz = newQuestion,
                                QuestionID = newQuestion.Id,
                                WrongAnswer = wrongAnswer
                            });
                        }
                    }

                    await db.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Results.Ok();
            });

            return app;
        }
    }
}