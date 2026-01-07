using Microsoft.AspNetCore.SignalR;
using geekzKai.Hubs;
using geekzKai.Data;
using geekzKai.Models;

namespace geekzKai.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(int userId, string type, string message, int fromUserId);
        Task SendBroadcastAsync(string message, int fromUserId);
    }

    public class NotificationService : INotificationService
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly AppDbContext _context;

        public NotificationService(IHubContext<ChatHub> hubContext, AppDbContext context)
        {
            _hubContext = hubContext;
            _context = context;
        }

        public async Task SendNotificationAsync(int userId, string type, string message, int fromUserId)
        {
            // Save to database
            var notification = new Notification
            {
                UserId = userId,
                FromUserId = fromUserId,
                Type = type,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Get sender info
            var fromUser = await _context.Users.FindAsync(fromUserId);

            // Send real-time notification
            await _hubContext.Clients.Group($"user_{userId}").SendAsync("ReceiveNotification", new
            {
                notification.Id,
                notification.Type,
                notification.Message,
                notification.IsRead,
                notification.CreatedAt,
                FromUser = new
                {
                    fromUser?.Id,
                    fromUser?.Username,
                    fromUser?.ProfilePictureUrl,
                    fromUser?.IsYoutuber,
                    fromUser?.IsAdmin
                }
            });
        }

        public async Task SendBroadcastAsync(string message, int fromUserId)
        {
            var users = await _context.Users.Where(u => u.IsActive).ToListAsync();
            
            var notifications = users.Select(user => new Notification
            {
                UserId = user.Id,
                FromUserId = fromUserId,
                Type = "admin_broadcast",
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();

            // Send real-time notifications to all users
            var fromUser = await _context.Users.FindAsync(fromUserId);
            var notificationData = new
            {
                Type = "admin_broadcast",
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                FromUser = new
                {
                    fromUser?.Id,
                    fromUser?.Username,
                    fromUser?.ProfilePictureUrl,
                    fromUser?.IsYoutuber,
                    fromUser?.IsAdmin
                }
            };

            foreach (var user in users)
            {
                await _hubContext.Clients.Group($"user_{user.Id}").SendAsync("ReceiveNotification", notificationData);
            }
        }
    }
}