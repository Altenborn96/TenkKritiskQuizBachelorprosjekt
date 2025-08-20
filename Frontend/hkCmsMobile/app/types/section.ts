//tabs/index.tsx
export interface Section {
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