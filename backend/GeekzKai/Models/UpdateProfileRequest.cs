namespace GeekzKai.Models
{
    public class UpdateProfileRequest
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public bool IsYoutuber { get; set; }
        public string? YouTubeChannelLink { get; set; }
    }
}