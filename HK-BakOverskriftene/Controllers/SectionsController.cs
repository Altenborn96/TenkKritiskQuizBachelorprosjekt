using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakOverskriftene.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SectionController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public SectionController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates a new section.
        /// This method validates the section data, initializes an empty list of questions, 
        /// and adds the section to the database.
        /// </summary>
        /// <param name="section">The section to be created, including the section name and any associated data.</param>
        /// <returns>Returns a CreatedAtAction result with the newly created section, or a BadRequest result if data is invalid.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateSection([FromBody] Section section)
        {
            if (section == null || string.IsNullOrEmpty(section.Name))
            {
                return BadRequest("Invalid section data.");
            }

            // Initialize an empty list of questions
            section.Questions = new List<Question>();

            _context.Sections.Add(section);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSectionById), new { id = section.Id }, section);
        }

        /// <summary>
        /// Retrieves a section by its ID.
        /// This method attempts to find the section by its unique identifier and returns it if found, 
        /// including any associated questions.
        /// </summary>
        /// <param name="id">The ID of the section to be retrieved.</param>
        /// <returns>Returns the section if found, or a NotFound result if no section exists for the given ID.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSectionById(int id)
        {
            var section = await _context.Sections
                .Include(s => s.Questions) // Include questions if needed
                .FirstOrDefaultAsync(s => s.Id == id);

            if (section == null)
            {
                return NotFound();
            }

            return Ok(section);
        }

        /// <summary>
        /// Retrieves a list of all sections.
        /// This method returns a list of all sections, each represented by a simplified DTO containing the section name.
        /// </summary>
        /// <returns>Returns a list of all sections, or an empty list if no sections exist.</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllSections()
        {
            var sections = await _context.Sections
                .Select(s => new SectionListDTO
                {
                    Id = s.Id,
                    SectionName = s.Name,
                    Points = s.Points,
                    Locked = s.Locked,
                    AchievementId = s.AchievementId,
                    Image = s.Image,
                    

                })
                .ToListAsync();

            return Ok(sections);
        }

        /// <summary>
        /// Deletes a section by its ID.
        /// This method attempts to find the section by its unique identifier and deletes it from the database if found.
        /// </summary>
        /// <param name="id">The ID of the section to be deleted.</param>
        /// <returns>Returns a NoContent result if deletion is successful, or a NotFound result if the section doesn't exist.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSection(int id)
        {
            var section = await _context.Sections.FindAsync(id);

            if (section == null)
            {
                return NotFound();
            }

            _context.Sections.Remove(section);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Updates an existing section with new data.
        /// This method validates the section data, finds the existing section by its ID, 
        /// and updates its properties with the new values.
        /// </summary>
        /// <param name="id">The ID of the section to be updated.</param>
        /// <param name="updatedSection">The data transfer object containing the updated section details.</param>
        /// <returns>Returns the updated section if successful, or a NotFound/BadRequest result if the section doesn't exist or data is invalid.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSection(int id, [FromBody] Section updatedSection)
        {
            if (updatedSection == null || string.IsNullOrEmpty(updatedSection.Name))
            {
                return BadRequest("Invalid section data.");
            }

            var section = await _context.Sections.FindAsync(id);
            if (section == null)
            {
                return NotFound();
            }

            section.Name = updatedSection.Name;
            section.Points = updatedSection.Points;
            section.Locked = updatedSection.Locked;
            section.AchievementId = updatedSection.AchievementId;
            section.Image = updatedSection.Image;
            section.Description = updatedSection.Description;

            await _context.SaveChangesAsync();

            return Ok(section);
        }

        /// <summary>
        /// Retrieves a list of sections with detailed information about each section, including associated questions and answers.
        /// This method returns a detailed view of sections, where each section contains its questions and each question contains its answers.
        /// </summary>
        /// <returns>Returns a list of sections with detailed information about the questions and answers associated with each section.</returns>
        [HttpGet("WithDetails")]
        public async Task<IActionResult> GetSectionsWithQuestionsAndAnswers()
        {
            var sections = await _context.Sections
                .Include(s => s.Questions)
                .ThenInclude(q => q.Answers)
                .Select(s => new SectionDetailsDTO
                {
                    Id = s.Id,
                    SectionName = s.Name,
                    Questions = s.Questions.Select(q => new QuestionDetailsDTO
                    {
                        Id = q.Id,
                        QuestionText = q.QuestionText,
                        Answers = q.Answers.Select(a => new AnswerDetailsDTO
                        {
                            Id = a.Id,
                            AnswerText = a.AnswerText,
                            IsCorrect = a.Correct,
                            Score = a.Score 
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();

            return Ok(sections);
        }

    }
}
