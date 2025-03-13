namespace Server_2_0.Entities;
    public class FillerCurrentEntity
    {
        public int Id { get; set; }
        public int Points { get; set; } = 0;
        public DateTime start{get;set;}
        public int fillerID {get;set;}
        public required FillersEntity Filler { get; set; }
    }