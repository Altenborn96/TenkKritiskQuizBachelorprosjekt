import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  contextUsername: string;
  playerId: string;
  profileImage: string;
  setContextUsername: (contextUsername: string) => void;
  setPlayerId: (playerId: string) => void;
  setProfileImage: (profileImage: string) => void;
}

// creating context
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [contextUsername, setContextUsername] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [profileImage, setProfileImage] = useState("");

  return (
    <UserContext.Provider
      value={{
        contextUsername,
        setContextUsername,
        playerId,
        setPlayerId,
        profileImage,
        setProfileImage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook for context usage elsewhere
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser m� brukes innenfor UserProvider!");
  }
  return context;
};
