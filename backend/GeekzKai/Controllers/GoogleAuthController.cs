using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GeekzKai.Data;
using GeekzKai.Models;

namespace GeekzKai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoogleAuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public GoogleAuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("test-config")]
        public IActionResult TestConfig()
        {
            var clientId = _configuration["Google:ClientId"] ?? Environment.GetEnvironmentVariable("Google__ClientId");
            var hasClientSecret = !string.IsNullOrEmpty(_configuration["Google:ClientSecret"] ?? Environment.GetEnvironmentVariable("Google__ClientSecret"));
            
            return Ok(new {
                ClientIdConfigured = !string.IsNullOrEmpty(clientId),
                ClientSecretConfigured = hasClientSecret,
                ClientIdPreview = clientId?.Substring(0, Math.Min(20, clientId.Length)) + "..."
            });
        }

        [HttpGet("signin")]
        public IActionResult SignIn()
        {
            var clientId = _configuration["Google:ClientId"] ?? Environment.GetEnvironmentVariable("Google__ClientId");
            var baseUrl = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development" 
                ? "http://localhost:5131" 
                : "https://geekzkai.onrender.com";
            var redirectUri = $"{baseUrl}/api/googleauth/callback";
            var scope = "openid email profile";
            var state = Guid.NewGuid().ToString();
            
            var googleAuthUrl = $"https://accounts.google.com/o/oauth2/v2/auth?" +
                $"client_id={clientId}&" +
                $"redirect_uri={Uri.EscapeDataString(redirectUri)}&" +
                $"scope={Uri.EscapeDataString(scope)}&" +
                $"response_type=code&" +
                $"state={state}&" +
                $"prompt=select_account";
            
            return Redirect(googleAuthUrl);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback(string code, string state)
        {
            var frontendUrl = _configuration["Frontend:BaseUrl"] ?? Environment.GetEnvironmentVariable("FRONTEND_BASE_URL") ?? "https://geekzkai-1.onrender.com";
            
            try
            {
                Console.WriteLine("Google OAuth callback started");
                
                if (string.IsNullOrEmpty(code))
                {
                    return Redirect($"{frontendUrl}/auth/error?message={Uri.EscapeDataString("No authorization code received")}");
                }

                // Exchange code for access token
                var tokenResponse = await ExchangeCodeForToken(code);
                if (tokenResponse == null)
                {
                    return Redirect($"{frontendUrl}/auth/error?message={Uri.EscapeDataString("Failed to get access token")}");
                }

                // Get user info from Google
                var userInfo = await GetGoogleUserInfo(tokenResponse.AccessToken);
                if (userInfo == null)
                {
                    return Redirect($"{frontendUrl}/auth/error?message={Uri.EscapeDataString("Failed to get user info")}");
                }

                Console.WriteLine($"Email: {userInfo.Email}, Name: {userInfo.Name}");

                // Find or create user
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userInfo.Email);
                bool isNewUser = false;
                
                if (user == null)
                {
                    Console.WriteLine("Creating new user");
                    user = new User
                    {
                        Email = userInfo.Email,
                        Username = userInfo.Name ?? userInfo.Email.Split('@')[0],
                        AuthProvider = "google",
                        ProfilePictureUrl = userInfo.Picture,
                        Password = null,
                        EmailVerified = true
                    };
                    
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"New user created with ID: {user.Id}");
                    isNewUser = true;
                }
                else
                {
                    Console.WriteLine($"Existing user found with ID: {user.Id}");
                    user.EmailVerified = true;
                    await _context.SaveChangesAsync();
                }

                var token = GenerateJwtToken(user);
                var redirectUrl = isNewUser ? $"{frontendUrl}/#token={token}&tour=true" : $"{frontendUrl}/#token={token}";
                return Redirect(redirectUrl);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Google OAuth callback error: {ex.Message}");
                return Redirect($"{frontendUrl}/auth/error?message={Uri.EscapeDataString(ex.Message)}");
            }
        }

        private async Task<TokenResponse?> ExchangeCodeForToken(string code)
        {
            var clientId = _configuration["Google:ClientId"] ?? Environment.GetEnvironmentVariable("Google__ClientId");
            var clientSecret = _configuration["Google:ClientSecret"] ?? Environment.GetEnvironmentVariable("Google__ClientSecret");
            var baseUrl = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development" 
                ? "http://localhost:5131" 
                : "https://geekzkai.onrender.com";
            var redirectUri = $"{baseUrl}/api/googleauth/callback";

            var tokenRequest = new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["code"] = code,
                ["grant_type"] = "authorization_code",
                ["redirect_uri"] = redirectUri
            };

            using var httpClient = new HttpClient();
            var response = await httpClient.PostAsync("https://oauth2.googleapis.com/token", 
                new FormUrlEncodedContent(tokenRequest));

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return System.Text.Json.JsonSerializer.Deserialize<TokenResponse>(json);
            }

            return null;
        }

        private async Task<GoogleUserInfo> GetGoogleUserInfo(string accessToken)
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            
            var response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
            
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return System.Text.Json.JsonSerializer.Deserialize<GoogleUserInfo>(json);
            }

            return null;
        }

        public class TokenResponse
        {
            public string? access_token { get; set; }
            public string? AccessToken => access_token;
        }

        public class GoogleUserInfo
        {
            public string? email { get; set; }
            public string? name { get; set; }
            public string? picture { get; set; }
            public string? Email => email;
            public string? Name => name;
            public string? Picture => picture;
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("id", user.Id.ToString()),
                new Claim("email", user.Email),
                new Claim("username", user.Username)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}.WriteToken(token);
        }
    }
}.WriteToken(token);
        }
    }
}