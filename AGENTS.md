# AGENTS.md — Suti & Thread E-Commerce Platform

Project instructions for opencode. Every rule here governs how code is written, reviewed, and maintained.

---

## 1. Project Identity

**Brand:** Suti & Thread — hand-embroidered products and custom commissions.
**Purpose:** Portfolio-grade, deployable e-commerce platform demonstrating full-stack and product-design skill.
**Constraints:**
- PKR only (no multi-currency)
- English only (no i18n)
- Account required to purchase (no guest checkout)
- Zero hosting cost (Vercel + Supabase free tiers)

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router), TypeScript (strict) |
| Styling | Tailwind CSS |
| Database | Supabase Postgres |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (product photos + custom order uploads) |
| Cart | Zustand (client-side, no backend round-trip) |
| Validation | Zod (shared between forms and server actions) |
| Payments | Stripe test mode + manual (bank transfer / COD) |
| Email | Resend (free tier, 100/day) |
| Testing | Vitest (unit) + Playwright (smoke e2e) |
| Hosting | Vercel (frontend + API) + Supabase (data/auth/storage) |

**Commands:**
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run typecheck # TypeScript type checking (add to package.json)
npm run test      # Run Vitest (add to package.json)
```

---

## 3. Architecture Rules (Non-Negotiable)

### Layered Architecture

```
src/
  app/              → Presentation layer (pages, layouts, components)
  lib/
    domain/         → TypeScript entities & types matching DB schema
    services/       → Business logic (pricing, workflows, email)
    repositories/   → Data access (Supabase queries ONLY here)
    supabase/       → Client init (client.ts for browser, server.ts for server)
    validation/     → Zod schemas (one per form/entity)
  components/       → Reusable UI components
  store/            → Zustand stores (cart, etc.)
  actions/          → Server actions (thin entry points, call services only)
```

### Critical Rules
1. **UI → Services → Repositories.** Never call Supabase directly from components.
2. **Server Components by default.** Add `'use client'` only when the component needs hooks, event handlers, or browser APIs.
3. **Zod validates everything.** Every form input is validated with Zod on the server before touching business logic.
4. **One responsibility per file.** Components do one thing. Services contain business rules. Repositories contain only data access.
5. **TypeScript strict mode.** No `any`. Infer types from Zod schemas and DB schema.
6. **Server Actions are thin.** They validate input, call a service, and return a result. No business logic in actions.

---

## 4. Code Quality Standards

### Spec-Driven Development
Every feature starts with a `spec.md` containing:
- User stories
- Functional requirements
- Success criteria
- Edge cases

Then `plan.md` (data models, API contracts, component structure), then `tasks.md` (implementation checklist).

### Research Before Implementing
Before building any feature or component, **search the web** for current best practices for that specific technology/pattern. Do not assume — verify. For example:
- Before building a form with Server Actions, search "Next.js Server Actions form best practices 2026"
- Before writing RLS policies, search "Supabase RLS performance best practices"
- Before building a Zustand store, search "Zustand e-commerce cart patterns"

### No Spaghetti Code
- Single responsibility per file
- One component per file (except small utility components)
- No inline SQL or Supabase calls in components
- No business logic in Server Actions
- No direct database access from the UI layer

### Error Resolution
If an error occurs that can't be resolved from context:
1. Search the web for the exact error message
2. Check Next.js, Supabase, and TypeScript documentation
3. Search GitHub issues for the relevant library
4. Only then attempt a fix based on research

### TypeScript Standards
- `strict: true` in tsconfig (already configured)
- No `any` types — use `unknown` and narrow
- Define interfaces in `/lib/domain/`
- Use Zod `infer` to derive types from schemas
- Use `satisfies` for type-safe object literals

---

## 5. File & Folder Convention

### Directory Structure
```
src/
  app/
    (shop)/
      page.tsx                    → Home
      products/page.tsx           → Products (catalog)
      products/[slug]/page.tsx    → Product detail
      custom-order/page.tsx       → Custom order builder
      cart/page.tsx               → Cart
      checkout/page.tsx           → Checkout
      order-confirmation/[orderId]/page.tsx
      about/page.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
    account/
      page.tsx                    → Profile + order history
      orders/[orderId]/page.tsx   → Order tracking
    admin/
      page.tsx                    → Dashboard
      products/page.tsx           → Manage products
      products/[id]/edit/page.tsx → Edit product
      orders/page.tsx             → All orders
      orders/[id]/page.tsx        → Order detail
      custom-orders/page.tsx      → Custom order queue
    actions/
      catalog.ts                  → Product server actions
      customOrders.ts             → Custom order server actions
      checkout.ts                 → Checkout/order server actions
      admin.ts                    → Admin server actions
    api/
      webhooks/stripe/route.ts    → Stripe webhook handler
  lib/
    domain/
      product.ts                  → Product, ProductVariant, ProductImage types
      order.ts                    → Order, OrderItem types
      custom-order.ts             → CustomOrderRequest type
      profile.ts                  → Profile, Address types
    services/
      pricing.ts                  → Price calculation logic
      orderWorkflow.ts            → Order status transitions
      customOrderWorkflow.ts      → Custom order status transitions
      email.ts                    → Resend email sending
    repositories/
      productRepository.ts        → Supabase product queries
      orderRepository.ts          → Supabase order queries
      customOrderRepository.ts    → Supabase custom order queries
      profileRepository.ts        → Supabase profile queries
    supabase/
      client.ts                   → Browser Supabase client
      server.ts                   → Server-side Supabase client
    validation/
      productSchema.ts            → Zod schema for product forms
      customOrderSchema.ts        → Zod schema for custom order form
      checkoutSchema.ts           → Zod schema for checkout form
      addressSchema.ts            → Zod schema for address form
  components/
    ui/                           → Button, Input, Badge, etc.
    product/                      → ProductCard, ProductGallery, VariantPicker
    cart/                         → CartItem, CartSummary
    custom-order/                 → CustomOrderForm, ThreadColorPicker
    layout/                       → Header, Footer, Sidebar
    admin/                        → AdminSidebar, StatBox, OrderTable
  store/
    cart.ts                       → Zustand cart store
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Utilities/services/repositories: `camelCase.ts` (e.g., `productRepository.ts`)
- Zod schemas: `camelCaseSchema.ts` (e.g., `checkoutSchema.ts`)
- Server actions: `camelCase.ts` grouped by feature in `/actions/`

---

## 6. Design System

### Color Palette (Tailwind Config)
| Name | Hex | Role |
|---|---|---|
| Kora | `#F2ECDD` | Page background (unbleached cotton) |
| Ink | `#2B211C` | Primary text (warm near-black) |
| Mahogany | `#7A2331` | Primary accent (CTAs, key actions) |
| Peacock | `#0F5C57` | Secondary accent (links, active nav, in-progress) |
| Zari Gold | `#B8860B` | Tertiary accent (sparingly — dividers, price highlights) |
| Charcoal | `#4A4038` | Muted text, borders, disabled states |

### Typography
| Role | Typeface |
|---|---|
| Display / Headings | Fraunces (serif, high-contrast) |
| Body / UI | Work Sans |

- Type scale: 14 / 16 / 20 / 28 / 40 / 56px (roughly 1.4x step)
- Body copy: 16px, line-height 1.6
- Line length: capped around 68 characters
- Sentence case everywhere (no all-caps labels)

### Design Principles
1. **The stitch is the motif.** Running-stitch dashed border on product card hover. Satin-stitch underline on form fields.
2. **Let the product be the color.** Interface stays restrained (Kora, Ink, Mahogany). Products provide vibrancy.
3. **One deliberate flourish per page.** 3D thread hero on Home only (Three.js). No other page gets a 3D element.
4. **Sequence gets numbered, nothing else does.** Order-status timeline uses step numbers.

### Component Patterns
- **Buttons:** Solid Mahogany fill for primary. Ink on Kora outline for secondary.
- **Product card:** Image + name + price. Dashed border on hover (running-stitch).
- **Status badge:** Semantic pill — Charcoal (pending), Zari Gold (quoted), Peacock (in production/shipped), Mahogany (delivered).
- **Form fields:** Underline style (satin-stitch line), not boxed inputs.

---

## 7. Feature Implementation Order

1. **Product Catalog** — establishes data model + UI patterns
2. **Custom Order Builder** — the differentiator (most complex)
3. **Cart & Checkout** — mixes catalog items + quoted custom orders
4. **Admin Dashboard** — product CRUD, order management, custom-order quoting
5. **Order Workflow + Notifications** — status transitions + email triggers

Each feature follows: **spec → plan → implement → test → verify**

---

## 8. Testing Requirements

- **Vitest unit tests** for every service function in `/lib/services/`:
  - Pricing edge cases
  - Order workflow transitions
  - Custom order workflow transitions
  - Zod schema validation
- **Playwright smoke tests** per critical path:
  - Browse → add to cart → checkout
  - Submit custom order
- **No task is marked done until its test passes.**
- **Run `npm run lint` after every change.**

---

## 9. Security Rules

- **Supabase RLS** on every table — customers read/write own data only.
- **Admin role bypass** via `role` claim in RLS policies.
- **Zod validation** on every form before server action execution.
- **File uploads:** Restrict type (jpg/png/pdf) and size (5MB max) — both client and server.
- **No secrets in client bundles.** `SUPABASE_SERVICE_ROLE_KEY` stays server-only.
- **Rate-limit** custom-order submission endpoint.

---

## 10. Reference Documents

| Document | Path |
|---|---|
| Constitution | `embroidery-ecommerce-constitution.md` |
| PRD | `embroidery-ecommerce-prd.md` |
| TRD | `embroidery-ecommerce-trd.md` |
| Design Doc | `embroidery-ecommerce-design-doc.md` |
| Navigation Plan | `embroidery-ecommerce-navigation-plan.md` |
| Prototype | `embroidery-store-prototype.jsx` |

---

## 11. Database Schema

See `embroidery-ecommerce-trd.md` Section 2 for the full schema. Key tables:
- `profiles` (extends auth.users, role: customer/admin)
- `products` + `product_images` + `product_variants`
- `addresses`
- `custom_order_requests` (reference image, fabric, thread colors, size, status, quoted price)
- `orders` + `order_items` (supports both catalog and custom items)

---

## 12. Deployment

1. Supabase project (free tier) — run schema via SQL editor, enable RLS on every table.
2. Supabase Storage buckets: `custom-order-references` (private, signed URLs), `product-images` (public read).
3. Vercel project linked to repo, environment variables set, deploy on push to `main`.
4. Stripe: test-mode keys, webhook endpoint at `https://<domain>/api/webhooks/stripe`.
