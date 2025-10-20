using FinanceTracker.Api.Data;
using FinanceTracker.Api.Services;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// const string CorsPolicy = "AppCors";
// multiple Origins via ENV, separated by comma:
// FRONTEND_ORIGIN=http://localhost:5173,http://<PI-IP>:5173, https://app.example.com
var allowedOrigins = (Environment.GetEnvironmentVariable("CADDY_EXTERNAL_ORIGIN")
                      ?? "http://192.168.0.168:8080")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

// get the connection string
var connectionString = Environment.GetEnvironmentVariable("DEFAULT_CONNECTION")
    ?? builder.Configuration.GetConnectionString("DefaultConnection"); 

// DB-Kontext using SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// For every Request once add DI for TransactionQueries
builder.Services.AddScoped<ITransactionQueries, TransactionQueries>();

// CORS for React Frontend
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(CorsPolicy, policy => 
//        policy.WithOrigins(allowedOrigins)
//        .AllowAnyHeader()
//        .AllowAnyMethod());
//    // Later for auth with cookies:
//    // .AllowCredentials()
//});

builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {   // So its not serialized as numbers, but as strings -> type: "Expense" instead of type: 0
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Behind Reverse Proxy: respect X-Forwarded-*
app.UseForwardedHeaders(new ForwardedHeadersOptions {
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

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
// app.UseCors(CorsPolicy);
app.UseAuthorization();

app.MapControllers();

app.Run();