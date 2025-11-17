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
    [Route("api/[controller]")]
    public class UpvoteController : ControllerBase
    {
        private readonly AppdbContext _context; // ✅ fixed typo: readnly → readonly

        public UpvoteController(AppdbContext context)
        {
            _context = context;
        }

        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleUpvote([FromBody] Upvote upvote)
        {
            // find the post
            var post = await _context.Posts.FindAsync(upvote.PostId);

            if (post == null)
                return NotFound(new { message = "Post not found" });

            // check if already upvoted
            var existingUpvote = await _context.Upvotes
                .FirstOrDefaultAsync(u => u.PostId == upvote.PostId && u.UserId == upvote.UserId); // ✅ fixed typo: FirstOrdDefaultAsync → FirstOrDefaultAsync

            // if exists, remove upvote
            if (existingUpvote != null)
            {
                _context.Upvotes.Remove(existingUpvote);

                if (post.Upvotes > 0)
                    post.Upvotes--;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Upvote removed." });
            }

            // if not, add new upvote
            _context.Upvotes.Add(upvote);
            post.Upvotes++;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Upvoted successfully!" });
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetUpvoteCount(int postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
                return NotFound(new { message = "Post not found" });

            return Ok(new { postId = postId, upvotes = post.Upvotes });
        }
    }
}
