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
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        // GET: api/posts/recommendations
        [HttpGet("recommendations")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetRecommendedUsers()
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var followingIds = await _context.Follows
                .Where(f => f.FollowerId == currentUserId)
                .Select(f => f.FollowingId)
                .ToListAsync();

            var recommendedUsers = await _context.Users
                .Where(u => u.Id != currentUserId && !followingIds.Contains(u.Id))
                .OrderByDescending(u => u.FollowersCount)
                .Take(5)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.ProfilePictureUrl,
                    u.FollowersCount
                })
                .ToListAsync();

            return Ok(recommendedUsers);
        }

        // GET: api/posts/feed
        [HttpGet("feed")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult<IEnumerable<Post>>> GetFeed()
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var followingIds = await _context.Follows
                .Where(f => f.FollowerId == currentUserId)
                .Select(f => f.FollowingId)
                .ToListAsync();

            var feedPosts = await _context.Posts
                .Where(p => followingIds.Contains(p.UserId))
                .Include(p => p.User)
                .Include(p => p.Comments)
                .OrderByDescending(p => p.CreatedAt)
                .Take(20)
                .ToListAsync();

            return Ok(feedPosts);
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
                    .ThenInclude(c => c.User)
                .Include(p => p.Upvotes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
                return NotFound(new { message = "Post not found" });

            return Ok(post);
        }

        // GET: api/posts/{id}/upvote-status
        [HttpGet("{id}/upvote-status")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> GetUpvoteStatus(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var isUpvoted = await _context.Upvotes
                .AnyAsync(u => u.PostId == id && u.UserId == userId);

            return Ok(new { isUpvoted });
        }

        // POST: api/posts/{id}/upvote
        [HttpPost("{id}/upvote")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpvotePost(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var existingUpvote = await _context.Upvotes
                .FirstOrDefaultAsync(u => u.PostId == id && u.UserId == userId);

            if (existingUpvote != null)
                return BadRequest("Already upvoted");

            var upvote = new Upvote
            {
                PostId = id,
                UserId = userId,
                VotedAt = DateTime.UtcNow
            };

            _context.Upvotes.Add(upvote);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/posts/{id}/upvote
        [HttpDelete("{id}/upvote")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> RemoveUpvote(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var upvote = await _context.Upvotes
                .FirstOrDefaultAsync(u => u.PostId == id && u.UserId == userId);

            if (upvote == null)
                return BadRequest("Not upvoted");

            _context.Upvotes.Remove(upvote);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // GET: api/posts/{id}/comments
        [HttpGet("{id}/comments")]
        public async Task<IActionResult> GetComments(int id)
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == id)
                .Include(c => c.User)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return Ok(comments);
        }

        // POST: api/posts/{id}/comments
        [HttpPost("{id}/comments")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> AddComment(int id, [FromBody] CommentRequest request)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            
            var comment = new Comment
            {
                PostId = id,
                UserId = userId,
                Text = request.Text,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok();
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

        // GET: api/posts/theme/{mode}
        [HttpGet("theme/{mode}")]
        public IActionResult GetTheme(string mode)
        {
            var theme = mode.ToLower() == "dark" 
                ? new { 
                    background = "#000000", 
                    text = "#ffffff", 
                    primary = "#1a1a1a", 
                    secondary = "#333333",
                    accent = "#007bff",
                    border = "#444444"
                }
                : new { 
                    background = "#ffffff", 
                    text = "#000000", 
                    primary = "#f8f9fa", 
                    secondary = "#e9ecef",
                    accent = "#007bff",
                    border = "#dee2e6"
                };
            
            return Ok(theme);
        }

        // GET: api/posts/themes
        [HttpGet("themes")]
        public IActionResult GetAllThemes()
        {
            return Ok(new {
                dark = new { 
                    background = "#000000", 
                    text = "#ffffff", 
                    primary = "#1a1a1a", 
                    secondary = "#333333",
                    accent = "#007bff",
                    border = "#444444"
                },
                light = new { 
                    background = "#ffffff", 
                    text = "#000000", 
                    primary = "#f8f9fa", 
                    secondary = "#e9ecef",
                    accent = "#007bff",
                    border = "#dee2e6"
                }
            });
        }
    }

    public class CommentRequest
    {
        public string Text { get; set; } = string.Empty;
    }
}
