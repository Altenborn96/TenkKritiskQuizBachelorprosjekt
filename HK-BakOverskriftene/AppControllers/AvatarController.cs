using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BakOverskriftene.Domain.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;


namespace BakOverskriftene.Api.AppControllers
{
    [Route("api/avatar")]
    [ApiController]
    
    public class AvatarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AvatarController(ApplicationDbContext context)
        {
            _context = context;
        }
        //Endpoint will be Avatar, not Avatars for appController.
        [HttpGet("allavatars")]
        public async Task<ActionResult<IEnumerable<Avatar>>> GetAvatars()
        {
            var avatars = await _context.Avatars.ToListAsync(); // Retrieve data asynchronously from db
            return Ok(avatars); // Return avatars as JSON
        }


    }
}