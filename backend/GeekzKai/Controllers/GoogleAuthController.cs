using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using geekzKai.Data;
using geekzKai.Models;

namespace geekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoogleAuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public GoogleAuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("test-config")]
        public IActionResult TestConfig()
        {
            var clientId = _configuration["Google:ClientId"] ?? Environment.GetEnvironmentVariable("Google__ClientId");
            var hasClientSecret = !string.IsNullOrEmpty(_configuration["Google:ClientSecret"] ?? Environment.GetEnvironmentVariable("Google__ClientSecret"));
            
            return Ok(new {
                ClientIdConfigured = !string.IsNullOrEmpty(clientId),
                ClientSecretConfigured = hasClientSecret,
                ClientIdPreview = clientId?.Substring(0, Math.Min(20, clientId.Length)) + "..."
            });
        }

        [HttpGet("signin")]
        public IActionResult SignIn()
        {
            Console.WriteLine($"Request Host: {Request.Host}");
            Console.WriteLine($"Request Scheme: {Request.Scheme}");
            var properties = new AuthenticationProperties();
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback()
        {
            try
            {
                Console.WriteLine("Google OAuth callback started");
                var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
                
                if (!result.Succeeded)
                {
                    var error = result.Failure?.Message ?? "Unknown authentication error";
                    Console.WriteLine($"Authentication failed: {error}");
                    return Redirect($"https://geekzkai-1.onrender.com/auth/error?message={Uri.EscapeDataString(error)}");
                }

                Console.WriteLine("Authentication succeeded, extracting claims");
                var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
                var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;
                var picture = result.Principal.FindFirst("picture")?.Value;

                Console.WriteLine($"Email: {email}, Name: {name}");

                if (string.IsNullOrEmpty(email))
                {
                    Console.WriteLine("Email not provided by Google");
                    return Redirect($"https://geekzkai-1.onrender.com/auth/error?message={Uri.EscapeDataString("Email not provided by Google")}");
                }

                Console.WriteLine("Looking up user in database");
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                
                if (user == null)
                {
                    Console.WriteLine("Creating new user");
                    user = new User
                    {
                        Email = email,
                        Username = name ?? email.Split('@')[0],
                        AuthProvider = "google",
                        ProfilePictureUrl = picture,
                        Password = null
                    };
                    
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"New user created with ID: {user.Id}");
                }
                else
                {
                    Console.WriteLine($"Existing user found with ID: {user.Id}");
                }

                Console.WriteLine("Generating JWT token");
                var token = GenerateJwtToken(user);
                
                Console.WriteLine("Redirecting to frontend with token");
                return Redirect($"https://geekzkai-1.onrender.com/auth/callback?token={token}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Google OAuth callback error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return Redirect($"https://geekzkai-1.onrender.com/auth/error?message={Uri.EscapeDataString(ex.Message)}");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}