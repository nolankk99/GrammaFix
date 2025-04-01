'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { getUserStatus, saveUserStatus } from '@/lib/userService';

export default function PremiumUpgrade() {
  const [showModal, setShowModal] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  
  const premiumFeatures = [
    '무제한 교정 서비스',
    '상세한 교정 이유 설명',
    '전문 분야별 맞춤 교정',
    '교정 내용 다운로드'
  ];
  
  const handleUpgrade = () => {
    // 실제 결제 구현 대신 모의 결제 성공 시뮬레이션
    setTimeout(() => {
      // 사용자 상태 업데이트
      const user = getUserStatus();
      user.premiumStatus = 'premium';
      saveUserStatus(user);
      
      setUpgradeSuccess(true);
      
      // 3초 후 모달 닫기
      setTimeout(() => {
        setShowModal(false);
        // 페이지 새로고침
        window.location.reload();
      }, 3000);
    }, 1500);
  };
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-md"
      >
        <Sparkles className="h-4 w-4" />
        <span>프리미엄으로 업그레이드</span>
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              disabled={upgradeSuccess}
            >
              <X className="h-5 w-5" />
            </button>
            
            {upgradeSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">업그레이드 완료!</h3>
                <p className="text-gray-600">
                  프리미엄 기능이 활성화되었습니다.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <Sparkles className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">프리미엄으로 업그레이드</h3>
                  <p className="text-gray-500 mt-1">무제한 교정과 고급 기능을 사용하세요</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">프리미엄 혜택</h4>
                  <ul className="space-y-2">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">월간 구독</span>
                    <span className="font-bold">₩5,900/월</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    언제든지 해지 가능, 첫 7일 무료 체험
                  </p>
                </div>
                
                <button
                  onClick={handleUpgrade}
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all font-medium"
                >
                  지금 업그레이드하기
                </button>
                
                <p className="text-xs text-gray-400 mt-4 text-center">
                  구독은 7일 무료 체험 후 자동으로 갱신됩니다.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
} 