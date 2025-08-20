using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakOverskriftene.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Adds a new question to the specified section.
        /// This method validates the question data, checks if the section exists, 
        /// and then adds the question to the section before saving it to the database.
        /// </summary>
        /// <param name="sectionId">The ID of the section to which the question will be added.</param>
        /// <param name="questionDTO">The data transfer object containing the question text and section ID.</param>
        /// <returns>Returns a CreatedAtAction result with the newly created question, or a BadRequest/NotFound result if validation fails.</returns>
        [HttpPost("{sectionId}")]
        public async Task<IActionResult> AddQuestion(int sectionId, [FromBody] QuestionDTO questionDTO)
        {
            if (questionDTO == null || string.IsNullOrEmpty(questionDTO.QuestionText))
            {
                return BadRequest("Invalid question data.");
            }

            if (questionDTO.SectionId != sectionId)
            {
                return BadRequest("Section ID mismatch.");
            }

            var section = await _context.Sections
                .Include(s => s.Questions)
                .FirstOrDefaultAsync(s => s.Id == sectionId);

            if (section == null)
            {
                return NotFound("Section not found.");
            }

            var question = new Question
            {
                QuestionText = questionDTO.QuestionText,
                SectionId = questionDTO.SectionId,
                Section = section,
                Score = questionDTO.Score,
            };

            section.Questions.Add(question);

            try
            {
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetQuestionById), new { id = question.Id }, question);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Retrieves all questions for a specified section.
        /// This method fetches the section along with its associated questions 
        /// and returns them as a list of QuestionDisplayDTOs.
        /// </summary>
        /// <param name="sectionId">The ID of the section whose questions are being fetched.</param>
        /// <returns>Returns a list of questions associated with the given section, or a NotFound result if the section doesn't exist.</returns>
        [HttpGet("section/{sectionId}")]
        public async Task<IActionResult> GetQuestionsBySection(int sectionId)
        {
            var section = await _context.Sections
                .Include(s => s.Questions)
                .FirstOrDefaultAsync(s => s.Id == sectionId);

            if (section == null)
            {
                return NotFound("Section not found.");
            }

            var questionDTOs = section.Questions
                .Select(q => new QuestionDisplayDTO
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    SectionId = q.SectionId
                })
                .ToList();

            return Ok(questionDTOs);
        }

        /// <summary>
        /// Retrieves a question by its ID.
        /// This method attempts to find the question by its unique identifier and returns it if found.
        /// </summary>
        /// <param name="id">The ID of the question to be retrieved.</param>
        /// <returns>Returns the question if found, or a NotFound result if no question exists for the given ID.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestionById(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            return Ok(question);
        }

        /// <summary>
        /// Updates an existing question with new data.
        /// This method validates the provided question data, finds the existing question by its ID,
        /// and updates the question's text.
        /// </summary>
        /// <param name="id">The ID of the question to be updated.</param>
        /// <param name="questionDTO">The data transfer object containing the new question text.</param>
        /// <returns>Returns the updated question if successful, or a NotFound/BadRequest result if the question doesn't exist or data is invalid.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] QuestionDTO questionDTO)
        {
            if (questionDTO == null || string.IsNullOrEmpty(questionDTO.QuestionText))
            {
                return BadRequest("Invalid question data.");
            }

            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound("Question not found.");
            }

            question.QuestionText = questionDTO.QuestionText;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(question);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Deletes a question by its ID.
        /// This method finds the question by its ID, removes it from the database, and saves the changes.
        /// </summary>
        /// <param name="id">The ID of the question to be deleted.</param>
        /// <returns>Returns a NoContent result if deletion is successful, or a NotFound result if the question doesn't exist.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound("Question not found.");
            }

            _context.Questions.Remove(question);

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
