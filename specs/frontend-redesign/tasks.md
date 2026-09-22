# Tasks — Frontend Redesign: Seamless Transitions, Interactions & Best Practices

## Setup

- [ ] 1. `npm install motion` — add animation library
- [ ] 2. Verify `motion/react` import works in a test component

## Global styles

- [ ] 3. Add shimmer `@keyframes` to `globals.css` for skeleton loaders
- [ ] 4. Add `scroll-behavior: smooth` to `globals.css`
- [ ] 5. Add skip-to-content utility styles to `globals.css`

## New UI components

- [ ] 6. Create `src/components/ui/Skeleton.tsx` — base skeleton with shimmer
- [ ] 7. Create `src/components/ui/RevealSection.tsx` — scroll-reveal wrapper
- [ ] 8. Create `src/components/product/ProductCardSkeleton.tsx` — product card skeleton

## Navigation redesign

- [ ] 9. Create `src/components/layout/MobileMenu.tsx` — full-screen mobile nav overlay
- [ ] 10. Rewrite `src/components/layout/HeaderClient.tsx` — floating pill + hamburger + Motion
- [ ] 11. Update `src/components/layout/Header.tsx` — pass required props for mobile menu

## Footer redesign

- [ ] 12. Rewrite `src/components/layout/Footer.tsx` — 3-column + newsletter + scroll reveal

## Component upgrades

- [ ] 13. Upgrade `src/components/ui/Button.tsx` — Motion whileHover/whileTap, shadow
- [ ] 14. Upgrade `src/components/ui/Badge.tsx` — subtle shadow
- [ ] 15. Upgrade `src/components/ui/EmptyState.tsx` — subtle animation
- [ ] 16. Upgrade `src/components/product/ProductCard.tsx` — Motion entry + hover effects
- [ ] 17. Upgrade `src/components/product/ProductGallery.tsx` — AnimatePresence image transitions
- [ ] 18. Upgrade `src/components/cart/CartItem.tsx` — AnimatePresence remove animation
- [ ] 19. Upgrade `src/components/cart/CartSummary.tsx` — transition on total change

## Home page

- [ ] 20. Rewrite `src/app/(shop)/page.tsx` — hero + featured products + brand statement + CTA

## Loading states

- [ ] 21. Create `src/app/(shop)/loading.tsx` — shop skeleton
- [ ] 22. Create `src/app/(shop)/products/[slug]/loading.tsx` — product detail skeleton
- [ ] 23. Create `src/app/account/loading.tsx` — account skeleton
- [ ] 24. Create `src/app/admin/loading.tsx` — admin skeleton

## Error states

- [ ] 25. Create `src/app/(shop)/error.tsx` — shop error boundary
- [ ] 26. Create `src/app/account/error.tsx` — account error boundary
- [ ] 27. Create `src/app/admin/error.tsx` — admin error boundary

## 404 page

- [ ] 28. Create `src/app/not-found.tsx` — branded 404

## Layout updates

- [ ] 29. Update `src/app/(shop)/layout.tsx` — add skip-to-content link
- [ ] 30. Update `src/app/layout.tsx` — add skip-to-content link

## Type safety

- [ ] 31. Fix `any` types in `src/app/account/custom-orders/page.tsx`
- [ ] 32. Fix `any` types in `src/app/admin/orders/[id]/page.tsx`
- [ ] 33. Fix `any` types in `src/actions/admin.ts`
- [ ] 34. Fix `any` types in `src/components/custom-order/CustomOrderForm.tsx`

## Design doc update

- [ ] 35. Update `embroidery-ecommerce-design-doc.md` Section 7 — document expanded motion system

## Verification

- [ ] 36. `npm run typecheck` — zero errors
- [ ] 37. `npm run lint` — zero errors
- [ ] 38. `npm run build` — succeeds
- [ ] 39. Manual test: mobile nav opens/closes correctly
- [ ] 40. Manual test: all scroll reveals fire once and stop
- [ ] 41. Manual test: `prefers-reduced-motion` disables all animations
- [ ] 42. Manual test: error boundaries catch and display errors
- [ ] 43. Manual test: 404 page renders and links back to shop
