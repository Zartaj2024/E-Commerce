-- Product Catalog Schema
-- Run this in Supabase SQL Editor

-- Products
create table if not exists products (
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

-- Product Images
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt_text text not null,
  sort_order int not null default 0
);

-- Product Variants
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  fabric text,
  color text,
  size text,
  price_modifier numeric(10,2) not null default 0,
  stock_quantity int not null default 0,
  sku text unique
);

-- Indexes
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_is_active on products(is_active);
create index if not exists idx_product_images_product_id on product_images(product_id);
create index if not exists idx_product_variants_product_id on product_variants(product_id);

-- Row Level Security
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;

-- Public read for active products
create policy "Public can view active products"
  on products for select
  using (is_active = true);

create policy "Public can view product images"
  on product_images for select
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
        and products.is_active = true
    )
  );

create policy "Public can view product variants"
  on product_variants for select
  using (
    exists (
      select 1 from products
      where products.id = product_variants.product_id
        and products.is_active = true
    )
  );

-- Admin write policies (service role bypasses RLS, but these exist for completeness)
create policy "Admins can insert products"
  on products for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can update products"
  on products for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can delete products"
  on products for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can manage product images"
  on product_images for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can manage product variants"
  on product_variants for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
