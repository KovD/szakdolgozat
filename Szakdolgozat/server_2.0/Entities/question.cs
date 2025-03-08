namespace Server_2_0.Entities;
    public class QuestionEntity
    {
        public int Id { get; set; }
        public required string Question { get; set; }
        public required int QuizID { get; set; }
        public required QuizEntity Quiz { get; set; }
    }