# Constitution — Embroidery Brand E-Commerce Platform

**Phase:** SpecKit Phase 1 (Constitution) — governs all later specs, plans, and tasks.
**Project type:** Personal brand storefront + custom embroidery order system, portfolio piece, zero hosting cost.

---

## 1. Non-negotiable tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS | Matches your existing stack; SSR/SSG for SEO; Vercel-native |
| Backend logic | Next.js Route Handlers + Server Actions | No second server to host or keep warm — avoids FastAPI's free-tier cold-start/sleep problem entirely |
| Database | Supabase Postgres | Free tier (500MB), real Postgres, matches your PostgreSQL preference |
| Auth | Supabase Auth | Email/password + optional Google OAuth, free, row-level security integrates directly |
| File storage | Supabase Storage | Product photos + customer-uploaded reference designs, free tier (1GB) |
| Cart state | Zustand | Lightweight, no backend round-trip needed for cart math |
| Payments | Stripe (test mode) + manual (bank transfer / COD / WhatsApp confirm) | Real card processors in Pakistan carry setup/monthly fees; Stripe test mode still demonstrates the integration for your portfolio |
| Email notifications | Resend (free tier, 100/day) via Supabase Edge Function or Route Handler | Order-status emails without a mail server |
| Hosting | Vercel (frontend + API) + Supabase (data/auth/storage) | Both have generous, genuinely free tiers — no credit card required to start |
| Validation | Zod | Shared schema between form and server action = no drift |
| Testing | Vitest (unit) + Playwright (smoke e2e, minimal) | Matches "test after every component" rule without heavy CI cost |

**Explicitly rejected for this project:** separate FastAPI service (adds a second free-tier host that sleeps and adds latency), self-hosted Postgres/Docker (exceeds your local RAM budget), any paid payment gateway (violates the zero-cost constraint).

---

## 2. Architecture pattern — layered/clean, inside a single Next.js repo

Even without a separate backend service, the code is layered so business logic never leans on Next.js or Supabase directly from the UI:

```
/app                        → Presentation layer (pages, layouts, components)
  /app/(shop)                → catalog, product detail, cart, checkout
  /app/account                → customer order history
  /app/admin                  → admin dashboard (protected)
  /app/api or /actions        → thin entry points, call services only

/lib/domain                 → Entities & types: Product, Order, CustomOrderRequest, User
/lib/services                → Business logic: pricing.ts, orderWorkflow.ts, customOrder.ts
/lib/repositories            → Data-access interfaces + Supabase implementations
/lib/supabase                → Supabase client init (server + client variants)
/lib/validation               → Zod schemas shared by forms and server actions

/specs/<feature-name>/spec.md, plan.md, tasks.md   → per SpecKit, one folder per feature
```

**Rule:** UI components call services, never Supabase directly. Services call repositories, never raw SQL/Supabase calls inline. This is what keeps the "backend" swappable later without touching the frontend.

**Frontend/backend separation within SpecKit:** because there's no separate backend service, "backend" tasks in your `tasks.md` files mean `/lib/services`, `/lib/repositories`, and `/app/api` or server actions — kept in their own task list section, separate from `/app` UI tasks, per your global instructions.

---

## 3. Core features

1. **Product catalog** — categories (e.g. sarees, kurtas, cushions, table linen), variants (fabric, color, size), image gallery.
2. **Custom order builder** — multi-step form: upload a reference image → choose fabric → choose thread colors → choose placement/size → add notes → submit for quote (not an instant price, since embroidery pricing is usually design-dependent).
3. **Cart & checkout** — mixes catalog items and confirmed custom-order quotes; delivery details; payment method choice (Stripe test / bank transfer / COD).
4. **Order status workflow** (see diagram below) with customer-visible tracking.
5. **Customer accounts** — order history, saved custom-order drafts.
6. **Admin dashboard** — manage products; review incoming custom-order requests and send a quote; update order status; basic sales overview.
7. **Email notifications** — order received, quote ready, payment confirmed, shipped.
8. **Reviews/testimonials** — social proof for finished embroidery pieces.

---

## 4. Custom order workflow (state machine)

```
Pending review → Quoted → Payment confirmed → In production → Quality check → Shipped → Delivered
                     ↘ Declined (if customer rejects quote)
```

- **Pending review**: customer submits design + specs, no price yet.
- **Quoted**: admin reviews and sets a price; customer notified by email.
- **Payment confirmed**: customer pays (Stripe test) or marks bank transfer/COD; admin confirms receipt for non-Stripe.
- **In production → Quality check → Shipped → Delivered**: admin-driven status updates, each triggering a customer email.

---

## 5. Security & data rules

- Supabase **Row Level Security**: customers can only read/write their own orders and profile; admin role bypasses via a `role` claim checked in policies.
- All form input validated with Zod **before** hitting a server action — never trust client data.
- Uploaded design images: restrict file type (jpg/png/pdf) and size (e.g. 5MB) both client- and server-side.
- No secrets in client bundles — Supabase service-role key stays server-only.
- Rate-limit the custom-order submission endpoint to prevent spam (simple IP/time check is enough at this scale).

---

## 6. Testing standard

- Every service function in `/lib/services` gets a Vitest unit test before moving to the next task (pricing edge cases, workflow transitions, validation).
- One Playwright smoke test per critical path (browse → add to cart → checkout; submit custom order) — kept minimal, not a full suite, to match the zero-cost/portfolio scope.
- No task is marked done until its test passes — per your global "test after every component" rule.

---

## 7. Next step

This Constitution is ready to govern `/speckit.specify` for the first feature. Suggested order of features to spec:
1. Product catalog (simplest, establishes data model + UI patterns)
2. Custom order builder (the differentiator — most complex)
3. Cart & checkout
4. Admin dashboard
5. Order workflow + notifications

Say which feature to start with and I'll produce its `spec.md` (user stories, functional requirements, success criteria — no implementation detail yet).
