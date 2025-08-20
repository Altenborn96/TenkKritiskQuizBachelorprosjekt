using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;


namespace HK_BakOverskriftene.AppControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IconsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IconsController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Get list of icons
        [HttpGet]
        public async Task<IActionResult> GetAllIcons()
        {
            try
            {
                var listOfIcons = await _context.Icons.ToListAsync();

                return Ok(listOfIcons);
                
            }catch(Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        //Get icon by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIcon(int id)
        {
            try
            {
                var icon = await _context.Icons.FindAsync(id);

                if(icon == null)
                {
                    return NotFound(new { message = "Fant ikke ikon med id: ", id });
                }

                return Ok(icon);

            }catch(Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        //Add new icon
        [HttpPost("add")]
        public async Task<IActionResult> AddIcon([FromForm] IFormFile file)
        {
            try
            {
                var form = Request.Form;
                var iconUrl = form["url"].ToString();

                if (file == null || file.Length == 0)
                    return BadRequest("Ingen fil valgt.");

                var isPng = file.ContentType == "image/png" &&
                            Path.GetExtension(file.FileName).ToLower() == ".png";

                if (!isPng)
                    return BadRequest("Kun PNG-filer er tillatt.");

                var existingIcon = await _context.Icons.FirstOrDefaultAsync(a => a.Url == iconUrl);
                if (existingIcon != null)
                {
                    return BadRequest("Icon finnes allerede");
                }

                var icon = new Icon
                {
                    Url = "" 
                };

                await _context.Icons.AddAsync(icon);
                await _context.SaveChangesAsync();


                var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var iconsPath = Path.Combine(wwwrootPath, "images", "icons");

                if (!Directory.Exists(iconsPath))
                    Directory.CreateDirectory(iconsPath);

                var fileName = $"{icon.Id}.png";
                var fullPath = Path.Combine(iconsPath, fileName);
                var fileUrl = $"https://tenk-kritisk.no/images/icons/{fileName}";


                using (var image = await Image.LoadAsync(file.OpenReadStream()))
                {
                    image.Mutate(x => x.Resize(95, 95));
                    await image.SaveAsPngAsync(fullPath);
                }


                icon.Url = fileUrl;
                _context.Icons.Update(icon);
                await _context.SaveChangesAsync();

                return Ok(new { fileUrl, fullPath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        //Delete icon by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIcon(int id)
        {
            try
            {
                var icon = await _context.Icons.FindAsync(id);

                if(icon == null)
                {
                    return NotFound(new { message = "Fant ikke ikon" });
                }

                _context.Icons.Remove(icon);
                await _context.SaveChangesAsync();

                return Ok();

            }catch(Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


    }
}
