using System.Collections.Generic;

namespace Server_2_0.DTOS;

public class SendbackQuiz
{
    public string Title { get; set; } = string.Empty;
    public int Timer { get; set; }
    public bool Infinite { get; set; }
    public List<OptPropsDto> Props { get; set; } = new();
    public List<TagsDto> Tags { get; set; } = new();
    public List<QuestionsDto> Questions { get; set; } = new();
}

public class QuestionsDto{
    public string Question { get; set; } = string.Empty;
    public List<AnswersDto> Answers { get; set; } = new();
}

public class AnswersDto{
    public int id { get; set; }
    public string Value {get; set; } = string.Empty;
}

public class TagsDto{
    public string Id { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

public class OptPropsDto
{
    public string Type { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
