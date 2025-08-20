using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BakOverskriftene.Domain.Models.DTO_s;
using BakOverskriftene.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace HK_BakOverskriftene.AppControllers
{
    [Route("api/result")]
    [ApiController]
    public class ResultController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResultController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add or update a quiz result for the current player
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostResult([FromBody] ResultsDTO resultsDto)
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var player = await _context.Players.FindAsync(playerId);

            if (player == null)
                return NotFound(new { success = false, message = "Player not found" });

            var results = new BakOverskriftene.Domain.Models.Results
            {
                PlayerId = playerId,
                Score = resultsDto.Score,
                SectionId = resultsDto.SectionId,
                QuizName = resultsDto.QuizName,
                PlayerName = player.UserName,
                CorrectAnswers = resultsDto.CorrectAnswers,
                TotalQuestions = resultsDto.TotalQuestions,
                AchievementId = resultsDto.AchievementId,
                EarnedAchievement = resultsDto.EarnedAchievement,
            };

            var existingResult = await _context.Results
                .FirstOrDefaultAsync(r => r.QuizName == results.QuizName && r.PlayerId == playerId);

            if (existingResult == null)
            {
                await _context.Results.AddAsync(results);
                await _context.SaveChangesAsync();
                return Ok(results);
            }

            bool updated = false;

            if (existingResult.Score < results.Score)
            {
                existingResult.Score = results.Score;
                existingResult.TotalQuestions = results.TotalQuestions;
                existingResult.AchievementId = results.AchievementId;
                existingResult.EarnedAchievement = results.EarnedAchievement;
                updated = true;
            }

            if (existingResult.CorrectAnswers < results.CorrectAnswers)
            {
                existingResult.CorrectAnswers = results.CorrectAnswers;
                existingResult.TotalQuestions = results.TotalQuestions;
                existingResult.EarnedAchievement = results.EarnedAchievement;
                updated = true;
            }

            if (updated)
                await _context.SaveChangesAsync();

            return Ok(existingResult);
        }

        // Returns the top 10 players based on total score
        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard()
        {
            // Group results per player
            var leaderboard = await _context.Results
                .Where(r => r.PlayerId != null)
                .GroupBy(r => r.PlayerId)
                .Select(g => new
                {
                    PlayerId = g.Key,
                    TotalScore = g.Sum(r => r.Score)
                })
                .ToListAsync();

            // Gets player info regarding player id (finding anonymous users)
            var playerIds = leaderboard.Select(l => l.PlayerId).ToList();

            var playerInfo = await _context.Players
                .Where(p => playerIds.Contains(p.Id))
                .ToDictionaryAsync(
                    p => p.Id,
                    p => new
                    {
                        p.UserName,
                        p.AvatarUrl,
                        p.IsAnonymous
                    }
                );

            //Builds final list with anonymous users
            var finalResult = leaderboard
                .Select(l => new
                {
                    PlayerName = playerInfo[l.PlayerId].IsAnonymous == true
                        ? "Anonym"
                        : playerInfo[l.PlayerId].UserName,

                    TotalScore = l.TotalScore,
                    AvatarUrl = playerInfo[l.PlayerId].AvatarUrl
                })
                .OrderByDescending(p => p.TotalScore)
                .Take(10)
                .ToList();

            
            return Ok(finalResult);
        }


        // Checks if a player has already completed a given quiz section
        [Authorize]
        [HttpGet("status/{playerName}/{sectionId}")]
        public async Task<IActionResult> SectionStatus(string playerName, int sectionId)
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var player = await _context.Players.FindAsync(playerId);

            if (player == null)
                return BadRequest(new { message = "Invalid player" });

            var result = await _context.Results
                .FirstOrDefaultAsync(r => r.PlayerName == player.UserName && r.SectionId == sectionId);

            if (result == null)
                return Ok(new { status = false });

            return Ok(new
            {
                status = true,
                correctAnswers = result.CorrectAnswers,
                totalQuestions = result.TotalQuestions
            });
        }

        // Returns either a result that needs improvement (<80%) or the next unplayed section
        [Authorize]
        [HttpGet("nextresult/{playerName}")]
        public async Task<IActionResult> GetNextResult()
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var player = await _context.Players.FindAsync(playerId);

            if (player == null)
                return StatusCode(500, new { message = "Internal server error" });

            var result = await _context.Results
                .FirstOrDefaultAsync(r =>
                    r.PlayerName == player.UserName &&
                    r.CorrectAnswers < r.TotalQuestions * 0.8);

            if (result != null)
            {
                return Ok(new
                {
                    type = "result",
                    data = result
                });
            }

            var playedSections = await _context.Results
                .Where(r => r.PlayerName == player.UserName)
                .Select(r => r.SectionId)
                .ToListAsync();

            var nextSection = await _context.Sections
                .Include(s => s.Questions)
                .Where(s => !playedSections.Contains(s.Id))
                .OrderBy(s => s.Id)
                .FirstOrDefaultAsync();

            if (nextSection == null)
            {
                return Ok(new { success = true, message = "No more sections in the list" });
            }

            var totalQuestions = nextSection.Questions.Count;
            var dto = new
            {
                nextSection.Id,
                nextSection.Name,
                nextSection.Description,
                nextSection.Image,
                nextSection.Stars,
                nextSection.Points,
                nextSection.Locked,
                nextSection.AchievementId,
                TotalQuestions = totalQuestions
            };

            return Ok(new
            {
                type = "section",
                data = dto
            });
        }

        // Delete a result by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResult(int id)
        {
            var result = await _context.Results.FindAsync(id);
            if (result == null)
                return NotFound(new { success = false, message = "Result not found" });

            _context.Results.Remove(result);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Result deleted" });
        }

        // Get all results for a player by ID
        [HttpGet("{playerId}")]
        public async Task<IActionResult> GetResults(string playerId)
        {
            var playerExists = await _context.Players.AnyAsync(p => p.Id == playerId);
            if (!playerExists)
                return NotFound(new { success = false, message = "Player not found" });

            var resultList = await _context.Results
                .Where(p => p.PlayerId == playerId)
                .ToListAsync();

            return Ok(resultList);
        }
    }
}
