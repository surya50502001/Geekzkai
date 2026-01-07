using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GeekzKai.Data;
using GeekzKai.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace GeekzKai.Controllers
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

            // Create follow relationship immediately
            var follow = new Follow
            {
                FollowerId = currentUserId,
                FollowingId = userId
            };
            _context.Follows.Add(follow);

            // Update follower counts
            var follower = await _context.Users.FindAsync(currentUserId);
            var following = await _context.Users.FindAsync(userId);
            
            if (follower != null) follower.FollowingCount++;
            if (following != null) following.FollowersCount++;

            // Send notification
            if (follower != null)
            {
                var notification = new Notification
                {
                    UserId = userId,
                    FromUserId = currentUserId,
                    Type = "follow",
                    Message = $"{follower.Username} started following you"
                };
                _context.Notifications.Add(notification);
            }

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

            // Update follower counts
            var follower = await _context.Users.FindAsync(currentUserId);
            var following = await _context.Users.FindAsync(userId);
            
            if (follower != null && follower.FollowingCount > 0) follower.FollowingCount--;
            if (following != null && following.FollowersCount > 0) following.FollowersCount--;

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