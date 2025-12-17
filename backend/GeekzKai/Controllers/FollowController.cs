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
        public async Task<IActionResult> SendFriendRequest(int userId)
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            if (currentUserId == userId)
                return BadRequest("Cannot send friend request to yourself");

            var existingFollow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowingId == userId);

            if (existingFollow != null)
                return BadRequest("Already following this user");

            // Check if friend request already exists
            var existingRequest = await _context.Notifications
                .FirstOrDefaultAsync(n => n.FromUserId == currentUserId && n.UserId == userId && n.Type == "friend_request");

            if (existingRequest != null)
                return BadRequest("Friend request already sent");

            var follower = await _context.Users.FindAsync(currentUserId);
            
            if (follower != null)
            {
                var notification = new Notification
                {
                    UserId = userId,
                    FromUserId = currentUserId,
                    Type = "friend_request",
                    Message = $"{follower.Username} sent you a friend request"
                };
                _context.Notifications.Add(notification);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend request sent successfully" });
        }

        [HttpPost("accept/{fromUserId}")]
        public async Task<IActionResult> AcceptFriendRequest(int fromUserId)
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            // Find the friend request notification
            var friendRequest = await _context.Notifications
                .FirstOrDefaultAsync(n => n.FromUserId == fromUserId && n.UserId == currentUserId && n.Type == "friend_request");

            if (friendRequest == null)
                return BadRequest("Friend request not found");

            // Create the follow relationship
            var follow = new Follow
            {
                FollowerId = fromUserId,
                FollowingId = currentUserId
            };
            _context.Follows.Add(follow);

            // Update follower counts
            var follower = await _context.Users.FindAsync(fromUserId);
            var following = await _context.Users.FindAsync(currentUserId);
            
            if (follower != null) follower.FollowingCount++;
            if (following != null) following.FollowersCount++;

            // Remove the friend request notification
            _context.Notifications.Remove(friendRequest);

            // Create acceptance notification
            if (following != null)
            {
                var notification = new Notification
                {
                    UserId = fromUserId,
                    FromUserId = currentUserId,
                    Type = "friend_accepted",
                    Message = $"{following.Username} accepted your friend request"
                };
                _context.Notifications.Add(notification);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend request accepted" });
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