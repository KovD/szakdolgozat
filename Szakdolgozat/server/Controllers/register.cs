using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly string _connectionString = "Data Source=Database.db";

        public RegisterController() { }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                await connection.OpenAsync();

                var checkCommand = connection.CreateCommand();
                checkCommand.CommandText = "SELECT EXISTS (SELECT 1 FROM Users WHERE UserName = @username)";
                checkCommand.Parameters.AddWithValue("@username", user.UserName);

                var exists = (long)(await checkCommand.ExecuteScalarAsync());

                if (exists == 1)
                {
                    return BadRequest(new { message = "Username is already taken." });
                }

                var passwordHasher = new PasswordHasher<User>();
                string hashedPassword = passwordHasher.HashPassword(null, user.Password);

                var insertCommand = connection.CreateCommand();
                insertCommand.CommandText = "INSERT INTO Users (UserName, Password) VALUES (@username, @password)";
                insertCommand.Parameters.AddWithValue("@username", user.UserName);
                insertCommand.Parameters.AddWithValue("@password", hashedPassword);

                await insertCommand.ExecuteNonQueryAsync();
            }

            return Ok(new { message = "User registered successfully." });
        }
    }
}
