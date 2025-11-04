using Microsoft.EntityFrameworkCore;
using geekzKai.Data;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecific", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
         .AllowAnyMethod()
        .AllowAnyHeader();

    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//Sql Server Connection
builder.Services.AddDbContext<AppdbContext>(options =>
      options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors();
app.MapControllers();
app.Run();