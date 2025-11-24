using Microsoft.EntityFrameworkCore;
using geekzKai.Models;
using System.Security.Cryptography.X509Certificates;


namespace geekzKai.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Upvote> Upvotes { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Post>(entity =>
            {
                entity.Property(p => p.Id).HasColumnName("Post_Id");
                entity.Property(p => p.Question).HasColumnName("Post_Question");
                entity.Property(p => p.Description).HasColumnName("Post_Description");
                entity.Property(p => p.Upvotes).HasColumnName("Post_Upvotes");
                entity.Property(p => p.CreatedAt).HasColumnName("Post_CreatedAt");
                entity.Property(p => p.UserId).HasColumnName("Post_UserId");
            });



            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(p => p.Id).HasColumnName("User_Id");
                entity.Property(p => p.Email).HasColumnName("User_Email");
                entity.Property(p => p.PasswordHash).HasColumnName("User_Password");
                entity.Property(p => p.CreatedAt).HasColumnName("User_CreatedAt");

            });

            modelBuilder.Entity<Upvote>(entity =>
            {
                entity.Property(p => p.Id).HasColumnName("Upvote_Id");
                entity.Property(p => p.UserId).HasColumnName("Upvote_UserId");
                entity.Property(p => p.PostId).HasColumnName("Upvote_PostId");

            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.Property(p => p.Id).HasColumnName("Comment_Id");
                entity.Property(p => p.Text).HasColumnName("Comment_Text");
                entity.Property(p => p.CreatedAt).HasColumnName("Comment_CreatedAt");
                entity.Property(p => p.PostId).HasColumnName("Comment_PostId");
                entity.Property(p => p.UserId).HasColumnName("Comment_UserId");

            });


            //relation ships
            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
                   .HasOne(c => c.User)
                   .WithMany(u => u.Comments)
                   .HasForeignKey(c => c.UserId)
                   .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Comment>()
                    .HasOne(c => c.Post)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(c => c.PostId)
                    .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Upvote>()
                    .HasIndex(u => new { u.UserId, u.PostId })
                    .IsUnique(); // prevent multiple upvotes from same user on same post

            modelBuilder.Entity<Upvote>()
                    .HasOne(u => u.User)
                    .WithMany()
                    .HasForeignKey(u => u.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Upvote>()
                    .HasOne(u => u.Post)
                    .WithMany()
                    .HasForeignKey(u => u.PostId)
                    .OnDelete(DeleteBehavior.Cascade);

        }
    }
}