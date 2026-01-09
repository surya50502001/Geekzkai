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
    public class RoomController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/room
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            return await _context.Rooms
                .Include(r => r.Creator)
                .Where(r => r.IsActive)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // GET: api/room/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Creator)
                .Include(r => r.Participants)
                .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
                return NotFound();

            return room;
        }

        // POST: api/room
        [HttpPost]
        public async Task<ActionResult<RoomResponse>> CreateRoom([FromBody] CreateRoomRequest request)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var room = new Room
            {
                Title = request.Title,
                Description = request.Description,
                MaxParticipants = request.MaxParticipants,
                CreatorId = userId,
                CreatedAt = DateTime.UtcNow,
                CurrentParticipants = 1
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            
            // Add creator as first participant
            var participant = new RoomParticipant
            {
                RoomId = room.Id,
                UserId = userId,
                JoinedAt = DateTime.UtcNow
            };
            
            _context.RoomParticipants.Add(participant);
            await _context.SaveChangesAsync();

            var creator = await _context.Users.FindAsync(userId);
            var response = new RoomResponse
            {
                Id = room.Id,
                Title = room.Title,
                Description = room.Description,
                CreatedAt = room.CreatedAt,
                IsActive = room.IsActive,
                MaxParticipants = room.MaxParticipants,
                CurrentParticipants = room.CurrentParticipants,
                Creator = new UserResponse
                {
                    Id = creator!.Id,
                    Username = creator.Username,
                    ProfilePictureUrl = creator.ProfilePictureUrl,
                    IsYoutuber = creator.IsYoutuber,
                    IsAdmin = creator.IsAdmin
                },
                IsJoined = true
            };

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, response);
        }

        // POST: api/room/{id}/join
        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinRoom(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var room = await _context.Rooms.FindAsync(id);

            if (room == null || !room.IsActive)
                return NotFound();

            if (room.CurrentParticipants >= room.MaxParticipants)
                return BadRequest("Room is full");

            var existingParticipant = await _context.RoomParticipants
                .FirstOrDefaultAsync(p => p.RoomId == id && p.UserId == userId && p.IsActive);

            if (existingParticipant != null)
                return BadRequest("Already in room");

            var participant = new RoomParticipant
            {
                RoomId = id,
                UserId = userId
            };

            _context.RoomParticipants.Add(participant);
            room.CurrentParticipants++;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // POST: api/room/{id}/leave
        [HttpPost("{id}/leave")]
        public async Task<IActionResult> LeaveRoom(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var participant = await _context.RoomParticipants
                .FirstOrDefaultAsync(p => p.RoomId == id && p.UserId == userId && p.IsActive);

            if (participant == null)
                return BadRequest("Not in room");

            participant.IsActive = false;
            
            var room = await _context.Rooms.FindAsync(id);
            if (room != null && room.CurrentParticipants > 0)
                room.CurrentParticipants--;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET: api/room/{id}/membership
        [HttpGet("{id}/membership")]
        public async Task<ActionResult<object>> GetMembership(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var participant = await _context.RoomParticipants
                .FirstOrDefaultAsync(p => p.RoomId == id && p.UserId == userId && p.IsActive);

            return Ok(new { isMember = participant != null });
        }

        // GET: api/room/{id}/messages
        [HttpGet("{id}/messages")]
        public async Task<ActionResult<IEnumerable<RoomMessage>>> GetRoomMessages(int id)
        {
            return await _context.RoomMessages
                .Include(m => m.User)
                .Where(m => m.RoomId == id)
                .OrderBy(m => m.SentAt)
                .Take(100)
                .ToListAsync();
        }

        // POST: api/room/{id}/messages
        [HttpPost("{id}/messages")]
        public async Task<ActionResult<MessageResponse>> SendMessage(int id, [FromBody] SendMessageRequest request)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            // Check if user is in room
            var participant = await _context.RoomParticipants
                .FirstOrDefaultAsync(p => p.RoomId == id && p.UserId == userId && p.IsActive);

            if (participant == null)
                return BadRequest("Not in room");

            var message = new RoomMessage
            {
                RoomId = id,
                UserId = userId,
                Message = request.Message,
                SentAt = DateTime.UtcNow
            };

            _context.RoomMessages.Add(message);
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

        // DELETE: api/room/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
                return NotFound();

            if (room.CreatorId != userId)
                return Forbid();

            room.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}