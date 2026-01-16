using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RealEstateManagementProject.Migrations
{
    /// <inheritdoc />
    public partial class CreateAlanAnalizTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlanAnalizleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    KullaniciId = table.Column<int>(type: "integer", nullable: false),
                    GeometriAdi = table.Column<string>(type: "text", nullable: false),
                    GeometriTuru = table.Column<string>(type: "text", nullable: false),
                    IslemTuru = table.Column<string>(type: "text", nullable: true),
                    GeometriJson = table.Column<string>(type: "text", nullable: false),
                    AlanMetrekare = table.Column<double>(type: "double precision", nullable: false),
                    OlusturmaTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlanAnalizleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlanAnalizleri_Users_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlanAnalizleri_KullaniciId",
                table: "AlanAnalizleri",
                column: "KullaniciId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlanAnalizleri");
        }
    }
}
