using HK_BakOverskriftene.AppControllers;
using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace HK_BakOverskriftene.Controllers
{
    [Route("api/cms/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Legge til en setting-seksjon 
        //Må fikse content -> privacy 
        [HttpPost]
        public async Task<IActionResult> AddSetting([FromBody] SettingsRequest request)
        {

            if (request.Identifier == "TERMS" &&
                (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Description)))
            {
                return BadRequest("Mangler tittel og/eller beskrivelse");
            }

            if (request.Identifier == "FAQ" &&
                (string.IsNullOrEmpty(request.Question) || string.IsNullOrEmpty(request.Answer)))
            {
                return BadRequest("Mangler spørsmål og/eller svar");
            }

            if (request.Identifier == "SOURCES" &&
                (string.IsNullOrEmpty(request.Link) || string.IsNullOrEmpty(request.Description)))
            {
                return BadRequest("Mangler link og/eller beskrivelse");
            }

            if (request.Identifier == "ABOUT" &&
                (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Description)))
            {
                return BadRequest("Mangler tittel og/eller beskrivelse");
            }

            if (request.Identifier == "CONTENT" &&
                (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Content)))
            {
                return BadRequest("Mangler tittel og/eller innhold (content)");
            }


            if (request.Identifier.Equals("TERMS") || request.Identifier.Equals("FAQ") || request.Identifier.Equals("SOURCES") || request.Identifier.Equals("ABOUT") || request.Identifier.Equals("PRIVACY"))
            {

                var settings = new Settings
                {
                    Title = request.Title,
                    Content = request.Content,
                    Description = request.Description,
                    Link = request.Link,
                    Question = request.Question,
                    Answer = request.Answer,
                    Identifier = request.Identifier
                };

                await _context.Settings.AddAsync(settings);
                await _context.SaveChangesAsync();

                return Ok(settings);
            }

            return BadRequest("Invalid identifier");
        }

        //Slette seksjon basert på id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSettingsSection(int id)
        {
            var section = await _context.Settings.FindAsync(id);

            if (section == null)
            {
                return NotFound("Fant ikke seksjon");
            }

            _context.Settings.Remove(section);
            await _context.SaveChangesAsync();
            return StatusCode(204);

        }

        //Update value of 
        [HttpPatch]
        public async Task<IActionResult> UpdateSettings([FromBody] Settings request)
        {
            try
            {
                if (request.Identifier == "TERMS")
                {
                    if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
                    {
                        return BadRequest("Mangler tittel og/eller beskrivelse");
                    }

                    var terms = await _context.Settings.FindAsync(request.Id);
                    if (terms == null)
                    {
                        return NotFound(new { message = "Fant ikke innhold" });
                    }

                    terms.Title = request.Title;
                    terms.Description = request.Description;

                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Begrep oppdatert" });
                }

                if (request.Identifier == "FAQ")
                {
                    if (string.IsNullOrWhiteSpace(request.Question) || string.IsNullOrWhiteSpace(request.Answer))
                    {
                        return BadRequest("Mangler spørsmål og/eller svar");
                    }

                    var faq = await _context.Settings.FindAsync(request.Id);
                    if (faq == null)
                    {
                        return NotFound(new { message = "Fant ikke innhold" });
                    }

                    faq.Question = request.Question;
                    faq.Answer = request.Answer;

                    await _context.SaveChangesAsync();
                    return Ok(new { message = "FAQ oppdatert" });
                }

                if (request.Identifier == "SOURCES")
                {
                    if (string.IsNullOrWhiteSpace(request.Link) || string.IsNullOrWhiteSpace(request.Description))
                    {
                        return BadRequest("Mangler link og/eller beskrivelse");
                    }

                    var source = await _context.Settings.FindAsync(request.Id);
                    if (source == null)
                    {
                        return NotFound(new { message = "Fant ikke innhold" });
                    }

                    source.Link = request.Link;
                    source.Description = request.Description;

                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Kilde oppdatert" });
                }

                if (request.Identifier == "ABOUT")
                {
                    if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
                    {
                        return BadRequest("Mangler tittel og/eller beskrivelse");
                    }

                    var about = await _context.Settings.FindAsync(request.Id);
                    if (about == null)
                    {
                        return NotFound(new { message = "Fant ikke innhold" });
                    }

                    about.Title = request.Title;
                    about.Description = request.Description;

                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Om-seksjon oppdatert" });
                }

                if (request.Identifier == "PRIVACY")
                {
                    if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Content))
                    {
                        return BadRequest("Mangler tittel og/eller beskrivelse(content)");
                    }

                    var privacy = await _context.Settings.FindAsync(request.Id);
                    if (privacy == null)
                    {
                        return NotFound(new { message = "Fant ikke innhold" });
                    }

                    privacy.Title = request.Title;
                    privacy.Content = request.Content;

                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Personvern oppdatert" });
                }

                return NotFound(new { message = "Mangler identifier" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Internal error" });
            }
        }


    }
}
