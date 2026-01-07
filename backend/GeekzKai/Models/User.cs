using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GeekzKai.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Password { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(200)]
        public string? Bio { get; set; }

        public int FollowersCount { get; set; } = 0;
        public int FollowingCount { get; set; } = 0;

        public bool IsActive { get; set; } = true;
        public bool IsAdmin { get; set; } = false;
        public bool IsYoutuber { get; set; } = false;

        public string? ProfilePictureUrl { get; set; }
        public string? YouTubeChannelLink { get; set; } // Corrected typo: Channellink -> ChannelLink

        [Required]
        public string AuthProvider { get; set; } = "local";

        public bool EmailVerified { get; set; } = false;
        public string? EmailVerificationToken { get; set; }

        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public List<Post> Posts { get; set; } = new();
        public List<Comment> Comments { get; set; } = new();
        public List<Upvote> Upvotes { get; set; } = new();
    }
}
