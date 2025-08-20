using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BakOverskriftene.Domain.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;


namespace BakOverskriftene.Api.Controllers
{
    [Route("api/avatars")]
    [ApiController]
    public class AvatarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AvatarController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("getall")]
        public async Task<ActionResult<IEnumerable<Avatar>>> GetAvatars()
        {
            var avatars = await _context.Avatars.ToListAsync(); // Retrieve data asynchronously from db
            return Ok(avatars); // Return avatars as JSON
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAvatar(int id)
        {
            var avatar = await _context.Avatars.FindAsync(id);
            if (avatar == null)
            {
                return NotFound("En feil har oppstått");
            }

            _context.Avatars.Remove(avatar);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpPost("upload")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var form = Request.Form;
            var avatarName = form["name"];

            if (file == null || file.Length == 0)
                return BadRequest("Ingen fil valgt.");

            var isPng = file.ContentType == "image/png" &&
            Path.GetExtension(file.FileName).ToLower() == ".png";

            if (!isPng)
                return BadRequest("Kun PNG-filer er tillatt.");

            var existingAvatar = await _context.Avatars.FirstOrDefaultAsync(a => a.Name == avatarName.ToString());
            if(existingAvatar != null)
            {
                return BadRequest("Avatar finnes allerede");
            }

            var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var avatarsPath = Path.Combine(wwwrootPath, "avatars");

            if (!Directory.Exists(avatarsPath))
                Directory.CreateDirectory(avatarsPath);

            var safeName = Path.GetFileNameWithoutExtension(file.FileName);
            var fileName = $"{safeName}.png";
            var fullPath = Path.Combine(avatarsPath, fileName);
            var fileUrl = $"https://tenk-kritisk.no/avatars/{fileName}";

            // Last inn bildet og tving størrelse
            using (var image = await Image.LoadAsync(file.OpenReadStream()))
            {
                image.Mutate(x => x.Resize(95, 95)); 

                await image.SaveAsPngAsync(fullPath);
            }

            var avatar = new Avatar
            {
                Name = avatarName,
                Url = fileUrl
            };

            await _context.Avatars.AddAsync(avatar);
            await _context.SaveChangesAsync();

            return Ok(new { fileUrl, fullPath });
        }




    }
}