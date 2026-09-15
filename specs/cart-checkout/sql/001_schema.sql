-- Addresses table
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

create index idx_addresses_user_id on addresses(user_id);

-- RLS for addresses
alter table addresses enable row level security;

create policy "Users can insert own addresses"
  on addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can read own addresses"
  on addresses for select
  using (auth.uid() = user_id);

create policy "Users can update own addresses"
  on addresses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on addresses for delete
  using (auth.uid() = user_id);

-- Orders table
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

create index idx_orders_user_id on orders(user_id);
create index idx_orders_status on orders(status);

-- RLS for orders
alter table orders enable row level security;

create policy "Users can read own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Admin can read all orders"
  on orders for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admin can update orders"
  on orders for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Order Items table
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

create index idx_order_items_order_id on order_items(order_id);

-- RLS for order_items
alter table order_items enable row level security;

create policy "Users can read own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admin can read all order items"
  on order_items for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
