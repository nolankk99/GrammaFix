import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider } from "@/lib/LanguageContext";
import { MetadataProvider } from "@/lib/MetadataContext";
import MainFooter from '@/components/MainFooter';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI 문장 교정기 - 맞춤법과 문법 오류를 수정하세요',
  description: '맞춤법, 문법 오류를 AI가 자동으로 교정해주는 서비스입니다. 한국어, 영어, 일본어를 지원합니다.',
  keywords: '맞춤법, 문법 교정, AI 교정, 문장 교정, 영어 교정, 일본어 교정, 한국어 교정',
  authors: [{ name: 'AI Grammar Fixer Team' }],
  openGraph: {
    title: 'AI 문장 교정기 - 맞춤법과 문법 오류를 수정하세요',
    description: '맞춤법, 문법 오류를 AI가 자동으로 교정해주는 서비스입니다. 한국어, 영어, 일본어를 지원합니다.',
    url: 'https://grammafixer.vercel.app',
    siteName: 'AI 문장 교정기',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 문장 교정기 - 맞춤법과 문법 오류를 수정하세요',
    description: '맞춤법, 문법 오류를 AI가 자동으로 교정해주는 서비스입니다.',
  },
  creator: 'AI 문장 교정기 팀',
  alternates: {
    languages: {
      'ko': 'https://grammafixer.vercel.app',
      'en': 'https://grammafixer.vercel.app?lang=en',
      'ja': 'https://grammafixer.vercel.app?lang=ja',
    },
  },
  verification: {
    google: 'SxzULmUVpWNorVEp5hd3rAMtuH_oXmQpxd-LdSZUsN8',
    yandex: 'b26cb632570ea2fb',
    other: {
      'naver-site-verification': 'naverd3ac23819bb1d26a6cb50281f185e5e1',
      'msvalidate.01': '900DC9F12AAD145614A53C291EA6A419'
    }
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5138554444834908"
          crossOrigin="anonymous"
        />
        <meta name="google-site-verification" content="SxzULmUVpWNorVEp5hd3rAMtuH_oXmQpxd-LdSZUsN8" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <LanguageProvider>
          <MetadataProvider>
            <div className="flex-grow">
              {children}
            </div>
            <MainFooter />
          </MetadataProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
