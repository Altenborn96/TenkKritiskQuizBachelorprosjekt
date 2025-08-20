namespace BakOverskriftene.Domain.Models {

    public class Answer {

        public int Id { get; set; } //PK
        public string AnswerText { get; set; }
        public bool Correct { get; set; }
        public int QuestionId { get; set; } //FK

        public int Score { get; set; }
        //Navigation Properties

        public Question Question { get; set; }
    }
}
