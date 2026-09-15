# Architecture, Navigation & Page Plan — Embroidery Brand E-Commerce

Builds on `embroidery-ecommerce-constitution.md`. English-only, designed evenly for mobile and desktop.

---

## 1. Full page list & routes

### Public / customer-facing

| Page | Route | Purpose |
|---|---|---|
| Home | `/` | Hero, featured products, brand intro, entry points to Shop / Custom Order |
| Products (catalog) | `/products` | Grid of products, category + fabric/color filters, search |
| Product detail | `/products/[slug]` | Images, variants (fabric/color/size), price, add to cart |
| Custom order builder | `/custom-order` | Multi-step form: upload design → fabric → thread colors → size/placement → notes → submit |
| Cart | `/cart` | Line items (catalog + confirmed custom quotes), quantity edit, subtotal |
| Checkout | `/checkout` | Shipping details, payment method (Stripe test / bank transfer / COD) |
| Order confirmation | `/order-confirmation/[orderId]` | Order summary, what happens next |
| About us | `/about` | Brand story, craft process, contact details |
| Login / Register | `/login`, `/register` | Supabase Auth email/password |
| Account | `/account` | Profile, order history |
| Order tracking | `/account/orders/[orderId]` | Status timeline for one order (catalog or custom) |

### Admin (protected — role check via Supabase RLS + middleware)

| Page | Route | Purpose |
|---|---|---|
| Admin dashboard | `/admin` | Sales snapshot, count of pending custom-order requests |
| Manage products | `/admin/products` | List, add, edit, delete products |
| Edit product | `/admin/products/[id]/edit` | Product form |
| All orders | `/admin/orders` | Every order, filterable by status |
| Order detail | `/admin/orders/[id]` | Update status, view customer details |
| Custom order queue | `/admin/custom-orders` | Pending requests needing a quote → set price → moves to "Quoted" |

**Route protection:** `/admin/*` and `/account/*` sit behind Next.js middleware that checks the Supabase session and, for `/admin/*`, the user's `role` claim. Anyone without the claim is redirected to `/` — the admin area is never linked from public navigation.

---

## 2. Navigation structure

**Header (public layout):**
`Logo` — `Home` — `Products` — `Custom Order` — `About Us` — [search icon] — [cart icon with item count] — [account icon → login or account menu]

**Footer:**
About blurb, contact info, social links, `Shipping & Returns` (can start as a section on About Us, split out later if it grows).

**Admin layout (separate from public layout entirely — own header/sidebar, no shared nav):**
Sidebar: `Dashboard` — `Products` — `Orders` — `Custom Order Requests` — `Logout`

---

## 3. Page connections & data flow

- **Home → Products / Custom Order / About Us / Account** — top-level entry points (see nav map above).
- **Products → Product detail** — click a card; **Product detail → Cart** — "Add to cart" writes to the Zustand cart store (client-side, no page load).
- **Custom order builder → Supabase** — on submit, a server action validates the form (Zod) and writes an order row with `status = pending_review`; triggers an email to the admin via Resend. The customer is redirected to their **Account → order tracking** page for that order, showing "Pending review."
- **Cart → Checkout** — reads the Zustand cart plus any of the customer's orders with `status = quoted` (confirmed custom pieces) that they've chosen to pay for.
- **Checkout → Order confirmation** — on successful payment (or COD/bank-transfer selection), a server action creates/updates the order record and redirects to the confirmation page.
- **Account / order tracking** — reads orders scoped to the logged-in user via Supabase RLS (`user_id = auth.uid()`).
- **Admin custom-order queue → sets a price** — updates the order's `status` to `quoted` and its `price` field, which triggers the "your quote is ready" email and makes it appear in that customer's Cart-eligible list.
- **Admin orders → status updates** — each status change (`in_production`, `shipped`, `delivered`) triggers a customer email and updates what the customer sees on their tracking page.

---

## 4. Notes on this pass

- I folded **Custom Order** into its own top-level nav item rather than a sub-page of Products, since it's the brand's differentiator and deserves its own entry point.
- **Cart** and **Checkout** are two separate pages (not one) so the flow matches standard e-commerce conventions and keeps the checkout page focused purely on payment/shipping.
- No dedicated **Contact** or **Wishlist** page yet — not mentioned in your page list. Say the word if you want either added.

---

## 5. Next step

This plan is ready to feed `/speckit.plan` (data models, API/server-action design, component structure) for whichever feature you pick first. Still recommend starting with the **product catalog** (Products + Product detail pages) since Cart, Custom Order, and Admin all depend on the product data model it establishes.
