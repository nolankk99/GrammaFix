'use client';

import { Card, CardContent } from "./ui/card";
import { useLanguage } from '../lib/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-16 py-10 px-4 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* SEO를 위한 관련 키워드 텍스트 */}
        <div className="mb-12 text-gray-600">
          <h2 className="font-bold text-lg mb-4 text-gray-800">
            SEO를 위한 제목 영역
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              SEO를 위한 첫 번째 문단입니다. 여기에 프로젝트 관련 키워드가 포함된 설명을 작성합니다.
            </p>
            <p className="mb-4">
              SEO를 위한 두 번째 문단입니다. 여기에 프로젝트와 관련된 또 다른 키워드가 포함된 설명을 작성합니다.
            </p>
            <p>
              SEO를 위한 세 번째 문단입니다. 추가적인 설명과 함께 마무리합니다.
            </p>
          </div>
        </div>

        {/* Google 애드센스 위치 */}
        <Card className="mb-12 border border-gray-200">
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-gray-400 text-sm">광고 영역</p>
            {/* 실제 애드센스 코드는 여기에 추가 */}
          </CardContent>
        </Card>

        {/* 저작권 정보 */}
        <div className="text-center text-gray-500 text-sm">
          <p>{t('copyright', 'footer')}</p>
        </div>
      </div>
    </footer>
  );
} 