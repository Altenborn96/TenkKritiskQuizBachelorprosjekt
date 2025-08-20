namespace BakOverskriftene.Domain.Models
{
    public class Results
    {
        public int Id { get; set; } // Egen unik PK
        public int Score { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public string PlayerName { get; set; }
        public bool EarnedAchievement { get; set; }

        // Fremmednøkler
        public int SectionId { get; set; }
        public string PlayerId { get; set; }
        public string QuizName { get; set; } = string.Empty;
        public int? AchievementId { get; set; }


        // Navigation Properties
        public Section Section { get; set; }
        public Player Player { get; set; }
        public Achievement Achievement { get; set; }
    }
}
