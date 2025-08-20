public class AnswerDTO {
    public int Id { get; set; }
    public string AnswerText { get; set; }
    public bool Correct { get; set; }
    public int QuestionId { get; set; }
    public int Score { get; set; }
}
