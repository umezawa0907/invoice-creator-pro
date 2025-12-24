import type { Metadata } from 'next';
import Script from 'next/script';
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
  metadataBase: new URL('https://sakutto-app.jp'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '請求書さくっと - 無料で簡単に請求書作成',
    description: '会員登録不要で請求書を無料で作れます。源泉徴収税の自動計算・適格請求書対応。',
    url: 'https://sakutto-app.jp',
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
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TRSB5ZV4');`}
        </Script>
        {/* End Google Tag Manager */}
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TRSB5ZV4"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {children}
      </body>
    </html>
  );
}
