import './globals.css';

export const metadata = {
  title: 'ByteWizard Shop',
  description: 'Mini App for Telegram',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[var(--tg-bg)] text-[var(--tg-text)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}