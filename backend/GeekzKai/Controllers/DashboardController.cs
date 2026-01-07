using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using GeekzKai.Data;

namespace GeekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetUserStats()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var stats = new
            {
                PostCount = await _context.Posts.CountAsync(p => p.UserId == userId),
                CommentCount = await _context.Comments.CountAsync(c => c.UserId == userId),
                UpvoteCount = await _context.Upvotes.CountAsync(u => u.UserId == userId),
                FollowersCount = await _context.Follows.CountAsync(f => f.FollowingId == userId),
                FollowingCount = await _context.Follows.CountAsync(f => f.FollowerId == userId),
                RoomsCreated = await _context.Rooms.CountAsync(r => r.CreatorId == userId),
                LiveStreamsCount = await _context.LiveStreams.CountAsync(l => l.StreamerId == userId),
                UnreadNotifications = await _context.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead)
            };

            return Ok(stats);
        }

        [HttpGet("activity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var recentPosts = await _context.Posts
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Take(5)
                .Select(p => new
                {
                    Type = "post",
                    p.Id,
                    Title = p.Question,
                    p.CreatedAt,
                    CommentCount = p.Comments.Count,
                    UpvoteCount = p.Upvotes.Count
                })
                .ToListAsync();

            var recentComments = await _context.Comments
                .Include(c => c.Post)
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Take(5)
                .Select(c => new
                {
                    Type = "comment",
                    c.Id,
                    Title = c.Text.Length > 50 ? c.Text.Substring(0, 50) + "..." : c.Text,
                    CreatedAt = c.CreatedAt,
                    PostTitle = c.Post!.Question
                })
                .ToListAsync();

            var recentRooms = await _context.Rooms
                .Where(r => r.CreatorId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Take(3)
                .Select(r => new
                {
                    Type = "room",
                    r.Id,
                    Title = r.Title,
                    r.CreatedAt,
                    r.CurrentParticipants,
                    r.IsActive
                })
                .ToListAsync();

            return Ok(new
            {
                recentPosts,
                recentComments,
                recentRooms
            });
        }

        [HttpGet("feed")]
        public async Task<IActionResult> GetPersonalizedFeed(int page = 1, int limit = 10)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            // Get posts from followed users
            var followingIds = await _context.Follows
                .Where(f => f.FollowerId == userId)
                .Select(f => f.FollowingId)
                .ToListAsync();

            var feedPosts = await _context.Posts
                .Include(p => p.User)
                .Where(p => followingIds.Contains(p.UserId) || p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(p => new
                {
                    p.Id,
                    p.Question,
                    p.Description,
                    p.CreatedAt,
                    User = new
                    {
                        p.User!.Id,
                        p.User.Username,
                        p.User.ProfilePictureUrl,
                        p.User.IsYoutuber
                    },
                    CommentCount = p.Comments.Count,
                    UpvoteCount = p.Upvotes.Count,
                    IsUpvoted = p.Upvotes.Any(u => u.UserId == userId)
                })
                .ToListAsync();

            return Ok(feedPosts);
        }

        [HttpGet("recommendations")]
        public async Task<IActionResult> GetRecommendations()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            // Get users to follow (not already following)
            var followingIds = await _context.Follows
                .Where(f => f.FollowerId == userId)
                .Select(f => f.FollowingId)
                .ToListAsync();

            var recommendedUsers = await _context.Users
                .Where(u => u.Id != userId && !followingIds.Contains(u.Id) && u.IsActive)
                .OrderByDescending(u => u.FollowersCount)
                .Take(5)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.ProfilePictureUrl,
                    u.Bio,
                    u.FollowersCount,
                    u.IsYoutuber
                })
                .ToListAsync();

            // Get trending posts
            var trendingPosts = await _context.Posts
                .Include(p => p.User)
                .Where(p => p.CreatedAt >= DateTime.UtcNow.AddDays(-3))
                .OrderByDescending(p => p.Upvotes.Count + p.Comments.Count)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    p.Question,
                    p.CreatedAt,
                    User = new
                    {
                        p.User!.Id,
                        p.User.Username,
                        p.User.ProfilePictureUrl
                    },
                    CommentCount = p.Comments.Count,
                    UpvoteCount = p.Upvotes.Count
                })
                .ToListAsync();

            // Get active rooms
            var activeRooms = await _context.Rooms
                .Include(r => r.Creator)
                .Where(r => r.IsActive && r.CurrentParticipants < r.MaxParticipants)
                .OrderByDescending(r => r.CurrentParticipants)
                .Take(3)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.CurrentParticipants,
                    r.MaxParticipants,
                    Creator = new
                    {
                        r.Creator!.Id,
                        r.Creator.Username,
                        r.Creator.ProfilePictureUrl
                    }
                })
                .ToListAsync();

            return Ok(new
            {
                recommendedUsers,
                trendingPosts,
                activeRooms
            });
        }
    }
}