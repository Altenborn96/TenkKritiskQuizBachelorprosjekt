namespace BakOverskriftene.Domain.Models
{

    public class Achievement
    {
        
        public int Id { get; set; } //PK
        public string Name { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        // Foreign Keys
        public string? PlayerId { get; set; }
        public int? SectionId { get; set; }


    }
}