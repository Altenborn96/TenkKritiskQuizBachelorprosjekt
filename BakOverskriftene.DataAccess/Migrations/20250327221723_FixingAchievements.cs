using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakOverskriftene.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FixingAchievements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop FK only if it exists
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT * FROM sys.foreign_keys 
                    WHERE name = 'FK_Achievements_AspNetUsers_PlayerId'
                )
                ALTER TABLE Achievements DROP CONSTRAINT FK_Achievements_AspNetUsers_PlayerId;
            ");

            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT * FROM sys.foreign_keys 
                    WHERE name = 'FK_Achievements_Sections_SectionId'
                )
                ALTER TABLE Achievements DROP CONSTRAINT FK_Achievements_Sections_SectionId;
            ");

            // Make columns nullable
            migrationBuilder.AlterColumn<int>(
                name: "SectionId",
                table: "Achievements",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "PlayerId",
                table: "Achievements",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            // Re-add foreign keys (optional delete behavior)
            migrationBuilder.AddForeignKey(
                name: "FK_Achievements_AspNetUsers_PlayerId",
                table: "Achievements",
                column: "PlayerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Achievements_Sections_SectionId",
                table: "Achievements",
                column: "SectionId",
                principalTable: "Sections",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop FKs safely
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT * FROM sys.foreign_keys 
                    WHERE name = 'FK_Achievements_AspNetUsers_PlayerId'
                )
                ALTER TABLE Achievements DROP CONSTRAINT FK_Achievements_AspNetUsers_PlayerId;
            ");

            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT * FROM sys.foreign_keys 
                    WHERE name = 'FK_Achievements_Sections_SectionId'
                )
                ALTER TABLE Achievements DROP CONSTRAINT FK_Achievements_Sections_SectionId;
            ");

            // Make columns NOT NULL again (fallback defaults for rollback)
            migrationBuilder.AlterColumn<int>(
                name: "SectionId",
                table: "Achievements",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PlayerId",
                table: "Achievements",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            // Re-add FK with cascade delete behavior
            migrationBuilder.AddForeignKey(
                name: "FK_Achievements_AspNetUsers_PlayerId",
                table: "Achievements",
                column: "PlayerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Achievements_Sections_SectionId",
                table: "Achievements",
                column: "SectionId",
                principalTable: "Sections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
