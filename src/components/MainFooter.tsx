import Link from 'next/link';

export default function MainFooter() {
  return (
    <footer className="mt-auto py-6 border-t">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AI 문장 교정기. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
              개인정보 처리방침
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
              이용약관
            </Link>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-400 text-center md:text-left">
          AI 문장 교정기는 언어 교정 서비스를 제공하며, 일부 기능은 제한될 수 있습니다. 교정 결과는 참고용으로만 사용하세요.
        </div>
      </div>
    </footer>
  );
} 