using System.ComponentModel.DataAnnotations;

namespace Server_2_0.DTOS;
    public record NewFillerDTO
    {
        public int FillerID {get;set;}
        public int QuizID {get;set;}
        public List<OptProps> Props { get; set; } = new();
        public DateTime Start {get; set;}
    }

    public class OptProps
    {
    public string Type { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    }