using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstateManagementProject.Migrations
{
    /// <inheritdoc />
    public partial class AddImagePathToTasinmaz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Tasinmazlar",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Tasinmazlar");
        }
    }
}
