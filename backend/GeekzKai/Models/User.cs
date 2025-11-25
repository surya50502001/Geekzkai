using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;   // <-- REQUIRED for [Key], [Required], [MaxLength], etc.
using geekzKai.Models;                       // <-- Makes sure Post and Comment resolve

namespace geekzKai.Models
{
    public class User
    {
        [Key]
        public int User_Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string User_Email { get; set; } = string.Empty;

        public string? User_Password { get; set; }

        public DateTime User_CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(200)]
        public string? Bio { get; set; }

        public int FollowersCount { get; set; } = 0;
        public int FollowingCount { get; set; } = 0;

        public bool IsActive { get; set; } = true;
        public bool IsAdmin { get; set; } = false;
        public bool IsYoutuber { get; set; } = false;

        public string? ProfilePictureUrl { get; set; }
        public string? YouTubeChannellink { get; set; }

        [Required]
        public string AuthProvider { get; set; } = "local";

        public DateTime? LastLoginAt { get; set; }

        // Navigation
        public List<Post> Posts { get; set; } = new();
        public List<Comment> Comments { get; set; } = new();
    }
}
