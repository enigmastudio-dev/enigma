-- ============================================================
-- Enigma Studio · Supabase setup
-- Jalankan sekali di Supabase → SQL Editor → New query → Run.
-- ============================================================

-- 1. Tabel isi website (satu baris, id = 'main', isinya JSON)
create table if not exists public.site_content (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- 2. Daftar email yang boleh mengedit (admin)
create table if not exists public.admins (
  email text primary key
);

alter table public.site_content enable row level security;
alter table public.admins       enable row level security;

-- Siapa pun boleh MEMBACA isi website (pengunjung perlu ini)
drop policy if exists "public read site content" on public.site_content;
create policy "public read site content"
  on public.site_content for select
  using (true);

-- Hanya admin yang login yang boleh MENAMBAH / MENGUBAH
drop policy if exists "admins insert site content" on public.site_content;
create policy "admins insert site content"
  on public.site_content for insert to authenticated
  with check (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

drop policy if exists "admins update site content" on public.site_content;
create policy "admins update site content"
  on public.site_content for update to authenticated
  using      (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')))
  with check (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

-- Admin boleh melihat baris emailnya sendiri (dipakai panel untuk cek akses)
drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row"
  on public.admins for select to authenticated
  using (email = (auth.jwt() ->> 'email'));

-- 3. Tabel request dari form "Request Form" di halaman utama
create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  contact     text not null check (char_length(contact) between 1 and 200),
  artist      text check (char_length(artist) <= 20),
  "references" text check (char_length("references") <= 500),
  notes       text check (char_length(notes) <= 4000),
  estimate    text check (char_length(estimate) <= 500),
  status      text not null default 'new' check (status in ('new','replied','accepted','declined'))
);
alter table public.requests enable row level security;

-- Pengunjung (tanpa login) boleh MENGIRIM request baru, status selalu 'new'
drop policy if exists "anyone can submit a request" on public.requests;
create policy "anyone can submit a request"
  on public.requests for insert to anon, authenticated
  with check (status = 'new');

-- Hanya admin yang boleh MELIHAT, MENGUBAH status, dan MENGHAPUS request
drop policy if exists "admins read requests" on public.requests;
create policy "admins read requests"
  on public.requests for select to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

drop policy if exists "admins update requests" on public.requests;
create policy "admins update requests"
  on public.requests for update to authenticated
  using      (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')))
  with check (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

drop policy if exists "admins delete requests" on public.requests;
create policy "admins delete requests"
  on public.requests for delete to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

-- 4. Daftarkan email admin. GANTI dengan email akun admin kamu.
--    Tambah baris lain untuk admin tambahan.
insert into public.admins (email) values
  ('enigma.artstd@gmail.com')
on conflict (email) do nothing;
