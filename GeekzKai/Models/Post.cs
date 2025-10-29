using System;
using System.Collections.Generic;

namespace geekzKai.Models
{
    public class Post
    {
        public int Id { get; set; }
        public required string Question { get; set; }
        public string? Description { get; set; }
        public int Upvotes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        // Foreign Key
        public int UserId { get; set; }
        public User User { get; set; }

        //relationships

        public List<Comments> Comments  { get; set; }

    }
}