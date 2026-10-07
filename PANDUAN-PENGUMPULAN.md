# Panduan pengumpulan mini test

Tenggat dalam PDF: **Jumat, 9 Oktober 2026, pukul 23.59 WIB**.

## 1. Lengkapi data kontak

Minta nomor WhatsApp resmi Ritelindo, isi `site.config.json`, kemudian jalankan build ulang. Jangan menggunakan nomor sembarang. Periksa semua tombol konsultasi dan pesan dari form sebelum submit.

## 2. Buat repository GitHub public

1. Login GitHub menggunakan akun Anda.
2. Buat repository, misalnya `ritelindo-landing-page`, pilih **Public**.
3. Unggah isi folder project: `src`, `public`, `scripts`, semua config, lockfile, dan dokumentasi.
4. Jangan unggah `node_modules`, token, `.env`, atau arsip ZIP deliverable. `dist` tidak perlu dimasukkan bila hosting melakukan build dari source.
5. Pastikan README tampil dan source dapat diakses dari browser tanpa login.

Jika memakai Git lokal, jalankan dari folder project setelah membuat repository kosong:

```sh
git init
git add .
git commit -m "Build Ritelindo B2B retail shelving landing page"
git branch -M main
git remote add origin https://github.com/USERNAME/ritelindo-landing-page.git
git push -u origin main
```

Ganti USERNAME dan nama repo dengan milik Anda. Jangan memasukkan token ke URL remote atau menyalin token ke chat.

## 3. Buat live demo

Di Netlify atau Vercel, import repo tersebut. Gunakan build `npm run build` dan output `dist`. Setelah domain tersedia, isi `siteUrl` dengan domain sebenarnya dan deploy ulang. Buka URL demo lewat browser tanpa login.

Alternatif tanpa integrasi repository: unggah folder `dist` ke Netlify Drop. Paket `ritelindo-live-demo.zip` berisi output static untuk upload manual; metadata URL masih perlu dibangun ulang setelah domain diketahui.

## 4. Pemeriksaan akhir sebelum kirim

- Nomor WA resmi dan semua CTA menuju nomor yang sama.
- CTA khusus solusi memiliki pesan yang sesuai.
- Form menambahkan jenis usaha, kota, ukuran, dan rencana ke pesan WA.
- Buka di HP dan desktop; tidak ada horizontal scroll atau tombol tertutup.
- Semua manfaat wajib dari PDF tersedia.
- Harga dan testimoni tidak dikarang.
- Canonical, og:url, og:image, twitter:image menggunakan domain live.
- `robots.txt` mengizinkan crawl dan `sitemap.xml` memakai domain live.
- Ukur PageSpeed/Lighthouse pada live demo; catat skor nyata jika ingin menyertakannya.
- Repo **Public** dan live demo dapat dibuka tanpa login.

## 5. Draft balasan email

Draft ini belum dikirim. Ganti bagian dalam kurung siku sebelum menggunakan.

**Subjek:** Re: [Tes Seleksi Awal] Intern WebDev - Ritelindo Akselera Kolaborasi

Yth. Tim Rekrutmen Ritelindo Akselera Kolaborasi,

Terima kasih atas kesempatan mengikuti mini test Web Developer Intern. Berikut hasil landing page B2B Paket Rak Minimarket / Rak Toko yang saya kerjakan:

- Repository GitHub public: [LINK REPOSITORY]
- Live demo: [LINK LIVE DEMO]

Landing page dibuat menggunakan HTML, Tailwind CSS yang dikompilasi lokal, dan JavaScript. Implementasi mencakup tampilan responsive, CTA konsultasi WhatsApp di berbagai bagian, seluruh value proposition yang diminta, hierarki heading, serta metadata SEO dan Open Graph.

Dokumentasi implementasi dan cara menjalankan tersedia pada README repository. Visual hero diberi label sebagai ilustrasi konsep.

Terima kasih atas waktu dan penilaiannya.

Hormat saya,
[NAMA ANDA]
