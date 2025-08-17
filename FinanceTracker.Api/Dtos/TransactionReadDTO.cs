using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.Dtos
{
    public class TransactionReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Description {  get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public TransactionType Type { get; set; }
        public int CategoryId { get; set; }
    }
}
