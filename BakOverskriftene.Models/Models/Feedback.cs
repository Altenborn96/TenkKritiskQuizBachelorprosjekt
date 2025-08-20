using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BakOverskriftene.Domain.Models
{
    public class Feedback
    {
        public int? Id { get; set; }
        public int? RecommendScore { get; set; }
        public int? FunScore { get; set; }
        public int? SatisfiedScore { get; set; }

        public string? SuggestionComment { get; set; }
        public string? GeneralComment { get; set; }
        public string Identifier { get; set; }

    }
}
