using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BakOverskriftene.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace HK_BakOverskriftene.AppControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add a settings section based on identifier
        [HttpPost]
        public async Task<IActionResult> AddSetting([FromBody] SettingsRequest request)
        {
            if (request.Identifier.Equals("TERMS") && (request.Title == null || request.Description == null))
                return BadRequest("Missing title and/or description");

            if (request.Identifier.Equals("FAQ") && (request.Question == null || request.Answer == null))
                return BadRequest("Missing question and/or answer");

            if (request.Identifier.Equals("SOURCES") && (request.Link == null || request.Description == null))
                return BadRequest("Missing link and/or description");

            if (request.Identifier.Equals("ABOUT") && (request.Title == null || request.Description == null))
                return BadRequest("Missing title and/or description");

            if (request.Identifier.Equals("CONTENT") && (request.Title == null || request.Content == null))
                return BadRequest("Missing title and/or content");

            if (request.Identifier is "TERMS" or "FAQ" or "SOURCES" or "ABOUT" or "PRIVACY")
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

        // Get a list of setting sections based on identifier in URL
        // Note: Will return null values for non-matching fields
        [HttpGet("{identifier}")]
        public async Task<IActionResult> GetSettingsSections(string identifier)
        {
            var settings = await _context.Settings
                .Where(s => s.Identifier == identifier)
                .ToListAsync();

            return Ok(settings);
        }

        // Delete a specific section by its ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSettingsSection(int id)
        {
            var section = await _context.Settings.FindAsync(id);
            if (section == null)
                return NotFound("Section not found");

            _context.Settings.Remove(section);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    // DTO for posting new settings sections
    public class SettingsRequest
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Description { get; set; }
        public string? Link { get; set; }
        public string? Question { get; set; }
        public string? Answer { get; set; }
        public string Identifier { get; set; }
    }
}
