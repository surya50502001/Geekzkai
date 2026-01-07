using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using GeekzKai.Data;
using GeekzKai.Models;

namespace GeekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LiveController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LiveController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/live
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LiveStream>>> GetLiveStreams()
        {
            return await _context.LiveStreams
                .Include(l => l.Streamer)
                .Where(l => l.IsLive)
                .OrderByDescending(l => l.ViewerCount)
                .ToListAsync();
        }

        // GET: api/live/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LiveStream>> GetLiveStream(int id)
        {
            var stream = await _context.LiveStreams
                .Include(l => l.Streamer)
                .Include(l => l.Viewers)
                .ThenInclude(v => v.User)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (stream == null)
                return NotFound();

            return stream;
        }

        // POST: api/live/start
        [HttpPost("start")]
        public async Task<ActionResult<LiveStreamResponse>> StartLiveStream([FromBody] CreateLiveStreamRequest request)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            // Check if user already has an active stream
            var existingStream = await _context.LiveStreams
                .FirstOrDefaultAsync(l => l.StreamerId == userId && l.IsLive);

            if (existingStream != null)
                return BadRequest("Already streaming");

            var stream = new LiveStream
            {
                Title = request.Title,
                Description = request.Description,
                StreamerId = userId,
                StartedAt = DateTime.UtcNow,
                StreamKey = Guid.NewGuid().ToString(),
                ViewerCount = 0,
                IsLive = true
            };

            _context.LiveStreams.Add(stream);
            await _context.SaveChangesAsync();

            var streamer = await _context.Users.FindAsync(userId);
            var response = new LiveStreamResponse
            {
                Id = stream.Id,
                Title = stream.Title,
                Description = stream.Description,
                StartedAt = stream.StartedAt,
                EndedAt = stream.EndedAt,
                IsLive = stream.IsLive,
                ViewerCount = stream.ViewerCount,
                Streamer = new UserResponse
                {
                    Id = streamer!.Id,
                    Username = streamer.Username,
                    ProfilePictureUrl = streamer.ProfilePictureUrl,
                    IsYoutuber = streamer.IsYoutuber,
                    IsAdmin = streamer.IsAdmin
                },
                IsWatching = false
            };

            return CreatedAtAction(nameof(GetLiveStream), new { id = stream.Id }, response);
        }

        // POST: api/live/{id}/stop
        [HttpPost("{id}/stop")]
        public async Task<IActionResult> StopLiveStream(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var stream = await _context.LiveStreams.FindAsync(id);

            if (stream == null)
                return NotFound();

            if (stream.StreamerId != userId)
                return Forbid();

            stream.IsLive = false;
            stream.EndedAt = DateTime.UtcNow;
            
            // Remove all viewers
            var viewers = await _context.LiveViewers
                .Where(v => v.LiveStreamId == id && v.IsActive)
                .ToListAsync();
            
            foreach (var viewer in viewers)
                viewer.IsActive = false;

            stream.ViewerCount = 0;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // POST: api/live/{id}/join
        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinLiveStream(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var stream = await _context.LiveStreams.FindAsync(id);

            if (stream == null || !stream.IsLive)
                return NotFound();

            var existingViewer = await _context.LiveViewers
                .FirstOrDefaultAsync(v => v.LiveStreamId == id && v.UserId == userId && v.IsActive);

            if (existingViewer != null)
                return BadRequest("Already watching");

            var viewer = new LiveViewer
            {
                LiveStreamId = id,
                UserId = userId
            };

            _context.LiveViewers.Add(viewer);
            stream.ViewerCount++;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // POST: api/live/{id}/leave
        [HttpPost("{id}/leave")]
        public async Task<IActionResult> LeaveLiveStream(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var viewer = await _context.LiveViewers
                .FirstOrDefaultAsync(v => v.LiveStreamId == id && v.UserId == userId && v.IsActive);

            if (viewer == null)
                return BadRequest("Not watching");

            viewer.IsActive = false;
            
            var stream = await _context.LiveStreams.FindAsync(id);
            if (stream != null && stream.ViewerCount > 0)
                stream.ViewerCount--;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET: api/live/{id}/messages
        [HttpGet("{id}/messages")]
        public async Task<ActionResult<IEnumerable<LiveMessage>>> GetLiveMessages(int id)
        {
            return await _context.LiveMessages
                .Include(m => m.User)
                .Where(m => m.LiveStreamId == id)
                .OrderBy(m => m.SentAt)
                .Take(100)
                .ToListAsync();
        }

        // POST: api/live/{id}/messages
        [HttpPost("{id}/messages")]
        public async Task<ActionResult<MessageResponse>> SendLiveMessage(int id, [FromBody] SendMessageRequest request)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            // Check if user is watching or is the streamer
            var stream = await _context.LiveStreams.FindAsync(id);
            var isViewer = await _context.LiveViewers
                .AnyAsync(v => v.LiveStreamId == id && v.UserId == userId && v.IsActive);

            if (stream == null || (!isViewer && stream.StreamerId != userId))
                return BadRequest("Not authorized to send messages");

            var message = new LiveMessage
            {
                LiveStreamId = id,
                UserId = userId,
                Message = request.Message,
                SentAt = DateTime.UtcNow
            };

            _context.LiveMessages.Add(message);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            var response = new MessageResponse
            {
                Id = message.Id,
                Message = message.Message,
                SentAt = message.SentAt,
                User = new UserResponse
                {
                    Id = user!.Id,
                    Username = user.Username,
                    ProfilePictureUrl = user.ProfilePictureUrl,
                    IsYoutuber = user.IsYoutuber,
                    IsAdmin = user.IsAdmin
                }
            };

            return Ok(response);
        }

        // GET: api/live/my-streams
        [HttpGet("my-streams")]
        public async Task<ActionResult<IEnumerable<LiveStream>>> GetMyStreams()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            return await _context.LiveStreams
                .Where(l => l.StreamerId == userId)
                .OrderByDescending(l => l.StartedAt)
                .ToListAsync();
        }
    }
}