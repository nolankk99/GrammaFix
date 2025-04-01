'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { Globe } from 'lucide-react';
import type { Language } from '../lib/LanguageContext';

const languages = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as Language);
    setIsOpen(false);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-dropdown relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm hover:bg-gray-100"
      >
        <Globe className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">{languages.find(lang => lang.code === language)?.name || '한국어'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-md z-50">
          <ul className="py-1">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`block w-full px-3 py-1.5 text-left text-sm ${
                    language === lang.code ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 