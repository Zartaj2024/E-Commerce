# Plan — Product Catalog

## Data model

```ts
// /lib/domain/product.ts
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  sort_order: number;
}

interface ProductVariant {
  id: string;
  product_id: string;
  fabric: string | null;
  color: string | null;
  size: string | null;
  price_modifier: number;
  stock_quantity: number;
  sku: string | null;
}

// Computed type for detail page
interface ProductWithDetails extends Product {
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}
```

## API contracts (Server Actions)

```ts
// Read-only, no auth needed for catalog browsing
getProducts(filters: { category?: string; page?: number; pageSize?: number })
  → { products: Product[]; total: number }

getProductBySlug(slug: string)
  → ProductWithDetails | null
```

## Component structure

```
src/components/
  ui/
    Button.tsx          → Reusable button (primary/secondary variants)
    Badge.tsx           → Status badge pill
    EmptyState.tsx      → Friendly empty state component
  product/
    ProductCard.tsx     → Card with image, name, price, stitch hover
    ProductGrid.tsx     → Grid layout for catalog
    VariantPicker.tsx   → Tappable swatch picker for fabric/color/size
    ProductGallery.tsx  → Image gallery with thumbnails
  layout/
    Header.tsx          → Site header with nav
    Footer.tsx          → Site footer
    ShopLayout.tsx      → Shared layout wrapping (shop) route group
```

## Page structure

```
src/app/(shop)/
  layout.tsx                        → ShopLayout (Header + main + Footer)
  products/page.tsx                 → ProductsPage (RSC, fetches via server action)
  products/[slug]/page.tsx          → ProductDetailPage (RSC, fetches via server action)
```

## Database

- Tables: `products`, `product_images`, `product_variants`
- RLS: Public read for active products. Admin write only.
- Indexes: `products(category)`, `products(slug)` unique, `product_variants(product_id)`

## File map

| File | Responsibility |
|---|---|
| `src/lib/domain/product.ts` | TypeScript types |
| `src/lib/validation/productSchema.ts` | Zod schemas for filters |
| `src/lib/repositories/productRepository.ts` | Supabase queries |
| `src/actions/catalog.ts` | Server actions (thin) |
| `src/components/ui/Button.tsx` | Button component |
| `src/components/ui/Badge.tsx` | Badge component |
| `src/components/ui/EmptyState.tsx` | Empty state |
| `src/components/product/ProductCard.tsx` | Product card |
| `src/components/product/ProductGrid.tsx` | Grid layout |
| `src/components/product/VariantPicker.tsx` | Variant swatches |
| `src/components/product/ProductGallery.tsx` | Image gallery |
| `src/components/layout/Header.tsx` | Header |
| `src/components/layout/Footer.tsx` | Footer |
| `src/app/(shop)/layout.tsx` | Shop layout |
| `src/app/(shop)/products/page.tsx` | Catalog page |
| `src/app/(shop)/products/[slug]/page.tsx` | Detail page |
| `specs/product-catalog/sql/001_schema.sql` | Database schema |
| `specs/product-catalog/sql/002_seed.sql` | Seed data |
