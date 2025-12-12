using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using geekzKai.Data;
using geekzKai.Models;

namespace geekzKai.Controllers
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
        public async Task<ActionResult<Room>> CreateRoom([FromBody] Room room)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            room.CreatorId = userId;
            room.CreatedAt = DateTime.UtcNow;
            room.CurrentParticipants = 1;

            _context.Rooms.Add(room);
            
            // Add creator as first participant
            var participant = new RoomParticipant
            {
                RoomId = room.Id,
                UserId = userId,
                JoinedAt = DateTime.UtcNow
            };
            
            await _context.SaveChangesAsync();
            
            participant.RoomId = room.Id;
            _context.RoomParticipants.Add(participant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room);
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
        public async Task<ActionResult<RoomMessage>> SendMessage(int id, [FromBody] RoomMessage message)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            // Check if user is in room
            var participant = await _context.RoomParticipants
                .FirstOrDefaultAsync(p => p.RoomId == id && p.UserId == userId && p.IsActive);

            if (participant == null)
                return BadRequest("Not in room");

            message.RoomId = id;
            message.UserId = userId;
            message.SentAt = DateTime.UtcNow;

            _context.RoomMessages.Add(message);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoomMessages), new { id }, message);
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