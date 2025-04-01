namespace Server_2_0.Entities;
    public class QuizEntity
    {
        public int Id { get; set; }
        public required string QuizName { get; set; }
        public required DateTime Creation = DateTime.Now;
        public required string Code { get; set; }
        public int Timer { get; set; }
        public bool Infinite { get; set; }
        public int UserId { get; set; }
        public UserEntity? User { get; set; }

        public List<PropEntity> Props { get; set; }
    public List<TagsEntity> Tags { get; set; }
    public List<QuestionEntity> Questions { get; set; }
    }