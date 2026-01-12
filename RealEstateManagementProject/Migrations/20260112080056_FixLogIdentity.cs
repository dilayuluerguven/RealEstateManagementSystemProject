using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstateManagementProject.Migrations
{
    /// <inheritdoc />
    public partial class FixLogIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Tasinmazlar_IlceId",
                table: "Tasinmazlar",
                column: "IlceId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasinmazlar_IlId",
                table: "Tasinmazlar",
                column: "IlId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasinmazlar_MahalleId",
                table: "Tasinmazlar",
                column: "MahalleId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasinmazlar_UserId",
                table: "Tasinmazlar",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Mahalleler_IlceId",
                table: "Mahalleler",
                column: "IlceId");

            migrationBuilder.CreateIndex(
                name: "IX_Ilceler_IlId",
                table: "Ilceler",
                column: "IlId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ilceler_Iller_IlId",
                table: "Ilceler",
                column: "IlId",
                principalTable: "Iller",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Mahalleler_Ilceler_IlceId",
                table: "Mahalleler",
                column: "IlceId",
                principalTable: "Ilceler",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasinmazlar_Ilceler_IlceId",
                table: "Tasinmazlar",
                column: "IlceId",
                principalTable: "Ilceler",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasinmazlar_Iller_IlId",
                table: "Tasinmazlar",
                column: "IlId",
                principalTable: "Iller",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasinmazlar_Mahalleler_MahalleId",
                table: "Tasinmazlar",
                column: "MahalleId",
                principalTable: "Mahalleler",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasinmazlar_Users_UserId",
                table: "Tasinmazlar",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ilceler_Iller_IlId",
                table: "Ilceler");

            migrationBuilder.DropForeignKey(
                name: "FK_Mahalleler_Ilceler_IlceId",
                table: "Mahalleler");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasinmazlar_Ilceler_IlceId",
                table: "Tasinmazlar");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasinmazlar_Iller_IlId",
                table: "Tasinmazlar");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasinmazlar_Mahalleler_MahalleId",
                table: "Tasinmazlar");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasinmazlar_Users_UserId",
                table: "Tasinmazlar");

            migrationBuilder.DropIndex(
                name: "IX_Tasinmazlar_IlceId",
                table: "Tasinmazlar");

            migrationBuilder.DropIndex(
                name: "IX_Tasinmazlar_IlId",
                table: "Tasinmazlar");

            migrationBuilder.DropIndex(
                name: "IX_Tasinmazlar_MahalleId",
                table: "Tasinmazlar");

            migrationBuilder.DropIndex(
                name: "IX_Tasinmazlar_UserId",
                table: "Tasinmazlar");

            migrationBuilder.DropIndex(
                name: "IX_Mahalleler_IlceId",
                table: "Mahalleler");

            migrationBuilder.DropIndex(
                name: "IX_Ilceler_IlId",
                table: "Ilceler");
        }
    }
}
