namespace Server_2_0.Entities;
    public class FillersEntity
    {
        public int Id { get; set; }
        public required string UserName { get; set; }
        public int Points { get; set; }
        public string? grade { get; set; }
        public int QuizId { get; set; }
        public required QuizEntity Quiz { get; set; }
    }