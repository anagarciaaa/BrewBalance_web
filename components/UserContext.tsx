import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  user_id: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing the UserContext
export const useUser = () => useContext(UserContext);
