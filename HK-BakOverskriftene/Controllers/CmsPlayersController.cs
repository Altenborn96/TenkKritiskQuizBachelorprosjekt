using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HK_BakOverskriftene.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CmsPlayersController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public CmsPlayersController(ApplicationDbContext context)
        {
            _context = context;
        }


        // Method to fetch all players
        [HttpGet]
        public async Task<IActionResult> GetPlayers()
        {

            var players = await _context.Players.ToListAsync();
            return Ok(players);


        }

        // Method to delete a player
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlayer(string id)
        {
            try
            {
                var player = await _context.Players.FindAsync(id);
                if (player == null)
                {
                    return NotFound(new { message = "Player not found" });
                }

                _context.Players.Remove(player);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Player deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
