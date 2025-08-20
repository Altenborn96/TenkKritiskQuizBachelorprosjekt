import { createContext, useContext, useState, ReactNode } from "react";

// Definer interface for svar
export interface Answer {
  id: number;
  answerText: string;
  correct: boolean;
  questionId: number;
  score: number;
}

// Oppdater interface for sp�rsm�l til � inkludere answers
export interface Question {
  id: number;
  questionText: string;
  sectionId: number;
  answers: Answer[];
}

// Definer typen for contexten
interface QuestionContextType {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  resetQuestions: () => void; //  Nustillingsfunksjon for state
}

// Opprett context med default-verdi
export const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);

// Opprett provider som holder state for sp�rsm�l
export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  //  Nullstill alle sp�rsm�l
  const resetQuestions = () => {
    setQuestions([]);
    console.log("Questions nullstilt");
  };

  return (
    <QuestionContext.Provider
      value={{ questions, setQuestions, resetQuestions }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

// Custom hook for � bruke QuestionContext
export const useQuestion = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestion m� brukes inne i en QuestionProvider");
  }
  return context;
};
