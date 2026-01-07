using Microsoft.EntityFrameworkCore;
using GeekzKai.Models;

namespace GeekzKai.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Upvote> Upvotes { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomParticipant> RoomParticipants { get; set; }
        public DbSet<RoomMessage> RoomMessages { get; set; }
        public DbSet<LiveStream> LiveStreams { get; set; }
        public DbSet<LiveViewer> LiveViewers { get; set; }
        public DbSet<LiveMessage> LiveMessages { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --------------------------
            // POST TABLE MAPPING
            // --------------------------
            modelBuilder.Entity<Post>(entity =>
            {
                entity.Property(p => p.Id).HasColumnName("Post_Id");
                entity.Property(p => p.Question).HasColumnName("Post_Question");
                entity.Property(p => p.Description).HasColumnName("Post_Description");
                entity.Property(p => p.CreatedAt).HasColumnName("Post_CreatedAt");
                entity.Property(p => p.UserId).HasColumnName("Post_UserId");
            });

            // --------------------------
            // USER TABLE MAPPING (UPDATED)
            // --------------------------
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.Id).HasColumnName("User_Id");
                entity.Property(u => u.Username).HasColumnName("Username");
                entity.Property(u => u.Email).HasColumnName("User_Email");
                entity.Property(u => u.Password).HasColumnName("User_Password");
                entity.Property(u => u.CreatedAt).HasColumnName("User_CreatedAt");
                entity.Property(u => u.Bio).HasColumnName("User_Bio");
                entity.Property(u => u.FollowersCount).HasColumnName("FollowersCount");
                entity.Property(u => u.FollowingCount).HasColumnName("FollowingCount");
                entity.Property(u => u.IsActive).HasColumnName("IsActive");
                entity.Property(u => u.IsAdmin).HasColumnName("IsAdmin");
                entity.Property(u => u.IsYoutuber).HasColumnName("IsYoutuber");
                entity.Property(u => u.ProfilePictureUrl).HasColumnName("ProfilePictureUrl");
                entity.Property(u => u.YouTubeChannelLink).HasColumnName("YouTubeChannellink");
                entity.Property(u => u.AuthProvider).HasColumnName("AuthProvider");
                entity.Property(u => u.LastLoginAt).HasColumnName("LastLoginAt");
            });

            // --------------------------
            // COMMENT TABLE MAPPING
            // --------------------------
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.Property(c => c.Id).HasColumnName("Comment_Id");
                entity.Property(c => c.Text).HasColumnName("Comment_Text");
                entity.Property(c => c.CreatedAt).HasColumnName("Comment_CreatedAt");
                entity.Property(c => c.PostId).HasColumnName("Comment_PostId");
                entity.Property(c => c.UserId).HasColumnName("Comment_UserId");
            });

            // --------------------------
            // UPVOTE TABLE MAPPING
            // --------------------------
            modelBuilder.Entity<Upvote>(entity =>
            {
                entity.Property(u => u.Id).HasColumnName("Upvote_Id");
                entity.Property(u => u.UserId).HasColumnName("Upvote_UserId");
                entity.Property(u => u.PostId).HasColumnName("Upvote_PostId");
            });

            // --------------------------
            // RELATIONSHIPS
            // --------------------------

            // POST — USER
            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // COMMENT — USER
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // COMMENT — POST
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // UPVOTE UNIQUE
            modelBuilder.Entity<Upvote>()
                .HasIndex(u => new { u.UserId, u.PostId })
                .IsUnique();

            // UPVOTE — USER
            modelBuilder.Entity<Upvote>()
                .HasOne(u => u.User)
                .WithMany(u => u.Upvotes)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // UPVOTE — POST
            modelBuilder.Entity<Upvote>()
                .HasOne(u => u.Post)
                .WithMany(p => p.Upvotes)
                .HasForeignKey(u => u.PostId)
                .HasPrincipalKey(p => p.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // FOLLOW RELATIONSHIPS
            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Follower)
                .WithMany()
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Follow>()
                .HasOne(f => f.Following)
                .WithMany()
                .HasForeignKey(f => f.FollowingId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Follow>()
                .HasIndex(f => new { f.FollowerId, f.FollowingId })
                .IsUnique();

            // MESSAGE RELATIONSHIPS
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany()
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            // ROOM RELATIONSHIPS
            modelBuilder.Entity<Room>()
                .HasOne(r => r.Creator)
                .WithMany()
                .HasForeignKey(r => r.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoomParticipant>()
                .HasOne(rp => rp.Room)
                .WithMany(r => r.Participants)
                .HasForeignKey(rp => rp.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoomParticipant>()
                .HasOne(rp => rp.User)
                .WithMany()
                .HasForeignKey(rp => rp.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoomMessage>()
                .HasOne(rm => rm.Room)
                .WithMany(r => r.Messages)
                .HasForeignKey(rm => rm.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoomMessage>()
                .HasOne(rm => rm.User)
                .WithMany()
                .HasForeignKey(rm => rm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // LIVE STREAM RELATIONSHIPS
            modelBuilder.Entity<LiveStream>()
                .HasOne(ls => ls.Streamer)
                .WithMany()
                .HasForeignKey(ls => ls.StreamerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LiveViewer>()
                .HasOne(lv => lv.LiveStream)
                .WithMany(ls => ls.Viewers)
                .HasForeignKey(lv => lv.LiveStreamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LiveViewer>()
                .HasOne(lv => lv.User)
                .WithMany()
                .HasForeignKey(lv => lv.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LiveMessage>()
                .HasOne(lm => lm.LiveStream)
                .WithMany(ls => ls.Messages)
                .HasForeignKey(lm => lm.LiveStreamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LiveMessage>()
                .HasOne(lm => lm.User)
                .WithMany()
                .HasForeignKey(lm => lm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // NOTIFICATION TABLE MAPPING
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(n => n.IsRead)
                    .HasConversion<int>();
            });

            // NOTIFICATION RELATIONSHIPS
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.FromUser)
                .WithMany()
                .HasForeignKey(n => n.FromUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
