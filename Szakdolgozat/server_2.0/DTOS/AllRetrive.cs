public record QuizDetailsDTO(
    int Id,
    string QuizName,
    string Code,
    DateTime Creation,
    int Timer,
    bool Infinite,
    List<PropDTO> Props,
    List<TagDTO> Tags,
    List<QuestionDetailsDTO> Questions
);

public record PropDTO(string PropName, string Type);
public record TagDTO(string Name, string Value);
public record QuestionDetailsDTO(
    int Id,
    string QuestionText,
    int Amount,
    List<string> CorrectAnswers,
    List<string> WrongAnswers
);