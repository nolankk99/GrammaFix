'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 번역 파일 import
import koTranslations from '../../public/locales/ko.json';
import enTranslations from '../../public/locales/en.json';
import jaTranslations from '../../public/locales/ja.json';

type Language = 'ko' | 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, section?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 정적으로 번역 파일 포함
const translationFiles = {
  ko: koTranslations,
  en: enTranslations,
  ja: jaTranslations
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');
  const [translations, setTranslations] = useState<Record<string, any>>(koTranslations);

  useEffect(() => {
    // 브라우저 언어 감지
    const detectLanguage = () => {
      try {
        const browserLang = navigator.language.split('-')[0];
        const savedLang = localStorage.getItem('language');
        
        // 지원되는 언어인지 확인
        const supported = ['ko', 'en', 'ja'];
        const lang = (savedLang || browserLang) as Language;
        
        return supported.includes(lang) ? lang : 'ko';
      } catch (error) {
        return 'ko';
      }
    };

    const initialLang = detectLanguage();
    setLanguage(initialLang);

    // 번역 데이터 설정
    setTranslations(translationFiles[initialLang] || translationFiles.ko);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // 언어 변경 시 번역 데이터 업데이트
    setTranslations(translationFiles[lang] || translationFiles.ko);
  };

  const t = (key: string, section?: string) => {
    try {
      if (!translations) return key;
      
      if (section) {
        const parts = key.split('.');
        if (parts.length > 1) {
          const mainKey = parts[0];
          const subKey = parts[1];
          return translations[section]?.[mainKey]?.[subKey] || 
                 translations[section]?.[key] || 
                 key;
        }
        return translations[section]?.[key] || key;
      }
      
      const parts = key.split('.');
      if (parts.length > 1) {
        let current = translations;
        for (const part of parts) {
          current = current?.[part];
          if (current === undefined) return key;
        }
        return current || key;
      }
      
      return translations[key] || key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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

export type { Language }; 