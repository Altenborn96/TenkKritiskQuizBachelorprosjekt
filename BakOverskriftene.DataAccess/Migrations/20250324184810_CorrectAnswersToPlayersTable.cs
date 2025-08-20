﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakOverskriftene.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CorrectAnswersToPlayersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CorrectAnswers",
                table: "Results",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CorrectAnswers",
                table: "Results");
        }
    }
}
