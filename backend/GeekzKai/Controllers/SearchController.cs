using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GeekzKai.Data;
using GeekzKai.Models;

namespace GeekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SearchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Search(string query, string type = "all", int limit = 10)
        {
            if (string.IsNullOrEmpty(query))
                return Ok(new { users = new List<object>(), posts = new List<object>(), rooms = new List<object>() });

            var results = new
            {
                users = type == "all" || type == "users" ? await SearchUsers(query, limit) : new List<object>(),
                posts = type == "all" || type == "posts" ? await SearchPosts(query, limit) : new List<object>(),
                rooms = type == "all" || type == "rooms" ? await SearchRooms(query, limit) : new List<object>()
            };

            return Ok(results);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(string query, int limit = 10)
        {
            var users = await SearchUsers(query, limit);
            return Ok(users);
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetPosts(string query, int limit = 10)
        {
            var posts = await SearchPosts(query, limit);
            return Ok(posts);
        }

        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms(string query, int limit = 10)
        {
            var rooms = await SearchRooms(query, limit);
            return Ok(rooms);
        }

        private async Task<List<object>> SearchUsers(string query, int limit)
        {
            return await _context.Users
                .Where(u => u.Username.ToLower().Contains(query.ToLower()) && u.IsActive)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.ProfilePictureUrl,
                    u.Bio,
                    u.IsYoutuber,
                    u.IsAdmin,
                    u.FollowersCount,
                    u.FollowingCount
                })
                .Take(limit)
                .ToListAsync<object>();
        }

        private async Task<List<object>> SearchPosts(string query, int limit)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Where(p => p.Question.ToLower().Contains(query.ToLower()) || 
                           (p.Description != null && p.Description.ToLower().Contains(query.ToLower())))
                .Select(p => new
                {
                    p.Id,
                    p.Question,
                    p.Description,
                    p.CreatedAt,
                    User = new
                    {
                        p.User!.Id,
                        p.User.Username,
                        p.User.ProfilePictureUrl
                    },
                    CommentCount = p.Comments.Count,
                    UpvoteCount = p.Upvotes.Count
                })
                .OrderByDescending(p => p.CreatedAt)
                .Take(limit)
                .ToListAsync<object>();
        }

        private async Task<List<object>> SearchRooms(string query, int limit)
        {
            return await _context.Rooms
                .Include(r => r.Creator)
                .Where(r => r.IsActive && 
                           (r.Title.ToLower().Contains(query.ToLower()) || 
                            (r.Description != null && r.Description.ToLower().Contains(query.ToLower()))))
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.CreatedAt,
                    r.CurrentParticipants,
                    r.MaxParticipants,
                    Creator = new
                    {
                        r.Creator!.Id,
                        r.Creator.Username,
                        r.Creator.ProfilePictureUrl
                    }
                })
                .OrderByDescending(r => r.CurrentParticipants)
                .Take(limit)
                .ToListAsync<object>();
        }

        [HttpGet("trending")]
        public async Task<IActionResult> GetTrending()
        {
            var trendingPosts = await _context.Posts
                .Include(p => p.User)
                .Where(p => p.CreatedAt >= DateTime.UtcNow.AddDays(-7))
                .OrderByDescending(p => p.Upvotes.Count)
                .ThenByDescending(p => p.Comments.Count)
                .Take(10)
                .Select(p => new
                {
                    p.Id,
                    p.Question,
                    p.Description,
                    p.CreatedAt,
                    User = new
                    {
                        p.User!.Id,
                        p.User.Username,
                        p.User.ProfilePictureUrl
                    },
                    CommentCount = p.Comments.Count,
                    UpvoteCount = p.Upvotes.Count
                })
                .ToListAsync();

            var activeRooms = await _context.Rooms
                .Include(r => r.Creator)
                .Where(r => r.IsActive)
                .OrderByDescending(r => r.CurrentParticipants)
                .Take(5)
                .Select(r => new
                {
                    r.Id,
                    r.Title,
                    r.Description,
                    r.CurrentParticipants,
                    r.MaxParticipants,
                    Creator = new
                    {
                        r.Creator!.Id,
                        r.Creator.Username,
                        r.Creator.ProfilePictureUrl
                    }
                })
                .ToListAsync();

            var liveStreams = await _context.LiveStreams
                .Include(l => l.Streamer)
                .Where(l => l.IsLive)
                .OrderByDescending(l => l.ViewerCount)
                .Take(5)
                .Select(l => new
                {
                    l.Id,
                    l.Title,
                    l.Description,
                    l.ViewerCount,
                    Streamer = new
                    {
                        l.Streamer!.Id,
                        l.Streamer.Username,
                        l.Streamer.ProfilePictureUrl
                    }
                })
                .ToListAsync();

            return Ok(new
            {
                trendingPosts,
                activeRooms,
                liveStreams
            });
        }
    }
}