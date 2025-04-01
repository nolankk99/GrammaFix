'use client';

import { Home } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="py-6 px-4">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <Home className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('title', 'header')}
          </h1>
        </div>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-6 rounded-full"></div>
        <p className="text-xl text-gray-600 leading-relaxed">
          {t('description', 'header')}
        </p>
      </div>
    </header>
  );
} 