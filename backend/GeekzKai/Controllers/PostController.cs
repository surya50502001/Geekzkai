using geekzKai.Data;
using geekzKai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace geekzKai.Controllers
{
    [ApiController]
    [Route("api/posts")]  // 👈 fixed route to match frontend
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                .ToListAsync();
        }

        // GET: api/posts/trending
        [HttpGet("trending")]
        public async Task<ActionResult<IEnumerable<Post>>> GetTrendingPosts()
        {
            var trendingPosts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                .OrderByDescending(p => p.Upvotes.Count(uv => uv.VotedAt > DateTime.UtcNow.AddDays(-7)))
                .Take(10)
                .ToListAsync();

            return Ok(trendingPosts);
        }

        // GET: api/posts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
                return NotFound(new { message = "Post not found" });

            return Ok(post);
        }

        // POST: api/posts
        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> CreatePost([FromBody] Post post)
        {
            if (post == null)
                return BadRequest("Invalid post data");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            post.UserId = int.Parse(userId);
            post.CreatedAt = DateTime.UtcNow;

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(post);
        }


        // PUT: api/posts/{id}
        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post post)
        {
            if (id != post.Id)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var postToUpdate = await _context.Posts.FindAsync(id);

            if (postToUpdate == null)
                return NotFound(new { message = "Post not found" });

            if (postToUpdate.UserId.ToString() != userId)
                return Forbid();

            postToUpdate.Question = post.Question;
            postToUpdate.Description = post.Description;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/posts/{id}
        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> DeletePost(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound(new { message = "Post not found" });

            if (post.UserId.ToString() != userId)
                return Forbid();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
