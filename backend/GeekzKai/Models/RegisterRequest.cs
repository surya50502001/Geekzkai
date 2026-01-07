using System.ComponentModel.DataAnnotations;

namespace geekzKai.Models
{
    public class RegisterRequest
    {
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
        public bool IsYoutuber { get; set; } = false;
        public string? YouTubeChannelLink { get; set; }
    }
}
