'use client';

import { ScreenTitle } from '../../components/ScreenTitle';
import { useTranslation } from '../../lib/i18n/useTranslation';

export default function CartPage() {
  const { t } = useTranslation();
  return <ScreenTitle>{t.nav.cart}</ScreenTitle>;
}