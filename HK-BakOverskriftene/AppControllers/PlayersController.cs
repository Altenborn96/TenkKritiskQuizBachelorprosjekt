using System.Security.Claims;
using BakOverskriftene.Domain.Models;
using BakOverskriftene.Domain.Models.DTO_s;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg;

namespace BakOverskriftene.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Player> _userManager;

        public PlayersController(ApplicationDbContext context, UserManager<Player> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // Henter alle spillere fra databasen
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetPlayers()
        {
            var players = await _context.Players.ToListAsync();
            return Ok(players);
        }


        // ## Legge til avatar url under registrering ved valg av avatar, lagres til db
        // Endepunkt for å endre avatar til spiller basert på brukernavn
        [HttpPatch("avatar")]
        public async Task<IActionResult> ChangePlayerAvatarUrl([FromBody] AddAvatarRequest request)
        {
            try
            {
                var foundPlayer = await _context.Players.FirstOrDefaultAsync(r => r.UserName == request.UserName);

                if (foundPlayer == null)
                {
                    return NotFound(new { message = $"Fant ingen bruker med brukernavn: {request.UserName}" });
                }

                foundPlayer.AvatarUrl = request.AvatarUrl;
                foundPlayer.AvatarId = request.AvatarId;

                await _context.SaveChangesAsync();
                return Ok(new { message = $"Avataren til {request.UserName} har blitt endret" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // ## Patche inn valg av anonymitet under registrering
        // Oppdaterer spillerens anonymitetsstatus (f.eks. om navnet skal skjules i rankingen)
        [Authorize]
        [HttpPatch("anonstatus")]
        public async Task<IActionResult> SetPlayerStatus([FromBody] SetStatusRequest request)
        {
            try
            {
                var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var player = await _context.Players.FindAsync(playerId);

                if (player == null)
                {
                    return NotFound(new { message = "Fant ingen bruker" });
                }

                if (request.isAnonymous == null)
                {
                    return BadRequest(new { message = "Feltet 'isAnonymous' er påkrevd." });
                }

                player.IsAnonymous = request.isAnonymous.Value;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Status oppdatert" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // Henter avatar-URL til en spiller basert på brukernavn
        [AllowAnonymous]
        [HttpGet("avatar/{playerName}")]
        public async Task<IActionResult> GetAvatarUrlByUser(string playerName)
        {
            var player = await _context.Players
                .Where(p => p.UserName == playerName)
                .Select(p => new { p.AvatarUrl })
                .FirstOrDefaultAsync();

            if (player == null)
            {
                return NotFound(new { message = "Fant ingen bruker med dette navnet" });
            }

            return Ok(new { avatarUrl = player.AvatarUrl });
        }


        //Endre spillers brukernavn
        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> ChangePlayerName([FromBody] ChangeUsernameDto dto)
        {
            try
            {
                var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (playerId == null)
                {
                    return NotFound(new { message = "Ugyldig bruker" });
                }

                var user = await _userManager.FindByIdAsync(playerId);
                if (user == null)
                {
                    return NotFound(new { message = "Bruker ikke funnet" });
                }

                user.UserName = dto.NewUsername;

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Kunne ikke oppdatere brukernavn", errors = result.Errors });
                }

                return Ok(new { message = "Brukernavn oppdatert" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

    }



    // DTO for å endre avatar
    public class AddAvatarRequest
    {
        public string UserName { get; set; }
        public string AvatarUrl { get; set; }
        public int AvatarId { get; set; }
    }

    // DTO for å sette anonymitetsstatus
    public class SetStatusRequest
    {
        public string UserName { get; set; } // Ikke i bruk i dag – autentiserte brukere hentes fra token
        public bool? isAnonymous { get; set; }
    }
}
