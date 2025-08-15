using FinanceTracker.Api.Data;
using FinanceTracker.Api.Dtos;
using FinanceTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        private static IQueryable<CategoryReadDto> ProjectToReadDto(IQueryable<Category> q) =>
             q.Select(c => new CategoryReadDto
             {
                 Id = c.Id,
                 Name = c.Name,
             });


        // GET /api/categories
        [HttpGet]
        public ActionResult<IEnumerable<CategoryReadDto>> GetAll()
        {
            var items = ProjectToReadDto(_context.Categories.AsNoTracking()).ToList();
            return Ok(items);
        }

        // GET /api/categories/{id}
        [HttpGet("{id:int}")]
        public ActionResult<CategoryReadDto> GetById(int id)
        {
            var dto = ProjectToReadDto(_context.Categories.AsNoTracking()
                      .Where(c => c.Id == id))
                      .FirstOrDefault();

            return dto is null ? NotFound() : Ok(dto);
        }

        // POST /api/categories
        [HttpPost]
        public ActionResult<CategoryReadDto> Create(CategoryCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required");
             
            if (_context.Categories.Any(c => c.Name == dto.Name))
                return Conflict("A category with this name already exists");

            var entity = new Category
            {
                Name = dto.Name
            };

            _context.Categories.Add(entity);
            _context.SaveChanges();

            // Don't use ProjectToReadDto here, extra DB query not needed
            var read = new CategoryReadDto
            {
                Id = entity.Id,
                Name = entity.Name,
            };

            return CreatedAtAction(nameof(GetById), new { id = read.Id }, read);
        }

        // PUT /api/categories/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, CategoryCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var entity = _context.Categories.FirstOrDefault(c => c.Id == id);
            if (entity is null) 
                return NotFound();

            var nameTaken = _context.Categories.Any(c => c.Id != id && string.Equals(c.Name.ToLower(), dto.Name.ToLower()));
            if (nameTaken) 
                return Conflict("A category with this name already exists.");

            entity.Name = dto.Name;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE /api/categories/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            if (id == 1)
                return BadRequest("Default category cannot be deleted."); 

            var entity = _context.Categories
                                 .Include(c => c.Transactions)
                                 .FirstOrDefault(c => c.Id == id);

            if (entity is null) 
                return NotFound();

            using var tx = _context.Database.BeginTransaction();

            _context.Transactions
                    .Where(t => t.CategoryId == id)
                    .ExecuteUpdate(s => s.SetProperty(t => t.CategoryId, 1));

            _context.Categories.Remove(entity);
            _context.SaveChanges();

            tx.Commit();

            return NoContent();
        }
    }
}
