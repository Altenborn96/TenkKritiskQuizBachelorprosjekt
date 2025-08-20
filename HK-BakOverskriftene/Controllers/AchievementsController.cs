using BakOverskriftene.Domain.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HK_BakOverskriftene.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AchievementsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public AchievementsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        //Legge til achievement
        [HttpPost]
        public async Task<IActionResult> UploadAchievement(IFormFile file)
        {
            var form = Request.Form;
            var achievementName = form["name"];
            var description = form["description"];

            if (file == null || file.Length == 0)
                return BadRequest("Ingen fil valgt.");

            var isPng = file.ContentType == "image/png" &&
            Path.GetExtension(file.FileName).ToLower() == ".png";

            if (!isPng)
                return BadRequest("Kun PNG-filer er tillatt.");

            var existingAchievement = await _context.Avatars.FirstOrDefaultAsync(a => a.Name == achievementName.ToString());
            if (existingAchievement != null)
            {
                return BadRequest("Achievement finnes allerede");
            }

            var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var achievementsPath = Path.Combine(wwwrootPath, "images\\achievements");

            if (!Directory.Exists(achievementsPath))
                Directory.CreateDirectory(achievementsPath);

            var safeName = Path.GetFileNameWithoutExtension(file.FileName);
            var fileName = $"{safeName}.png";
            var fullPath = Path.Combine(achievementsPath, fileName);
            var fileUrl = $"https://tenk-kritisk.no/images/achievements/{fileName}";

            // Last inn bildet og tving størrelse
            using (var image = await Image.LoadAsync(file.OpenReadStream()))
            {
                image.Mutate(x => x.Resize(95, 95));

                await image.SaveAsPngAsync(fullPath);
            }

            var achievement = new Achievement
            {
                Name = achievementName,
                Url = fileUrl,
                Description = description,
            };

            await _context.Achievements.AddAsync(achievement);
            await _context.SaveChangesAsync();

            return Ok(new { fileUrl, fullPath });
        }

        //Hente liste med achievements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Achievement>>> GetAchievements()
        {
            var achievements = await _context.Achievements.ToListAsync(); 
            return Ok(achievements); 
        }

        //Slette achievement
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAchievement(int id)
        {
            var achievement = await _context.Achievements.FindAsync(id);
            if (achievement == null)
            {
                return NotFound("En feil har oppstått");
            }

            _context.Achievements.Remove(achievement);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
