using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeekzKai.Migrations
{
    /// <inheritdoc />
    public partial class RenamedFieldUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_UserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_UserId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Posts_PostId",
                table: "Upvotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Users_UserId",
                table: "Upvotes");

            migrationBuilder.DropIndex(
                name: "IX_Upvotes_UserId",
                table: "Upvotes");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Users",
                newName: "User_Password");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "User_Email");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Users",
                newName: "User_CreatedAt");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "User_Id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Upvotes",
                newName: "Upvote_UserId");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "Upvotes",
                newName: "Upvote_PostId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Upvotes",
                newName: "Upvote_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Upvotes_PostId",
                table: "Upvotes",
                newName: "IX_Upvotes_Upvote_PostId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Posts",
                newName: "Post_UserId");

            migrationBuilder.RenameColumn(
                name: "Upvotes",
                table: "Posts",
                newName: "Post_Upvotes");

            migrationBuilder.RenameColumn(
                name: "Question",
                table: "Posts",
                newName: "Post_Question");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Posts",
                newName: "Post_Description");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Posts",
                newName: "Post_CreatedAt");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Posts",
                newName: "Post_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_UserId",
                table: "Posts",
                newName: "IX_Posts_Post_UserId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Comments",
                newName: "Comment_UserId");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Comments",
                newName: "Comment_Text");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "Comments",
                newName: "Comment_PostId");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Comments",
                newName: "Comment_CreatedAt");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Comments",
                newName: "Comment_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                newName: "IX_Comments_Comment_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_PostId",
                table: "Comments",
                newName: "IX_Comments_Comment_PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_Upvote_UserId_Upvote_PostId",
                table: "Upvotes",
                columns: new[] { "Upvote_UserId", "Upvote_PostId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Posts_Comment_PostId",
                table: "Comments",
                column: "Comment_PostId",
                principalTable: "Posts",
                principalColumn: "Post_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_Comment_UserId",
                table: "Comments",
                column: "Comment_UserId",
                principalTable: "Users",
                principalColumn: "User_Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_Post_UserId",
                table: "Posts",
                column: "Post_UserId",
                principalTable: "Users",
                principalColumn: "User_Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Posts_Upvote_PostId",
                table: "Upvotes",
                column: "Upvote_PostId",
                principalTable: "Posts",
                principalColumn: "Post_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Users_Upvote_UserId",
                table: "Upvotes",
                column: "Upvote_UserId",
                principalTable: "Users",
                principalColumn: "User_Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_Comment_PostId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_Comment_UserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_Post_UserId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Posts_Upvote_PostId",
                table: "Upvotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Users_Upvote_UserId",
                table: "Upvotes");

            migrationBuilder.DropIndex(
                name: "IX_Upvotes_Upvote_UserId_Upvote_PostId",
                table: "Upvotes");

            migrationBuilder.RenameColumn(
                name: "User_Password",
                table: "Users",
                newName: "PasswordHash");

            migrationBuilder.RenameColumn(
                name: "User_Email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "User_CreatedAt",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "User_Id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Upvote_UserId",
                table: "Upvotes",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Upvote_PostId",
                table: "Upvotes",
                newName: "PostId");

            migrationBuilder.RenameColumn(
                name: "Upvote_Id",
                table: "Upvotes",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Upvotes_Upvote_PostId",
                table: "Upvotes",
                newName: "IX_Upvotes_PostId");

            migrationBuilder.RenameColumn(
                name: "Post_UserId",
                table: "Posts",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Post_Upvotes",
                table: "Posts",
                newName: "Upvotes");

            migrationBuilder.RenameColumn(
                name: "Post_Question",
                table: "Posts",
                newName: "Question");

            migrationBuilder.RenameColumn(
                name: "Post_Description",
                table: "Posts",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "Post_CreatedAt",
                table: "Posts",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "Post_Id",
                table: "Posts",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_Post_UserId",
                table: "Posts",
                newName: "IX_Posts_UserId");

            migrationBuilder.RenameColumn(
                name: "Comment_UserId",
                table: "Comments",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Comment_Text",
                table: "Comments",
                newName: "Text");

            migrationBuilder.RenameColumn(
                name: "Comment_PostId",
                table: "Comments",
                newName: "PostId");

            migrationBuilder.RenameColumn(
                name: "Comment_CreatedAt",
                table: "Comments",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "Comment_Id",
                table: "Comments",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_Comment_UserId",
                table: "Comments",
                newName: "IX_Comments_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_Comment_PostId",
                table: "Comments",
                newName: "IX_Comments_PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_UserId",
                table: "Upvotes",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_UserId",
                table: "Posts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Posts_PostId",
                table: "Upvotes",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Users_UserId",
                table: "Upvotes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
