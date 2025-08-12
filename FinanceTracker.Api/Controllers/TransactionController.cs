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

        // Helper method to project Transaction entities to TransactionReadDto
        private IQueryable<TransactionReadDto> ProjectToReadDto(IQueryable<Transaction> q) =>
            q.Select(t => new TransactionReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Amount = t.Amount,
                Date = t.Date,
                Type = t.Type,
                CategoryId = t.CategoryId
            });

        [HttpGet]
        public IActionResult GetAll()
        {
            var items = ProjectToReadDto(_context.Transactions.AsNoTracking()).ToList();
            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var dto = ProjectToReadDto(_context.Transactions.AsNoTracking()
                      .Where(t => t.Id == id))
                      .FirstOrDefault();

            return dto is null ? NotFound() : Ok(dto);
        }

        [HttpPost]
        public IActionResult Create(TransactionCreateDto dto)
        {
            if (!_context.Categories.Any(c => c.Id == dto.CategoryId))
                return BadRequest("Unknown CategoryId.");

            var entity = new Transaction
            {
                Title = dto.Title,
                Amount = dto.Amount,
                Date = dto.Date,
                Type = dto.Type,
                CategoryId = dto.CategoryId
            };

            _context.Transactions.Add(entity);
            _context.SaveChanges();

            // Don't use ProjectToReadDto here, extra DB query not needed
            var read = new TransactionReadDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Amount = entity.Amount,
                Date = entity.Date,
                Type = entity.Type,
                CategoryId = entity.CategoryId
            };

            return CreatedAtAction(nameof(GetById), new { id = read.Id }, read);
        }
    }
}
