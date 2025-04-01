'use client';

import { UserStatus, PremiumStatus, CorrectionResult } from '@/types/common';

const USER_KEY = 'grammafixer_user';
const HISTORY_KEY = 'grammafixer_history';

// 기본 무료 사용자 제한
const FREE_DAILY_LIMIT = 20;

/**
 * 사용자 상태 조회
 */
export function getUserStatus(): UserStatus {
  if (typeof window === 'undefined') {
    return {
      correctionCount: 0,
      premiumStatus: 'free',
      lastUsed: new Date().toISOString().split('T')[0],
    };
  }

  try {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) {
      return {
        correctionCount: 0,
        premiumStatus: 'free',
        lastUsed: new Date().toISOString().split('T')[0],
      };
    }

    const user: UserStatus = JSON.parse(stored);
    
    // 날짜가 바뀌었으면 카운트 리셋
    const today = new Date().toISOString().split('T')[0];
    if (user.lastUsed !== today) {
      user.correctionCount = 0;
      user.lastUsed = today;
      saveUserStatus(user);
    }
    
    return user;
  } catch (error) {
    console.error('사용자 상태 로드 오류:', error);
    return {
      correctionCount: 0, 
      premiumStatus: 'free',
      lastUsed: new Date().toISOString().split('T')[0],
    };
  }
}

/**
 * 사용자 상태 저장
 */
export function saveUserStatus(user: UserStatus): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('사용자 상태 저장 오류:', error);
  }
}

/**
 * 교정 횟수 증가
 */
export function incrementCorrectionCount(): boolean {
  const user = getUserStatus();
  
  // 프리미엄 사용자는 무제한
  if (user.premiumStatus === 'premium') {
    return true;
  }
  
  // 무료 사용자는 일일 제한 적용
  if (user.correctionCount >= FREE_DAILY_LIMIT) {
    return false;
  }
  
  user.correctionCount += 1;
  saveUserStatus(user);
  return true;
}

/**
 * 남은 교정 횟수 확인
 */
export function getRemainingCorrections(): number {
  const user = getUserStatus();
  
  if (user.premiumStatus === 'premium') {
    return Infinity;
  }
  
  return Math.max(0, FREE_DAILY_LIMIT - user.correctionCount);
}

/**
 * 교정 이력 가져오기
 */
export function getCorrectionHistory(): CorrectionResult[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) {
      return [];
    }
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('교정 이력 로드 오류:', error);
    return [];
  }
}

/**
 * 교정 이력 저장
 */
export function saveCorrectionHistory(history: CorrectionResult[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    // 최대 50개까지만 저장
    const limitedHistory = history.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('교정 이력 저장 오류:', error);
  }
}

/**
 * 새 교정 결과 추가
 */
export function addCorrectionResult(result: CorrectionResult): void {
  const history = getCorrectionHistory();
  history.unshift(result); // 최신 항목을 맨 앞에 추가
  saveCorrectionHistory(history);
} 