// 지원하는 언어 타입
export type Language = 'ko' | 'en' | 'ja';

// 프리미엄 기능 상태
export type PremiumStatus = 'free' | 'premium';

// 사용자 상태
export interface UserStatus {
  correctionCount: number; // 오늘 사용한 교정 횟수
  premiumStatus: PremiumStatus;
  lastUsed: string; // ISO 날짜 문자열
}

// 교정 결과 타입
export interface CorrectionResult {
  originalText: string;
  correctedText: string;
  explanation?: string; // 프리미엄 기능
  language: Language;
  timestamp: string; // ISO 날짜 문자열
} 