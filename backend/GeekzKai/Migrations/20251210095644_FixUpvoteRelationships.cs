using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeekzKai.Migrations
{
    /// <inheritdoc />
    public partial class FixUpvoteRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Posts_Upvote_PostId",
                table: "Upvotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Users_UserId1",
                table: "Upvotes");

            migrationBuilder.DropIndex(
                name: "IX_Upvotes_Upvote_PostId",
                table: "Upvotes");

            migrationBuilder.DropIndex(
                name: "IX_Upvotes_UserId1",
                table: "Upvotes");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Upvotes");

            migrationBuilder.AddColumn<int>(
                name: "Upvote_PostId1",
                table: "Upvotes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Upvote_UserId1",
                table: "Upvotes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_Upvote_PostId1",
                table: "Upvotes",
                column: "Upvote_PostId1");

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_Upvote_UserId1",
                table: "Upvotes",
                column: "Upvote_UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Posts_Upvote_PostId1",
                table: "Upvotes",
                column: "Upvote_PostId1",
                principalTable: "Posts",
                principalColumn: "Post_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Users_Upvote_UserId1",
                table: "Upvotes",
                column: "Upvote_UserId1",
                principalTable: "Users",
                principalColumn: "User_Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Posts_Upvote_PostId1",
                table: "Upvotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Users_Upvote_UserId1",
                table: "Upvotes");

            migrationBuilder.DropIndex(
                name: "IX_Upvotes_Upvote_PostId1",
                table: "Upvotes");

            migrationBuilder.DropIndex(
                name: "IX_Upvotes_Upvote_UserId1",
                table: "Upvotes");

            migrationBuilder.DropColumn(
                name: "Upvote_PostId1",
                table: "Upvotes");

            migrationBuilder.DropColumn(
                name: "Upvote_UserId1",
                table: "Upvotes");

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "Upvotes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_Upvote_PostId",
                table: "Upvotes",
                column: "Upvote_PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_UserId1",
                table: "Upvotes",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Posts_Upvote_PostId",
                table: "Upvotes",
                column: "Upvote_PostId",
                principalTable: "Posts",
                principalColumn: "Post_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Users_UserId1",
                table: "Upvotes",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "User_Id");
        }
    }
}
