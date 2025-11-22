using Microsoft.EntityFrameworkCore;
using geekzKai.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// CORS for your frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecific", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://your-frontend-domain.com")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ⚠️ Read JWT values from Render env vars
var jwtKey = builder.Configuration["Jwt__Key"];
var jwtIssuer = builder.Configuration["Jwt__Issuer"];
var jwtAudience = builder.Configuration["Jwt__Audience"];

if (string.IsNullOrEmpty(jwtKey))
    throw new Exception("JWT Key missing! Add Jwt__Key in Render Environment Variables.");

// JWT Authentication
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

// ⚠️ Use PostgreSQL from Render
builder.Services.AddDbContext<AppdbContext>(options =>
    options.UseNpgsql(builder.Configuration["DefaultConnection"])
);

var app = builder.Build();

// Enable Swagger in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware
app.UseRouting();
app.UseCors("AllowSpecific");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
