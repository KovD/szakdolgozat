using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Server_2_0.Data;
using Server_2_0.DTOS;
using Server_2_0.endpoints.QuizEndpoints;
using Server_2_0.endpoints.UserEndpoints;

var builder = WebApplication.CreateBuilder(args);

var secretKey = builder.Configuration["Jwt:SecretKey"] 
    ?? throw new Exception("JWT Secret Key is missing in configuration!");

var key = Encoding.UTF8.GetBytes(secretKey);

var connString = builder.Configuration.GetConnectionString("Quizes");

builder.Services.AddSqlite<QuizWebContext>(connString);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("https://kovd.github.io", "https://192.168.1.90:5173", "https://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.MigrateDB();
app.RegisterUserEndpoints();
app.RegisterQuizEndpoints();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.Run();
