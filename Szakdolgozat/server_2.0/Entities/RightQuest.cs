namespace Server_2_0.Entities;
    public class RightAnswersEntity
    {
        public int Id { get; set; }
        public required string RightAnswer { get; set; }
        public required int QuestionID { get; set; }
        public required QuestionEntity Quiz { get; set; }
    }