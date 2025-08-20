using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakOverskriftene.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FeedbackTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Feedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecommendScore = table.Column<int>(type: "int", nullable: true),
                    FunScore = table.Column<int>(type: "int", nullable: true),
                    SatisfiedScore = table.Column<int>(type: "int", nullable: true),
                    SuggestionComment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GeneralComment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Identifier = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedbacks", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feedbacks");
        }
    }
}
