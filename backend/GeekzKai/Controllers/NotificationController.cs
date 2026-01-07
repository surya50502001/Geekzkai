using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using GeekzKai.Data;
using GeekzKai.Models;

namespace GeekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .Include(n => n.FromUser)
                .OrderByDescending(n => n.CreatedAt)
                .Take(20)
                .Select(n => new NotificationResponse
                {
                    Id = n.Id,
                    Type = n.Type,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt,
                    FromUser = new UserResponse
                    {
                        Id = n.FromUser!.Id,
                        Username = n.FromUser.Username,
                        ProfilePictureUrl = n.FromUser.ProfilePictureUrl,
                        IsYoutuber = n.FromUser.IsYoutuber,
                        IsAdmin = n.FromUser.IsAdmin
                    }
                })
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpGet("unread-count")]
        [Authorize]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var count = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .CountAsync();

            return Ok(new { count });
        }

        [HttpPost("{id}/read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("friend-requests")]
        [Authorize]
        public async Task<IActionResult> GetFriendRequests()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var friendRequests = await _context.Notifications
                .Where(n => n.UserId == userId && n.Type == "friend_request")
                .Include(n => n.FromUser)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationResponse
                {
                    Id = n.Id,
                    Type = n.Type,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt,
                    FromUser = new UserResponse
                    {
                        Id = n.FromUser!.Id,
                        Username = n.FromUser.Username,
                        ProfilePictureUrl = n.FromUser.ProfilePictureUrl,
                        IsYoutuber = n.FromUser.IsYoutuber,
                        IsAdmin = n.FromUser.IsAdmin
                    }
                })
                .ToListAsync();

            return Ok(friendRequests);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest request)
        {
            var fromUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var notification = new Notification
            {
                UserId = request.ToUserId,
                FromUserId = fromUserId,
                Type = request.Type,
                Message = request.Message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("mark-all-read")]
        [Authorize]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}