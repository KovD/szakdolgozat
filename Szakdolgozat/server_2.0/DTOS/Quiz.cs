namespace Server_2_0.DTOS
{
    public record Quiz
    {
        public int Id { get; init; }
        public string Title { get; init; } = string.Empty;

        public string Location { get; init; } = string.Empty;
        public DateTime CreateDate { get; init; }

    }
}