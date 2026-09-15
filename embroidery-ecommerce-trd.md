# Technical Requirements Document — Embroidery Brand E-Commerce Platform

Covers the whole platform at a technical-design level, per the Constitution, Architecture/Navigation Plan, and PRD already produced. Full schema and server-action contracts included as requested; per-feature detail (edge cases, exact validation rules) still gets nailed down in each feature's own `/speckit.plan` when implementation starts.

---

## 1. Scope & assumptions

- Stack: Next.js 14 (App Router) on Vercel, Supabase (Postgres + Auth + Storage), Stripe test mode, Resend for email — per the Constitution.
- Account required to purchase (no guest checkout). PKR only. English only.
- All monetary values stored as `numeric(10,2)` in PKR — no currency column needed on line items since the whole store is single-currency (documented here as a deliberate simplification, not an oversight).

---

## 2. Database schema (Supabase / Postgres)

```sql
-- Extends Supabase's built-in auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category text not null,
  base_price numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt_text text not null,
  sort_order int not null default 0
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  fabric text,
  color text,
  size text,
  price_modifier numeric(10,2) not null default 0,
  stock_quantity int not null default 0,
  sku text unique
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  postal_code text,
  is_default boolean not null default false
);

create table custom_order_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  reference_image_url text not null,
  image_alt_text text not null,
  fabric text not null,
  thread_colors text[] not null,
  size_placement text not null,
  notes text,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'quoted', 'declined', 'converted')),
  quoted_price numeric(10,2),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'payment_confirmed'
    check (status in ('payment_confirmed', 'in_production', 'quality_check', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null check (payment_method in ('stripe', 'bank_transfer', 'cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  shipping_address_id uuid not null references addresses(id),
  subtotal numeric(10,2) not null,
  total numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  item_type text not null check (item_type in ('catalog', 'custom')),
  product_variant_id uuid references product_variants(id),
  custom_order_request_id uuid references custom_order_requests(id),
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  line_total numeric(10,2) not null,
  constraint item_source_check check (
    (item_type = 'catalog' and product_variant_id is not null and custom_order_request_id is null) or
    (item_type = 'custom' and custom_order_request_id is not null and product_variant_id is null)
  )
);
```

**Row Level Security (summary — exact policies written during implementation):**

| Table | Read | Write |
|---|---|---|
| `profiles` | Own row; admin reads all | Own row (not `role`); admin all |
| `products`, `product_variants`, `product_images` | Public (where `is_active`) | Admin only |
| `addresses` | Own rows | Own rows |
| `custom_order_requests` | Own rows; admin all | Insert own; admin updates `status`/`quoted_price`/`admin_notes` |
| `orders`, `order_items` | Own rows; admin all | Created via server action only (service role), never direct client write |

---

## 3. Server-action / API contracts

All are Next.js Server Actions unless noted. Types are illustrative TypeScript, not final.

### Catalog
```ts
getProducts(filters: { category?: string; fabric?: string; color?: string; page?: number; pageSize?: number })
  → { products: Product[]; total: number }

getProductBySlug(slug: string)
  → ProductWithVariantsAndImages | null
```

### Custom orders
```ts
submitCustomOrderRequest(input: {
  imageFile: File; imageAltText: string; fabric: string;
  threadColors: string[]; sizePlacement: string; notes?: string;
}) → { requestId: string }
// Uploads image to Supabase Storage first, then inserts the row and emails the admin.

getMyCustomOrderRequests(userId: string) → CustomOrderRequest[]
```

### Cart & checkout
```ts
// Cart lives client-side in Zustand — no server contract for cart mutation itself.

createOrder(input: {
  cartItems: CartLineItem[];           // catalog items
  acceptedCustomOrderIds: string[];    // quoted custom orders being paid for
  shippingAddress: AddressInput;
  paymentMethod: 'stripe' | 'bank_transfer' | 'cod';
}) → { orderId: string; stripeCheckoutUrl?: string }

// Stripe webhook (Route Handler, not a server action):
POST /api/webhooks/stripe → verifies signature, updates orders.payment_status
```

### Account
```ts
getMyOrders(userId: string) → OrderSummary[]
getOrderDetail(orderId: string, userId: string) → OrderDetail
```

### Admin
```ts
// Products
createProduct(input: ProductInput) → { productId: string }
updateProduct(productId: string, input: Partial<ProductInput>) → void
deleteProduct(productId: string) → void

// Orders
listAllOrders(filters: { status?: string }) → OrderSummary[]
updateOrderStatus(orderId: string, status: OrderStatus) → void
// Triggers customer email on every status change.

// Custom order queue
listCustomOrderRequests(filters: { status?: string }) → CustomOrderRequest[]
quoteCustomOrderRequest(requestId: string, price: number, adminNotes?: string) → void
// Sets status = 'quoted', emails customer.
declineCustomOrderRequest(requestId: string, reason?: string) → void
```

---

## 4. File & folder structure (refined)

```
/app
  /(shop)/page.tsx                 → Home
  /(shop)/products/page.tsx        → Products
  /(shop)/products/[slug]/page.tsx → Product detail
  /(shop)/custom-order/page.tsx
  /(shop)/cart/page.tsx
  /(shop)/checkout/page.tsx
  /(shop)/order-confirmation/[orderId]/page.tsx
  /(shop)/about/page.tsx
  /(auth)/login/page.tsx
  /(auth)/register/page.tsx
  /account/page.tsx
  /account/orders/[orderId]/page.tsx
  /admin/page.tsx
  /admin/products/page.tsx
  /admin/products/[id]/edit/page.tsx
  /admin/orders/page.tsx
  /admin/orders/[id]/page.tsx
  /admin/custom-orders/page.tsx
  /api/webhooks/stripe/route.ts
  /actions/                         → server actions, grouped by feature (catalog.ts, customOrders.ts, checkout.ts, admin.ts)

/lib/domain      → TypeScript types matching the schema above
/lib/services    → pricing.ts, orderWorkflow.ts, customOrderWorkflow.ts, email.ts
/lib/repositories → productRepository.ts, orderRepository.ts, customOrderRepository.ts (Supabase queries live here only)
/lib/supabase    → client.ts (browser), server.ts (server component/action client)
/lib/validation  → Zod schemas (one per form: productSchema, customOrderSchema, checkoutSchema, addressSchema)

middleware.ts    → session check + admin role gate for /admin/*, auth gate for /account/* and /checkout
```

---

## 5. Environment & configuration

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, used in repositories that bypass RLS (e.g. admin queries) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe test mode |
| `RESEND_API_KEY` | Transactional email |
| `NEXT_PUBLIC_SITE_URL` | Used in emails/redirects |

---

## 6. Deployment

1. Supabase project (free tier) — run the schema above via SQL editor or a migration file, enable RLS on every table before writing policies.
2. Supabase Storage bucket `custom-order-references` (private, signed URLs) and `product-images` (public read).
3. Vercel project linked to the repo, environment variables set per above, deploy on push to `main`.
4. Stripe: use test-mode keys; webhook endpoint pointed at `https://<domain>/api/webhooks/stripe`.

---

## 7. Next step

Technical foundation is now defined end-to-end. Ready to start `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement` for the **product catalog** feature — say the word and I'll write its `spec.md`.
