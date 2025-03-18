namespace Server_2_0.Entities;
    public class FillersEntity
    {
        public int Id { get; set; }
        public int Points { get; set; }
        public int QuizId { get; set; }
        public DateTime start{get;set;}
        public required QuizEntity Quiz { get; set; }
    }