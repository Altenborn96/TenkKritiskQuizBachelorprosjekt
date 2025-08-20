using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HK_BakOverskriftene.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CmsFeedbackController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public CmsFeedbackController(ApplicationDbContext context)
        {
            _context = context;
        }


        //Get list of all feedback regardless of identifier
        [HttpGet("{identifier}")]
        public async Task<IActionResult> GetFeedback(string identifier)
        {
            try
            {
                if(identifier == "score" || identifier == "comment")
                {
                    var feedback = await _context.Feedbacks
                       .Where(f => f.Identifier == identifier)
                       .ToListAsync();

                    if (feedback.Count == 0)
                    {
                        return NotFound(new { message = "Ingen tilbakemeldinger å hente" });
                    }

                    return Ok(feedback);
                }

                return BadRequest(new { message = "Ugyldig identifier" });



            }catch(Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        //Delete feedback by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            try
            {
                var feedback = await _context.Feedbacks.FindAsync(id);

                if(feedback == null)
                {
                    return NotFound(new { message = "Fant ikke feedback" });
                }

                _context.Feedbacks.Remove(feedback);
                await _context.SaveChangesAsync();


                return StatusCode(204);

            }catch(Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
