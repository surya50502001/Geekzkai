using System.ComponentModel.DataAnnotations;

namespace geekzKai.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public int MaxParticipants { get; set; } = 50;
        public int CurrentParticipants { get; set; } = 0;

        // Foreign Key
        public int CreatorId { get; set; }
        public User? Creator { get; set; }

        // Navigation properties
        public List<RoomParticipant> Participants { get; set; } = new();
        public List<RoomMessage> Messages { get; set; } = new();
    }

    public class RoomParticipant
    {
        [Key]
        public int Id { get; set; }
        public int RoomId { get; set; }
        public Room? Room { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }

    public class RoomMessage
    {
        [Key]
        public int Id { get; set; }
        public int RoomId { get; set; }
        public Room? Room { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}