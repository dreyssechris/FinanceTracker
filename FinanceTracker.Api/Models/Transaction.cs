namespace FinanceTracker.Api.Models;

public class Transaction {
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    public int CategoryId { get; set; }
    // Category is required for the transaction to be valid
    // Best practice to hold a reference to the category in Entity Framework Core
    public required Category Category { get; set; } = null!;
}