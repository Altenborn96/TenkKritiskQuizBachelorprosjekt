import { Result } from "./result";

// Defining TS interfaces for the data structures
export interface Achievement {
    id: number;
    name: string;
    url: string;
    description?: string | "";
  }
  
  export interface Progress {
    icon: string;
    message: string;
    buttonText: string;
  }
  
  export interface AchievementCard {
    id: number;
    title: string;
    type: "achievements" | "progress";
    achievements?: Achievement[] | null;
    progress?: Result;
  }
  
  
  export interface UserAchievementDto {
    PlayerId: string;
    AchievementId: number | null;
  }