using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakOverskriftene.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnswersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates a new answer for the given question.
        /// This method validates the answer data, checks if the associated question exists, 
        /// and then associates the answer with the question before saving it to the database.
        /// </summary>
        /// <param name="questionId">The ID of the question to which the answer is being added.</param>
        /// <param name="answerDto">The data transfer object containing the answer text and correctness.</param>
        /// <returns>Returns a CreatedAtAction result with the created answer, or a BadRequest/NotFound result if validation fails.</returns>
        [HttpPost("{questionId}")]
        public async Task<IActionResult> CreateAnswer(int questionId, [FromBody] AnswerDTO answerDto)
        {
            if (answerDto == null || string.IsNullOrEmpty(answerDto.AnswerText))
            {
                return BadRequest("Invalid answer data.");
            }

            if (answerDto.QuestionId != questionId)
            {
                return BadRequest("Question ID mismatch.");
            }

            var question = await _context.Questions
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null)
            {
                return NotFound("Question not found.");
            }

            var answer = new Answer
            {
                AnswerText = answerDto.AnswerText,
                Correct = answerDto.Correct,
                QuestionId = answerDto.QuestionId,
                Question = question,
                Score = answerDto.Score,
            };

            question.Answers.Add(answer);  // Associate answer with the question

            try
            {
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetAnswerById), new { id = answer.Id }, answer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Retrieves an answer by its ID.
        /// This method attempts to find the answer by its unique identifier and returns it if found.
        /// </summary>
        /// <param name="id">The ID of the answer to be retrieved.</param>
        /// <returns>Returns the answer if found, or a NotFound result if no answer exists for the given ID.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnswerById(int id)
        {
            var answer = await _context.Answers.FindAsync(id);

            if (answer == null)
            {
                return NotFound();
            }

            return Ok(answer);
        }

        /// <summary>
        /// Retrieves all answers for a specific question by its ID.
        /// This method returns a list of answers associated with a particular question, 
        /// including the question's text and the answers' correctness status.
        /// </summary>
        /// <param name="questionId">The ID of the question whose answers are being fetched.</param>
        /// <returns>Returns a list of answers for the specified question, or a NotFound result if the question doesn't exist.</returns>
        [HttpGet("question/{questionId}")]
        public async Task<IActionResult> GetAnswersByQuestionId(int questionId)
        {
            var questionWithAnswers = await _context.Questions
                .Where(q => q.Id == questionId)
                .Select(q => new
                {
                    QuestionText = q.QuestionText,
                    Answers = q.Answers.Select(a => new
                    {
                        a.Id,
                        a.AnswerText,
                        a.Correct,
                        a.Score
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (questionWithAnswers == null)
            {
                return NotFound(); // Return 404 if the question is not found
            }

            return Ok(questionWithAnswers);
        }

        /// <summary>
        /// Updates an existing answer with new data.
        /// This method validates the provided answer data, finds the existing answer by its ID,
        /// and updates the answer's text and correctness status.
        /// </summary>
        /// <param name="id">The ID of the answer to be updated.</param>
        /// <param name="answerDto">The data transfer object containing the new answer text and correctness status.</param>
        /// <returns>Returns an updated answer if successful, or a NotFound/BadRequest result if the answer doesn't exist or data is invalid.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnswer(int id, [FromBody] AnswerDTO answerDto)
        {
            if (answerDto == null || string.IsNullOrEmpty(answerDto.AnswerText))
            {
                return BadRequest("Invalid answer data.");
            }

            var answer = await _context.Answers.FindAsync(id);
            if (answer == null)
            {
                return NotFound("Answer not found.");
            }


            answer.AnswerText = answerDto.AnswerText;
            answer.Correct = answerDto.Correct;
            answer.Score = answerDto.Score;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(answer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Deletes an answer by its ID.
        /// This method finds the answer by its ID, removes it from the database, and saves the changes.
        /// </summary>
        /// <param name="id">The ID of the answer to be deleted.</param>
        /// <returns>Returns a NoContent result if deletion is successful, or a NotFound result if the answer doesn't exist.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnswer(int id)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null)
            {
                return NotFound("Answer not found.");
            }

            _context.Answers.Remove(answer);

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
