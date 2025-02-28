using System.ComponentModel.DataAnnotations;

namespace Server_2_0.DTOS;
    public record class AddUser
    (
        [Required]string UserName,
        [Required]string Password
    );