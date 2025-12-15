using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeekzKai.Migrations
{
    public partial class DropNotificationsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS \"Notifications\";");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No rollback needed
        }
    }
}