using Microsoft.AspNetCore.Identity;

namespace BakOverskriftene.Domain.Models
{

    public class Player : IdentityUser
    { //Extend IdentityUser

        public string? SecretQuestion { get; set; }
        public string? SecretAnswer { get; set; }

        public int? AvatarId { get; set; }
        public string? AvatarUrl { get; set; }
        public bool? IsAnonymous { get; set; } = false;

        //password reset token properties
        public string? ResetTokenHash { get; set; }
        public DateTime? ResetTokenExpiration { get; set; }



        //Navigation Properties

        public List<Results> Results { get; set; } = new List<Results>();
        public ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();
        public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();


    }
}