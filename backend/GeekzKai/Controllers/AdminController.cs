using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using GeekzKai.Data;
using GeekzKai.Models;

namespace GeekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        private async Task<bool> IsAdmin()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var user = await _context.Users.FindAsync(userId);
            return user?.IsAdmin == true;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            if (!await IsAdmin()) return Forbid();

            var stats = new
            {
                TotalUsers = await _context.Users.CountAsync(),
                ActiveUsers = await _context.Users.Where(u => u.IsActive).CountAsync(),
                TotalPosts = await _context.Posts.CountAsync(),
                TotalComments = await _context.Comments.CountAsync(),
                ActiveRooms = await _context.Rooms.Where(r => r.IsActive).CountAsync(),
                LiveStreams = await _context.LiveStreams.Where(l => l.IsLive).CountAsync(),
                TotalNotifications = await _context.Notifications.CountAsync()
            };

            return Ok(stats);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(int page = 1, int limit = 20)
        {
            if (!await IsAdmin()) return Forbid();

            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.CreatedAt,
                    u.IsActive,
                    u.IsAdmin,
                    u.IsYoutuber,
                    u.AuthProvider,
                    u.EmailVerified,
                    PostCount = u.Posts.Count,
                    CommentCount = u.Comments.Count
                })
                .ToListAsync();

            var total = await _context.Users.CountAsync();

            return Ok(new { users, total, page, limit });
        }

        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateUserStatusRequest request)
        {
            if (!await IsAdmin()) return Forbid();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.IsActive = request.IsActive;
            user.IsAdmin = request.IsAdmin;
            user.IsYoutuber = request.IsYoutuber;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetAllPosts(int page = 1, int limit = 20)
        {
            if (!await IsAdmin()) return Forbid();

            var posts = await _context.Posts
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(p => new
                {
                    p.Id,
                    p.Question,
                    p.Description,
                    p.CreatedAt,
                    User = new { p.User!.Id, p.User.Username },
                    CommentCount = p.Comments.Count,
                    UpvoteCount = p.Upvotes.Count
                })
                .ToListAsync();

            var total = await _context.Posts.CountAsync();

            return Ok(new { posts, total, page, limit });
        }

        [HttpDelete("posts/{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            if (!await IsAdmin()) return Forbid();

            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("rooms")]
        public async Task<IActionResult> GetAllRooms(int page = 1, int limit = 20)
        {
            if (!await IsAdmin()) return Forbid();

            var rooms = await _context.Rooms
                .Include(r => r.Creator)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.CreatedAt,
                    r.IsActive,
                    r.CurrentParticipants,
                    r.MaxParticipants,
                    Creator = new { r.Creator!.Id, r.Creator.Username }
                })
                .ToListAsync();

            var total = await _context.Rooms.CountAsync();

            return Ok(new { rooms, total, page, limit });
        }

        [HttpPut("rooms/{id}/status")]
        public async Task<IActionResult> UpdateRoomStatus(int id, [FromBody] UpdateRoomStatusRequest request)
        {
            if (!await IsAdmin()) return Forbid();

            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            room.IsActive = request.IsActive;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("live-streams")]
        public async Task<IActionResult> GetAllLiveStreams(int page = 1, int limit = 20)
        {
            if (!await IsAdmin()) return Forbid();

            var streams = await _context.LiveStreams
                .Include(l => l.Streamer)
                .OrderByDescending(l => l.StartedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(l => new
                {
                    l.Id,
                    l.Title,
                    l.Description,
                    l.StartedAt,
                    l.EndedAt,
                    l.IsLive,
                    l.ViewerCount,
                    Streamer = new { l.Streamer!.Id, l.Streamer.Username }
                })
                .ToListAsync();

            var total = await _context.LiveStreams.CountAsync();

            return Ok(new { streams, total, page, limit });
        }

        [HttpPost("live-streams/{id}/stop")]
        public async Task<IActionResult> StopLiveStream(int id)
        {
            if (!await IsAdmin()) return Forbid();

            var stream = await _context.LiveStreams.FindAsync(id);
            if (stream == null) return NotFound();

            stream.IsLive = false;
            stream.EndedAt = DateTime.UtcNow;
            stream.ViewerCount = 0;

            // Remove all viewers
            var viewers = await _context.LiveViewers
                .Where(v => v.LiveStreamId == id && v.IsActive)
                .ToListAsync();
            
            foreach (var viewer in viewers)
                viewer.IsActive = false;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("broadcast")]
        public async Task<IActionResult> BroadcastNotification([FromBody] BroadcastNotificationRequest request)
        {
            if (!await IsAdmin()) return Forbid();

            var adminUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var users = await _context.Users.Where(u => u.IsActive).ToListAsync();

            var notifications = users.Select(user => new Notification
            {
                UserId = user.Id,
                FromUserId = adminUserId,
                Type = "admin_broadcast",
                Message = request.Message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();

            return Ok(new { sent = notifications.Count });
        }
    }

    public class UpdateUserStatusRequest
    {
        public bool IsActive { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsYoutuber { get; set; }
    }

    public class UpdateRoomStatusRequest
    {
        public bool IsActive { get; set; }
    }

    public class BroadcastNotificationRequest
    {
        public string Message { get; set; } = string.Empty;
    }
}