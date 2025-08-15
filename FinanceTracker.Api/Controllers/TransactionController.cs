using FinanceTracker.Api.Data;
using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;
using FinanceTracker.Api.Dtos;

namespace FinanceTracker.Api.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionsController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        // Helper method to project Transaction entities to TransactionReadDto
        private static IQueryable<TransactionReadDto> ProjectToReadDto(IQueryable<Transaction> q) =>
            q.Select(t => new TransactionReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Amount = t.Amount,
                Description = t.Description,
                Date = t.Date,
                Type = t.Type,
                CategoryId = t.CategoryId
            });

        // GET /api/transactions
        [HttpGet]
        // Enumerable because its a list
        public ActionResult<IEnumerable<TransactionReadDto>> GetAll()
        {
            var items = ProjectToReadDto(_context.Transactions.AsNoTracking()).ToList();
            return Ok(items);
        }

        // GET /api/transactions/{id}
        [HttpGet("{id:int}")]
        public ActionResult<TransactionReadDto> GetById(int id)
        {
            var dto = ProjectToReadDto(_context.Transactions.AsNoTracking()
                      .Where(t => t.Id == id))
                      .FirstOrDefault();

            return dto is null ? NotFound() : Ok(dto);
        }

        // POST /api/transactions
        [HttpPost]
        public ActionResult<TransactionReadDto> Create(TransactionCreateDto dto)
        {
            if (!_context.Categories.Any(c => c.Id == dto.CategoryId))
                return BadRequest("Unknown CategoryId.");

            var entity = new Transaction
            {
                Title = dto.Title,
                Amount = dto.Amount,
                Description = dto.Description,
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
                Description = entity.Description,
                Date = entity.Date,
                Type = entity.Type,
                CategoryId = entity.CategoryId
            };

            return CreatedAtAction(nameof(GetById), new { id = read.Id }, read);
        }

        // PUT /api/transactions/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, TransactionCreateDto dto)
        {
            var entity = _context.Transactions.FirstOrDefault(t => t.Id == id);
            if (entity is null) 
                return NotFound();

            if (!_context.Categories.Any(c => c.Id == dto.CategoryId))
                return BadRequest("Unknown CategoryId.");

            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.Amount = dto.Amount;
            entity.Date = dto.Date;
            entity.Type = dto.Type;
            entity.CategoryId = dto.CategoryId;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE /api/transactions/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var entity = _context.Transactions.Find(id);
            if (entity == null)
                return NotFound();


            _context.Transactions.Remove(entity);
            _context.SaveChanges();

            return NoContent(); // 204
        }
    }
}
