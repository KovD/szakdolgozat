using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

public class User
{
    [Key]
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public List<Quiz> Quizzes { get; set; } = new List<Quiz>();
}

public class Quiz
{
    public int Id { get; set; }
    public string Json { get; set; } = string.Empty;
    public string UserName { get; set; }
    public User User { get; set; }
}
