import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ByteWizard Shop',
  description: 'Mini App for Telegram',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}