using System;
using System.Collections.Generic;

namespace geekzKai.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        //Relationships can be added here in the future

        public List<Post> Posts { get; set; }
        public List<Comments> Comments { get; set; }

    }
}