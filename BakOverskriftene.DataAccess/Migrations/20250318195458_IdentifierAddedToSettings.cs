using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakOverskriftene.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class IdentifierAddedToSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Identifier",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Identifier",
                table: "Settings");
        }
    }
}
