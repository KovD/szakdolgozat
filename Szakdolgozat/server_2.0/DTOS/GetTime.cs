using System.ComponentModel.DataAnnotations;

namespace Server_2_0.DTOS;
    public record GetTimeDTO
    {
        public DateTime CurrentTime {get;set;}
        public int FillerID {get;set;}
        public int QuizID {get;set;}
    }