using Microsoft.EntityFrameworkCore;
using Server_2_0.Entities;

namespace Server_2_0.Data;

public class QuizWebContext : DbContext
{
    public QuizWebContext(DbContextOptions<QuizWebContext> options) : base(options) { }

    public DbSet<QuizEntity> Quizes => Set<QuizEntity>();
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<FillersEntity> Fillers => Set<FillersEntity>();

}
