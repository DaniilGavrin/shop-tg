import type { Metadata } from 'next';
import { Exo_2 } from 'next/font/google';
import Script from 'next/script';

import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ClientLayout } from './ClientLayout';

const cyberFont = Exo_2({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ByteWizard Shop',
  description: 'Telegram WebApp marketplace for digital products',
  verification: {
    yandex: 'd89a024f898728e2',
  },
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
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      </head>

      <body
        className={`${cyberFont.className} min-h-screen overflow-x-hidden bg-[var(--bg-deep)] text-[var(--text-main)] antialiased`}
      >
        <div id="__app" className="min-h-screen w-full flex flex-col overflow-x-hidden">
          <Script
            src="/telegram-web-app.js"
            strategy="afterInteractive"
          />

          <ClientLayout>
            {children}
          </ClientLayout>
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}