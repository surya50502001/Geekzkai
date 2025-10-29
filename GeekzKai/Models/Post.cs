using System;

namespace geekzKai.Models
{
    public class Post
    {
        public int Id { get; set; }
        public required string Question { get; set; }
        public string? Description { get; set; }
        public int Upvotes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}