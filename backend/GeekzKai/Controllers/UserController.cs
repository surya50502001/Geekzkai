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

        // GET: api/User
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .FirstOrDefaultAsync(u => u.Id == id);

            return user == null
                ? NotFound(new { message = "User not found" })
                : Ok(user);
        }

        // POST: api/User
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = await _context.Users
                .AnyAsync(u => u.Username == request.Username || u.Email == request.Email);

            if (exists)
                return BadRequest(new { message = "Username or Email already taken." });

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow,
                IsYoutuber = request.IsYoutuber,
                YouTubeChannelLink = request.YouTubeChannelLink
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User update)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            user.Username = update.Username ?? user.Username;
            user.Email = update.Email ?? user.Email;

            if (!string.IsNullOrEmpty(update.PasswordHash))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(update.PasswordHash);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/User/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new { user.Id, user.Username, user.Email } });
        }

        // GET: api/User/me
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user == null ? NotFound(new { message = "User not found" }) : Ok(user);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
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
