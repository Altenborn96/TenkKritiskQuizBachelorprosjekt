using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakOverskriftene.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class QuizNameToResultsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuizName",
                table: "Results",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuizName",
                table: "Results");
        }
    }
}
