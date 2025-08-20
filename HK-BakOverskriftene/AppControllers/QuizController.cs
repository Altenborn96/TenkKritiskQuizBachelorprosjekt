using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BakOverskriftene.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace HK_BakOverskriftene.AppControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuizController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Get all sections
        [HttpGet]
        public async Task<IActionResult> getAllSections()
        {

            var sections = await _context.Sections.ToListAsync();
            return Ok(sections);
        }

        //Get section without questions
        [HttpGet("{id}")]
        public async Task<IActionResult> getSectionById(int id)
        {
            var section = await _context.Sections.FindAsync(id);

            if (section == null)
            {
                return NotFound();
            }

            return Ok(section);
        }


        /// <summary>
        /// Retrieves a section by its ID.
        /// This method attempts to find the section by its unique identifier and returns it if found, 
        /// including any associated questions.
        /// </summary>
        /// <param name="id">The ID of the section to be retrieved.</param>
        /// <returns>Returns the section if found, or a NotFound result if no section exists for the given ID.</returns>
        [HttpGet("fullsection/{id}")]
        public async Task<IActionResult> GetSectionById(int id)
        {
            var section = await _context.Sections
                .Include(s => s.Questions) 
                .FirstOrDefaultAsync(s => s.Id == id);

            if (section == null)
            {
                return NotFound();
            }

            return Ok(section);
        }


        [HttpGet("avatar")]
        public async Task<ActionResult<IEnumerable<Avatar>>> GetAvatars()
        {
            var avatars = await _context.Avatars.ToListAsync(); // Retrieve data asynchronously from db
            return Ok(avatars); // Return avatars as JSON
        }

    }
}
