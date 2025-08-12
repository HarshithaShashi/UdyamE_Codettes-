import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage, changeLanguage, AVAILABLE_LANGUAGES } from '@/src/i18n';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => Promise<void>;
  availableLanguages: typeof AVAILABLE_LANGUAGES;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  const handleSetLanguage = async (language: string) => {
    try {
      await changeLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  useEffect(() => {
    // Update current language when i18n language changes
    const interval = setInterval(() => {
      const newLanguage = getCurrentLanguage();
      if (newLanguage !== currentLanguage) {
        setCurrentLanguage(newLanguage);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage: handleSetLanguage,
      availableLanguages: AVAILABLE_LANGUAGES,
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}