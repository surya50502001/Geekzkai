using Microsoft.EntityFrameworkCore;
using geekzKai.Models;
using System.Security.Cryptography.X509Certificates;


namespace geekzKai.Data
{
    public class AppdbContext : DbContext
    {
        public AppdbContext(DbContextOptions<AppdbContext> options) : base(options)
        {
            
        }
        public DbSet<Post> Posts { get; set; }
    }
}