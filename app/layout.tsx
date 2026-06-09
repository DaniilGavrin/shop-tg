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

        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --bg-deep: #05020a;
            --bg-surface: #130a24;
            --bg-surface-glass: rgba(19, 10, 36, 0.85);
            --neon-purple: #b026ff;
            --neon-pink: #ff007f;
            --neon-blue: #00f0ff;
            --text-main: #f3e8ff;
            --text-dim: #8b5cf6;
            --glow-purple: 0 0 10px rgba(176, 38, 255, 0.7), 0 0 25px rgba(176, 38, 255, 0.4);
            --glow-pink: 0 0 10px rgba(255, 0, 127, 0.7), 0 0 25px rgba(255, 0, 127, 0.4);
          }
          *, *::before, *::after { box-sizing: border-box; }
          html { min-height: 100%; width: 100%; margin: 0; padding: 0; overflow-x: hidden; background: var(--bg-deep); }
          body { min-height: 100%; width: 100%; max-width: 100%; margin: 0; padding: 0; background: var(--bg-deep); color: var(--text-main); overflow-x: hidden; overflow-y: auto; -webkit-overflow-scrolling: touch; }
          button, input, textarea, select { font: inherit; }
          .app-shell { min-height: 100svh; width: 100%; overflow-x: hidden; background: linear-gradient(180deg, rgba(176, 38, 255, 0.1), transparent 180px), linear-gradient(160deg, rgba(0, 240, 255, 0.08), transparent 42%), var(--bg-deep); padding: 20px 0 0; }
          .app-content { width: 100%; min-height: calc(100svh - 84px); padding-left: 16px; padding-right: 16px; padding-bottom: calc(118px + env(safe-area-inset-bottom, 0px)); margin: 0 auto; }
          .text-gradient-neon { background: linear-gradient(135deg, var(--neon-purple), var(--neon-pink), var(--neon-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 30px rgba(176, 38, 255, 0.5); }
          .avatar-neon { position: relative; border-radius: 9999px; padding: 2px; background: linear-gradient(135deg, var(--neon-purple), var(--neon-pink)); box-shadow: var(--glow-purple); }
          .safe-area-pb { padding-bottom: env(safe-area-inset-bottom, 0px); }
        `}} />
      </head>

      <body
        className={`${cyberFont.className} min-h-screen overflow-x-hidden bg-[var(--bg-deep)] text-[var(--text-main)] antialiased`}
      >
        {/* Telegram SDK НЕ критичен */}
        <Script
          src="/telegram-web-app.js"
          strategy="afterInteractive"
        />

        <ClientLayout>
          {children}
        </ClientLayout>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}