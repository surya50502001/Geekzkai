namespace geekzKai.Models
{
    public class CreateRoomRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int MaxParticipants { get; set; } = 50;
    }

    public class CreateLiveStreamRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class SendMessageRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    public class CreateNotificationRequest
    {
        public int ToUserId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class RoomResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public UserResponse Creator { get; set; } = new();
        public bool IsJoined { get; set; }
    }

    public class LiveStreamResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public bool IsLive { get; set; }
        public int ViewerCount { get; set; }
        public UserResponse Streamer { get; set; } = new();
        public bool IsWatching { get; set; }
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public bool IsYoutuber { get; set; }
        public bool IsAdmin { get; set; }
    }

    public class MessageResponse
    {
        public int Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public UserResponse User { get; set; } = new();
    }

    public class NotificationResponse
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserResponse FromUser { get; set; } = new();
    }
}