export type CatalogItem = {
  id: number;
  name: string;
  base_price_rub: number;
  slug: string;
  category: string;
  preview_image: string | null;
};

export type CatalogResponse = {
  items: CatalogItem[];
};