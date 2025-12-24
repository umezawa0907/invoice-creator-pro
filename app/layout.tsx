import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '請求書さくっと - 無料で簡単に請求書作成',
    template: '%s | 請求書さくっと',
  },
  description: '会員登録不要で請求書を無料で作れます。源泉徴収税の自動計算・適格請求書対応。個人情報はあなたのPC・スマホにのみ暗号化して保存する仕様だから安心。',
  keywords: '請求書, フリーランス, クリエイター, 源泉徴収, インボイス, 無料, 会員登録不要, 請求書作成, 税金計算, 適格請求書',
  authors: [{ name: '請求書さくっと' }],
  creator: '請求書さくっと',
  publisher: '請求書さくっと',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://invoice-sakutto.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '請求書さくっと - 無料で簡単に請求書作成',
    description: '会員登録不要で請求書を無料で作れます。源泉徴収税の自動計算・適格請求書対応。',
    url: 'https://invoice-sakutto.com',
    siteName: '請求書さくっと',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '請求書さくっと - 無料で簡単に請求書作成',
    description: '会員登録不要で請求書を無料で作れます。源泉徴収税の自動計算・適格請求書対応。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
