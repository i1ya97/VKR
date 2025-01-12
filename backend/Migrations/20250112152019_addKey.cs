using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class addKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UploadLogs",
                table: "UploadLogs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UploadLogs",
                table: "UploadLogs",
                columns: new[] { "Id", "User_id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UploadLogs",
                table: "UploadLogs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UploadLogs",
                table: "UploadLogs",
                column: "Id");
        }
    }
}
