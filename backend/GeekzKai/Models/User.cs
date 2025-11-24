using System;
using System.Collections.Generic;

namespace geekzKai.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Boolean IsActive { get; set; } = true;
        public Boolean IsYoutuber { get; set; } = false;
        public Boolean IsAdmin { get; set; } = false;
        public string? YouTubeChannelLink { get; set; }

        public string? Bio { get; set; }                  // short about text
        public string? ProfilePictureUrl { get; set; }    // for avatar image
        public int FollowersCount { get; set; } = 0;      // follower metrics
        public int FollowingCount { get; set; } = 0;
        // Navigation properties
        public List<Post> Posts { get; set; } = new();
        public List<Comment> Comments { get; set; } = new();
    }
}
