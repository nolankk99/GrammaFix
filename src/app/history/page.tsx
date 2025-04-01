'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { getCorrectionHistory, saveCorrectionHistory } from '@/lib/userService';
import { CorrectionResult, Language } from '@/types/common';

// 언어 표시 텍스트
const languageDisplay: Record<Language, string> = {
  ko: '한국어',
  en: '영어',
  ja: '일본어'
};

export default function HistoryPage() {
  const [history, setHistory] = useState<CorrectionResult[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const correctionHistory = getCorrectionHistory();
    setHistory(correctionHistory);
  }, []);

  const handleDelete = (timestamp: string) => {
    const updatedHistory = history.filter(item => item.timestamp !== timestamp);
    setHistory(updatedHistory);
    saveCorrectionHistory(updatedHistory);
  };

  const handleClearAll = () => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      setHistory([]);
      saveCorrectionHistory([]);
    }
  };

  // 시간 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  if (!isClient) {
    return <div className="p-8 flex justify-center">로딩 중...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>메인으로 돌아가기</span>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">교정 히스토리</h1>
          {history.length > 0 && (
            <button 
              className="text-sm text-red-500 flex items-center hover:text-red-700"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              모두 삭제
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16 border rounded-lg bg-gray-50">
            <p className="text-gray-500">교정 히스토리가 없습니다.</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
              교정하러 가기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={item.timestamp} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {languageDisplay[item.language]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleDelete(item.timestamp)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">원본 텍스트</h3>
                    <p className="text-sm border-l-2 border-gray-300 pl-2 py-1">
                      {item.originalText}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">교정된 텍스트</h3>
                    <p className="text-sm border-l-2 border-blue-400 pl-2 py-1">
                      {item.correctedText}
                    </p>
                  </div>
                </div>
                
                {item.explanation && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium mb-1">설명</h3>
                    <p className="text-xs text-gray-600">{item.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 