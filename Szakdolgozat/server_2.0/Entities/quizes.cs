namespace Server_2_0.Entities;
    public class QuizEntity
    {
        public int Id { get; set; }
        public required string QuizName { get; set; }
        public required string Json { get; set; }
        public required DateTime Creation = DateTime.Now;
        public required string Code { get; set; }
        public int UserId { get; set; }
        public required UserEntity User { get; set; }
    }