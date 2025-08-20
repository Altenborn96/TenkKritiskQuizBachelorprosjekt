using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BakOverskriftene.Domain.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;
using Microsoft.AspNetCore.Authorization;



namespace BakOverskriftene.Api.AppControllers
{
    [Route("api/appAchievement")]
    [ApiController]
    
    public class AchievementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AchievementController(ApplicationDbContext context)
        {
            _context = context;
        }
        //List of achievements
        [AllowAnonymous]

        [HttpGet("allachievements")]
        public async Task<ActionResult<IEnumerable<Achievement>>> GetAchievements()
        {
            var achievements = await _context.Achievements.ToListAsync(); // Retrieve data asynchronously from db
            return Ok(achievements); 
        }


        //Get achievement by id 
        [AllowAnonymous]
        [HttpGet("{id}")]   
        public async Task<IActionResult> GetAchievementById(int id)
        {
            var achievement = await _context.Achievements.FindAsync(id);

            if(achievement == null)
            {
                return NotFound("Fant ikke achievement");
            }
;
            return Ok(achievement);
        }


    }
}