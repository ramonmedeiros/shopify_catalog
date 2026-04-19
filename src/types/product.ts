export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  currency_code: string;
  available: boolean;
  options?: Record<string, string>;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  handle?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  shop?: {
    name: string;
    domain: string;
  };
  rating?: {
    value: number;
    count: number;
  };
  price_range?: {
    min: string;
    max: string;
    currency_code: string;
  };
}
