import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  verification: {
    yandex: '2690b0d0f79c5b4c',
  },
};

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}