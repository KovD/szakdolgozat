namespace Server_2_0.Entities;
    public class TagsEntity
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Value { get; set; }
        public required int QuizID { get; set; }
        public required QuizEntity Quiz { get; set; }
    }