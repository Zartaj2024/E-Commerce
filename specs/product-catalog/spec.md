# Spec — Product Catalog

## User stories

1. As a visitor, I can browse a grid of products so I can discover what the brand offers.
2. As a visitor, I can filter products by category so I can narrow my browse to shawls, kurtas, home, etc.
3. As a visitor, I can click a product card to see its full detail page.
4. As a visitor, on the product detail page I can see multiple images, pick a variant (fabric/color/size), and see the computed price.
5. As a visitor, I can see stock availability for the selected variant.

## Functional requirements

- Products page (`/products`) shows a grid of active products with name, price, and thumbnail.
- Category filter is available (sidebar on desktop, collapsible on mobile).
- Clicking a card navigates to `/products/[slug]`.
- Product detail page shows image gallery, variant picker (tappable swatches), price, description, and stock status.
- Price is computed as `base_price + variant.price_modifier`.
- Only active products appear on the catalog. Inactive products return 404 on detail.
- Products and product detail pages are server-rendered (RSC) for SEO.
- Images use `next/image` with proper alt text.

## Success criteria

- A visitor can browse the catalog and reach a product detail page in ≤ 2 clicks.
- Product detail page shows correct price for any variant combination.
- Page loads under 2.5s LCP on a 3G throttle.
- All images have alt text.

## Edge cases

- Empty catalog (no active products) → friendly empty state.
- Product with no variants → show base price, disable add-to-cart.
- Slug not found → 404 page.
- Image load failure → fallback placeholder.
