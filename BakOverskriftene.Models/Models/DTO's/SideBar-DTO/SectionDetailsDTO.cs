public class SectionDetailsDTO {
    public int Id { get; set; }
    public string SectionName { get; set; }

    public List<QuestionDetailsDTO> Questions { get; set; }
}