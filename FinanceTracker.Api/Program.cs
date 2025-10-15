using FinanceTracker.Api.Data;
using FinanceTracker.Api.Services;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "AppCors";
var allowedOrigin = Environment.GetEnvironmentVariable("FRONTEND_ORIGIN") 
                    ?? "http://localhost:5173";

// get the connection string
var connectionString = Environment.GetEnvironmentVariable("DEFAULT_CONNECTION")
    ?? builder.Configuration.GetConnectionString("DefaultConnection"); // 

// DB-Kontext using SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// For every Request once add DI for TransactionQueries
builder.Services.AddScoped<ITransactionQueries, TransactionQueries>();

// CORS for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy => 
        policy.WithOrigins(allowedOrigin)
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

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();   // nice to have
app.UseCors(CorsPolicy);
app.UseAuthorization();

app.MapControllers();

app.Run();