using System.ComponentModel.DataAnnotations;

namespace geekzKai.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }
        
        public int SenderId { get; set; }
        public User? Sender { get; set; }

        public int ReceiverId { get; set; }
        public User? Receiver { get; set; }
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}