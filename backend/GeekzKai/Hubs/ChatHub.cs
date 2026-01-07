using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using GeekzKai.Data;
using Microsoft.EntityFrameworkCore;

namespace GeekzKai.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly AppDbContext _context;

        public ChatHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"room_{roomId}");
            await Clients.Group($"room_{roomId}").SendAsync("UserJoined", Context.User?.Identity?.Name);
        }

        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"room_{roomId}");
            await Clients.Group($"room_{roomId}").SendAsync("UserLeft", Context.User?.Identity?.Name);
        }

        public async Task SendRoomMessage(string roomId, string message)
        {
            var userId = Context.User?.FindFirst("id")?.Value;
            var user = await _context.Users.FindAsync(int.Parse(userId ?? "0"));
            
            if (user != null)
            {
                await Clients.Group($"room_{roomId}").SendAsync("ReceiveMessage", new
                {
                    User = new { user.Id, user.Username, user.ProfilePictureUrl },
                    Message = message,
                    SentAt = DateTime.UtcNow
                });
            }
        }

        public async Task JoinLiveStream(string streamId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"stream_{streamId}");
            await Clients.Group($"stream_{streamId}").SendAsync("ViewerJoined", Context.User?.Identity?.Name);
        }

        public async Task LeaveLiveStream(string streamId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"stream_{streamId}");
            await Clients.Group($"stream_{streamId}").SendAsync("ViewerLeft", Context.User?.Identity?.Name);
        }

        public async Task SendLiveMessage(string streamId, string message)
        {
            var userId = Context.User?.FindFirst("id")?.Value;
            var user = await _context.Users.FindAsync(int.Parse(userId ?? "0"));
            
            if (user != null)
            {
                await Clients.Group($"stream_{streamId}").SendAsync("ReceiveLiveMessage", new
                {
                    User = new { user.Id, user.Username, user.ProfilePictureUrl },
                    Message = message,
                    SentAt = DateTime.UtcNow
                });
            }
        }

        public async Task SendNotification(string userId, object notification)
        {
            await Clients.Group($"user_{userId}").SendAsync("ReceiveNotification", notification);
        }

        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst("id")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
                await Clients.All.SendAsync("UserOnline", userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst("id")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
                await Clients.All.SendAsync("UserOffline", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}