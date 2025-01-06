using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Quiz>()
            .HasOne(q => q.User) // A Quiz entitásnak egy User entitása van
            .WithMany(u => u.Quizzes) // A User entitásnak több Quiz-je lehet
            .HasForeignKey(q => q.UserName) // Az idegen kulcs a UserName
            .HasPrincipalKey(u => u.UserName); // A kapcsolódó kulcs a UserName a User entitásban

        // Egyéb konfigurációk (pl. nem engedélyezett null értékek, stb.)
        modelBuilder.Entity<User>()
            .Property(u => u.UserName)
            .IsRequired();

        modelBuilder.Entity<Quiz>()
            .Property(q => q.UserName)
            .IsRequired();
    }
}
