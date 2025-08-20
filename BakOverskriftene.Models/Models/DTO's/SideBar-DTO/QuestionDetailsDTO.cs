public class QuestionDetailsDTO {
    public int Id { get; set; }
    public string QuestionText { get; set; }
    public List<AnswerDetailsDTO> Answers { get; set; }
}