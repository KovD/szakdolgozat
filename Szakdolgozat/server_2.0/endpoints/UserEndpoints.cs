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

            group.MapPost("/register", (AddUser user, QuizWebContext db) =>
            {
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

                UserEntity newUser = new()
                {
                    UserName = user.UserName,
                    Password = hashedPassword
                };

                db.Users.Add(newUser);
                db.SaveChanges();

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

            group.MapPost("/PostQuiz",[Authorize] (AddQuiz Quiz, QuizWebContext db, HttpContext context) =>
            {
                var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Results.Unauthorized();
                }

                int userId = int.Parse(userIdClaim.Value);

                var user = db.Users.Find(userId);

                Console.WriteLine(userId);

                if (Quiz == null)
                {
                    return Results.BadRequest();
                }
                
                QuizEntity newQuiz = new()
                {
                    QuizName = Quiz.Allprops.Title,
                    Code = GenerateRandomCode(db, 5),
                    Creation = DateTime.Now,
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
                        Quiz = newQuiz
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


                    RightAnswersEntity NewCorrectAnswer = new()
                    {
                        QuestionID = NewQuestion.Id,
                        RightAnswer = Convert.ToString(Questions.CorrectAnswer),
                        Quiz = NewQuestion
                    };

                    db.RightAnswers.Add(NewCorrectAnswer);
                    db.SaveChanges();
                    }

                foreach (var Tags in Quiz.Tags)
                {
                    TagsEntity NewTag = new()
                    {
                        QuizID = newQuiz.Id,
                        Name = Tags.Id,
                        Value = Tags.Value,
                        Quiz = newQuiz
                    };

                    db.Tags.Add(NewTag);
                    db.SaveChanges();
                }

                return Results.Ok();
            });

            group.MapGet("/GetQuiz/{code}", (string code, QuizWebContext db) =>
            {
                int Quiz = db.Quizes.FirstOrDefault(q => q.Code == code).Id;
                QuestionEntity[] Questions = db.Questions.Where(q => q.QuizID == Quiz).ToArray();
                
                SendbackQuiz SendBack = new();

                SendBack.Title = db.Quizes.FirstOrDefault(q => q.Id == Quiz).QuizName;
                SendBack.Timer = 45;
                SendBack.Infinite = false; 

                foreach (var Question in Questions)
                {
                    SendBack.Questions.Add(new QuestionsDto
                    {
                        Question = Question.Question,
                        Answers = db.WrongAnswers.Where(w => w.QuestionID == Question.Id).Select(w => new AnswersDto
                        {
                            id = w.Id,
                            Value = w.WrongAnswer
                        }).ToList()
                    });      
                }
            });
            

            return app;
        }
    }
}
