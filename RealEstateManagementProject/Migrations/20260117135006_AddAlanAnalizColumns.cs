using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstateManagementProject.Migrations
{
    /// <inheritdoc />
    public partial class AddAlanAnalizColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlanAnalizleri_Users_KullaniciId",
                table: "AlanAnalizleri");

            migrationBuilder.DropIndex(
                name: "IX_AlanAnalizleri_KullaniciId",
                table: "AlanAnalizleri");

            migrationBuilder.DropColumn(
                name: "IslemTuru",
                table: "AlanAnalizleri");

            migrationBuilder.RenameColumn(
                name: "GeometriTuru",
                table: "AlanAnalizleri",
                newName: "AnalizTuru");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AnalizTuru",
                table: "AlanAnalizleri",
                newName: "GeometriTuru");

            migrationBuilder.AddColumn<string>(
                name: "IslemTuru",
                table: "AlanAnalizleri",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AlanAnalizleri_KullaniciId",
                table: "AlanAnalizleri",
                column: "KullaniciId");

            migrationBuilder.AddForeignKey(
                name: "FK_AlanAnalizleri_Users_KullaniciId",
                table: "AlanAnalizleri",
                column: "KullaniciId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
