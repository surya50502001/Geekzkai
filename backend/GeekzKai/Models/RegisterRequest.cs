namespace geekzKai.Models
{
    public class RegisterRequest
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public bool IsYoutuber { get; set; } = false;
        public string? YouTubeChannelLink { get; set; }
    }
}
