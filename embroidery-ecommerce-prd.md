# Product Requirements Document — Embroidery Brand E-Commerce Platform

Builds on the Constitution and Architecture/Navigation Plan already produced. Account required to buy, PKR only.

---

## 1. Overview

A personal-brand storefront that sells ready-made embroidery products and takes custom, made-to-order commissions, built as a zero-cost, portfolio-grade project demonstrating full-stack and product-design ability.

**Primary goals:**
- Let customers browse and buy ready-made pieces.
- Let customers commission a custom embroidery piece (upload a reference, choose fabric/thread/size) and receive a quote before paying.
- Give the brand owner (admin) a single dashboard to manage products, orders, and custom-order quotes.
- Serve as a strong, deployable portfolio piece: fast, clean, and demonstrably well-architected.

---

## 2. V1 vs. V2 scope (recommendation)

You asked for a cut recommendation — here it is, biased toward: **keep the custom-order flow (it's the differentiator), cut anything that adds complexity without demonstrating a new skill.**

### V1 — launch scope
- Home, Products (catalog + filters), Product detail
- Custom order builder (upload → fabric → thread → size → notes → submit for quote) — kept in full, it's the standout feature
- Cart, Checkout (account required, PKR, Stripe test mode + manual bank transfer/COD)
- Order confirmation + order tracking (status timeline)
- Account (register/login, order history)
- About Us
- Admin: dashboard (basic counts), product CRUD, order list + status updates, custom-order queue with quoting

### V2 — after launch
- Customer reviews/testimonials on products
- Wishlist / saved items
- Discount codes / promotions
- Richer admin analytics (charts, revenue trends)
- Multi-image zoom / 360° product view
- Email marketing / newsletter signup
- Wholesale or bulk-order pricing tier

**Rationale:** everything in V2 either needs real usage data to be worth building (reviews, analytics) or is a "nice to have" that doesn't change the core story you're telling with the project. Cutting them keeps V1 shippable without cutting the feature that makes the project distinctive.

---

## 3. User roles

| Role | Capabilities |
|---|---|
| Guest (not logged in) | Browse catalog, view product details, view About Us — cannot add to cart or check out |
| Customer (registered) | Everything a guest can do, plus: cart, checkout, submit custom orders, track orders |
| Admin | Everything a customer can do, plus: manage products, manage all orders, quote custom orders |

---

## 4. Functional requirements by page

*(Full page list and routes already defined in the navigation plan — this section states what each must do, not how.)*

- **Products page:** must support filtering by category and fabric/color; must paginate or infinite-scroll past a reasonable product count; must show price and a thumbnail per item.
- **Product detail page:** must let the customer pick variant options (fabric/color/size where applicable) before adding to cart; must show enough images to judge quality (embroidery detail matters).
- **Custom order builder:** must accept an image upload (reference design), fabric choice, thread color choice, size/placement input, and free-text notes; must not require payment at submission — it creates a request, not an order; must confirm submission clearly and explain "you'll receive a quote."
- **Cart:** must show both catalog items and any of the customer's already-quoted custom orders they choose to include; must recalculate totals live on quantity change.
- **Checkout:** must require login (per your decision); must collect shipping address; must offer Stripe (test mode) and manual (bank transfer/COD) as payment methods; must not allow submission with invalid/incomplete shipping info.
- **Order tracking:** must show the current status in the workflow (pending review → quoted → payment confirmed → in production → quality check → shipped → delivered) for both catalog and custom orders.
- **Admin custom-order queue:** must let the admin view uploaded reference images, set a price, and mark quoted — this action must trigger the customer notification.
- **Admin product management:** must support create/edit/delete with image upload.

---

## 5. Non-functional requirements & optimizations

These weren't in the original ask but matter for both the live site and how it reads as a portfolio piece:

- **Performance:** use `next/image` for all product and custom-order photos (automatic resizing/lazy-loading); use Incremental Static Regeneration for the Products and Product-detail pages so they're fast without a database hit on every request; target Core Web Vitals "good" thresholds (LCP < 2.5s, CLS < 0.1).
- **SEO:** server-rendered product pages with proper `<title>`/meta description per product; `sitemap.xml` and `robots.txt`; structured data (`Product` schema) so listings can show price/availability in search results.
- **Accessibility:** alt text on all product/design images (critical since custom-order images are user-uploaded — require a description field alongside the upload); full keyboard navigation on the multi-step custom-order form; sufficient color contrast (worth double-checking against an embroidery-brand color palette, which tends to be rich/saturated).
- **Security:** already covered in the Constitution (RLS, Zod validation, upload restrictions) — carried forward here as a hard requirement, not optional polish.
- **Analytics:** Vercel Web Analytics (free tier, no cookie banner needed) is enough to show page views and conversion funnel for a portfolio project — avoids a paid analytics tool.
- **Error/empty states:** every list view (Products, Admin orders, Account order history) needs a designed empty state, not a blank page — small detail, but it's the kind of polish that reads well in a portfolio review.

---

## 6. Success criteria

- A visitor can go from Home to a completed order (catalog item) in under 5 clicks.
- A visitor can submit a custom-order request without confusion about "why isn't there a price yet."
- Admin can process a new custom-order request (view → quote) in under 2 minutes.
- Lighthouse performance score ≥ 90 on Products and Product-detail pages.
- Zero ongoing hosting cost at expected solo-brand traffic levels.

---

## 7. Out of scope (explicitly, for this PRD)

- Multi-language support (English-only, per your decision)
- Multi-currency (PKR-only, per your decision)
- Guest checkout (account required, per your decision)
- Anything listed under V2 above

---

## 8. Open questions / risks

- **Custom-order pricing:** since pricing is quote-based rather than instant, there's a manual-response-time dependency on the admin — worth deciding an internal SLA (e.g. "quote within 24 hours") even though it's not a system requirement.
- **Payment gateway migration:** Stripe test mode demonstrates the integration but won't process real payments in Pakistan without a supported local processor or a business Stripe account with cross-border settlement — flag this as a known limitation if the site goes fully live rather than staying a portfolio demo.

---

## 9. Next step

Ready for `/speckit.specify` on the first feature — recommend **Product catalog** (Products + Product detail), since Cart, Custom Order, and Admin all depend on the data model it defines.
