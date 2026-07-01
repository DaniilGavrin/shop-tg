import { ScreenTitle } from '../../components/ScreenTitle';
import { getCatalog } from '../../lib/api';
import { CatalogGrid } from '../../components/CatalogGrid';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale !== 'en';
  return {
    title: isRu ? 'Каталог услуг — ByteWizard Shop' : 'Services Catalog — ByteWizard Shop',
    description: isRu
      ? 'Полный каталог цифровых услуг: разработка сайтов, мобильных приложений, ботов, автоматизация бизнеса.'
      : 'Full catalog of digital services: website development, mobile apps, bots, business automation.',
  };
}

export default async function CatalogPage() {
  const data = await getCatalog();
  return (
    <>
      <ScreenTitle>Каталог</ScreenTitle>
      <CatalogGrid items={data.items} />
    </>
  );
}