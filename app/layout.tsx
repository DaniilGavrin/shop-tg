import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { YandexMetrika } from './components/YandexMetrica';
import { ClientLayout } from './ClientLayout';

export const metadata: Metadata = {
  title: 'ByteWizard Shop',
  description: 'Telegram WebApp marketplace for digital products',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'ByteWizard' },
  verification: { yandex: 'd89a024f898728e2' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Скрипт темы — синхронно, чтобы не было вспышки */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('bw_theme');
                  if (theme === 'light') document.documentElement.classList.add('light');
                } catch(e) {}
              })();
            `,
          }}
        />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen overflow-x-hidden antialiased">
        <div id="__app" className="min-h-screen w-full flex flex-col overflow-x-hidden">
          <Script src="/telegram-web-app.js" strategy="afterInteractive" />
          <ClientLayout>{children}</ClientLayout>
        </div>
        <Analytics />
        <SpeedInsights />
        <YandexMetrika />
        <Script
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}