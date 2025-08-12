namespace FinanceTracker.Api.Dtos
{
    public class CategoryCreateDTO
    {
        public string Name { get; set; } = string.Empty;
        public ICollection<TransactionReadDTO> Transactions { get; set; } = new List<TransactionReadDTO>();
    }
}
