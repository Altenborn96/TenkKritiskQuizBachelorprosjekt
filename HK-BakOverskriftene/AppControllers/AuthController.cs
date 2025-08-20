using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace BakOverskriftene.Controllers
{
    // Autentiseringskontroller for brukere (Player)
    // Endepunktene bruker JWT-token
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly UserManager<Player> _userManager;
        private readonly SignInManager<Player> _signInManager;
        private readonly MailerSendService _mailerSendService;

        public AuthController(
            ApplicationDbContext context,
            IConfiguration configuration,
            UserManager<Player> userManager,
            SignInManager<Player> signInManager,
            MailerSendService mailerSendService)
        {
            _context = context;
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
            _mailerSendService = mailerSendService;
        }

        // Metode for å logge inn
        // Returnerer JWT-token dersom innloggingen er vellykket
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginDTO request)
        {
            try
            {
                var player = await _userManager.FindByNameAsync(request.UserName);
                if (player == null)
                    return Unauthorized(new { message = "Feil brukernavn eller passord" });

                var result = await _signInManager.PasswordSignInAsync(request.UserName, request.Password, false, false);
                if (!result.Succeeded)
                    return Unauthorized(new { message = "Feil brukernavn eller passord" });

                var token = GenerateJwtToken(player);
                return Ok(new { message = "Innlogging vellykket", token, playerId = player.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Noe gikk galt", error = ex.Message });
            }
        }

        // Registrerer en ny bruker (Player)
        // Returnerer også JWT-token direkte etter registrering
        // Passordkrav konfigureres i Program.cs (IdentityOptions)
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> AddPlayer([FromBody] RegisterDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserName) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Username and password are required." });

            if (!dto.Email.Contains("@"))
                return BadRequest(new { message = "Oppgi en gyldig epost adresse" });

            if (await _userManager.FindByEmailAsync(dto.Email) != null)
                return BadRequest(new { message = "E-post er allerede registrert" });

            if (await _context.Players.AnyAsync(p => p.UserName == dto.UserName))
                return BadRequest(new { message = "Brukernavn er allerede tatt" });

            var player = new Player
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            try
            {
                var result = await _userManager.CreateAsync(player, dto.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                var token = GenerateJwtToken(player);
                return Ok(new
                {
                    message = "Registrering vellykket",
                    token,
                    playerId = player.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // Glemt passord-funksjon
        // Sender e-post med tilbakestillingslenke dersom brukeren finnes
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(dto.Email);
                if (user == null)
                    return Ok(); // Ikke avslør at e-post ikke finnes

                // Generer token for tilbakestilling av passord
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var urlEncodedToken = Uri.EscapeDataString(token);

                // TODO: Bytt til produksjonslink før deploy
                var link = $"http://localhost:8081/reset?email={dto.Email}&token={urlEncodedToken}";
                await _mailerSendService.SendEmail(dto.Email, link);

                return Ok(new { message = "E-post med tilbakestillingslenke er sendt" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // Tilbakestill passord med gyldig token
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(dto.email);
                if (user == null)
                    return Ok(); // Ikke avslør at bruker ikke finnes

                var result = await _userManager.ResetPasswordAsync(user, dto.token, dto.newPassword);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                return Ok(new { message = "Passord er oppdatert" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // Genererer JWT-token for innlogget bruker
        // Brukes ved login og registrering
        private string GenerateJwtToken(Player player)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"] ?? "DEFAULT_SECRET_KEY");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, player.Id),
                    new Claim(ClaimTypes.Name, player.UserName)
                }),
                Expires = DateTime.UtcNow.AddDays(1), // Token varer i 1 dag
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
