using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstateManagementProject.Migrations
{
    /// <inheritdoc />
    public partial class AddImageByteColumnsToTasinmaz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImagePath",
                table: "Tasinmazlar",
                newName: "ImageContentType");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Tasinmazlar",
                type: "bytea",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Tasinmazlar");

            migrationBuilder.RenameColumn(
                name: "ImageContentType",
                table: "Tasinmazlar",
                newName: "ImagePath");
        }
    }
}
