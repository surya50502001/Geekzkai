using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using geekzKai.Data;
using geekzKai.Models;

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

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new {
                user.Id,
                user.Username,
                user.Email,
                user.ProfilePictureUrl,
                user.EmailVerified,
                user.Bio,
                user.FollowersCount,
                user.FollowingCount,
                user.IsYoutuber,
                user.IsAdmin,
                user.CreatedAt
            });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return Ok(new List<object>());
            }

            var users = await _context.Users
                .Where(u => u.Email.ToLower().Contains(query.ToLower()))
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.ProfilePictureUrl,
                    u.Bio
                })
                .Take(10)
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new {
                user.Id,
                user.Username,
                user.Email,
                user.Bio,
                user.ProfilePictureUrl,
                user.FollowersCount,
                user.FollowingCount,
                user.IsYoutuber,
                user.IsAdmin,
                user.CreatedAt
            });
        }

        [HttpGet("{id}/followers")]
        public async Task<IActionResult> GetFollowers(int id)
        {
            var followers = await _context.Follows
                .Where(f => f.FollowingId == id)
                .Include(f => f.Follower)
                .Select(f => new {
                    f.Follower.Id,
                    f.Follower.Username,
                    f.Follower.ProfilePictureUrl,
                    f.Follower.Bio
                })
                .ToListAsync();

            return Ok(followers);
        }

        [HttpGet("{id}/following")]
        public async Task<IActionResult> GetFollowing(int id)
        {
            var following = await _context.Follows
                .Where(f => f.FollowerId == id)
                .Include(f => f.Following)
                .Select(f => new {
                    f.Following.Id,
                    f.Following.Username,
                    f.Following.ProfilePictureUrl,
                    f.Following.Bio
                })
                .ToListAsync();

            return Ok(following);
        }
    }
}