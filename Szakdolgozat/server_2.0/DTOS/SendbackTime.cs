using System.ComponentModel.DataAnnotations;

namespace Server_2_0.DTOS;
    public record class SendBackTime
    (
        int elapsedMinsBack,
        int timer
    );