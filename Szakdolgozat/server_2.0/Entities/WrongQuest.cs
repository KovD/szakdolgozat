namespace Server_2_0.Entities;
    public class WrongAnswersEntity
    {
        public int Id { get; set; }
        public required string WrongAnswer { get; set; }
        public required int QuestionID { get; set; }
        public required QuestionEntity Quiz { get; set; }
    }