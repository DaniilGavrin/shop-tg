import { ScreenTitle } from '../../components/ScreenTitle';
import { getCatalog } from '../../lib/api';
import { CatalogGrid } from '../../components/CatalogGrid';

export default async function CatalogPage() {
  const data = await getCatalog();

  return (
    <>
      <ScreenTitle>Каталог</ScreenTitle>
      <CatalogGrid items={data.items} />
    </>
  );
}