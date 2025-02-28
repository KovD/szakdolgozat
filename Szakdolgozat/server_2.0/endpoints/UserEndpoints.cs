using Server_2_0.Data;
using Server_2_0.DTOS;
using Server_2_0.Entities;
using BCrypt.Net;

namespace Server_2_0.endpoints.UserEndpoints
{
    public static class UserEndpoints
    {
        private static readonly List<User> users = new();

        public static WebApplication RegisterUserEndpoints(this WebApplication app) {
        Console.WriteLine("Registering User Endpoints");
        var group = app.MapGroup("/users");
        
        group.MapPost("/register", (AddUser user, QuizWebContext db) => {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

            UserEntity newUser = new() {
                UserName = user.UserName,
                Password = hashedPassword
            };

            db.Users.Add(newUser);
            db.SaveChanges();

            return Results.Created($"/users/{newUser.Id}", newUser);
        });
        
        group.MapPost("/login", (LoginUser login, QuizWebContext db) => {
            var user = db.Users.FirstOrDefault(u => u.UserName == login.UserName);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password)) {
                return Results.Unauthorized();
            }

            return Results.Ok(user);
        });

        return app;
    }
        };
}

