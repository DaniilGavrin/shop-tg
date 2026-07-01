export type DeliveryInfo = {
  base_days: number;
  min_days: number;
  avg_days: number;
  max_days: number;
  complex_days: number | null;
};

export type PricingInfo = {
  currency: 'RUB' | 'USD' | 'EUR';
  base_price: number;
  hourly_rate: number | null;
  hourly_support_rate: number | null;
  setup_fee: number;
};

export type ConfigFieldOption = {
  label: string;
  value: string;
  price_modifier?: number;
  delivery_days_modifier?: number;
  description?: string;
};

export type ConfigField = {
  type: 'select' | 'multiselect' | 'checkbox' | 'textarea' | 'number';
  label: string;
  description?: string;
  default?: string | number | boolean | string[];
  required?: boolean;
  options?: ConfigFieldOption[];
  min?: number;
  max?: number;
  price_per_unit?: number;
  price_modifier?: number;
  delivery_days_modifier?: number; 
};

export type ProductMetadata = {
  stack: string[];
  pricing: PricingInfo;
  delivery: DeliveryInfo;
  features: string[];
  config_schema: Record<string, ConfigField>;
};

export type CatalogItem = {
  id: number;
  name: string;
  short_description: string;
  description: string;
  base_price_rub: number;
  category: string;
  preview_image: string | null;
  is_configurable: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_hidden: boolean;
  sort_order: number;
  slug: string;
  type: string;
  metadata: ProductMetadata;
  created_at: string;
  updated_at: string;
};

export type CatalogResponse = {
  items: CatalogItem[];
};