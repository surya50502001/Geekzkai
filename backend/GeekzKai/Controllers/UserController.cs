using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using geekzKai.Data;

namespace geekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return Ok(new List<object>());
            }

            var users = await _context.Users
                .Where(u => u.Username.Contains(query) || u.Email.Contains(query))
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.ProfilePictureUrl
                })
                .Take(10)
                .ToListAsync();

            return Ok(users);
        }
    }
}