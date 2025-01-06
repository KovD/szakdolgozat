using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/ping")]
public class PingController : ControllerBase
{
    [HttpGet]
    public IActionResult GetPing()
    {
        Console.WriteLine("Ping");
        return Ok("pong");
    }
}