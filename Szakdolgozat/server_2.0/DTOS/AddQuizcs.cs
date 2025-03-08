using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Server_2_0.DTOS
{
    public class AddQuiz
    {
        [JsonPropertyName("dataQuestions")]
        public List<QuestionDto> DataQuestions { get; set; } = new();

        [JsonPropertyName("tags")]
        public List<TagDto> Tags { get; set; } = new();

        [JsonPropertyName("Allprops")]
        public PropsDto Allprops { get; set; } = new();
    }

    public class QuestionDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("correctAnswer")]
        public string CorrectAnswer { get; set; } = string.Empty;

        [JsonPropertyName("wrongAnswers")]
        public List<string> WrongAnswers { get; set; } = new();

        [JsonPropertyName("amount")]
        public int? Amount { get; set; }
    }

    public class TagDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("value")]
        public string Value { get; set; } = string.Empty;
    }

    public class PropsDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("timer")]
        public int Timer { get; set; }

        [JsonPropertyName("infinite")]
        public bool Infinite { get; set; }

        [JsonPropertyName("props")]
        public List<AddedPropsDto> Props { get; set; } = new();
    }

    public class AddedPropsDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;
    }
}