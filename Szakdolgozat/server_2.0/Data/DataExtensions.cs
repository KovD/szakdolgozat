using Microsoft.EntityFrameworkCore;

namespace Server_2_0.Data;

public static class DataExtensions
{
    public static void MigrateDB(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var DbContext = scope.ServiceProvider.GetRequiredService<QuizWebContext>();
        DbContext.Database.Migrate();
    }
}