using BakOverskriftene.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Reflection;

public class ApplicationDbContext : IdentityDbContext<Player>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
        base(options)
    { }

    public DbSet<Player> Players { get; set; }
    public DbSet<Results> Results { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }

    public DbSet<Answer> Answers { get; set; }
    public DbSet<Avatar> Avatars { get; set; }
    public DbSet<Settings> Settings { get; set; }
    public DbSet<Icon> Icons { get; set; }
    public DbSet<Feedback> Feedbacks { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Player>()
        .HasDiscriminator<string>("Discriminator")
        .HasValue("Player");

        // Configure relationships
        modelBuilder.Entity<Question>()
            .HasOne(q => q.Section)
            .WithMany(s => s.Questions)
            .HasForeignKey(q => q.SectionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Answer>()
            .HasOne(a => a.Question)
            .WithMany(q => q.Answers)
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Results>()
            .HasKey(r => r.Id); // egen PK

        modelBuilder.Entity<Results>()
            .HasOne(r => r.Section)
            .WithMany(s => s.Results)
            .HasForeignKey(r => r.SectionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Results>()
            .HasOne(r => r.Player)
            .WithMany(p => p.Results)
            .HasForeignKey(r => r.PlayerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<IdentityUserLogin<string>>(entity =>
        {
            entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });
        });

        foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes())
        {
            MethodInfo? method = entityType.ClrType.GetMethod("OnModelCreating",
            BindingFlags.Static | BindingFlags.NonPublic);
            if (method != null)
            {
                method.Invoke(null, new object[] { modelBuilder });
            }
        }
    }
}
