import type { ReactNode } from 'react';


type ScreenTitleProps = {
  children: ReactNode;
};

export function ScreenTitle({ children }: ScreenTitleProps) {
  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold text-gradient-neon">{children}</h1>
    </header>
  );
}
