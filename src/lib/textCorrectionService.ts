import { Language } from '@/types/common';

// LanguageTool API URL (무료 API)
const LANGUAGE_TOOL_API_URL = 'https://api.languagetool.org/v2/check';

// API 응답 타입
interface LanguageToolResponse {
  matches: Array<{
    message: string;
    replacements: Array<{
      value: string;
    }>;
    offset: number;
    length: number;
    context: {
      text: string;
      offset: number;
      length: number;
    };
  }>;
}

// 언어 코드 매핑
const languageCodeMap: Record<Language, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
};

// Google Gemini API 키
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyCKolmjh-MTp9xDz5NNiDUa9OftO-6Ws2o';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// 네트워크 타임아웃 설정 (10초)
const FETCH_TIMEOUT = 10000;

// 타임아웃 기능이 있는 fetch
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = FETCH_TIMEOUT) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Gemini API를 사용해 텍스트 교정
 */
export async function correctWithGemini(text: string, language: Language): Promise<string> {
  try {
    const promptsByLanguage = {
      ko: `다음 텍스트의 문법과 맞춤법을 교정해주세요. 원문과 다른 부분만 수정하고, 교정된 전체 텍스트만 반환하세요.
      원문: "${text}"`,
      en: `Please correct the grammar and spelling in the following text. Only modify parts that need correction, and return only the corrected full text.
      Original: "${text}"`,
      ja: `次のテキストの文法と綴りを修正してください。修正が必要な部分のみを変更し、修正されたテキスト全体のみを返してください。
      原文: "${text}"`
    };

    const prompt = promptsByLanguage[language];
    
    const response = await fetchWithTimeout(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API 응답 오류:', response.status, errorData);
      
      // 에러 상태 코드에 따른 다른 메시지
      if (response.status === 429) {
        throw new Error('요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('API 인증에 실패했습니다. 관리자에게 문의하세요.');
      } else if (response.status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    
    // Gemini API 응답에서 텍스트 추출
    const correctedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text;
    return correctedText;
  } catch (error) {
    console.error('Gemini API 오류:', error);
    
    // 타임아웃 에러 처리
    if ((error as any).name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.');
    }
    
    // 다른 에러 처리
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
}

/**
 * Gemini API 응답 정리
 */
function cleanupGeminiResponse(response: string, language: Language): string {
  // 결과에서 따옴표, 마크다운 형식 등 제거
  let cleaned = response.trim();
  
  // 원문: "..." 또는 "교정된 텍스트: " 등의 접두사 제거
  const prefixesToRemove = {
    ko: ['교정된 텍스트:', '수정된 텍스트:', '결과:', '교정 결과:'],
    en: ['Corrected text:', 'Correction:', 'Result:', 'Corrected version:'],
    ja: ['修正されたテキスト:', '修正結果:', '結果:']
  };
  
  for (const prefix of prefixesToRemove[language]) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
    }
  }
  
  // 따옴표 제거
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
      (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }
  
  return cleaned;
}

/**
 * LanguageTool API를 사용해 텍스트 교정
 */
export async function correctWithLanguageTool(text: string, language: Language): Promise<string> {
  try {
    // 우선 Gemini API를 사용해 교정합니다.
    return await correctWithGemini(text, language);
  } catch (error) {
    console.error('텍스트 교정 오류:', error);
    
    // 사용자에게 보여줄 알림
    if (error instanceof Error) {
      alert(`교정 중 오류가 발생했습니다: ${error.message}`);
    } else {
      alert('교정 중 알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    }
    
    // 오류 발생 시 입력 텍스트 그대로 반환
    return text;
  }
}

/**
 * 모의 구현을 통한 텍스트 교정 (API 실패 시 폴백)
 */
function correctWithMock(text: string, language: Language): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let correctedText = text;
      
      if (language === 'ko') {
        // 한국어 교정 예시
        correctedText = correctedText.replace(/학교가 갔다/g, '학교에 갔다');
        correctedText = correctedText.replace(/밥을 먹고 싶어요/g, '밥을 먹고 싶습니다');
        correctedText = correctedText.replace(/않된다/g, '안 된다');
        correctedText = correctedText.replace(/알아보다/g, '알아보았다');
      } else if (language === 'en') {
        // 영어 교정 예시
        correctedText = correctedText.replace(/I going to/g, 'I am going to');
        correctedText = correctedText.replace(/He don't/g, 'He doesn\'t');
        correctedText = correctedText.replace(/She have/g, 'She has');
      } else if (language === 'ja') {
        // 일본어 교정 예시
        correctedText = correctedText.replace(/学校が行きました/g, '学校に行きました');
        correctedText = correctedText.replace(/本読みます/g, '本を読みます');
      }
      
      resolve(correctedText);
    }, 1000);
  });
}

/**
 * DeepL API를 사용한 텍스트 교정 (고급 버전)
 * 프리미엄 기능 구현 시 활용 가능
 */
export async function correctWithDeepL(text: string, language: Language): Promise<string> {
  // 프리미엄 기능 구현 예시
  // DeepL API 키는 환경변수에서 불러오도록 설정
  return text; // 실제 구현 전 기본값 반환
}

/**
 * GPT 모델을 사용한 고급 텍스트 교정 (유료 기능)
 */
export async function correctWithGPT(text: string, language: Language): Promise<{correctedText: string; explanation: string}> {
  // Gemini API를 활용한 교정 및 설명 (프리미엄 기능)
  try {
    const promptsByLanguage = {
      ko: `다음 텍스트의 문법과 맞춤법을 교정하고, 수정 이유에 대한 설명을 제공해주세요.
      원문: "${text}"
      다음 형식으로 반환해주세요:
      교정: [교정된 텍스트]
      설명: [교정 이유에 대한 설명]`,
      en: `Please correct the grammar and spelling in the following text, and provide an explanation for the corrections.
      Original: "${text}"
      Return in this format:
      Corrected: [corrected text]
      Explanation: [explanation of corrections]`,
      ja: `次のテキストの文法と綴りを修正し、修正理由についての説明を提供してください。
      原文: "${text}"
      次の形式で返してください:
      修正: [修正されたテキスト]
      説明: [修正理由についての説明]`
    };

    const prompt = promptsByLanguage[language];
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 1,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // 응답 파싱
    const correctionMatch = responseText.match(/교정:|Corrected:|修正:/i);
    const explanationMatch = responseText.match(/설명:|Explanation:|説明:/i);
    
    if (correctionMatch && explanationMatch) {
      const correctionStart = correctionMatch.index + correctionMatch[0].length;
      const explanationStart = explanationMatch.index;
      
      const correctedText = responseText.substring(correctionStart, explanationStart).trim();
      const explanation = responseText.substring(explanationStart + explanationMatch[0].length).trim();
      
      return {
        correctedText: cleanupGeminiResponse(correctedText, language),
        explanation
      };
    }
    
    // 파싱 실패 시 기본 응답
    return {
      correctedText: await correctWithGemini(text, language),
      explanation: '교정 내용에 대한 설명을 생성할 수 없습니다.'
    };
  } catch (error) {
    console.error('고급 교정 오류:', error);
    return {
      correctedText: text,
      explanation: '교정 서비스 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }
} 