namespace BakOverskriftene.Domain.Models {

    public class Section {

        public int Id { get; set; } //PK
        public string Name { get; set; }

        public string? Image { get; set; }
        public int Stars { get; set; }
        public int Points { get; set; }
        public int TotalQuestions { get; set; }
        public string? Description { get; set; }
        public bool Locked { get; set; }
        public int AchievementId { get; set; }

        //Navigation Properties

        public List<Results> Results { get; set; } = new List<Results>();
        public List<Question> Questions { get; set; } = new List<Question>();
        public ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();


    }
}
