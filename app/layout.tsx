
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
  description: 'ByteWizard Shop for Telegram',
  verification: {
    yandex: 'd89a024f898728e2',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${cyberFont.className} min-h-screen overflow-x-hidden bg-[var(--bg-deep)] text-[var(--text-main)] antialiased`}
      >
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <ClientLayout>{children}</ClientLayout>

        {/* Аналитика — в конце body, после контента */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
