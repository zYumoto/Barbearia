create extension if not exists "pgcrypto";

create type public.profile_role as enum ('customer', 'admin');
create type public.appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'paid');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  birth_date date,
  avatar_url text,
  role public.profile_role not null default 'customer',
  favorite_barber_id uuid,
  favorite_service_id uuid,
  created_at timestamptz not null default now()
);

create table public.barbers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  specialties text[] not null default '{}',
  rating numeric(2,1) not null default 5,
  appointments_count integer not null default 0,
  bio text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration_minutes integer not null,
  icon_key text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0
);

alter table public.profiles
  add constraint profiles_favorite_barber_fk foreign key (favorite_barber_id) references public.barbers(id),
  add constraint profiles_favorite_service_fk foreign key (favorite_service_id) references public.services(id);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  barber_id uuid references public.barbers(id),
  service_id uuid not null references public.services(id),
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  price numeric(10,2) not null,
  status public.appointment_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

create table public.appointment_services (
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  service_id uuid not null references public.services(id),
  primary key (appointment_id, service_id)
);

create table public.customer_history (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid references public.services(id),
  barber_id uuid references public.barbers(id),
  service_name text not null,
  barber_name text not null,
  appointment_date date not null,
  price numeric(10,2) not null,
  rating integer check (rating between 1 and 5),
  photo_url text,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  rating numeric(2,1) not null,
  comment text not null,
  created_at timestamptz not null default now()
);

create table public.working_hours (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid references public.barbers(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  open time not null,
  close time not null,
  active boolean not null default true
);

create table public.barber_days_off (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references public.barbers(id) on delete cascade,
  date date not null,
  reason text
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(10,2) not null,
  method text not null default 'dinheiro',
  status public.payment_status not null default 'pending',
  paid_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_services enable row level security;
alter table public.customer_history enable row level security;
alter table public.reviews enable row level security;
alter table public.working_hours enable row level security;
alter table public.barber_days_off enable row level security;
alter table public.payments enable row level security;

create policy "public read active services" on public.services for select using (active = true);
create policy "public read active barbers" on public.barbers for select using (active = true);
create policy "public read reviews" on public.reviews for select using (true);
create policy "public read working hours" on public.working_hours for select using (true);

create policy "profiles own read" on public.profiles for select using (auth.uid() = id);
create policy "profiles own insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles own update" on public.profiles for update using (auth.uid() = id);

create policy "appointments own read" on public.appointments for select using (auth.uid() = customer_id);
create policy "appointments own insert" on public.appointments for insert with check (auth.uid() = customer_id);
create policy "appointments own cancel" on public.appointments for update using (auth.uid() = customer_id) with check (status = 'cancelled');
create policy "history own read" on public.customer_history for select using (auth.uid() = customer_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage barbers" on public.barbers for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage appointments" on public.appointments for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage appointment services" on public.appointment_services for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage history" on public.customer_history for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage hours" on public.working_hours for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage days off" on public.barber_days_off for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
