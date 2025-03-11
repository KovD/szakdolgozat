namespace Server_2_0.Entities;
    public class FillerPropsEntity
    {
        public int Id { get; set; }
        public int fillerID {get; set; }
        public string name {get; set;} = string.Empty;
        public string value {get;set;}=string.Empty;
        public required FillersEntity filler {get;set;}
    }