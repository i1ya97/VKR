using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class init2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Analytics_Products_SkuId",
                table: "Analytics");

            migrationBuilder.DropForeignKey(
                name: "FK_Stoks_Products_SkuId",
                table: "Stoks");

            migrationBuilder.RenameColumn(
                name: "SkuId",
                table: "Stoks",
                newName: "OfferId");

            migrationBuilder.RenameIndex(
                name: "IX_Stoks_SkuId",
                table: "Stoks",
                newName: "IX_Stoks_OfferId");

            migrationBuilder.RenameColumn(
                name: "SkuId",
                table: "Analytics",
                newName: "OfferId");

            migrationBuilder.RenameIndex(
                name: "IX_Analytics_SkuId",
                table: "Analytics",
                newName: "IX_Analytics_OfferId");

            migrationBuilder.AddColumn<int>(
                name: "Sku",
                table: "Stoks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Analytics_Products_OfferId",
                table: "Analytics",
                column: "OfferId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stoks_Products_OfferId",
                table: "Stoks",
                column: "OfferId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Analytics_Products_OfferId",
                table: "Analytics");

            migrationBuilder.DropForeignKey(
                name: "FK_Stoks_Products_OfferId",
                table: "Stoks");

            migrationBuilder.DropColumn(
                name: "Sku",
                table: "Stoks");

            migrationBuilder.RenameColumn(
                name: "OfferId",
                table: "Stoks",
                newName: "SkuId");

            migrationBuilder.RenameIndex(
                name: "IX_Stoks_OfferId",
                table: "Stoks",
                newName: "IX_Stoks_SkuId");

            migrationBuilder.RenameColumn(
                name: "OfferId",
                table: "Analytics",
                newName: "SkuId");

            migrationBuilder.RenameIndex(
                name: "IX_Analytics_OfferId",
                table: "Analytics",
                newName: "IX_Analytics_SkuId");

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
    }
}
