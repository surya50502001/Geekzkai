using System.ComponentModel.DataAnnotations;

namespace GeekzKai.Models
{
    public class Notification
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; } // Who receives the notification
        
        [Required]
        public int FromUserId { get; set; } // Who triggered the notification
        
        [Required]
        public string Type { get; set; } = string.Empty; // "follow_request", "follow_accepted"
        
        [Required]
        public string Message { get; set; } = string.Empty;
        
        public bool IsRead { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User User { get; set; } = null!;
        public User FromUser { get; set; } = null!;
    }
}