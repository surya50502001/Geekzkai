using System;

namespace geekzKai.Models
{
    public class Upvote
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }

        public required User User { get; set; }
        public required Post Post { get; set; }
    }
}