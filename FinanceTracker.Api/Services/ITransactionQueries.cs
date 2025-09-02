namespace FinanceTracker.Api.Services;
using FinanceTracker.Api.Dtos;

public interface ITransactionQueries
{
    Task<List<TransactionReadDto>> GetAllNewestFirstAsync(CancellationToken ct);
}