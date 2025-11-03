using geekzKai.Data;
using geekzKai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace geekzKai.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppdbContext _context;

        public UserController(AppdbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Comments)
               .ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var user = await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Comments)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(user);
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser(User user)
        {
            if (user == null)
            {
                return BadRequest(new { message = "Invalid user data" });
            }

            user.CreatedAt = DateTime.UtcNow;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }


        [HttpPut]

        public async Task<IActionResult> GetUser(int id, User updateUser)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            user.Username = updateUser.Username ?? user.Username;
            user.Email = updateUser.Email ?? user.Email;
            user.PasswordHash = updateUser.PasswordHash ?? user.PasswordHash;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();

        }
    }
}