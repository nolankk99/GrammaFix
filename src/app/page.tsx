'use client';

import TextCorrector from '@/components/TextCorrector';
import Link from 'next/link';
import { History } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <div className="z-10 max-w-5xl w-full">
        {/* 헤더 영역 */}
        <div className="mb-8">
          {/* 상단 탐색 영역 */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link 
                href="/history" 
                className="flex items-center text-sm px-3 py-1.5 border rounded-md hover:bg-gray-50 transition"
              >
                <History className="h-4 w-4 mr-1" />
                {t('navigation.history')}
              </Link>
            </div>
          </div>
          
          {/* 타이틀 영역 */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {t('common.title')}
            </h1>
            <p className="text-lg md:text-xl mb-2">
              {t('common.description')}
            </p>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              {t('common.subDescription')}
            </p>
          </div>
        </div>

        <TextCorrector />

        <div className="border rounded-lg p-4 md:p-6 bg-white mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">{t('howto.title')}</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>{t('howto.step1')}</li>
            <li>{t('howto.step2')}</li>
            <li>{t('howto.step3')}</li>
            <li>{t('howto.step4')}</li>
          </ol>
        </div>

        <div className="border rounded-lg p-4 md:p-6 bg-gray-50 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">{t('aiInfo.title')}</h2>
          <p className="mb-4">{t('aiInfo.description')}</p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">{t('aiInfo.details')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
