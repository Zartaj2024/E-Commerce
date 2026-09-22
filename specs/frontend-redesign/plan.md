# Plan — Frontend Redesign: Seamless Transitions, Interactions & Best Practices

## New dependency

```
motion (npm install motion) — animation library, import from motion/react
```

## Architecture

### New components

```
src/components/
  ui/
    Skeleton.tsx              → Base skeleton with shimmer animation
    RevealSection.tsx         → Scroll-reveal wrapper (whileInView)
  product/
    ProductCardSkeleton.tsx   → Skeleton matching ProductCard layout
  layout/
    MobileMenu.tsx            → Full-screen mobile nav overlay
```

### Modified components

```
src/components/
  ui/
    Button.tsx                → ADD: Motion whileHover/whileTap, shadow lift
    Badge.tsx                 → ADD: subtle shadow for depth
    EmptyState.tsx            → ADD: subtle entrance animation
  product/
    ProductCard.tsx           → ADD: Motion whileInView entry, hover shadow lift
    ProductGallery.tsx        → ADD: AnimatePresence for image transitions
  cart/
    CartItem.tsx              → ADD: AnimatePresence for remove animation
    CartSummary.tsx           → ADD: subtle transition on total change
  layout/
    Header.tsx                → MODIFY: pass mobile menu props
    HeaderClient.tsx          → REWRITE: floating pill nav + hamburger + Motion animations
    Footer.tsx                → REWRITE: 3-column layout + newsletter + scroll reveal
```

### New route files

```
src/app/
  not-found.tsx                          → Branded 404 page
  (shop)/loading.tsx                     → Shop skeleton loader
  (shop)/error.tsx                       → Shop error boundary
  (shop)/page.tsx                        → REWRITE: full home page (4 sections)
  (shop)/products/[slug]/loading.tsx     → Product detail skeleton
  account/loading.tsx                     → Account skeleton
  account/error.tsx                       → Account error boundary
  admin/loading.tsx                       → Admin skeleton
  admin/error.tsx                         → Admin error boundary
```

### Modified route files

```
src/app/
  layout.tsx                             → ADD: skip-to-content link
  (shop)/layout.tsx                      → ADD: skip-to-content link
```

### Updated documentation

```
embroidery-ecommerce-design-doc.md       → Update Section 7 (Motion) to reflect expanded motion system
```

## Component specifications

### Skeleton.tsx (new)

- **Props:** `className?: string`, `variant?: 'text' | 'circular' | 'rectangular'`, `width?: string`, `height?: string`
- **Behavior:** Renders a div with `bg-charcoal/10` and a CSS shimmer animation (gradient sweep left-to-right).
- **Animation:** Custom `@keyframes shimmer` in globals.css using `background-position` animation.
- **Reduced motion:** Static placeholder, no shimmer.

### RevealSection.tsx (new)

- **Props:** `children: React.ReactNode`, `className?: string`, `delay?: number`, `direction?: 'up' | 'left' | 'right'`
- **Behavior:** Wraps children in `motion.div` with `whileInView` fade-in.
- **Animation:**
  - `initial={{ opacity: 0, y: 24 }}`
  - `whileInView={{ opacity: 1, y: 0 }}`
  - `viewport={{ once: true, amount: 0.3 }}`
  - `transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}`
- **Reduced motion:** `useReducedMotion()` returns true → render static children, no animation.

### MobileMenu.tsx (new)

- **Props:** `isOpen: boolean`, `onClose: () => void`, `navLinks: Array<{href: string, label: string}>`, `user: {email: string} | null`, `role: string | null`
- **Behavior:** `AnimatePresence` full-screen overlay with backdrop-blur. Links stagger in with 50ms delay each.
- **Animation:**
  - Backdrop: `opacity: 0 → 1`, `transition={{ duration: 0.2 }}`
  - Links: `y: 48, opacity: 0 → y: 0, opacity: 1` with `transition={{ delay: i * 0.05 }}`
  - Exit: reverse of enter, `transition={{ duration: 0.15 }}`
- **Body scroll lock:** When open, `document.body.style.overflow = 'hidden'`. Restore on close/unmount.
- **Reduced motion:** Instant show/hide, no stagger.
- **Accessibility:** Focus trap within menu when open. Escape key closes menu. `aria-modal="true"`.

### Button.tsx (modified)

- **Change:** Wrap `<button>` in `motion.button` for hover/tap animations.
- **Add to primary variant:** `hover:shadow-lg hover:shadow-mahogany/20` (tinted shadow matching mahogany).
- **Add:** `whileHover={{ scale: 1.02 }}` with `transition={{ type: 'spring', stiffness: 400, damping: 17 }}`.
- **Add:** `whileTap={{ scale: 0.98 }}`.
- **Keep:** All existing variant styles, focus-visible, disabled states, fullWidth prop.

### ProductCard.tsx (modified)

- **Add:** Wrap card in `motion.div` with `whileInView` entry animation.
  - `initial={{ opacity: 0, y: 24 }}`
  - `whileInView={{ opacity: 1, y: 0 }}`
  - `viewport={{ once: true, amount: 0.2 }}`
  - `transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}`
- **Add:** Hover shadow: `group-hover:shadow-lg group-hover:shadow-charcoal/10`.
- **Add:** Image scale on hover: `group-hover:scale-108` (currently 105, increase to 108).
- **Keep:** Running-stitch dashed border on hover (existing pattern).

### HeaderClient.tsx (rewritten)

- **Desktop nav:** Fixed floating pill:
  - `fixed top-4 left-1/2 -translate-x-1/2 z-50`
  - `rounded-full border border-charcoal/10 bg-kora/80 backdrop-blur-xl`
  - `px-6 py-3`
- **Desktop nav links:** Horizontal flex with gap. Active link has Peacock underline using `layoutId` for smooth sliding indicator.
- **Mobile:** Hamburger button (3 lines). Lines morph to X via `motion.span` with `rotate: 45/−45` and `y` translation.
- **Cart badge:** `motion.span` with `animate={{ scale: [1, 1.3, 1] }}` spring when `itemCount` changes. Uses `useEffect` to trigger on count change.
- **Scroll effect:** On scroll > 50px, nav gains `bg-kora/95` (more opaque). Uses `useMotionValueEvent(useScroll(), 'change')`.

### Footer.tsx (rewritten)

- **Desktop:** 3-column CSS Grid:
  - Column 1: Brand name (Fraunces) + tagline ("Made by hand, one piece at a time.")
  - Column 2: Quick links (Products, Custom order, About, Account)
  - Column 3: Newsletter signup (input + submit button) + social/contact placeholder
- **Mobile:** Single column, stacked sections.
- **Scroll reveal:** Entire footer wrapped in `motion.div` with `whileInView` fade-up.
- **Bottom bar:** Separated by `border-t border-charcoal/20`. Copyright left, legal links right.
- **Newsletter input:** Underline style (satin-stitch focus), Mahogany submit button.

### Home page (rewritten)

#### Section 1: Hero
- **Layout:** Split on desktop (text left 60%, image right 40%). Vertical stack on mobile.
- **Text side:** `flex flex-col justify-center` with:
  - Optional eyebrow pill: `rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-mahogany border border-mahogany/20`
  - Headline: `font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight text-ink`. Staggered word reveal via Motion.
  - Subtext: `font-body text-base text-charcoal max-w-md`. Fades in after headline.
  - CTA: Mahogany primary button → `/products`. Slides up last.
- **Image side:** Product image with soft shadow, `rounded-2xl`, `aspect-[4/5]`.
- **Height:** `min-h-[100dvh]` with `py-24` top padding (cap per design-taste-frontend rule).
- **Reduced motion:** All text visible immediately, no stagger.

#### Section 2: Featured Products
- **Heading:** "Selected pieces" in Fraunces, left-aligned.
- **Grid:** ProductGrid with staggered card entry (each card 60ms delay).
- **Mobile:** Horizontal scroll-snap row, `overflow-x-auto`, `snap-x snap-mandatory`.
- **Desktop:** 3-column CSS Grid.

#### Section 3: Brand Statement
- **Layout:** Full-width, centered text.
- **Content:** Large Fraunces display text: "Every stitch carries intention." + one-line subtext.
- **Spacing:** `py-32` for generous whitespace.

#### Section 4: Custom Order CTA
- **Layout:** Split. Text left with heading + description + CTA button. Decorative stitched border pattern right (CSS dashed border in mahogany, rotated slightly).
- **Button:** Magnetic hover (scale 1.02 + shadow lift).
- **Heading:** "Made for you" in Fraunces.

### Loading skeletons

- **Shop (`(shop)/loading.tsx`):**
  - Header placeholder: full-width bar, `h-16`, `bg-charcoal/5`, `animate-pulse`
  - Grid: 3-column of `ProductCardSkeleton` components
- **Product detail (`(shop)/products/[slug]/loading.tsx`):**
  - Left: square image placeholder, `aspect-square`, `bg-charcoal/5`
  - Right: 4 text line placeholders of varying widths
- **Account (`account/loading.tsx`):**
  - Sidebar: 4 nav item placeholders
  - Content: 3 text line placeholders
- **Admin (`admin/loading.tsx`):**
  - Sidebar: 4 nav item placeholders
  - Content: 4 stat box placeholders in 2x2 grid

### Error boundaries

- **Convention:** Next.js `error.tsx` client components with `{ error, reset }` props.
- **UI:**
  - Centered card with `bg-kora border border-charcoal/20 rounded-lg p-8`
  - Heading: "Something went wrong" in Fraunces
  - Error message: `font-body text-sm text-charcoal`
  - Retry button: Mahogany primary, calls `reset()`
- **Styling:** Consistent across all three (shop, account, admin).

### 404 page

- **File:** `src/app/not-found.tsx` (can be server component)
- **UI:**
  - Centered layout with generous whitespace
  - Large "404" in Fraunces (`text-8xl text-charcoal/20`) with dashed border (running-stitch motif)
  - "Page not found" heading in Fraunces
  - Helpful message: "The page you're looking for doesn't exist or has been moved."
  - "Back to shop" link (Peacock color, underline on hover)

## Motion strategy

### Animation categories

| Category | Pattern | API | Applied to |
|---|---|---|---|
| Scroll reveal | Fade-up on enter | `whileInView` + `viewport={{ once: true }}` | Home sections, product grid, about, footer |
| Staggered children | Cascading delay | `transition={{ delay: i * 0.06 }}` | Product cards, nav links, feature lists |
| Hover lift | Scale + shadow | `whileHover={{ scale: 1.02 }}` | Buttons, cards |
| Press feedback | Scale down | `whileTap={{ scale: 0.98 }}` | Buttons |
| Cart badge bounce | Spring scale | `animate={{ scale: [1, 1.3, 1] }}` | Cart icon badge |
| Mobile menu | Staggered overlay | `AnimatePresence` + stagger | Mobile nav links |
| Image transition | Crossfade | `AnimatePresence` + `key` | Product gallery |
| Cart item remove | Slide out | `AnimatePresence` + `exit` | Cart items |
| Skeleton shimmer | Gradient sweep | CSS `@keyframes shimmer` | All skeleton loaders |
| Nav active indicator | Layout slide | `layoutId="nav-indicator"` | Active nav link underline |

### Reduced motion protocol

- All Motion components check `useReducedMotion()` from `motion/react`.
- When true:
  - Scroll reveals → content visible immediately (no initial hidden state).
  - Stagger → all items appear simultaneously.
  - Mobile menu → instant show/hide, no stagger.
  - Cart badge → no bounce.
  - Skeleton shimmer → static placeholder (no animation).
  - Hover/press → still functional (scale changes are instant, not animated).

### Performance guards

- Animate only `transform` and `opacity` (GPU-accelerated properties).
- `viewport={{ once: true }}` on all scroll reveals (animate once, not on every scroll).
- No `backdrop-blur` on scrolling containers (only on fixed/sticky elements).
- `will-change: transform` only on elements actively animating, remove after animation.
- Skeleton shimmer uses CSS animation (not JS) for zero JS cost.
- Motion library is tree-shakeable — only import what's used.

## File map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Modify | Add `motion` dependency |
| `src/app/globals.css` | Modify | Add shimmer keyframes, skip-to-content styles |
| `src/components/ui/Skeleton.tsx` | Create | Base skeleton component |
| `src/components/ui/RevealSection.tsx` | Create | Scroll-reveal wrapper |
| `src/components/ui/Button.tsx` | Modify | Add Motion hover/tap, shadow |
| `src/components/ui/Badge.tsx` | Modify | Add subtle shadow |
| `src/components/ui/EmptyState.tsx` | Modify | Add subtle animation |
| `src/components/product/ProductCard.tsx` | Modify | Add Motion entry + hover |
| `src/components/product/ProductCardSkeleton.tsx` | Create | Product card skeleton |
| `src/components/product/ProductGallery.tsx` | Modify | Add AnimatePresence |
| `src/components/cart/CartItem.tsx` | Modify | Add AnimatePresence remove |
| `src/components/cart/CartSummary.tsx` | Modify | Add transition on total |
| `src/components/layout/Header.tsx` | Modify | Pass mobile menu props |
| `src/components/layout/HeaderClient.tsx` | Rewrite | Floating pill + hamburger + Motion |
| `src/components/layout/MobileMenu.tsx` | Create | Full-screen mobile nav overlay |
| `src/components/layout/Footer.tsx` | Rewrite | 3-column + newsletter + scroll reveal |
| `src/app/(shop)/page.tsx` | Rewrite | Full home page (4 sections) |
| `src/app/(shop)/layout.tsx` | Modify | Add skip-to-content link |
| `src/app/(shop)/loading.tsx` | Create | Shop skeleton loader |
| `src/app/(shop)/error.tsx` | Create | Shop error boundary |
| `src/app/(shop)/products/[slug]/loading.tsx` | Create | Product detail skeleton |
| `src/app/account/loading.tsx` | Create | Account skeleton |
| `src/app/account/error.tsx` | Create | Account error boundary |
| `src/app/admin/loading.tsx` | Create | Admin skeleton |
| `src/app/admin/error.tsx` | Create | Admin error boundary |
| `src/app/not-found.tsx` | Create | Branded 404 page |
| `src/app/layout.tsx` | Modify | Add skip-to-content link |
| `embroidery-ecommerce-design-doc.md` | Modify | Update Section 7 (Motion) |

## Notes

- The 3D thread hero (design doc Section 6a) is deferred to a separate phase. It requires the `3d-web-experience` skill and Three.js setup. The home page hero uses a product image instead.
- Motion+ patterns referenced for inspiration (source requires Motion+ membership at https://motion.dev/plus):
  - [Skeleton loader](https://motion.dev/ui/components/skeleton)
  - [Stagger reveal](https://motion.dev/ui/components/stagger-reveal)
  - [Footer sticky reveal](https://motion.dev/ui/components/footer-reveal)
  - [Mega Menu nav](https://examples.motion.dev/react/mega-menu)
  - [Bobble hover](https://examples.motion.dev/react/bobble-hover)
