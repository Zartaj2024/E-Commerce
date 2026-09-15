export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  fabric: string | null;
  color: string | null;
  size: string | null;
  price_modifier: number;
  stock_quantity: number;
  sku: string | null;
}

export interface ProductWithDetails extends Product {
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}

export interface ProductFilters {
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
}
