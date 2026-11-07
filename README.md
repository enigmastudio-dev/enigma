# Enigma Studio · Website + Panel Admin (Vercel)

Website commission Enigma Studio dengan panel admin di `/admin`. Admin login dengan email dan password, lalu bisa:

- melihat dan mengelola **request masuk** dari form di halaman utama (status: baru, sudah dibalas, diterima, ditolak)
- mengubah link kontak Discord, X/Twitter, email, dan link tombol **Open Trello board**
- mengubah harga ilustrasi, model art, rig, paket, diskon bundle, dan add-on
- mengubah status buka/tutup, tagline, data tim, antrean **Where's my file?**, ToS, FAQ, toggles, dan galeri
- membuat backup dan memulihkan isi (file JSON)

Hosting di **Vercel**, data dan login di **Supabase**. Selama Supabase belum tersambung, situs berjalan dalam **mode demo**: semua fitur bisa dicoba, tapi data hanya tersimpan di browser yang dipakai.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Halaman utama untuk pengunjung |
| `admin.html` | Panel admin (dibuka di `/admin`) |
| `api/config.js` | Vercel Function: membaca kunci Supabase dari Environment Variables |
| `vercel.json` | Pengaturan Vercel (URL bersih, `/admin` tidak diindeks Google) |
| `js/config.js` | Isian manual kunci Supabase, hanya kalau tidak memakai Vercel |
| `js/content-default.js` | Isi awal / contoh |
| `js/store.js`, `js/site.js`, `js/admin.js` | Logika situs, form, dan panel |
| `css/site.css` | Tampilan (tema gelap/terang) |
| `assets/` | Maskot dan font Space Age |
| `supabase/setup.sql` | Skrip pembuatan tabel dan aturan akses |

## Langkah 1 · Upload ke Vercel

Pilih salah satu cara:

**A. Lewat GitHub (disarankan, gampang di-update)**
1. Buat repository baru di GitHub, lalu unggah isi folder ini (tombol "uploading an existing file" di halaman repo).
2. Di vercel.com pilih **Add New → Project**, lalu import repository tadi.
3. Framework Preset: **Other**. Biarkan Build Command dan Output Directory kosong. Klik **Deploy**.
4. Setiap kali file di GitHub diubah, Vercel otomatis deploy ulang.

**B. Lewat Vercel CLI**
1. Install Node.js, buka terminal di folder ini.
2. Jalankan `npx vercel` lalu ikuti pertanyaannya (login, buat project baru).
3. Jalankan `npx vercel --prod` untuk menerbitkan ke domain utama.

## Langkah 2 · Sambungkan Supabase

**A. Lewat Vercel Marketplace (paling praktis)**
1. Di project Vercel, buka tab **Storage** (atau **Integrations**), pilih **Supabase**, lalu buat database baru dan sambungkan ke project ini.
2. Vercel otomatis menambahkan Environment Variables Supabase ke project. `api/config.js` membaca `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (juga varian `PUBLISHABLE_KEY`).
3. Buka dashboard Supabase dari halaman integrasi tersebut untuk Langkah 3.

**B. Pakai project Supabase yang sudah ada**
1. Di Supabase: **Project Settings → API**, salin **Project URL** dan kunci **anon / publishable**.
2. Di Vercel: **Settings → Environment Variables**, tambahkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.

Setelah Environment Variables ditambahkan, **Redeploy** project (tab Deployments → titik tiga → Redeploy) supaya nilainya terbaca.

Jangan pernah menaruh kunci **service_role** di file situs. Kunci anon aman dipakai di browser karena aturan akses di `setup.sql` membatasi siapa yang boleh mengubah data.

## Langkah 3 · Siapkan database dan akun admin

1. Di Supabase buka **SQL Editor → New query**, tempel isi `supabase/setup.sql`, ganti email di bagian paling bawah dengan email admin, lalu **Run**.
2. Buka **Authentication → Users → Add user**. Buat user dengan email yang sama dan password yang kuat (centang auto-confirm jika ada).
3. Di pengaturan Authentication, **matikan pendaftaran user baru** supaya orang lain tidak bisa membuat akun sendiri.
4. Buka `https://domainkamu.vercel.app/admin`, login, dan cek label di kiri atas sudah berbunyi **LIVE · Supabase**.

Untuk menambah admin lain: buat user baru di Supabase lalu jalankan

```sql
insert into public.admins (email) values ('admin2@contoh.com');
```

## Memakai panel admin

- **Request masuk:** semua kiriman form tampil di sini. Ganti status atau hapus langsung, tanpa tombol Simpan.
- **Bagian lain:** ubah isinya, lalu tekan **Simpan & terbitkan**. Pengunjung melihat isi baru saat membuka atau memuat ulang halaman. Tidak perlu deploy ulang.
- **Backup:** unduh file JSON sebelum perubahan besar.

## Catatan

- **Domain sendiri:** Vercel → Settings → Domains.
- **Gambar galeri:** isi "Link gambar" dengan URL gambar yang sudah diunggah, misalnya dari Supabase Storage (bucket publik).
- **Font Space Age:** pastikan studio punya lisensi komersial. Kalau tidak, hapus `assets/space-age.ttf`; judul otomatis memakai Orbitron.
- **Notifikasi request:** belum ada email otomatis. Cek menu Request masuk secara berkala, atau minta dibuatkan notifikasi email/Discord sebagai langkah berikutnya.
