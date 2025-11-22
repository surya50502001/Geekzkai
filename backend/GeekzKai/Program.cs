using Microsoft.EntityFrameworkCore;
using geekzKai.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers + JSON settings
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// CORS POLICY
var corsPolicy = "AllowFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins(
                "https://geekzkai-1.onrender.com",
                "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// LOAD ENV VARS (Render injects these)
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var dbConnection = builder.Configuration["DefaultConnection"];

// VALIDATE ENV VARS
if (string.IsNullOrEmpty(jwtKey)) throw new Exception("JWT Key missing");
if (string.IsNullOrEmpty(jwtIssuer)) throw new Exception("JWT Issuer missing");
if (string.IsNullOrEmpty(jwtAudience)) throw new Exception("JWT Audience missing");
if (string.IsNullOrEmpty(dbConnection)) throw new Exception("Database connection missing");

// JWT AUTH
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
    });

// PostgreSQL
builder.Services.AddDbContext<AppdbContext>(options =>
    options.UseNpgsql(dbConnection)
);

var app = builder.Build();

// Enable Swagger in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
};


// Middleware
app.UseRouting();
app.UseCors(corsPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
