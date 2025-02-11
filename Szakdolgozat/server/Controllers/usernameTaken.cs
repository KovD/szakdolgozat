using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsernameTakenController : ControllerBase
    {
        private readonly string _connectionString = "Data Source=Database.db";

        public UsernameTakenController() { }

        [HttpGet("IsUsernameTaken/{username}")]
        public async Task<IActionResult> IsUsernameTaken(string username)
        {
            bool isTaken = false;

            using (var connection = new SqliteConnection(_connectionString))
            {
                await connection.OpenAsync();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT EXISTS (SELECT 1 FROM Users WHERE UserName = @username)";
                command.Parameters.AddWithValue("@username", username);

                var result = await command.ExecuteScalarAsync();
                isTaken = (result != null && (long)result == 1);
            }

            return Ok(new { isTaken });
        }
    }
}
