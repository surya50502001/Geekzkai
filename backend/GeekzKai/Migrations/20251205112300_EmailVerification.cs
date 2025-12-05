using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeekzKai.Migrations
{
    /// <inheritdoc />
    public partial class EmailVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailVerificationToken",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EmailVerified",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "Upvotes",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Upvotes_UserId1",
                table: "Upvotes",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Users_UserId1",
                table: "Upvotes",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "User_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Users_UserId1",
                table: "Upvotes");

            migrationBuilder.DropIndex(
                name: "IX_Upvotes_UserId1",
                table: "Upvotes");

            migrationBuilder.DropColumn(
                name: "EmailVerificationToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EmailVerified",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Upvotes");
        }
    }
}
