using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HK_BakOverskriftene.AppControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionController(ApplicationDbContext context)
        {
            _context = context;
        }


        //Get questions belonging to specific section id including answers
        [HttpGet("{id}")]
        public async Task<IActionResult> getQuestionsBySection(int id)
        {

            try
            {
                var questions = await _context.Questions
                    .Where(q => q.SectionId == id) 
                    .Include(q => q.Answers) 
                    .ToListAsync(); 

                if (!questions.Any())
                {
                    throw new Exception();
                    
                }

                return Ok(questions);
            }catch(Exception ex)
            {
                return NotFound("Fant ikke spørsmål ");
            }
        }


    }
}
