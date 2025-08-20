using System.Security.Claims;
using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HK_BakOverskriftene.AppControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeedbackController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Add new feedback
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> addFeedback([FromBody] Feedback request)
        {

            try
            {

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var user = await _context.Players.FindAsync(userId);

                if(user == null)
                {
                    return Unauthorized();
                }

                

                if (request.Identifier == "COMMENT"  && (string.IsNullOrEmpty(request.GeneralComment) || string.IsNullOrEmpty(request.SuggestionComment)))
                {
                    return BadRequest(new { message = "Mangler kommentar " });
                }

                if (request.Identifier == "SCORE" && (request.FunScore == null || request.RecommendScore == null || request.SatisfiedScore == null))
                {
                    return BadRequest(new { message = "Mangler score " });
                }

                if (request.Identifier == "COMMENT" || request.Identifier == "SCORE")
                {
                    await _context.Feedbacks.AddAsync(request);
                    await _context.SaveChangesAsync();
                    return Ok(request);

                }

                return BadRequest(new { message = "Ugyldig identifier" });

            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error" });
            }
        }


    }
}
