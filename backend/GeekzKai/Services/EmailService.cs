using System.Net.Mail;
using System.Net;

namespace GeekzKai.Services
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
            var verificationUrl = $"https://geekzkai-1.onrender.com/verify-email?token={verificationToken}";
            
            var htmlContent = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset=""utf-8"">
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                <title>Verify Your Email</title>
            </head>
            <body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"">
                <div style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;"">
                    <h1 style=""color: white; margin: 0; font-size: 28px;"">👑 GeekzKai</h1>
                    <p style=""color: white; margin: 10px 0 0 0; opacity: 0.9;"">
                        Your ultimate anime community
                    </p>
                </div>
                
                <div style=""background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"">
                    <h2 style=""color: #333; margin-bottom: 20px;"">
                        Welcome to GeekzKai! 🎉
                    </h2>
                    
                    <p style=""margin-bottom: 25px; font-size: 16px;"">
                        Thanks for joining our anime community! To get started, please verify your email address by clicking the button below:
                    </p>
                    
                    <div style=""text-align: center; margin: 30px 0;"">
                        <a href=""{verificationUrl}"" style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;"">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <p style=""color: #666; font-size: 14px; margin-top: 30px;"">
                        If the button doesn't work, copy and paste this link into your browser:
                        <br>
                        <a href=""{verificationUrl}"" style=""color: #667eea; word-break: break-all;"">{verificationUrl}</a>
                    </p>
                    
                    <hr style=""border: none; border-top: 1px solid #eee; margin: 30px 0;"">
                    
                    <p style=""color: #999; font-size: 12px; text-align: center;"">
                        This email was sent to {email}. If you didn't create an account, you can safely ignore this email.
                    </p>
                </div>
            </body>
            </html>";

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(
                    _configuration["Email:Username"], 
                    _configuration["Email:Password"]
                ),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["Email:Username"], "GeekzKai"),
                Subject = "Verify your GeekzKai account",
                Body = htmlContent,
                IsBodyHtml = true,
            };
            
            mailMessage.To.Add(email);
            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}