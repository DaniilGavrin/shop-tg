import type { ReactNode } from 'react';
export function ScreenTitle({ children }: { children: ReactNode }) {
  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
        {children}
      </h1>
    </header>
  );
}