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
            .HasOne(q => q.User) // A Quiz entit�snak egy User entit�sa van
            .WithMany(u => u.Quizzes) // A User entit�snak t�bb Quiz-je lehet
            .HasForeignKey(q => q.UserName) // Az idegen kulcs a UserName
            .HasPrincipalKey(u => u.UserName); // A kapcsol�d� kulcs a UserName a User entit�sban

        // Egy�b konfigur�ci�k (pl. nem enged�lyezett null �rt�kek, stb.)
        modelBuilder.Entity<User>()
            .Property(u => u.UserName)
            .IsRequired();

        modelBuilder.Entity<Quiz>()
            .Property(q => q.UserName)
            .IsRequired();
    }
}
