using System;

namespace GeekzKai.Models
{
    public class Upvote
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }
        public DateTime VotedAt { get; set; }

        public  User? User { get; set; }
        public  Post? Post { get; set; }

        public Upvote()
        {
            VotedAt = DateTime.UtcNow;
        }
    }
}