export interface ProductMedia {
  url: string;
  altText?: string;
}

export interface ProductVariant {
  id: string;
  displayName?: string;
  availableForSale?: boolean;
  price?: {
    amount: number;
    currency: string;
  };
  media?: ProductMedia[];
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  uniqueSellingPoint?: string;
  media?: ProductMedia[];
  priceRange?: {
    min: { amount: number; currency: string };
    max: { amount: number; currency: string };
  };
  rating?: {
    rating: number;
    count: number;
  };
  variants?: ProductVariant[];
  lookupUrl?: string;
}
