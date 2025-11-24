using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GeekzKai.Migrations
{
    /// <inheritdoc />
    public partial class today : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    User_Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    User_Email = table.Column<string>(type: "text", nullable: false),
                    User_Password = table.Column<string>(type: "text", nullable: false),
                    User_CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsYoutuber = table.Column<bool>(type: "boolean", nullable: false),
                    IsAdmin = table.Column<bool>(type: "boolean", nullable: false),
                    YouTubeChannelLink = table.Column<string>(type: "text", nullable: true),
                    Bio = table.Column<string>(type: "text", nullable: true),
                    ProfilePictureUrl = table.Column<string>(type: "text", nullable: true),
                    FollowersCount = table.Column<int>(type: "integer", nullable: false),
                    FollowingCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.User_Id);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Post_Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Post_Question = table.Column<string>(type: "text", nullable: false),
                    Post_Description = table.Column<string>(type: "text", nullable: true),
                    Post_Upvotes = table.Column<int>(type: "integer", nullable: false),
                    Post_CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Post_UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Post_Id);
                    table.ForeignKey(
                        name: "FK_Posts_Users_Post_UserId",
                        column: x => x.Post_UserId,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Comment_Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Comment_Text = table.Column<string>(type: "text", nullable: false),
                    Comment_CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Comment_PostId = table.Column<int>(type: "integer", nullable: false),
                    Comment_UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Comment_Id);
                    table.ForeignKey(
                        name: "FK_Comments_Posts_Comment_PostId",
                        column: x => x.Comment_PostId,
                        principalTable: "Posts",
                        principalColumn: "Post_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Users_Comment_UserId",
                        column: x => x.Comment_UserId,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Upvotes",
                columns: table => new
                {
                    Upvote_Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Upvote_UserId = table.Column<int>(type: "integer", nullable: false),
                    Upvote_PostId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Upvotes", x => x.Upvote_Id);
                    table.ForeignKey(
                        name: "FK_Upvotes_Posts_Upvote_PostId",
                        column: x => x.Upvote_PostId,
                        principalTable: "Posts",
                        principalColumn: "Post_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Upvotes_Users_Upvote_UserId",
                        column: x => x.Upvote_UserId,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_Comment_PostId",
                table: "Comments",
                column: "Comment_PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_Comment_UserId",
                table: "Comments",
                column: "Comment_UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_Post_UserId",
                table: "Posts",
                column: "Post_UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_Upvote_PostId",
                table: "Upvotes",
                column: "Upvote_PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_Upvote_UserId_Upvote_PostId",
                table: "Upvotes",
                columns: new[] { "Upvote_UserId", "Upvote_PostId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Upvotes");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
