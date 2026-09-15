-- Custom Order Requests table
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

-- Index for user lookups
create index idx_custom_order_requests_user_id on custom_order_requests(user_id);
create index idx_custom_order_requests_status on custom_order_requests(status);

-- RLS policies for custom_order_requests
alter table custom_order_requests enable row level security;

-- Users can insert their own orders
create policy "Users can insert own custom orders"
  on custom_order_requests for insert
  with check (auth.uid() = user_id);

-- Users can read their own orders
create policy "Users can read own custom orders"
  on custom_order_requests for select
  using (auth.uid() = user_id);

-- Admin can read all orders
create policy "Admin can read all custom orders"
  on custom_order_requests for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Admin can update status, quoted_price, admin_notes
create policy "Admin can update custom orders"
  on custom_order_requests for update
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

-- Storage bucket for custom order reference images
insert into storage.buckets (id, name, public)
values ('custom-order-references', 'custom-order-references', false);

-- Storage RLS: Users can upload to their own folder
create policy "Users can upload reference images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'custom-order-references'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: Users can read their own files
create policy "Users can read own reference images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'custom-order-references'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: Admin can read all files
create policy "Admin can read all reference images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'custom-order-references'
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
