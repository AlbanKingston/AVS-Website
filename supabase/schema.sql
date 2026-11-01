-- Run this in the Supabase SQL editor.

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  items text[] not null default '{}',
  image_url text not null default '',
  sort_order int not null default 0
);

create table if not exists pricing_plans (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  starting_price numeric,
  description text not null default '',
  features text[] not null default '{}',
  highlight boolean not null default false,
  sort_order int not null default 0
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text not null default '',
  quote text not null,
  published boolean not null default true
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null default '',
  service text not null default '',
  message text not null default '',
  status text not null default 'new'
    check (status in ('new','contacted','in_progress','won','closed')),
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  business_email text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '',
  instagram_url text not null default '',
  facebook_url text not null default '',
  address text not null default '',
  map_query text not null default ''
);
insert into site_settings (id) values (1) on conflict do nothing;

-- Row Level Security
alter table portfolio_projects enable row level security;
alter table services enable row level security;
alter table pricing_plans enable row level security;
alter table testimonials enable row level security;
alter table enquiries enable row level security;
alter table site_settings enable row level security;

-- Public can read content
create policy "public read portfolio" on portfolio_projects for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read pricing" on pricing_plans for select using (true);
create policy "public read testimonials" on testimonials for select using (published = true or auth.role() = 'authenticated');
create policy "public read settings" on site_settings for select using (true);

-- Anyone can submit an enquiry, only admins can read/update it
create policy "public insert enquiries" on enquiries for insert with check (true);
create policy "admin read enquiries" on enquiries for select using (auth.role() = 'authenticated');
create policy "admin update enquiries" on enquiries for update using (auth.role() = 'authenticated');
create policy "admin delete enquiries" on enquiries for delete using (auth.role() = 'authenticated');

-- Admin (any authenticated user) write access.
-- Only create users for admins in Supabase Auth and DISABLE public sign-ups.
create policy "admin write portfolio" on portfolio_projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write services" on services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write pricing" on pricing_plans for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write settings" on site_settings for update using (auth.role() = 'authenticated');

-- Storage bucket for project images
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
  on conflict do nothing;
create policy "public read portfolio images" on storage.objects for select using (bucket_id = 'portfolio');
create policy "admin upload portfolio images" on storage.objects for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');
create policy "admin update portfolio images" on storage.objects for update using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
create policy "admin delete portfolio images" on storage.objects for delete using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
