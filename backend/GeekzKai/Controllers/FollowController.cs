using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using geekzKai.Data;
using geekzKai.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace geekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FollowController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FollowController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> FollowUser(int userId)
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            if (currentUserId == userId)
                return BadRequest("Cannot follow yourself");

            var existingFollow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowingId == userId);

            if (existingFollow != null)
                return BadRequest("Already following this user");

            var follow = new Follow
            {
                FollowerId = currentUserId,
                FollowingId = userId
            };

            _context.Follows.Add(follow);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User followed successfully" });
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> UnfollowUser(int userId)
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowingId == userId);

            if (follow == null)
                return BadRequest("Not following this user");

            _context.Follows.Remove(follow);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User unfollowed successfully" });
        }

        [HttpGet("status/{userId}")]
        public async Task<IActionResult> GetFollowStatus(int userId)
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var isFollowing = await _context.Follows
                .AnyAsync(f => f.FollowerId == currentUserId && f.FollowingId == userId);

            return Ok(new { isFollowing });
        }
    }
}