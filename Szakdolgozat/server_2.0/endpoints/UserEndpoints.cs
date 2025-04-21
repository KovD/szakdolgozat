using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Server_2_0.Data;
using Server_2_0.DTOS;
using Server_2_0.Entities;
using BCrypt.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text.RegularExpressions;

namespace Server_2_0.endpoints.UserEndpoints
{
    public static class UserEndpoints
    {
        private static string GenerateJwtToken(UserEntity user, string secretKey)
        {
            var key = Encoding.UTF8.GetBytes(secretKey);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                NotBefore = DateTime.UtcNow,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

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

        public static WebApplication RegisterUserEndpoints(this WebApplication app)
        {
            Console.WriteLine("Registering User Endpoints");
            var group = app.MapGroup("/users");

            group.MapPost("/register", async (AddUser user, QuizWebContext db) =>
            {
                var existingUser = await db.Users.FirstOrDefaultAsync(u => u.UserName == user.UserName);
                if (existingUser != null)
                {
                    return Results.BadRequest("Username is already taken.");
                }

                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

                UserEntity newUser = new()
                {
                    UserName = user.UserName,
                    Password = hashedPassword
                };

                db.Users.Add(newUser);
                await db.SaveChangesAsync();

                return Results.Created($"/users/{newUser.Id}", newUser);
            });

            group.MapPost("/login", (LoginUser login, QuizWebContext db, IConfiguration config) =>
            {
                var user = db.Users.FirstOrDefault(u => u.UserName == login.UserName);

                if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                {
                    return Results.Unauthorized();
                }

                var secretKey = config["Jwt:SecretKey"] ?? throw new Exception("JWT Secret Key is missing in configuration!");
                var token = GenerateJwtToken(user, secretKey);

                var loginResponse = new LoginResponse
                {
                    Token = token
                };
                return Results.Ok(loginResponse);
            });

            app.MapGet("/ping", () => Results.Ok("pong"));

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

            group.MapGet("/CheckUsername/{name}", async (string name, QuizWebContext db) =>
            {
                bool exists = await db.Users.AnyAsync(u => u.UserName == name);
                return Results.Ok(new { exists = exists });
            });
            
            group.MapGet("/CheckToken", [Authorize] () => Results.Ok(new { message = "Token is valid" }));

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

            group.MapPost("/UploadData", (NewFillerDTO Filler, QuizWebContext db) => {
                var quiz = db.Quizes.Find(Filler.QuizID);
                if (quiz == null)
                {
                    return Results.BadRequest("Nem létező quiz ID!");
                }
                FillersEntity NewFiller = new(){
                    Quiz = quiz,
                    start = Filler.Start
                };
                db.Fillers.Add(NewFiller);
                db.SaveChanges();

                foreach(var prop in Filler.Props){
                    FillerPropsEntity NewProps = new(){
                        filler = NewFiller,
                        name = prop.Type,
                        value = prop.Value
                    };
                    db.FillerProps.Add(NewProps);
                    db.SaveChanges();
                }

                return Results.Ok(NewFiller.Id);
            });

            group.MapPut("/CheckQuiz", (AnswersBackDTO Test, QuizWebContext db) =>{
                int points = 0;
                int id = Test.quizId;
                int filler = Test.FillerID;
                int FillerScore = 0;
                var questionsWithAnswers = db.Questions
                .Where(q => q.QuizID == id)
                .Select(q => new
                {
                    id = q.Id,
                    Question = q.Question,
                    RightAnswers = db.RightAnswers
                        .Where(r => r.QuestionID == q.Id)
                        .Select(r => r.RightAnswer)
                        .ToList()
                })
                .ToList();

                foreach (var answer in Test.answers)
                {
                    var question = questionsWithAnswers.FirstOrDefault(q => q.id == answer.id);
                    if (question != null && question.RightAnswers.Contains(answer.selected.value.Trim()))
                    {
                        FillerScore++;
                    }
                }

                double percentage = (double)FillerScore / questionsWithAnswers.Count * 100;
                double Result = Math.Round(percentage, 2);
                var Modfiller = db.Fillers.Find(filler);
                if(!Test.infinite){
                    Modfiller.Points = Convert.ToInt16(Result);
                } else {
                    if (Result > 0)
                    {
                        Modfiller.Points += 1;
                    }
                    points = Modfiller.Points;
                }
                db.SaveChanges();

                SendbackRes res =  new(){
                    Points = points,
                    Percentage = Result
                };
                return Results.Ok(res);
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
            
            group.MapPost("/GetTime", (GetTimeDTO TimeCheck, QuizWebContext db) => {
                var filler = db.Fillers.FirstOrDefault(f => f.Id == TimeCheck.FillerID);
                if (filler == null)
                {
                    return Results.BadRequest("Filler nem található!");
                }
                DateTime Start = filler.start;
                int time = db.Quizes.Find(TimeCheck.QuizID).Timer;

                double elapsedMins = (TimeCheck.CurrentTime - Start).TotalMinutes;
                var timer = new SendBackTime(Convert.ToInt16(elapsedMins), time);

                return Results.Ok(timer);
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
