using Microsoft.EntityFrameworkCore;
using Server_2_0.Entities;

namespace Server_2_0.Data;

public class QuizWebContext : DbContext
{
    public QuizWebContext(DbContextOptions<QuizWebContext> options) : base(options) { }

    public DbSet<QuizEntity> Quizes => Set<QuizEntity>();
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<FillersEntity> Fillers => Set<FillersEntity>();
    public DbSet<QuestionEntity> Questions => Set<QuestionEntity>();
    public DbSet<RightAnswersEntity> RightAnswers => Set<RightAnswersEntity>();
    public DbSet<WrongAnswersEntity> WrongAnswers => Set<WrongAnswersEntity>();
    public DbSet<TagsEntity> Tags => Set<TagsEntity>();
    public DbSet<PropEntity> Props => Set<PropEntity>();
    public DbSet<FillerPropsEntity> FillerProps => Set<FillerPropsEntity>();
    public DbSet<FillerCurrentEntity> FillerData => Set<FillerCurrentEntity>();

}
