'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ko' | 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, section?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');
  const [translations, setTranslations] = useState<Record<string, any>>({});

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

    // 번역 파일 로드
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${initialLang}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('번역 파일을 불러오는데 실패했습니다:', error);
        // 기본 한국어 번역으로 폴백
        try {
          const fallbackResponse = await fetch('/locales/ko.json');
          const fallbackData = await fallbackResponse.json();
          setTranslations(fallbackData);
        } catch (fallbackError) {
          console.error('기본 번역 파일도 불러오지 못했습니다:', fallbackError);
        }
      }
    };

    loadTranslations();
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // 언어 변경 시 번역 데이터 다시 로드
    fetch(`/locales/${lang}.json`)
      .then(res => res.json())
      .then(data => setTranslations(data))
      .catch(error => console.error('언어 변경 중 오류 발생:', error));
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