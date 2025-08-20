using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BakOverskriftene.Domain.Models
{

    public class Settings
    {
        public int Id { get; set; } // PK
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Description { get; set; }
        public string? Link { get; set; }
        public string? Question { get; set; }
        public string? Answer { get; set; }
        public string Identifier { get; set; }
    }

}
