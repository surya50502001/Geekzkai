using System;
using System.Collections.Generic;

namespace geekzKai.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Question { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Upvotes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public int UserId { get; set; }
        public User? User { get; set; }

        // Navigation property
        public List<Comment> Comments { get; set; } = new();
    }
}
