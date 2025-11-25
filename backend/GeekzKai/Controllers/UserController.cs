using geekzKai.Data;
using geekzKai.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace geekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public UserController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // GET ALL USERS
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .ToListAsync();

            return Ok(users);
        }

        // GET SINGLE USER
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .FirstOrDefaultAsync(u => u.User_Id == id);

            return user == null
                ? NotFound(new { message = "User not found" })
                : Ok(user);
        }

        // REGISTER
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = await _context.Users
                .AnyAsync(u => u.Username == request.Username || u.User_Email == request.Email);

            if (exists)
                return BadRequest(new { message = "Username or Email already taken." });

            var newUser = new User
            {
                Username = request.Username,
                User_Email = request.Email,
                User_Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                User_CreatedAt = DateTime.UtcNow,
                IsYoutuber = request.IsYoutuber,
                YouTubeChannellink = request.YouTubeChannelLink,
                AuthProvider = "local"
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = newUser.User_Id }, newUser);
        }

        // UPDATE USER
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User update)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.Username = update.Username ?? user.Username;
            user.User_Email = update.User_Email ?? user.User_Email;

            if (!string.IsNullOrEmpty(update.User_Password))
                user.User_Password = BCrypt.Net.BCrypt.HashPassword(update.User_Password);

            user.Bio = update.Bio ?? user.Bio;
            user.ProfilePictureUrl = update.ProfilePictureUrl ?? user.ProfilePictureUrl;
            user.YouTubeChannellink = update.YouTubeChannellink ?? user.YouTubeChannellink;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE USER
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.User_Email == request.Email);

            if (user == null || string.IsNullOrEmpty(user.User_Password))
                return Unauthorized(new { message = "Invalid email or password" });

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.User_Password))
                return Unauthorized(new { message = "Invalid email or password" });

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.User_Id,
                    user.Username,
                    user.User_Email
                }
            });
        }

        // GET LOGGED IN USER
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .FirstOrDefaultAsync(u => u.User_Id == userId);

            return user == null ? NotFound(new { message = "User not found" }) : Ok(user);
        }

        // JWT GENERATOR
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.User_Id.ToString()),
                new Claim(ClaimTypes.Email, user.User_Email),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
