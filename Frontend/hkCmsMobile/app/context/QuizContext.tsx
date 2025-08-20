import React, { createContext, useContext, useState, ReactNode } from "react";

// Interface for konteksten
interface ResultContextType {
  id: number;
  playerId: number;
  score: number;
  quizName: string;
  correctAnswers: number;
  totalQuestions: number;

  setId: React.Dispatch<React.SetStateAction<number>>;
  setPlayerId: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setQuizName: React.Dispatch<React.SetStateAction<string>>;
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>;
  setTotalQuestions: React.Dispatch<React.SetStateAction<number>>;
  resetResult: () => void; //  Nullstillingsfunksjon
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

// Provider for å holde state
export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number>(0);
  const [playerId, setPlayerId] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [quizName, setQuizName] = useState<string>("");
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  //  Nullstill alle verdier
  const resetResult = () => {
    setId(0);
    setPlayerId(0);
    setScore(0);
    setQuizName("");
    setCorrectAnswers(0);
    setTotalQuestions(0);
    console.log("Result nullstilt");
  };

  return (
    <ResultContext.Provider
      value={{
        id,
        playerId,
        score,
        quizName,
        correctAnswers,
        totalQuestions,
        setId,
        setPlayerId,
        setScore,
        setQuizName,
        resetResult,
        setCorrectAnswers,
        setTotalQuestions,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

//  Custom hook for � bruke konteksten
export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult m� brukes inne i en ResultProvider");
  }
  return context;
};
