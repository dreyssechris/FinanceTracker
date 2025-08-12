using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.Dtos
{
    public class TransactionReadDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public TransactionType Type { get; set; }
        public int CategoryId { get; set; }
        // Optional zusätzlich:
        // public string CategoryName { get; set; } = string.Empty;
    }
}
