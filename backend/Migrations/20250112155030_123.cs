using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class _123 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Analytics_Products_SkuId_SkuUser_id",
                table: "Analytics");

            migrationBuilder.DropForeignKey(
                name: "FK_Stoks_Products_SkuId_SkuUser_id",
                table: "Stoks");

            migrationBuilder.DropIndex(
                name: "IX_Stoks_SkuId_SkuUser_id",
                table: "Stoks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Analytics_SkuId_SkuUser_id",
                table: "Analytics");

            migrationBuilder.DropColumn(
                name: "SkuUser_id",
                table: "Stoks");

            migrationBuilder.DropColumn(
                name: "SkuUser_id",
                table: "Analytics");

            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "Products",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Stoks_SkuId",
                table: "Stoks",
                column: "SkuId");

            migrationBuilder.CreateIndex(
                name: "IX_Analytics_SkuId",
                table: "Analytics",
                column: "SkuId");

            migrationBuilder.AddForeignKey(
                name: "FK_Analytics_Products_SkuId",
                table: "Analytics",
                column: "SkuId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stoks_Products_SkuId",
                table: "Stoks",
                column: "SkuId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Analytics_Products_SkuId",
                table: "Analytics");

            migrationBuilder.DropForeignKey(
                name: "FK_Stoks_Products_SkuId",
                table: "Stoks");

            migrationBuilder.DropIndex(
                name: "IX_Stoks_SkuId",
                table: "Stoks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Analytics_SkuId",
                table: "Analytics");

            migrationBuilder.AddColumn<string>(
                name: "SkuUser_id",
                table: "Stoks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "Products",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "SkuUser_id",
                table: "Analytics",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                columns: new[] { "Id", "User_id" });

            migrationBuilder.CreateIndex(
                name: "IX_Stoks_SkuId_SkuUser_id",
                table: "Stoks",
                columns: new[] { "SkuId", "SkuUser_id" });

            migrationBuilder.CreateIndex(
                name: "IX_Analytics_SkuId_SkuUser_id",
                table: "Analytics",
                columns: new[] { "SkuId", "SkuUser_id" });

            migrationBuilder.AddForeignKey(
                name: "FK_Analytics_Products_SkuId_SkuUser_id",
                table: "Analytics",
                columns: new[] { "SkuId", "SkuUser_id" },
                principalTable: "Products",
                principalColumns: new[] { "Id", "User_id" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stoks_Products_SkuId_SkuUser_id",
                table: "Stoks",
                columns: new[] { "SkuId", "SkuUser_id" },
                principalTable: "Products",
                principalColumns: new[] { "Id", "User_id" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
