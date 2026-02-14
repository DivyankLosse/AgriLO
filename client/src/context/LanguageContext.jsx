import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import mr from '../i18n/mr.json';

const translations = { en, hi, mr };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('appLang');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('appLang', lang);
  };

  const t = (key) => {
    const currentLang = translations[language] ? translations[language] : translations['en'];
    return currentLang[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
