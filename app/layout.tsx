import type { Metadata } from 'next';
import Script from 'next/script';

import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ClientLayout } from './ClientLayout';

import '@fontsource/exo-2/400.css';
import '@fontsource/exo-2/500.css';
import '@fontsource/exo-2/600.css';
import '@fontsource/exo-2/700.css';
import '@fontsource/exo-2/cyrillic.css';

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
      </head>

      <body className="min-h-screen overflow-x-hidden bg-[var(--bg-deep)] text-[var(--text-main)] antialiased">
        <div id="__app" className="min-h-screen w-full flex flex-col overflow-x-hidden">
          <Script src="/telegram-web-app.js" strategy="afterInteractive" />
          <ClientLayout>{children}</ClientLayout>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}