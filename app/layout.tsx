
import { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: 'ByteWizard Shop',
  description: 'Mini App for Telegram',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] font-sans antialiased">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        {children}

        {/* Аналитика — в конце body, после контента */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
