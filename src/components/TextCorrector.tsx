'use client';

import { useState, useRef, useEffect } from 'react';
import { ClipboardCopy, Loader2, WifiOff, Trash2, X } from 'lucide-react';
import { correctWithLanguageTool } from '@/lib/textCorrectionService';
import type { Language } from '@/lib/LanguageContext';
import { useLanguage } from '@/lib/LanguageContext';
import { addCorrectionResult } from '@/lib/userService';

export default function TextCorrector() {
  const { language: contextLanguage, t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [language, setLanguage] = useState<Language>('ko');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [correctionInfo, setCorrectionInfo] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 컨텍스트 언어가 변경되면 교정기 언어도 변경
  useEffect(() => {
    setLanguage(contextLanguage);
  }, [contextLanguage]);

  // 온라인 상태 감지
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // 초기 온라인 상태 확인
    setIsOnline(navigator.onLine);

    // 이벤트 리스너 등록
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 텍스트 교정 요청 함수
  const handleCorrection = async () => {
    // 오프라인 상태 확인
    if (!isOnline) {
      setCorrectionInfo(t('common.offlineError'));
      return;
    }

    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setCorrectionInfo('');
    
    try {
      // 기본 교정
      const result = await correctWithLanguageTool(inputText, language);
      setCorrectedText(result);
      
      // 교정 결과 저장
      addCorrectionResult({
        originalText: inputText,
        correctedText: result,
        language,
        timestamp: new Date().toISOString()
      });
      
      // 교정 정보 설정
      if (result !== inputText) {
        setCorrectionInfo(t('corrector.corrected'));
      } else {
        setCorrectionInfo(t('corrector.noCorrection'));
      }
    } catch (error) {
      console.error('교정 오류:', error);
      setCorrectionInfo(
        error instanceof Error 
          ? `${t('corrector.error')}: ${error.message}` 
          : t('corrector.error')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 복사 기능
  const handleCopy = () => {
    if (!correctedText) return;
    
    navigator.clipboard.writeText(correctedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
      alert(t('common.copyFailed'));
    });
  };

  // 자동 높이 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // 입력 텍스트 지우기 함수
  const handleClearText = () => {
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <>
      {!isOnline && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center">
          <WifiOff className="h-5 w-5 mr-2" />
          <span>{t('common.offlineWarning')}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 w-full">
        {/* 입력 영역 */}
        <div className="h-full flex flex-col border rounded-lg overflow-hidden">
          <div className="flex justify-between items-center bg-gray-50 px-3 py-2 border-b">
            <h2 className="font-medium">{t('corrector.originalText')}</h2>
            <div className="flex space-x-2 items-center">
              {inputText && (
                <button
                  className="text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-200"
                  onClick={handleClearText}
                  title={t('common.clear')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <select 
                className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                disabled={isLoading || !isOnline}
              >
                <option value="ko">{t('languages.ko')}</option>
                <option value="en">{t('languages.en')}</option>
                <option value="ja">{t('languages.ja')}</option>
              </select>
            </div>
          </div>
          <div className="relative flex-grow">
            <textarea
              ref={textareaRef}
              className="w-full h-full min-h-[220px] p-3 md:p-4 resize-none focus:outline-none"
              placeholder={t('corrector.placeholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="border-t bg-gray-50 px-3 py-2 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              <span>{t('common.powered')}</span>
            </div>
            <button 
              className="bg-blue-600 text-white py-1.5 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              onClick={handleCorrection}
              disabled={isLoading || !inputText.trim() || !isOnline}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-3 w-3 mr-2" />
                  {t('corrector.correcting')}
                </>
              ) : (
                t('corrector.correct')
              )}
            </button>
          </div>
        </div>

        {/* 결과 영역 */}
        <div className="h-full flex flex-col border rounded-lg overflow-hidden">
          <div className="flex justify-between items-center bg-gray-50 px-3 py-2 border-b">
            <h2 className="font-medium">{t('corrector.correctedText')}</h2>
            <button 
              className={`text-sm border rounded px-2 py-1 flex items-center gap-1 bg-white ${
                correctedText ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={handleCopy}
              disabled={!correctedText}
            >
              <ClipboardCopy className="h-3 w-3" />
              {isCopied ? t('common.copied') : t('common.copy')}
            </button>
          </div>
          <div className="flex-grow min-h-[220px] p-3 md:p-4 bg-white overflow-auto">
            {correctedText ? (
              <p>{correctedText}</p>
            ) : (
              <p className="text-gray-400">{t('corrector.placeholder')}</p>
            )}
          </div>
          <div className="px-3 py-2 bg-gray-50 border-t">
            <div className="text-xs text-gray-600">
              {correctionInfo && <p>{correctionInfo}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 