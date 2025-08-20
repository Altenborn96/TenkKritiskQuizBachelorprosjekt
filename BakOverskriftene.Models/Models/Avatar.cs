namespace BakOverskriftene.Domain.Models
{

    public class Avatar
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Url { get; set; }
    }
}