import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  userRole: 'buyer' | 'seller' | null;
  setUserRole: (role: 'buyer' | 'seller') => void;
  hasSelectedLanguage: boolean;
  setHasSelectedLanguage: (selected: boolean) => void;
  interests: string[];
  setInterests: (interests: string[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<'buyer' | 'seller' | null>(null);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  return (
    <UserContext.Provider value={{
      userRole,
      setUserRole,
      hasSelectedLanguage,
      setHasSelectedLanguage,
      interests,
      setInterests,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}