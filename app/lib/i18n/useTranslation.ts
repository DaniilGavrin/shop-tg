'use client';

import { usePathname } from 'next/navigation';
import { dictionaries } from './dictionaries';

export function useTranslation() {
  const pathname = usePathname();

  const locale = pathname.split('/')[1] as keyof typeof dictionaries || 'ru';

  const t = dictionaries[locale] ?? dictionaries.ru;

  return { t, locale };
}