using System.ComponentModel.DataAnnotations;

namespace geekzKai.Models
{
    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public bool IsYoutuber { get; set; } = false;
        public string? YouTubeChannelLink { get; set; }
    }
}
