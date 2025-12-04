using Microsoft.EntityFrameworkCore;
using geekzKai.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// CORS
var corsPolicy = "AllowFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins("https://geekzkai-1.onrender.com")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Log all configuration keys for debugging
Console.WriteLine("--- All Configuration Keys ---");
var configuration = builder.Configuration as IConfigurationRoot;
if (configuration != null)
{
    foreach (var provider in configuration.Providers)
    {
        Console.WriteLine($"Provider: {provider.GetType().Name}");
        var keys = provider.GetChildKeys(Enumerable.Empty<string>(), null);
        foreach (var key in keys)
        {
            if (provider.TryGet(key, out var value))
            {
                // Be careful not to log sensitive values in a real production environment
                if (key.ToLower().Contains("key") || key.ToLower().Contains("password") || key.ToLower().Contains("connection"))
                {
                    Console.WriteLine($"{key}: [REDACTED]");
                }
                else
                {
                    Console.WriteLine($"{key}: {value}");
                }
            }
        }
    }
}
Console.WriteLine("-----------------------------");

// LOAD ENV VARS
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var dbConnection = builder.Configuration["ConnectionStrings:DefaultConnection"];

// VALIDATE
if (builder.Environment.IsProduction())
{
    if (string.IsNullOrEmpty(jwtKey)) throw new Exception("JWT Key missing");
    if (string.IsNullOrEmpty(jwtIssuer)) throw new Exception("JWT Issuer missing");
    if (string.IsNullOrEmpty(jwtAudience)) throw new Exception("JWT Audience missing");
    if (string.IsNullOrEmpty(dbConnection)) throw new Exception("Database connection missing");
}
// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dbConnection)
);

// JWT & Google OAuth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Google:ClientId"];
        options.ClientSecret = builder.Configuration["Google:ClientSecret"];
    });

var app = builder.Build();

// Auto-apply any pending EF migrations at startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ENABLE SWAGGER ALWAYS (for debugging)
app.UseSwagger();
app.UseSwaggerUI();



// Middleware

app.UseRouting();

app.UseCors(corsPolicy);

app.UseAuthentication();

app.UseAuthorization();



app.MapControllers();



app.Run();


