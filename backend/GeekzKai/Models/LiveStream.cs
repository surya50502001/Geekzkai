using System.ComponentModel.DataAnnotations;

namespace geekzKai.Models
{
    public class LiveStream
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndedAt { get; set; }
        public bool IsLive { get; set; } = true;
        public int ViewerCount { get; set; } = 0;
        public string? StreamKey { get; set; }

        // Foreign Key
        public int StreamerId { get; set; }
        public User? Streamer { get; set; }

        // Navigation properties
        public List<LiveViewer> Viewers { get; set; } = new();
        public List<LiveMessage> Messages { get; set; } = new();
    }

    public class LiveViewer
    {
        [Key]
        public int Id { get; set; }
        public int LiveStreamId { get; set; }
        public LiveStream? LiveStream { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }

    public class LiveMessage
    {
        [Key]
        public int Id { get; set; }
        public int LiveStreamId { get; set; }
        public LiveStream? LiveStream { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}