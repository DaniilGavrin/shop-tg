import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  verification: {
    yandex: 'd89a024f898728e2',
  },
};

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}