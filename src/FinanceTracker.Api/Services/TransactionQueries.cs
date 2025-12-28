using FinanceTracker.Api.Data;
using FinanceTracker.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Services;

public sealed class TransactionQueries(AppDbContext context) : ITransactionQueries
{
    public Task<List<TransactionReadDto>> GetAllNewestFirstAsync(CancellationToken ct) =>
        context.Transactions
            .AsNoTracking()
            .OrderByDescending(t => t.Date)   // neueste zuerst
            .ThenByDescending(t => t.Id)      // stabil bei gleichen Datumswerten
            .Select(t => new TransactionReadDto {
                Id = t.Id, Title = t.Title, Amount = t.Amount,
                Description = t.Description, Date = t.Date,
                Type = t.Type, CategoryId = t.CategoryId
            })
            .ToListAsync(ct);
}