# Design Document — Embroidery Brand E-Commerce Platform

A warm, heritage-craft visual identity, built from the actual vocabulary of embroidery — thread, cloth, and hand-stitching — rather than a generic "warm brand" template.

---

## 1. Design principles

- **The stitch is the motif.** Structural details (dividers, borders, focus states) draw from actual embroidery techniques — a running-stitch dashed line, a satin-stitch solid underline — instead of generic rules or shadows.
- **Let the product be the color.** Embroidery pieces are naturally rich and colorful; the interface itself stays restrained (ink, muslin, gold) so photographed products provide the vibrancy, never compete with it.
- **One deliberate flourish per page**, everywhere else quiet. A hand-set headline treatment on the hero, a stitched-border frame on featured products — not decoration repeated on every card.
- **Sequence gets numbered, nothing else does.** The order-status timeline is genuinely sequential, so it's the one place step numbers appear.

---

## 2. Color palette

| Name | Hex | Role |
|---|---|---|
| Kora (base) | `#F2ECDD` | Page background — unbleached cotton, not bright white |
| Ink | `#2B211C` | Primary text — warm near-black, not pure black or blue-black |
| Mahogany | `#7A2331` | Primary accent — deep thread-maroon, used for CTAs and key actions |
| Peacock | `#0F5C57` | Secondary accent — used for links, active nav, in-progress states |
| Zari gold | `#B8860B` | Tertiary accent, used sparingly — stitched dividers, price highlights, "quoted" status |
| Charcoal cloth | `#4A4038` | Muted text, borders, disabled states |

**Deliberately avoided:** the warm-cream-plus-terracotta pairing (`#F4F1EA` / `#D97757`) that's become the generic "warm brand" default — it reads as templated and isn't specific to embroidery. Mahogany and peacock come directly from thread-color vocabulary instead.

---

## 3. Typography

| Role | Typeface | Notes |
|---|---|---|
| Display / headings | **Fraunces** (serif, high-contrast, slightly eccentric) | Has enough character to read as "hand-set," not a neutral corporate serif |
| Body / UI | **Work Sans** | Clean and warm without being the default (avoids Inter, which is the generic-AI-page tell) |

**Type scale:** 14 / 16 / 20 / 28 / 40 / 56px, following a roughly 1.4x step. Body copy at 16px, line-height 1.6. Line length capped around 68 characters for readability. No all-caps labels anywhere — sentence case throughout, including nav and buttons.

---

## 4. Layout concept

Left-aligned, not centered — echoes a tailor's cutting table rather than a symmetrical poster. Generous negative space around products; images are never cropped tight, since embroidery detail needs room to be seen.

**Hero (Home):** a single large, full-bleed product photograph with the headline set in Fraunces, slightly overlapping the image's edge — like a label pinned to fabric — rather than a centered headline-over-gradient default.

```
+----------------------------------------------------+
| Logo    Home  Products  Custom Order  About   [cart]|
+----------------------------------------------------+
|                                                      |
|   [ full-bleed hero photo of a finished piece ]      |
|   Ink headline overlapping the image's edge          |
|   one-line supporting copy, one CTA button           |
|                                                      |
+----------------------------------------------------+
|  Featured pieces (3-up grid, generous gutters)       |
+----------------------------------------------------+
|  A short craft-process strip (3 short steps,          |
|  numbered — this one IS a real sequence)             |
+----------------------------------------------------+
|  Footer                                             |
+----------------------------------------------------+
```

---

## 5. Core components

- **Buttons:** solid Mahogany fill for primary actions ("Add to cart", "Submit request"), Ink text on Kora outline for secondary. Label states plainly: "Add to cart," never "Submit."
- **Product card:** image, name, price. On hover, a thin dashed (running-stitch) border appears around the image — the one recurring motif, used only here.
- **Status badge (order tracking):** small pill using the palette semantically — Charcoal for "pending review," Zari gold for "quoted," Peacock for "in production"/"shipped," Mahogany for "delivered."
- **Form fields (custom order builder):** underline style (satin-stitch line) rather than boxed inputs, echoing thread on cloth. Clear inline errors in Mahogany, stated plainly ("Upload a reference image to continue" — not vague).
- **Admin tables:** dense, functional, Charcoal-cloth borders — deliberately plainer than the customer-facing UI, since this audience is one person who wants speed, not atmosphere.

---

## 6. Page-by-page layout notes

**Products (catalog):** left sidebar filters (category, fabric, color) on desktop, collapsible into a top sheet on mobile. Grid of cards, 3-up desktop / 1-up mobile.

**Product detail:** large image gallery left, details right on desktop (stacked on mobile) — variant pickers (fabric/color/size) as tappable swatches, not a dropdown, since fabric and thread color are visual choices.

**Custom order builder:** a single vertical flow, not a boxed wizard — each step (upload, fabric, thread, size, notes) is its own section on one scrollable page with a sticky progress indicator, so the customer can see the whole request forming rather than losing context between modal steps.

**Cart / Checkout:** cart on the left, order summary sticky on the right on desktop; stacked with summary at top on mobile so the total is never scrolled out of view.

**About us:** long-form, editorial layout — this is the one page allowed a more expressive type treatment (pull quotes in Fraunces) since it's telling the brand's story, not transacting.

**Account / order tracking:** the status timeline is the centerpiece — a horizontal stepper on desktop, vertical on mobile, using the numbered-sequence exception from the principles above.

**Admin:** sidebar nav + dense content area, Work Sans throughout (no display serif) — optimized for scanning, not atmosphere.

---

## 6a. 3D hero (Home page)

An abstract thread/stitch particle piece, replacing a static hero photo on the Home page:

- **Form:** 3–4 flowing curved "thread" lines (Catmull-Rom curves) rendered in Mahogany, Peacock, Zari gold, and Ink, gently undulating — evoking thread mid-stitch rather than any literal object.
- **Motion:** slow ambient rotation plus a subtle undulation (sine-wave vertex offset), so it never looks static; speed stays slow enough to feel like fabric movement, not a tech demo spinner.
- **Interaction:** the whole piece drifts toward the cursor (parallax, not full drag-rotate) — inviting without demanding interaction, and it must not block the headline or CTA beneath/beside it.
- **Restraint:** this is the "one deliberate flourish" for the whole site (per Section 1) — no other page gets a 3D element, keeping it a signature moment rather than decoration repeated everywhere.
- **Fallback:** reduced-motion users get the threads static (no rotation/undulation), still visible as a still image of the same geometry.

## 6b. Interactivity standard (applies site-wide)

Every page's controls do something real, not just look clickable: filters actually filter, "add to cart" actually updates the cart and its count, the custom-order form actually progresses through its steps and produces a request, admin actions actually change the record they act on. Nothing on any page is a static mockup of a control.

---

## 7. Motion

A layered motion system using the `motion` library (import from `motion/react`). All animations respect `prefers-reduced-motion`.

### Scroll reveals
Content sections use `whileInView` with `viewport={{ once: true }}` for entrance animations. Staggered children (cards, list items) enter with 60ms cascading delay. Fade-up pattern: `opacity: 0, y: 24` to `opacity: 1, y: 0` over 600ms with cubic-bezier `[0.16, 1, 0.3, 1]`. Applied to: home page sections, product grid, about page, footer.

### Hover and press micro-interactions
Buttons use `whileHover={{ scale: 1.02 }}` (spring, stiffness 400, damping 17) and `whileTap={{ scale: 0.98 }}`. Primary buttons get a tinted shadow lift on hover (`shadow-mahogany/20`). Product cards lift with shadow + image scale on hover. The running-stitch dashed border on product-card hover draws itself in via CSS transition (~300ms).

### Navigation
Desktop: floating glass-pill nav with backdrop-blur. Mobile: hamburger icon morphs to X via Motion rotation, full-screen overlay with staggered link reveals (50ms delay each). Active page indicated by Peacock accent. Cart badge bounces with spring scale when count changes.

### Page transitions
Content fade-in on route change (200ms opacity). Loading skeletons shown during async navigations.

### Skeleton loaders
CSS shimmer animation (gradient sweep left-to-right, 1.8s loop). Applied to all data-fetching route loading states. Disabled under reduced motion.

### Cart interactions
`AnimatePresence` for add/remove with slide-out animation. Quantity change pulses the number. Remove slides item left and fades out.

### Performance guards
Animate only `transform` and `opacity` (GPU-accelerated). `viewport={{ once: true }}` on all scroll reveals. No `backdrop-blur` on scrolling containers. `will-change: transform` only on actively animating elements.

---

## 8. Accessibility

- Mahogany (`#7A2331`) on Kora (`#F2ECDD`) and Ink on Kora both meet WCAG AA for body text.
- All interactive elements get a visible focus outline in Peacock, not just a color change.
- Fabric/color swatches in the product picker get a text label on focus/hover, not color alone — color-blind customers still need to choose correctly.

---

## 9. Next step

Design tokens here are ready to translate into Tailwind config (colors, font families, type scale) when the product-catalog feature moves into implementation.
