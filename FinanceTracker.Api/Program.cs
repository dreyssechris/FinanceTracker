using FinanceTracker.Api.Data;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DB-Kontext using SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {   // So its not serialized as numbers, but as strings -> type: "Expense" instead of type: 0
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();   // nice to have
app.UseCors("AllowFrontend");
app.UseAuthorization();

app.MapControllers();

app.Run();