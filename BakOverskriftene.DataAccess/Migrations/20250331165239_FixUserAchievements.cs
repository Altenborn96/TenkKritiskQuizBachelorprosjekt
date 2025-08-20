using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakOverskriftene.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FixUserAchievements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Rename table
            migrationBuilder.RenameTable(
                name: "UserAchievement",
                newName: "UserAchievements");

            // Rename indexes
            migrationBuilder.RenameIndex(
                name: "IX_UserAchievement_PlayerId",
                table: "UserAchievements",
                newName: "IX_UserAchievements_PlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_UserAchievement_AchievementId",
                table: "UserAchievements",
                newName: "IX_UserAchievements_AchievementId");

            // Drop old PK
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserAchievement",
                table: "UserAchievements");

            // Add new PK with correct name
            migrationBuilder.AddPrimaryKey(
                name: "PK_UserAchievements",
                table: "UserAchievements",
                column: "Id");
        }


        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop current PK
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserAchievements",
                table: "UserAchievements");

            // Rename indexes back
            migrationBuilder.RenameIndex(
                name: "IX_UserAchievements_PlayerId",
                table: "UserAchievements",
                newName: "IX_UserAchievement_PlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_UserAchievements_AchievementId",
                table: "UserAchievements",
                newName: "IX_UserAchievement_AchievementId");

            // Rename table back
            migrationBuilder.RenameTable(
                name: "UserAchievements",
                newName: "UserAchievement");

            // Re-add old PK
            migrationBuilder.AddPrimaryKey(
                name: "PK_UserAchievement",
                table: "UserAchievement",
                column: "Id");
        }


    }
}
