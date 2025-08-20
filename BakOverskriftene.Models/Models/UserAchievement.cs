namespace BakOverskriftene.Domain.Models
{

    public class UserAchievement
    {
        
        public int Id { get; set; } //PK
        public DateTime Date { get; set; } = DateTime.UtcNow;


        // Foreign Keys
        public string PlayerId { get; set; }
        public int? AchievementId { get; set; }

        //Navigation props
        public Achievement? Achievement { get; set; } // Navigation property
        public Player? Player { get; set; }  // Navigation property



    }
}