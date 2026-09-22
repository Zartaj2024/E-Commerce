# Spec — Frontend Redesign: Seamless Transitions, Interactions & Best Practices

## User stories

1. As a visitor, I experience smooth page transitions when navigating between routes so the site feels cohesive and premium.
2. As a visitor, I see content animate into view as I scroll so the page feels alive and guided.
3. As a visitor, I get visual feedback (hover, press, focus) on every interactive element so I know what's clickable.
4. As a visitor on mobile, I can open a navigation menu via hamburger icon so I can access all routes on small screens.
5. As a visitor, I see skeleton loaders while content loads so I'm not staring at a blank page.
6. As a visitor, if something goes wrong I see a clear error message with a retry option so I'm not stuck.
7. As a visitor, I see a branded 404 page when I hit a missing route so I can find my way back.
8. As a visitor, the home page showcases featured products and the brand story so I understand what Suti & Thread offers.
9. As a visitor with `prefers-reduced-motion`, all animations are disabled so the site is still comfortable to use.
10. As a returning visitor, the cart badge animates when items are added so I get confirmation of my action.
11. As a visitor, product cards have depth and hover effects so the catalog feels tactile.
12. As a visitor, the footer provides navigation links, contact info, and a newsletter signup so I can stay connected.

## Functional requirements

### Navigation (Header)

- Desktop: floating glass-pill nav with backdrop-blur, detached from viewport top.
- Mobile (<768px): hamburger icon that morphs to X via Motion rotation.
- Mobile menu: full-screen overlay with staggered link reveal (each link slides up with 50ms delay).
- Active page indicated by Peacock accent (underline or dot).
- Cart badge: scale bounce animation (spring physics) when count changes.
- Nav background gains opacity on scroll (not sticky, floating).
- All nav links render on a single line at desktop (1024px+).
- Nav height cap: 80px max desktop, default 64-72px.

### Home page

- Hero: split-screen layout (text left 60%, product image right 40%) on desktop; vertical stack on mobile.
- Hero text: staggered word-by-word reveal using Motion `whileInView`.
- Hero: `min-h-[100dvh]` (not `h-screen`).
- Hero max 4 text elements: eyebrow (optional), headline (max 2 lines), subtext (max 20 words), CTA.
- Featured products: "Selected pieces" heading, staggered card entry (60ms delay between cards).
- Brand statement: large display text, editorial feel, no image needed.
- Custom order CTA: split layout with magnetic hover button.

### Scroll reveals

- Content sections use `whileInView` with `viewport={{ once: true }}` for entrance animations.
- Staggered children: cards, list items, features enter with cascading delay.
- Fade-up pattern: `opacity: 0, y: 24` to `opacity: 1, y: 0` over 600ms with cubic-bezier easing.
- Applied to: home page sections, product grid, about page, footer links.
- Disabled entirely under `prefers-reduced-motion`.

### Hover and press micro-interactions

- Buttons: `whileHover={{ scale: 1.02 }}` spring, `whileTap={{ scale: 0.98 }}` on press.
- Primary buttons: subtle shadow lift on hover.
- Product cards: shadow lift + image scale 1.08 on hover, running-stitch dashed border animates in.
- Variant picker pills: scale + color transition on hover/active.
- Nav links: underline slide-in on hover (CSS transition, not Motion).

### Page transitions

- Content fade-in on route change (subtle 200ms opacity transition).
- Loading states shown during async navigations.

### Loading states (skeleton loaders)

- Base `Skeleton.tsx` component with shimmer animation (gradient sweep).
- `ProductCardSkeleton.tsx`: matches ProductCard layout (image placeholder + text lines).
- Route-level `loading.tsx` files:
  - `(shop)/loading.tsx`: header + grid of ProductCardSkeleton.
  - `account/loading.tsx`: sidebar + content placeholder.
  - `admin/loading.tsx`: sidebar + stat box placeholders.
  - `(shop)/products/[slug]/loading.tsx`: gallery + info skeleton.

### Error states

- Route-level `error.tsx` files (client components with reset function):
  - `(shop)/error.tsx`
  - `account/error.tsx`
  - `admin/error.tsx`
- Branded error message with retry button.
- No `window.alert()` — inline error display.

### 404 page

- `src/app/not-found.tsx`: branded with Fraunces heading, helpful message, link back to shop.
- Subtle decorative stitch element (CSS only, no image).

### Footer

- 3-column desktop: Brand + tagline | Quick links | Contact/newsletter.
- Single column on mobile.
- Newsletter signup form (visual only, styled input + button).
- Bottom bar: copyright + legal links.
- Footer links get subtle hover underline animation.
- Footer fades in on scroll (sticky reveal pattern from Motion).

### Cart interactions

- `CartItem`: `AnimatePresence` for add/remove with slide-out animation.
- Quantity change: subtle scale pulse on number.
- Remove: item slides left and fades out.
- Empty state: floating animation on illustration.

### Accessibility

- Skip-to-content link (hidden, keyboard accessible).
- Focus-visible rings (Peacock outline) on all interactive elements.
- Proper heading hierarchy (h1 -> h2 -> h3).
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`.
- ARIA labels on icon-only buttons.
- All animations respect `prefers-reduced-motion`.
- WCAG AA contrast on all text.

### Typography and spacing

- `text-wrap: balance` on all headings.
- Body text max-width 65ch.
- Section padding minimum `py-20` (80px).
- Letter-spacing: tighter on display headings.
- Heading scale: 14/16/20/28/40/56px per design doc.

### Code quality

- Remove all `any` types (4+ files identified).
- No inline styles — all styling via Tailwind classes.
- One component per file.
- `'use client'` only when hooks/events needed.
- Import `motion` from `motion/react` (not `framer-motion`).

## Success criteria

- All pages load under 2.5s LCP on 3G throttle.
- Zero `any` types in codebase.
- `npm run typecheck` passes with zero errors.
- `npm run lint` passes with zero errors.
- `npm run build` succeeds.
- All animations disabled under `prefers-reduced-motion`.
- Mobile nav works correctly at 320px-428px viewport.
- Every interactive element has hover + focus-visible states.
- Loading skeletons appear for all data-fetching routes.
- Error states recoverable via retry button.
- 404 page branded and navigable.
- Skip-to-content link present and functional.
- All images have meaningful alt text.

## Edge cases

- Motion package not installed: install first, verify import works.
- Server components cannot use Motion: wrap animation in Client Component wrappers.
- AnimatePresence on cart items with rapid add/remove: debounce or queue.
- Mobile menu open + scroll: lock body scroll.
- Skeleton loader flash (content loads too fast): minimum 300ms display.
- Error boundary catching non-error throws: only catch rendering errors.
- 3D thread hero (per design doc): defer to later phase, use static fallback for now.
- Reduced motion + skeleton shimmer: disable shimmer, show static placeholder.
