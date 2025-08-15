using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.Dtos
{
    public class CategoryReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
