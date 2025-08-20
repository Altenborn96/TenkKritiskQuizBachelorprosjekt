using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakOverskriftene.DataAccess.Migrations
{
    public partial class AchievementsFix2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Slett tabellen hvis den finnes
            migrationBuilder.Sql(@"
        IF OBJECT_ID('Achievements', 'U') IS NOT NULL
        DROP TABLE Achievements;

        CREATE TABLE Achievements (
            Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
            Name NVARCHAR(MAX) NOT NULL,
            Url NVARCHAR(MAX) NOT NULL,
            Description NVARCHAR(MAX) NOT NULL,
            PlayerId NVARCHAR(450) NULL,
            SectionId INT NULL,
            CONSTRAINT FK_Achievements_AspNetUsers_PlayerId FOREIGN KEY (PlayerId) REFERENCES AspNetUsers(Id),
            CONSTRAINT FK_Achievements_Sections_SectionId FOREIGN KEY (SectionId) REFERENCES Sections(Id)
        );

        CREATE INDEX IX_Achievements_PlayerId ON Achievements(PlayerId);
        CREATE INDEX IX_Achievements_SectionId ON Achievements(SectionId);
    ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS Achievements;");
        }

    }
}
