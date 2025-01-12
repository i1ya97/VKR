using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Offer_id = table.Column<long>(type: "bigint", nullable: false),
                    Type_id = table.Column<long>(type: "bigint", nullable: false),
                    Created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Old_price = table.Column<double>(type: "double precision", nullable: false),
                    Min_price = table.Column<double>(type: "double precision", nullable: false),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    Marketing_price = table.Column<double>(type: "double precision", nullable: false),
                    Currency_code = table.Column<string>(type: "text", nullable: false),
                    Sale_schema = table.Column<string>(type: "text", nullable: false),
                    Delivery_amount = table.Column<double>(type: "double precision", nullable: false),
                    Return_amount = table.Column<double>(type: "double precision", nullable: false),
                    Vat = table.Column<double>(type: "double precision", nullable: false),
                    Percent = table.Column<double>(type: "double precision", nullable: false),
                    Value = table.Column<double>(type: "double precision", nullable: false),
                    Volume_weight = table.Column<double>(type: "double precision", nullable: false),
                    Is_discounted = table.Column<bool>(type: "boolean", nullable: false),
                    Is_kgt = table.Column<bool>(type: "boolean", nullable: false),
                    User_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UploadLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Due_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    End_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    User_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UploadLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Analytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Ordered_units = table.Column<int>(type: "integer", nullable: false),
                    Returns = table.Column<int>(type: "integer", nullable: false),
                    SkuId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analytics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Analytics_Products_SkuId",
                        column: x => x.SkuId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stoks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Present = table.Column<int>(type: "integer", nullable: false),
                    Reserved = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    SkuId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stoks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stoks_Products_SkuId",
                        column: x => x.SkuId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Analytics_SkuId",
                table: "Analytics",
                column: "SkuId");

            migrationBuilder.CreateIndex(
                name: "IX_Stoks_SkuId",
                table: "Stoks",
                column: "SkuId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Analytics");

            migrationBuilder.DropTable(
                name: "Stoks");

            migrationBuilder.DropTable(
                name: "UploadLogs");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
