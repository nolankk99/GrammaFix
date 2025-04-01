'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

interface MetadataContextType {
  title: string;
  description: string;
  updateMetadata: (title?: string, description?: string) => void;
}

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export function MetadataProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // 언어 변경시 메타데이터 기본값 업데이트
  useEffect(() => {
    // 언어별 기본 메타데이터 설정
    const defaultMetadata = {
      ko: {
        title: '웹사이트 제목',
        description: '웹사이트 설명'
      },
      en: {
        title: 'Website Title',
        description: 'Website Description'
      },
      ja: {
        title: 'ウェブサイトタイトル',
        description: 'ウェブサイトの説明'
      },
      zh: {
        title: '网站标题',
        description: '网站描述'
      },
      es: {
        title: 'Título del sitio web',
        description: 'Descripción del sitio web'
      }
    };

    const metadata = defaultMetadata[language as keyof typeof defaultMetadata] || defaultMetadata.en;
    setTitle(metadata.title);
    setDescription(metadata.description);
  }, [language]);

  const updateMetadata = (newTitle?: string, newDescription?: string) => {
    if (newTitle) setTitle(newTitle);
    if (newDescription) setDescription(newDescription);
  };

  return (
    <MetadataContext.Provider value={{ title, description, updateMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
}

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
}; 