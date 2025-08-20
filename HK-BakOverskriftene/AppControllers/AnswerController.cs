using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HK_BakOverskriftene.AppControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnswerController(ApplicationDbContext context)
        {
            _context = context;
        }


      
    }
}
