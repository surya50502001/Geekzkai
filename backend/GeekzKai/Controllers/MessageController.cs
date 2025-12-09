using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using geekzKai.Data;
using geekzKai.Models;
using Microsoft.AspNetCore.Authorization;

namespace geekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
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

            return Ok(new { message = "Message sent successfully" });
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var conversations = await _context.Messages
                .Where(m => m.SenderId == currentUserId || m.ReceiverId == currentUserId)
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .GroupBy(m => m.SenderId == currentUserId ? m.ReceiverId : m.SenderId)
                .Select(g => new
                {
                    UserId = g.Key,
                    User = g.First().SenderId == currentUserId ? g.First().Receiver : g.First().Sender,
                    LastMessage = g.OrderByDescending(m => m.CreatedAt).First(),
                    UnreadCount = g.Count(m => m.ReceiverId == currentUserId && !m.IsRead)
                })
                .ToListAsync();

            return Ok(conversations);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMessages(int userId)
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
    }

    public class SendMessageRequest
    {
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}