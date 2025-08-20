namespace BakOverskriftene.Domain.Models {

    public class Question {

        public int Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int SectionId { get; set; } //FK
        
        public int Score { get; set; }

        //Navigation Properties

        public Section Section { get; set; }
        public List<Answer> Answers { get; set; } = new List<Answer>();
    }
}
