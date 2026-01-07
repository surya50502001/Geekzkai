using GeekzKai.Data;
using GeekzKai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace GeekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UpvoteController : ControllerBase
    {
        private readonly AppDbContext _context; 

        public UpvoteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleUpvote([FromBody] Upvote upvote)
        {
            // find the post
            var post = await _context.Posts.Include(p => p.Upvotes).Include(p => p.User).FirstOrDefaultAsync(p => p.Id == upvote.PostId);

            if (post == null)
                return NotFound(new { message = "Post not found" });

            // check if already upvoted
            var existingUpvote = await _context.Upvotes
                .FirstOrDefaultAsync(u => u.PostId == upvote.PostId && u.UserId == upvote.UserId);

            // if exists, remove upvote
            if (existingUpvote != null)
            {
                _context.Upvotes.Remove(existingUpvote);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Upvote removed." });
            }

            // if not, add new upvote
            _context.Upvotes.Add(upvote);

            // Create notification for post owner (don't notify yourself)
            if (post.UserId != upvote.UserId)
            {
                var upvoter = await _context.Users.FindAsync(upvote.UserId);
                if (upvoter != null)
                {
                    var notification = new Notification
                    {
                        UserId = post.UserId,
                        FromUserId = upvote.UserId,
                        Type = "upvote",
                        Message = $"{upvoter.Username} upvoted your post"
                    };
                    _context.Notifications.Add(notification);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Upvoted successfully!" });
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetUpvoteCount(int postId)
        {
            var post = await _context.Posts.Include(p => p.Upvotes).FirstOrDefaultAsync(p => p.Id == postId);
            if (post == null)
                return NotFound(new { message = "Post not found" });

            return Ok(new { postId = postId, upvotes = post.Upvotes.Count });
        }
    }
}