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
            .OnDelete(DeleteBehavior.Restrict) // if tryed to delete a parent (category), with min 1 child error is thrown ( FOREIGN KEY constraint violation)
            .IsRequired();

        // Category Constraints
        modelBuilder.Entity<Category>()
                .HasIndex(c => c.Name)
                .IsUnique();

        // Standard category if category is skipped or deleted
        modelBuilder.Entity<Category>().HasData(
            new Category
            {
                Id = 1,
                Name = "Uncategorized"
            }
        );

        base.OnModelCreating(modelBuilder);
        
        // Indexes for better Sort/Query
        modelBuilder.Entity<Transaction>().HasIndex(t => t.Date);
        modelBuilder.Entity<Transaction>().HasIndex(t => new { t.Date, t.Id }); // more stable sorting
    }
}
