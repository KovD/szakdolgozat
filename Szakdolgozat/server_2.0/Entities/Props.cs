namespace Server_2_0.Entities;
    public class PropEntity
    {
        public int Id { get; set; }
        public required string PropName { get; set; }
        public required string Type { get; set; }
        public required int QuizID { get; set; }
        public required QuizEntity Quiz { get; set; }
    }