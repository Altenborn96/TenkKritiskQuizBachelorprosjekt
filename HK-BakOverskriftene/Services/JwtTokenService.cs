
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

using Microsoft.IdentityModel.Tokens;
using System.Text;

using Microsoft.IdentityModel.JsonWebTokens;

public class JwtTokenService
{
	private readonly IConfiguration _config;

	public JwtTokenService(IConfiguration config)
	{
		_config = config;
	}

	public string GenerateJwtToken(IdentityUser user)
	{
		string secretKey = _config["Jwt:Secret"]!;
		var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

		var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(
				[
				new Claim(JwtRegisteredClaimNames.Sub, user.Id),
				new Claim(JwtRegisteredClaimNames.Email, user.Email)
				]),
			Expires = DateTime.UtcNow.AddMinutes(_config.GetValue<int>("Jwt:ExpirationInMinutes")),
			SigningCredentials = credentials,
			Issuer = _config["Jwt:Issuer"],
			Audience = _config["Jwt: Audience"]
		};

		var handler = new JsonWebTokenHandler();

		string token = handler.CreateToken(tokenDescriptor);
		return token;
	}
}
