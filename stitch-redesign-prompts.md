# Suti & Thread — Stitch Redesign Prompts

---

## STITCH INTRO PROMPT

Copy and paste this intro first, then share each template prompt below:

```
You are redesigning the frontend for "Suti & Thread", a hand-embroidered e-commerce brand. I will share a series of prompts — one for each page template. Read every prompt carefully and generate a design for each.

BRAND IDENTITY:
- Name: Suti & Thread
- Purpose: Hand-embroidered products and custom embroidery commissions
- Tone: Warm, artisanal, editorial — like a craft journal, not a generic shop
- Every piece is made by hand — the design must communicate craft, patience, and intention

DESIGN SYSTEM (apply to ALL templates):

COLOR PALETTE:
- Kora (#F2ECDD): Page background — unbleached cotton, warm off-white
- Ink (#2B211C): Primary text — warm near-black
- Mahogany (#7A2331): Primary accent — CTAs, key actions, active states
- Peacock (#0F5C57): Secondary accent — links, active nav, in-progress status
- Zari Gold (#B8860B): Tertiary accent — sparingly, dividers, price highlights, decorative stitch elements
- Charcoal (#4A4038): Muted text, borders, disabled states

TYPOGRAPHY:
- Headings: Fraunces (serif, high-contrast) — for all headings, product names, prices
- Body/UI: Work Sans (sans-serif, clean) — for body copy, labels, buttons, nav
- Body copy: 16px, line-height 1.6
- Headings scale: 28px / 40px / 56px
- Line length: capped around 68 characters
- Sentence case everywhere (no all-caps labels)

DESIGN PRINCIPLES:
1. "The stitch is the motif." — Use running-stitch dashed borders on hover states. Satin-stitch underline on form fields. Zari gold for decorative stitch elements.
2. "Let the product be the color." — Interface stays restrained (Kora, Ink, Mahogany). Product photography provides vibrancy. Don't add colorful backgrounds or gradients.
3. "One deliberate flourish per page." — Each page gets exactly one decorative moment (a 3D thread animation, a stitched divider, a texture overlay). Nothing else competes.
4. "Sequence gets numbered, nothing else does." — Order-status timelines use step numbers. Everything else uses icons or color.

COMPONENT PATTERNS:
- Buttons: Solid Mahogany fill for primary actions. Ink on Kora outline for secondary. Ghost (no border) for tertiary.
- Product card: Image + name + price. Dashed border on hover (running-stitch motif in Zari Gold).
- Status badge: Pill shape. Charcoal (pending), Zari Gold (quoted/review), Peacock (in-progress/shipped), Mahogany (declined/cancelled), Green-700 (delivered).
- Form fields: Underline style (2px solid Charcoal border-bottom only). On focus: border transitions to Mahogany. No boxed inputs.
- Cards: Transparent background, 1px Charcoal border, 8px border-radius. No box shadows.

SPACING:
- Max content width: 1200px
- Page padding: 24px mobile, 48px desktop
- Section spacing: 64px between major sections
- Component spacing: 16px between related items

ICON STYLE: Simple line icons, 1px stroke, matching Ink color. No filled icons.

Now read each prompt I share and generate the design. Each prompt describes one page or template. Start with Prompt 1.
```

---

## PROMPT 1: Shop Layout Shell

```
Design a premium e-commerce layout shell for "Suti & Thread", a hand-embroidered products brand. The layout wraps all public-facing pages.

BRAND CONTEXT:
- Aesthetic: Warm, artisanal, editorial — like a craft journal, not a generic Shopify store
- Every page uses this shell: Header + Content + Footer

HEADER:
- Sticky top, full-width, bg-kora (#F2ECDD) with subtle 1px bottom border in Charcoal (#4A4038)
- Left: Brand logo "Suti & Thread" in Fraunces serif, 20px, semibold, Ink (#2B211C)
- Center: Navigation links — Home, Products, Custom order, About. Work Sans 14px, sentence case. Active/hover state: Peacock (#0F5C57) color. No underlines.
- Right: Icon group — Account (person icon), Cart (bag icon with item count badge in Mahogany #7A2331). If logged in, show "Account" text instead of icon. If admin, show "Admin" link.
- Mobile: Hamburger menu icon, nav slides in from right as a panel on Kora background

FOOTER:
- Minimal. Single centered line: "Made by hand, one piece at a time." in Work Sans 14px, Charcoal color. No links, no columns. Generous padding above and below.

GLOBAL:
- Max content width: 1200px, centered
- Page padding: 24px horizontal on mobile, 48px on desktop
- Background: Kora (#F2ECDD) on all public pages
```

---

## PROMPT 2: Home Page / Hero

```
Design a hero section for the Suti & Thread homepage. This is the first impression. It must feel like opening a craft journal, not scrolling a shop.

LAYOUT:
- Full viewport height (100vh)
- Vertically centered content
- Max-width 800px, centered

CONTENT:
- Headline (H1): "Thread, held to the light." in Fraunces serif, 56px, Ink (#2B211C). High contrast between thick and thin strokes. Elegant, not loud.
- Subtitle: "Hand-embroidered pieces and custom commissions. Choose your fabric, thread, and story." in Work Sans 18px, line-height 1.6, Charcoal (#4A4038)
- CTA Button: "Shop the collection" — solid Mahogany (#7A2331) fill, white text, 14px Work Sans, padding 12px 32px, 6px border-radius. On hover: darken to #5E1B27. No icon.

DECORATIVE ELEMENT (the one flourish):
- A subtle stitched line (2px dashed stroke in Zari Gold #B8860B) running horizontally above or below the headline, like a hand-drawn divider. This is the only decorative element on the page.

EMPTY SPACE:
- Generous whitespace above and below the content block. This page breathes. Nothing else — no featured products, no carousels, no promotional banners. Just the words, the space, and the stitch divider.

MOBILE:
- Stack everything vertically
- Headline scales to 36px
- CTA full-width
```

---

## PROMPT 3: Product Catalog Page

```
Design a product catalog page for "Suti & Thread". This page shows all products with category filtering.

LAYOUT:
- Page header: "Products" in Fraunces 40px, Ink
- Below header: horizontal filter pill bar
- Below filters: 3-column responsive product grid
- Below grid: pagination (Previous / Next)

FILTER PILLS:
- Horizontal scrollable row of pill buttons
- Options: All, Dupattas, Kurtas, Home, Accessories
- Inactive: outlined pill, Charcoal border, Ink text
- Active: filled pill, Mahogany background, white text
- Work Sans 14px, sentence case

PRODUCT CARD (3-column grid):
- Card: transparent background, no shadow, 1px Charcoal border
- Aspect ratio: 4:5 image (portrait)
- Image: product photo, object-fit cover
- Below image: product name (Fraunces 18px, Ink) + price (Work Sans 16px, Ink)
- Hover effect: running-stitch dashed border (2px dashed Zari Gold #B8860B) appears around the card — like a stitch being drawn
- Click entire card leads to product detail page
- No badges, no ratings, no quick-add — clean and minimal

PAGINATION:
- Centered below grid
- "Previous" / "Next" buttons
- Button style: outlined (Ink border, Ink text, transparent fill)
- Active/Disabled states with opacity

EMPTY STATE:
- Centered message: "No products found"
- Sub-message: "Try a different category."

MOBILE:
- 1-column grid on mobile, 2-column on tablet, 3-column on desktop
- Filter pills horizontally scrollable
```

---

## PROMPT 4: Product Detail Page

```
Design a product detail page for "Suti & Thread". This is where customers inspect a product and add it to cart.

PRODUCT INFO:
- Products have multiple variants (different fabric, color, size combinations)
- Each product has multiple images
- Price is computed: base price + variant modifier
- Stock is tracked per variant

LAYOUT:
- Two-column on desktop (lg:flex-row): Left = Image gallery, Right = Product info
- Single column on mobile (gallery on top, info below)

LEFT COLUMN — IMAGE GALLERY:
- Large main image: aspect-ratio 4:5, object-fit cover, rounded 8px
- Below main image: thumbnail strip — horizontal row of small images (64x64px)
- Active thumbnail: 2px Mahogany (#7A2331) border
- Click thumbnail swaps main image
- If only 1 image: hide thumbnails

RIGHT COLUMN — PRODUCT INFO:
- Category badge: pill, small, Charcoal background, white text, Work Sans 12px
- Product name: Fraunces 32px, Ink, semibold
- Description: Work Sans 16px, line-height 1.6, Charcoal, max 3 lines with "Read more" expand
- Variant picker: grouped sections
  - "Fabric" label (Work Sans 12px, uppercase, Charcoal, letter-spacing 0.05em)
  - Row of pill buttons for each fabric option
  - Active: Peacock (#0F5C57) border + light teal background
  - Inactive: Charcoal border, transparent background
  - Same pattern for "Color" and "Size" groups
- Price: Fraunces 28px, Ink, bold. Format: "Rs. X,XXX"
- Stock: Work Sans 14px, Charcoal. Shows "X in stock" or "Out of stock"
- Add to cart button: full-width, solid Mahogany, white text, Work Sans 14px, padding 14px. Disabled when out of stock (opacity 0.5, cursor not-allowed).
- After adding: button text changes to "Added!" for 2 seconds, then reverts

MOBILE:
- Gallery: swipeable main image, thumbnails below
- Info: full-width below gallery
- Variant pills: wrap to multiple rows
- Add to cart: sticky bottom bar
```

---

## PROMPT 5: Auth Forms (Login + Register)

```
Design login and register pages for "Suti & Thread". These are simple, centered forms — clean and trustworthy.

LAYOUT:
- Centered column, max-width 400px, vertically centered on page
- Brand mark at top: "Suti & Thread" in Fraunces serif, 24px, Ink, centered, linking to home
- Below brand: form (no visible card border — just the form on the Kora background)

LOGIN FORM:
- H1: "Log in" in Fraunces 28px, Ink, centered
- Subtitle: "Welcome back" in Work Sans 14px, Charcoal, centered
- Fields (stacked vertically, 16px gap):
  - Email input: Work Sans 16px, placeholder "Email", underline-style bottom border (2px solid Charcoal, transitions to Mahogany on focus)
  - Password input: same style, placeholder "Password"
- Error message: Work Sans 14px, Mahogany, appears below the field
- Submit button: "Log in" — full-width, solid Mahogany, white text, Work Sans 14px, padding 12px, 6px radius
- Footer link: "Don't have an account? Create one" — Work Sans 14px, Peacock (#0F5C57), centered. Links to register page.

REGISTER FORM:
- H1: "Create account" in Fraunces 28px, Ink, centered
- Subtitle: "Join us" in Work Sans 14px, Charcoal, centered
- Fields (same underline style): Full name, Email, Password, Confirm password
- Error message: same style
- Submit button: "Create account" — full-width, solid Mahogany
- Footer link: "Already have an account? Log in" — Peacock, links to login page

INPUT STYLE (shared):
- No box/border around inputs
- Bottom border only: 2px solid Charcoal
- On focus: border transitions to Mahogany — like a satin stitch being highlighted
- Label: floating or static above the field, Work Sans 12px, uppercase, Charcoal, letter-spacing
- Padding: 12px vertical, 0 horizontal
- Background: transparent

MOBILE:
- Same centered layout, full-width form, slightly larger touch targets
```

---

## PROMPT 6: Account Hub

```
Design the account dashboard section for "Suti & Thread". This is a logged-in area with a side navigation and content panels.

LAYOUT:
- Two-column: Left side-nav (240px) + Right content area
- On mobile: horizontal nav tabs at top, content below

SIDE NAVIGATION:
- Vertical list of nav items: Profile, Orders, Custom orders, Addresses
- Each item: Work Sans 14px, sentence case
- Inactive: Ink text, transparent background
- Active: Mahogany text, light Mahogany background (10% opacity), rounded 6px
- Hover: slight background tint

CONTENT AREA:
- Max-width 800px
- Page heading: Fraunces 28px, Ink

SUB-TEMPLATE 6A — PROFILE:
- Profile card: rounded corners, Charcoal border
  - Fields: Full name, Email, Role (customer/admin), Member since
  - Layout: label (Charcoal, 12px uppercase) above value (Ink, 16px)
- "Recent orders" section: H2 (Fraunces 20px), table with columns: Order #, Date, Status (badge), Total
- If > 5 orders: "View all" link in Peacock
- Empty state if no orders: "No orders yet" + "Browse products" CTA

SUB-TEMPLATE 6B — ORDERS LIST:
- Status filter pills: All, Payment confirmed, In production, Quality check, Shipped, Delivered, Cancelled
- Same pill style as product catalog
- Orders table: Order # (Peacock link), Date, Status (badge), Payment method, Total (Rs.)
- Rows separated by thin Charcoal border
- Empty state: "No orders found" / "No orders match this filter."

SUB-TEMPLATE 6C — ORDER DETAIL:
- Back link: "Back to orders" in Peacock
- Header: "Order #XXXXXXXX" (Fraunces 28px) + status badge + date
- TRACKING TIMELINE: horizontal 5-step progress bar
  - Steps: Payment confirmed, In production, Quality check, Shipped, Delivered
  - Completed steps: Peacock circle with white checkmark
  - Current step: ring highlight (Peacock border)
  - Upcoming steps: Charcoal circle, muted text
  - If cancelled: all steps grayed, "Cancelled" badge
- Order items: product image (64x64), product name, variant info (fabric/color/size), quantity, line total
- Summary card: Subtotal, Shipping (Free), Total (bold), Payment method
- Shipping address card: Full name, address lines, city, postal code, phone

SUB-TEMPLATE 6D — ADDRESSES:
- Address cards: rounded, Charcoal border, 2-column grid
  - Each: Full name, address lines, city, postal code, phone
  - "Default" badge on first address (Mahogany pill)
- "Add address" toggle button: opens inline form
  - Fields: full name, phone, address line 1, address line 2, city, postal code
  - Same underline input style as auth forms
  - "Save address" button (Mahogany)
- Empty state: "No saved addresses. Add one to use during checkout."

SUB-TEMPLATE 6E — CUSTOM ORDERS:
- Cards: each custom order as a card
  - Reference image thumbnail (128x128, rounded)
  - Status badge, date, fabric + placement
  - Thread colors (color swatches in a row)
  - Notes (italic, quoted)
  - Quoted price (Fraunces, Mahogany) if quoted
  - Admin notes if any
- Empty state: "No custom orders yet" + "Start a custom order" CTA

MOBILE:
- Side nav becomes horizontal scrollable tabs
- Tables become stacked card layouts
- Timeline compresses to vertical steps
```

---

## PROMPT 7: Checkout & Cart

```
Design the cart and checkout flow for "Suti & Thread". Two connected pages: Cart (review) and Checkout (payment).

BRAND CONTEXT:
- Cart is client-side (localStorage)
- Checkout creates an order
- Three payment methods: Stripe, Bank Transfer, Cash on Delivery
- Must feel trustworthy and clear

===== CART PAGE =====

LAYOUT:
- H1: "Your cart" (Fraunces 32px)
- Empty state: centered message + "Shop now" CTA
- When items exist: 2-column — Left (2/3): cart items, Right (1/3): sticky summary

CART ITEM (each row):
- 3-column: Image | Info | Quantity+Price
- Image: 80x80px, rounded 6px
- Info: Product name (Fraunces 16px), variant details (Work Sans 14px, Charcoal: "Fabric / Color / Size"), "Remove" link (Charcoal)
- Quantity stepper: minus | count | plus. Pill-shaped container. Buttons: outlined Charcoal. Count: Work Sans 16px.
- Line price: "Rs. X,XXX" Work Sans 16px, Ink
- Items separated by thin Charcoal border

CART SUMMARY (sticky sidebar):
- Card, Charcoal border, rounded 8px
- Subtotal, Shipping (Free if > Rs. 5,000), Total (bold, Fraunces 18px)
- "Proceed to checkout" button: full-width, solid Mahogany
- "Continue shopping" link: Peacock

===== CHECKOUT PAGE =====

LAYOUT:
- H1: "Checkout" (Fraunces 32px)
- 2-column: Left (2/3): address + payment, Right (1/3): sticky summary

ADDRESS SECTION:
- H2: "Shipping address" (Fraunces 20px)
- If saved addresses exist: radio list of address cards
  - Each: name, address, phone, "Default" badge on first
  - Selected: Mahogany border
  - "Add new address" link at bottom
- If no saved addresses: inline form
  - Fields: full name, phone, address line 1, address line 2 (optional), city, postal code
  - Same underline input style

PAYMENT SECTION:
- H2: "Payment method" (Fraunces 20px)
- Radio group: Stripe, Bank Transfer, Cash on Delivery
- Selected: Mahogany radio fill + light Mahogany background
- Payment-specific info appears below:
  - Bank Transfer: bank details text
  - COD: "Keep the amount ready at delivery"
  - Stripe: card form

ORDER SUMMARY (sticky sidebar):
- Item list: image thumbnail + name + variant + quantity + line price
- Subtotal, Shipping, Total
- "Place order" button: full-width, solid Mahogany

MOBILE:
- Cart: items stack, summary below
- Checkout: address + payment stack, summary below
- Sticky bottom bar with "Place order" button
```

---

## PROMPT 8: Admin Dashboard

```
Design the admin dashboard for "Suti & Thread". This is the back-office for managing products, orders, and custom orders.

LAYOUT:
- Fixed left sidebar: 224px wide, full height, bg-Ink (#2B211C)
- Main content area: scrollable, padding 32px, max-width 1200px, bg-Kora (#F2ECDD)

SIDEBAR:
- Top: "Suti & Thread" logo in white, Fraunces 18px
- Nav items (vertical list): Dashboard, Products, Orders, Custom Orders
  - Each: Work Sans 14px, white at 70% opacity
  - Active: white text, Mahogany (#7A2331) left border accent, brighter background
  - Hover: white text, subtle background change
- Bottom: "Back to shop" link, Peacock (#0F5C57)

===== DASHBOARD =====
- H1: "Dashboard" (Fraunces 32px)
- 4-column stat grid:
  - Each: card with Charcoal border, rounded 8px
  - Icon + Label (Work Sans 12px, uppercase, Charcoal) + Value (Fraunces 32px, Ink)
  - Stats: Total orders, Revenue (Rs.), Pending custom orders, Active products

===== PRODUCTS LIST =====
- H1: "Products" (Fraunces 32px)
- Table: Name, Category, Price (Rs.), Stock, Status
  - Status: toggle switch (green = active, gray = inactive)
  - Action: "Edit" link (Peacock) per row
  - Rows: Work Sans 14px, separated by Charcoal borders

===== PRODUCT EDIT =====
- H1: "Edit product" (Fraunces 28px) + "Save changes" button (Mahogany, top-right)
- "Back to products" link (Peacock)
- 2-column: Left (2/3) = product info + variants, Right (1/3) = images

PRODUCT INFO CARD:
- Name (auto-generates slug), Slug, Description (textarea), Category (select), Base price (PKR), Active toggle
- Underline input style, denser for admin

VARIANTS CARD:
- List of variant sub-forms: Fabric, Color, Size, Price modifier, Stock, SKU
- "Remove" button per variant, "Add variant" button at bottom
- Separated by dashed Charcoal borders

IMAGES CARD:
- Drag-to-upload area: dashed border, "Drop images here or click to upload"
- Uploaded images: thumbnail + alt text + reorder arrows + remove button

===== ORDERS LIST =====
- H1: "Orders" (Fraunces 32px)
- Filter pills: All, Pending, In production, Shipped, Delivered, Cancelled
- Table: Order # (Peacock link), Date, Status (badge), Total (Rs.), Payment method

===== ORDER DETAIL =====
- H1: "Order #XXXXXXXX" (Fraunces 28px) + status badge
- 2-column: Left = items + summary, Right = sidebar
- Left: items list (image + name + variant + price + quantity), summary card
- Right: Status update dropdown, Shipping address card, Payment info card

===== CUSTOM ORDERS =====
- H1: "Custom Orders" (Fraunces 32px)
- Filter pills: All, Pending, Quoted, Declined, Converted
- Cards: reference image, status badge, date, fabric + colors + placement, notes
- Pending items: "Quote" (Mahogany) + "Decline" (outlined) buttons

QUOTE MODAL:
- Dark semi-transparent backdrop
- Modal card: centered, max-width 480px, bg-Kora, rounded 12px
- "Quote custom order" heading, price input (Rs.), notes textarea
- "Send quote" (Mahogany) + "Cancel" (outlined)

MOBILE:
- Sidebar collapses to top horizontal bar
- Tables become stacked cards
- Stat grid: 2-column tablet, 1-column mobile
```

---

## PROMPT 9: Custom Order Builder

```
Design the custom order builder for "Suti & Thread". This is a 5-step wizard where customers design their custom embroidery commission.

LAYOUT:
- Centered column, max-width 640px
- Header: "Design your custom order" (Fraunces 32px) + subtitle "Tell us what you envision and we'll bring it to life." (Work Sans 16px, Charcoal)

STEP INDICATOR:
- Horizontal row of 5 numbered circles connected by lines
- Active: Peacock (#0F5C57) fill, white number, 40px
- Completed: Peacock fill, white checkmark
- Inactive: Charcoal outline, Charcoal number
- Lines: solid Peacock when completed, dashed Charcoal when upcoming
- Labels: "Image", "Fabric & Colors", "Size", "Notes", "Review" (Work Sans 12px)

===== STEP 1: IMAGE =====
- H2: "Upload a reference image" (Fraunces 20px)
- Subtitle: "Show us what you have in mind" (Work Sans 14px, Charcoal)
- Upload area: dashed border (2px dashed Charcoal), rounded 8px, min-height 200px
  - Center: camera/upload icon + "Click to upload or drag and drop"
  - Accepted: JPG, PNG, WebP. Max 5MB.
  - After upload: image preview with remove (x) button
- Design description: textarea, "Describe your design idea...", max 500 chars
- "Next" button (Mahogany) bottom right

===== STEP 2: FABRIC & COLORS =====
- H2: "Choose your fabric" (Fraunces 20px)
- Fabric grid: 3-column buttons (Khaddar, Cotton, Linen, Chiffon, Organza, Silk)
  - Active: Peacock border + light teal background
- H2: "Select thread colors" (Fraunces 20px)
- Subtitle: "Choose up to 6 colors"
- Color swatch grid: 4x3 circles (48px each)
  - Colors: Ivory White, Marigold, Madder Red, Indigo, Emerald, Peacock Teal, Dusty Rose, Terracotta, Mustard, Charcoal, Plum, Sky Blue
  - Selected: 3px Peacock ring
  - Color name below each (Work Sans 12px)
  - Max 6 selected
- "Back" (outlined) + "Next" (Mahogany)

===== STEP 3: SIZE & PLACEMENT =====
- H2: "Where should the embroidery go?" (Fraunces 20px)
- Placement grid: 2-column cards (Dupatta full, Shirt Front, Shirt Back, Sleeves, Trousers Hem, Border/Trim, Other)
  - Each: name (Fraunces 16px) + description (Work Sans 12px, Charcoal)
  - Active: Mahogany border + light Mahogany background
  - Single select
- "Back" + "Next"

===== STEP 4: NOTES =====
- H2: "Any additional notes?" (Fraunces 20px)
- Subtitle: "Optional — anything else we should know"
- Textarea: "Special instructions, measurements, preferences...", max 500 chars
- "Back" + "Next"

===== STEP 5: REVIEW =====
- H2: "Review your order" (Fraunces 20px)
- Summary card: all selections listed
  - Reference image (thumbnail), description, fabric, thread colors (swatches), placement, notes
  - Label (Charcoal, 12px uppercase) + value (Ink)
  - "Edit" link per section to jump back
- "Submit request" button (full-width, Mahogany)

MOBILE:
- Step indicator: circles with labels, scrollable if needed
- All grids: 2-column
- Upload: tap to open camera/gallery
```

---

## PROMPT 10: Order Confirmation

```
Design the order confirmation page for "Suti & Thread". Appears after successful order or custom order submission.

LAYOUT:
- Centered column, max-width 600px
- Generous vertical spacing (64px+)

SUCCESS INDICATOR:
- Large circle (80px) with Peacock (#0F5C57) fill + white checkmark
- "Order confirmed" (Fraunces 32px, Ink, centered)
- "Thank you for your order. We've received it and will start working on it soon." (Work Sans 16px, Charcoal, centered)

ORDER SUMMARY CARD:
- Rounded 8px, Charcoal border, padding 24px
- Order number: "Order #XXXXXXXX" (Fraunces 20px)
- Payment method: Work Sans 14px, Charcoal label + Ink value
- Status: colored badge
- Total: "Rs. X,XXX" (Fraunces 24px, Mahogany)

PAYMENT INSTRUCTIONS (conditional):
- Bank Transfer: "Please transfer Rs. X,XXX to [bank details]. Reference: Order #XXXXXXXX"
- Cash on Delivery: "Please keep Rs. X,XXX ready at the time of delivery."
- Stripe: "You'll receive a payment confirmation email shortly."
- Styled: subtle info box, light background, Work Sans 14px, Charcoal

CTA BUTTONS:
- "View my orders" (Mahogany, primary)
- "Continue shopping" (outlined, secondary)
- Full-width, stacked, centered

MOBILE:
- Same layout, full-width, buttons stack vertically
```

---

## PROMPT 11: About Page

```
Design the about page for "Suti & Thread". Static editorial content — warm, personal, like reading a letter from the maker.

LAYOUT:
- Centered column, max-width 680px
- Line-height 1.8 for readability

CONTENT STRUCTURE:
- H1: "About us" (Fraunces 40px, Ink)
- Opening paragraphs (3 blocks): studio intro, philosophy, what makes them different
- Blockquote: "The stitch is the motif. Every thread carries intention."
  - Style: left border 3px Zari Gold (#B8860B), italic, Fraunces 20px, Ink, generous padding
- H2: "What we make" (Fraunces 24px) — bullet list: ready-to-ship, custom commissions
- H2: "Our materials" (Fraunces 24px) — paragraph about fabrics and threads
- H2: "Custom orders" (Fraunces 24px) — paragraph about the process
- CTA box: rounded card, Charcoal border, centered
  - "Ready to start a custom order?" (Fraunces 20px)
  - "Begin your commission" button (Mahogany) → /custom-order

TYPOGRAPHY:
- Body: Work Sans 16px, line-height 1.8, Ink
- Headings: Fraunces, Ink
- Paragraph spacing: 24px

MOBILE:
- Same layout, full-width, blockquote scales down
```
