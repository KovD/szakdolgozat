using System.ComponentModel.DataAnnotations;

namespace Server_2_0.DTOS;
    public record User
    {
        public int Id { get; init; }
        public string UserName { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
    }