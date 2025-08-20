import { createContext, useContext, useState, ReactNode } from "react";

// Definer interface for Section
interface Section {
  id: number;
  name: string;
  image: string;
  stars: number;
  points?: number | 0;
  description: string;
  locked: boolean;
  completed: boolean | false;
  achievementId: number;
}

// Definer typen for contexten (verdi + setter-funksjon)
interface SectionContextType {
  section: Section | null;
  setSection: (section: Section) => void;
}

// Opprett contexten med en default verdi
export const SectionContext = createContext<SectionContextType | undefined>(
  undefined
);

// Opprett provider som holder state
export const SectionProvider = ({ children }: { children: ReactNode }) => {
  const [section, setSection] = useState<Section | null>(null);

  return (
    <SectionContext.Provider value={{ section, setSection }}>
      {children}
    </SectionContext.Provider>
  );
};

// Custom hook for � bruke SectionContext
export const useSection = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSection m� brukes inne i en SectionProvider");
  }
  return context;
};
