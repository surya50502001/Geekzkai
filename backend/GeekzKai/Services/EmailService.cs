using System.Net.Mail;
using System.Net;

namespace geekzKai.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendVerificationEmail(string email, string verificationToken)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(
                    _configuration["Email:Username"], 
                    _configuration["Email:Password"]
                ),
                EnableSsl = true,
            };

            var verificationUrl = $"https://geekzkai-1.onrender.com/verify-email?token={verificationToken}";
            
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["Email:Username"]),
                Subject = "Verify your GeekzKai account",
                Body = $"Click here to verify your email: {verificationUrl}",
                IsBodyHtml = false,
            };
            
            mailMessage.To.Add(email);
            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}