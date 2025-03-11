namespace Server_2_0.DTOS;

public record class AnswersBackDTO{
    public int quizId {get;set;}
    public bool infinite {get;set;} = false;
    public List<AddedProps> props {get;set;}= new();
    public List<QuestionDTO> answers {get;set;} = new();

}

public record class QuestionDTO{
    public int id {get; set;}
    public string question {get;set;}= string.Empty;
    public answerDTO selected {get;set;} = new();
}

public record class answerDTO{
    public int index {get; set;}
    public string value {get;set;} = string.Empty;

}

public record class AddedProps{
    public string id {get;set;} = string.Empty;
    public string value {get;set;} = string.Empty;
}


