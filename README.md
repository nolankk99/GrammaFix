# AI 문장 교정기 (GrammaFix)

AI를 활용한 다국어 문장 교정 서비스입니다. 한국어, 영어, 일본어 텍스트의 맞춤법, 문법을 자동으로 교정해 드립니다.

## 주요 기능

- 한국어, 영어, 일본어 텍스트 교정 지원
- Google Gemini AI 모델을 활용한 고품질 교정
- 다국어 인터페이스 지원 (한국어, 영어, 일본어)
- 오프라인 상태 감지 및 대응
- 히스토리 기능으로 이전 교정 내역 확인

## 기술 스택

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **AI Model**: Google Gemini AI
- **기타 도구**: i18n (다국어 지원)

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 방법

```bash
# 저장소 복제
git clone https://github.com/nolankk99/GrammaFix.git
cd GrammaFix

# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## 라이선스

MIT License
