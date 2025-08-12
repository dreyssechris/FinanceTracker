using Microsoft.EntityFrameworkCore;
using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Category> Categories => Set<Category>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Enum will be stored as string in the database
        modelBuilder.Entity<Transaction>()
            .Property(t => t.Type)
            .HasConversion<string>();

        modelBuilder.Entity<Transaction>()
            .Property(testc => testc.Amount)
            .HasPrecision(18, 2); // Set precision for decimal amounts

        // Configure the primary key for the Transaction entity
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Category)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CategoryId)
            .IsRequired();

        base.OnModelCreating(modelBuilder);
    }
}
