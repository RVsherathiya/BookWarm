import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    loadLanguageFromStorage();
  }, []);

  const loadLanguageFromStorage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage as Language);
        i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language from storage:', error);
    }
  };

  const changeLanguage = async (lang: Language): Promise<void> => {
    try {
      setLanguage(lang);
      i18n.changeLanguage(lang);
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const t = (key: string): string => {
    return i18n.t(key);
  };

  const value: LanguageContextType = {
    language,
    changeLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
