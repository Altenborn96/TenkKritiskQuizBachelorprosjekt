using System.Security.Claims;
using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HK_BakOverskriftene.AppControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAchievementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserAchievementController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add an achievement for the currently logged-in user
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddUserAchievement([FromBody] UserAchievement userAchievement)
        {
            if (userAchievement.AchievementId == null)
                return Ok();

            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var player = await _context.Players.FindAsync(playerId);

            if (player == null)
                return NotFound(new { success = false, message = "Player does not exist" });

            var achievement = await _context.Achievements.FindAsync(userAchievement.AchievementId);
            if (achievement == null)
                return NotFound(new { success = false, message = "Invalid achievement" });

            // Check if this achievement already exists for the player
            var existingUserAchievement = await _context.UserAchievements
                .FirstOrDefaultAsync(ua => ua.AchievementId == userAchievement.AchievementId && ua.PlayerId == playerId);

            if (existingUserAchievement == null)
            {
                userAchievement.PlayerId = playerId;
                await _context.UserAchievements.AddAsync(userAchievement);
                await _context.SaveChangesAsync();

                return Ok(userAchievement);
            }

            return Ok(new { success = true, message = "Achievement already assigned to user" });
        }

        // Get all achievements for the logged-in user
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetUserAchievements()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var achievements = await _context.UserAchievements
                .Where(ua => ua.PlayerId == userId)
                .Include(ua => ua.Achievement)
                .Select(ua => new
                {
                    ua.Achievement!.Id,
                    ua.Achievement.Name,
                    ua.Achievement.Url,
                    ua.Date
                })
                .ToListAsync();

            return Ok(achievements);
        }

        // Delete a user achievement by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAchievement(int id)
        {
            var achievement = await _context.UserAchievements.FindAsync(id);
            if (achievement == null)
                return NotFound(new { success = false, message = "Achievement not found" });

            _context.UserAchievements.Remove(achievement);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Achievement deleted" });
        }

        // Check if the current user has a specific achievement
        [Authorize]
        [HttpGet("me/{achievementId}")]
        public async Task<IActionResult> GetUserAchievementById(int achievementId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var hasAchievement = await _context.UserAchievements
                .FirstOrDefaultAsync(ua => ua.AchievementId == achievementId && ua.PlayerId == userId);

            return Ok(new { hasAchievement = hasAchievement != null });
        }
    }
}
