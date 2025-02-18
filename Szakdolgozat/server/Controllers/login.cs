using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Server.Models;

[Route("api/Login")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly string _connectionString = "Data Source=Database.db";



    [HttpPost]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        try
        {
            Console.WriteLine($"Received login request for user: {user.UserName}");
            if (user == null || string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.Password))
            {
                Console.WriteLine("Missing username or password.");
                return BadRequest(new { message = "Missing username or password." });
            }

            using (var connection = new SqliteConnection(_connectionString))
            {
                await connection.OpenAsync();

                var checkCommand = connection.CreateCommand();
                checkCommand.CommandText = "SELECT Password FROM Users WHERE UserName COLLATE NOCASE = @username";
                checkCommand.Parameters.AddWithValue("@username", user.UserName);

                var hashedPassword = await checkCommand.ExecuteScalarAsync() as string;

                if (hashedPassword == null)
                {
                    Console.WriteLine("Invalid username or password.");
                    return BadRequest(new { message = "Invalid username or password." });
                }

                var passwordHasher = new PasswordHasher<User>();
                var result = passwordHasher.VerifyHashedPassword(null, hashedPassword, user.Password);

                if (result == PasswordVerificationResult.Failed)
                {
                    Console.WriteLine("Password verification failed.");
                    return Unauthorized(new { message = "Invalid username or password." });
                }

                Console.WriteLine("Login successful.");
                return Ok(new { success = true, message = "Login successful." });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during login: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred while processing your request." });
        }
    }
}
