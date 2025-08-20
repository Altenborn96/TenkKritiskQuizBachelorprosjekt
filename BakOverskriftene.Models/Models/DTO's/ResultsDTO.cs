using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


    public class ResultsDTO
    {


        public int Id { get; set; } //PK
        public int Score { get; set; }
        public string PlayerId { get; set; } //FK
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public bool EarnedAchievement { get; set; }

        public string QuizName { get; set; }
        public int SectionId { get; set; }
        public string PlayerName { get; set; }
        public int? AchievementId { get; set; }


}
