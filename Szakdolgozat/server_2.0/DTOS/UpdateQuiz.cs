namespace Server_2_0.DTOS;

public record UpdateQuizDTO{
    public int quizID {get;set;}
    public AddQuiz QuizData {get;set;}= new();
}