using BakOverskriftene.Domain.Models.DTO_s;
using Microsoft.AspNetCore.Mvc;

namespace HK_BakOverskriftene.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class CmsLoginController : ControllerBase {
        /// <summary>
        /// Login method to check credentials against environment variables.
        /// </summary>
        /// <param name="login"></param>
        /// <returns></returns>
        [HttpPost("login")]
        public IActionResult Login([FromBody] CmsLoginDTO login) {
            // Log received request payload for debugging
            Console.WriteLine($"Received login request: Username = {login.Username}, Password = {login.Password}");

            // Fetch credentials from environment variables
            var username = Environment.GetEnvironmentVariable("CMS_LOGIN_USERNAME");
            var password = Environment.GetEnvironmentVariable("CMS_LOGIN_PASSWORD");

            // Log environment variables for debugging (only do this for debugging purposes)
            Console.WriteLine($"Fetched username from environment: {username}");
            Console.WriteLine($"Fetched password from environment: {password}");

            // Check if environment variables are loaded properly
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password)) {
                return StatusCode(500, new { message = "Environment variables for credentials are not set." });
            }

            // Validate the credentials
            if (login.Username == username && login.Password == password) {
                return Ok(new { message = "Login successful" });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }
    }
}


