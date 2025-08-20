using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HK_BakOverskriftene.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CmsResultController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public CmsResultController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Slette en result basert på resultID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResult(int id)
        {

            var result = await _context.Results.FindAsync(id);

            if (result == null)
            {
                return NotFound(new { success = true, message = "Fant ikke modul" });
            }

            _context.Results.Remove(result);
            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}
