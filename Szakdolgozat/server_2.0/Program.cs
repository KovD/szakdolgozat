using Server_2_0.Data;
using Server_2_0.endpoints.UserEndpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("Quizes");

builder.Services.AddSqlite<QuizWebContext>(connString);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
});


var app = builder.Build();

app.MigrateDB();
app.RegisterUserEndpoints();

app.UseCors("AllowFrontend");


app.Run();
