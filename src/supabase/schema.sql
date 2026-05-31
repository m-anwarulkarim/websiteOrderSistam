-- =====================================================================
--  Website Order System — Supabase schema
--  Supabase Dashboard > SQL Editor এ পুরো ফাইলটা paste করে Run করুন।
-- =====================================================================

-- ---------- ENUM types ----------
do $$ begin
  create type domain_status as enum ('have', 'need');     -- ডোমেইন আছে / লাগবে
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('new', 'in_progress', 'done');
exception when duplicate_object then null; end $$;

-- ---------- orders (প্রতিটা ফর্ম = একটা চ্যানেল) ----------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  whatsapp        text not null,          -- normalized (শুধু সংখ্যা, country code/০ বাদ)
  domain_status   domain_status not null,
  domain_name     text,                   -- domain_status = 'have' হলে
  office_address  text,
  hotline         text,
  fb_page         text,
  youtube         text,
  other_socials   text,
  gmail           text,
  password        text,                   -- NOTE: চাইলে পরে pgcrypto দিয়ে encrypt করা যাবে
  status          order_status not null default 'new',
  created_at      timestamptz not null default now()
);

-- whatsapp + সময়ের ভিত্তিতে দ্রুত lookup-এর জন্য index
create index if not exists orders_whatsapp_created_idx
  on public.orders (whatsapp, created_at desc);

-- ---------- notes (অ্যাডমিনের নোট, চ্যানেলের মেসেজের মতো) ----------
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists notes_order_idx on public.notes (order_id, created_at);

-- =====================================================================
--  Row Level Security
--  - orders/notes এ anon (পাবলিক) কোনো read পাবে না — পাসওয়ার্ড আছে এখানে।
--  - শুধু logged-in অ্যাডমিন পড়তে/লিখতে পারবে।
--  - পাবলিক ফর্ম submit হবে নিচের create_order() ফাংশন দিয়ে (security definer)।
-- =====================================================================
alter table public.orders enable row level security;
alter table public.notes  enable row level security;

drop policy if exists "admin read orders"   on public.orders;
drop policy if exists "admin update orders"  on public.orders;
drop policy if exists "admin all notes"      on public.notes;

create policy "admin read orders"  on public.orders
  for select to authenticated using (true);

create policy "admin update orders" on public.orders
  for update to authenticated using (true) with check (true);

create policy "admin all notes" on public.notes
  for all to authenticated using (true) with check (true);

-- =====================================================================
--  create_order()  — পাবলিক ফর্ম এই ফাংশন call করবে।
--  ভেতরেই ২৪ ঘণ্টার চেক হয় (একই whatsapp নাম্বার আবার দিলে error)।
--  security definer হওয়ায় RLS bypass করে নিরাপদে insert করে।
-- =====================================================================
create or replace function public.create_order(
  p_name           text,
  p_whatsapp       text,
  p_domain_status  domain_status,
  p_domain_name    text,
  p_office_address text,
  p_hotline        text,
  p_fb_page        text,
  p_youtube        text,
  p_other_socials  text,
  p_gmail          text,
  p_password       text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  -- ২৪ ঘণ্টার লিমিট (whatsapp ভিত্তিক)
  if exists (
    select 1 from public.orders
    where whatsapp = p_whatsapp
      and created_at > now() - interval '24 hours'
  ) then
    raise exception 'RATE_LIMIT' using errcode = 'P0001';
  end if;

  insert into public.orders (
    name, whatsapp, domain_status, domain_name, office_address,
    hotline, fb_page, youtube, other_socials, gmail, password
  ) values (
    p_name, p_whatsapp, p_domain_status, nullif(p_domain_name,''), nullif(p_office_address,''),
    nullif(p_hotline,''), nullif(p_fb_page,''), nullif(p_youtube,''),
    nullif(p_other_socials,''), nullif(p_gmail,''), nullif(p_password,'')
  )
  returning id into new_id;

  return new_id;
end;
$$;

-- পাবলিক (anon) শুধু এই ফাংশনটাই চালাতে পারবে — টেবিলে সরাসরি হাত দিতে পারবে না।
grant execute on function public.create_order(
  text, text, domain_status, text, text, text, text, text, text, text, text
) to anon, authenticated;

-- ---------- Realtime (নতুন order এলে অ্যাডমিন প্যানেলে live আসবে) ----------
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.notes;
