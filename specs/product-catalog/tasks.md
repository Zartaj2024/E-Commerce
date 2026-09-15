# Tasks — Product Catalog

## Database
- [ ] 1. Write SQL schema for products, product_images, product_variants (specs/product-catalog/sql/001_schema.sql)
- [ ] 2. Write seed data SQL (specs/product-catalog/sql/002_seed.sql)
- [ ] 3. Run schema + seed in Supabase

## Domain layer
- [ ] 4. Create /lib/domain/product.ts with types
- [ ] 5. Create /lib/validation/productSchema.ts with Zod schemas

## Data access layer
- [ ] 6. Create /lib/repositories/productRepository.ts with getProducts, getProductBySlug

## Server actions
- [ ] 7. Create /actions/catalog.ts with getProducts, getProductBySlug actions

## UI components
- [ ] 8. Create /components/ui/Button.tsx
- [ ] 9. Create /components/ui/Badge.tsx
- [ ] 10. Create /components/ui/EmptyState.tsx
- [ ] 11. Create /components/product/ProductCard.tsx
- [ ] 12. Create /components/product/ProductGrid.tsx
- [ ] 13. Create /components/product/VariantPicker.tsx
- [ ] 14. Create /components/product/ProductGallery.tsx
- [ ] 15. Create /components/layout/Header.tsx
- [ ] 16. Create /components/layout/Footer.tsx

## Pages
- [ ] 17. Create /app/(shop)/layout.tsx (ShopLayout)
- [ ] 18. Create /app/(shop)/products/page.tsx (catalog)
- [ ] 19. Create /app/(shop)/products/[slug]/page.tsx (detail)
- [ ] 20. Move home page into (shop) layout
- [ ] 21. Update root layout to remove direct home page wrapper

## Verification
- [ ] 22. Run npm run typecheck — zero errors
- [ ] 23. Run npm run lint — zero errors
- [ ] 24. Run npm run build — succeeds
