using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakOverskriftene.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AchievementIdToResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AchievementId",
                table: "Results",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Results_AchievementId",
                table: "Results",
                column: "AchievementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Results_Achievements_AchievementId",
                table: "Results",
                column: "AchievementId",
                principalTable: "Achievements",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Results_Achievements_AchievementId",
                table: "Results");

            migrationBuilder.DropIndex(
                name: "IX_Results_AchievementId",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "AchievementId",
                table: "Results");
        }
    }
}
