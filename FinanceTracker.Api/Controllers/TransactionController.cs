using FinanceTracker.Api.Data;
using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;
using FinanceTracker.Api.Dtos;

namespace FinanceTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionController(AppDbContext context)
        {
            _context = context; 
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var transactions = _context.Transactions
                .Include(t => t.Category)
                .ToList();

            // 200 OK response with the list of transactions
            return Ok(transactions);
        }

        [HttpGet]
        public IActionResult GetbyId(int id)
        {
            var transaction = _context.Transactions.Find(id);
            // If the transaction is not found, return a 404 Not Found response
            return transaction is null ? NotFound() : Ok(transaction);
        }

        [HttpPost]
        public IActionResult Create(TransactionReadDTO dto)
        {
            var transaction = new Transaction
            {
                Title = dto.Title,
                Amount = dto.Amount,
                Date = dto.Date,
                Type = dto.Type,
                CategoryId = dto.CategoryId,
                C
            };

            _context.Transactions.Add(transaction);
            _context.SaveChanges();

            // Return the created transaction with a 201 Created response
            // Uses the rooting Attri
            return CreatedAtAction(nameof(GetAll), new { id = transaction.Id }, transaction);

        }

    }
}
