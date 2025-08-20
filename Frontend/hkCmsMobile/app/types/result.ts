export interface Result {
    correctAnswers: number;
    totalQuestions: number;
    earnedAchievement?: boolean;
    sectionId?: number;
    quizName?: string;
    achievementId: number;
    id: number;
    name: string;
    image: string;
  }
  
  export interface SectionResult {
    id: number;
    name: string;
    image: string;
    stars: number;
    points: number;
    description: string;
    locked: boolean;
    completed: boolean;
    totalQuestions: number;
    correctAnswers: number;
    achievementId: number;
  }
  
  export type NextResultResponse =
    | { type: "result"; data: Result }
    | { type: "section"; data: SectionResult };
  
  export interface ResultDto {
    Score: number;
    PlayerId: string;
    SectionId: number;
    QuizName: string;
    PlayerName: string;
    CorrectAnswers: number;
    TotalQuestions: number;
    EarnedAchievement: boolean | false;
  }
  