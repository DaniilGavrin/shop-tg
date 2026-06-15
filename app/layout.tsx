import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { YandexMetrika } from './components/YandexMetrica';

import { ClientLayout } from './ClientLayout';

import '@fontsource/exo-2/400.css';
import '@fontsource/exo-2/500.css';
import '@fontsource/exo-2/600.css';
import '@fontsource/exo-2/700.css';
import '@fontsource/exo-2/cyrillic.css';

export const metadata: Metadata = {
  title: 'ByteWizard Shop',
  description: 'Telegram WebApp marketplace for digital products',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ByteWizard',
  },
  verification: {
    yandex: 'd89a024f898728e2',
  },
};

export const viewport: Viewport = {
  themeColor: '#05020a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        <meta name="theme-color" content="#05020a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ByteWizard" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>

      <body className="min-h-screen overflow-x-hidden bg-[var(--bg-deep)] text-[var(--text-main)] antialiased">
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
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}