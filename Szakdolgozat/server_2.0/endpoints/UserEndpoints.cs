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

        public static WebApplication RegisterUserEndpoints(this WebApplication app)
        {
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


            group.MapGet("/CheckUsername/{name}", async (string name, QuizWebContext db) =>
            {
                bool exists = await db.Users.AnyAsync(u => u.UserName == name);
                return Results.Ok(new { exists = exists });
            });
            
            group.MapGet("/CheckToken", [Authorize] () => Results.Ok(new { message = "Token is valid" }));

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

            return app;
        }
    }
}
