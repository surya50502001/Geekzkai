using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using geekzKai.Data;
using geekzKai.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using geekzKai.Hubs;

namespace geekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageController(AppDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendDirectMessageRequest request)
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var message = new Message
            {
                SenderId = currentUserId,
                ReceiverId = request.ReceiverId,
                Content = request.Content
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Load sender info for real-time notification
            var messageWithSender = await _context.Messages
                .Include(m => m.Sender)
                .FirstAsync(m => m.Id == message.Id);

            // Send real-time notification to receiver
            await _hubContext.Clients.Group($"user_{request.ReceiverId}")
                .SendAsync("ReceiveMessage", new {
                    messageWithSender.Id,
                    messageWithSender.SenderId,
                    messageWithSender.Content,
                    messageWithSender.CreatedAt,
                    Sender = new {
                        messageWithSender.Sender.Id,
                        messageWithSender.Sender.Username,
                        messageWithSender.Sender.ProfilePictureUrl
                    }
                });

            return Ok(messageWithSender);
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");

                var messages = await _context.Messages
                    .Where(m => m.SenderId == currentUserId || m.ReceiverId == currentUserId)
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .OrderByDescending(m => m.CreatedAt)
                    .ToListAsync();

                var conversations = messages
                    .GroupBy(m => m.SenderId == currentUserId ? m.ReceiverId : m.SenderId)
                    .Select(g => new
                    {
                        UserId = g.Key,
                        User = g.First().SenderId == currentUserId ? g.First().Receiver : g.First().Sender,
                        LastMessage = g.First(),
                        UnreadCount = g.Count(m => m.ReceiverId == currentUserId && !m.IsRead)
                    })
                    .ToList();

                return Ok(conversations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMessages(int userId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");

                var messages = await _context.Messages
                    .Where(m => (m.SenderId == currentUserId && m.ReceiverId == userId) ||
                               (m.SenderId == userId && m.ReceiverId == currentUserId))
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .OrderBy(m => m.CreatedAt)
                    .ToListAsync();

                // Mark messages as read
                var unreadMessages = messages.Where(m => m.ReceiverId == currentUserId && !m.IsRead);
                foreach (var message in unreadMessages)
                {
                    message.IsRead = true;
                }
                await _context.SaveChangesAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class SendDirectMessageRequest
    {
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}