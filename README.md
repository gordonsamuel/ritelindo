# Ritelindo — Landing Page Paket Rak Minimarket

Implementasi mini test Web Developer Intern: satu halaman B2B untuk pengunjung Google Ads Search yang ingin berkonsultasi tentang rak minimarket dan rak toko. Bahasa halaman: Indonesia.

## Status hasil

- Source lengkap, aset lokal, build static, dan konfigurasi Vercel/Netlify disertakan.
- Nomor WhatsApp resmi belum diberikan. Isi `whatsappNumber` sebelum pengumpulan agar seluruh CTA benar-benar membuka konsultasi.
- URL publik belum diisi. Isi `siteUrl` setelah mendapatkan domain hosting, lalu build/deploy ulang untuk canonical, Open Graph image, robots, dan sitemap.
- Foto hero adalah ilustrasi konsep yang dibuat dengan AI; bukan dokumentasi produk atau proyek Ritelindo. Labelnya tampil di halaman. Wordmark hanya treatment tipografi, bukan logo resmi.
- Tidak mencantumkan harga, testimoni, jumlah pelanggan, sertifikasi, atau klaim performa hasil pengukuran yang belum tersedia.

## Stack dan alasan pemilihan

HTML semantik + Tailwind CSS 4 yang dikompilasi lokal + JavaScript vanilla. Brief mengizinkan HTML + Tailwind. CSS produk berada di layer components dengan token warna terpusat dan utility Tailwind untuk container. Tidak memakai CDN Tailwind, runtime React, database, atau layanan form. Halaman tetap dapat dibaca tanpa JavaScript; konsultasi dan menu seluler memerlukan JavaScript.

Output berupa HTML, CSS, JS, satu gambar WebP, serta modul Three.js lokal yang dimuat ketika simulator dibuka. Struktur ini cocok untuk single-page static site, mudah ditinjau recruiter, dan mengurangi dependensi runtime pada perangkat pengunjung.

## Menjalankan

Memerlukan Node.js 20 atau lebih baru. Pilih salah satu package manager:

```sh
npm install
npm run build
npm run dev
```

Atau gunakan lockfile pnpm yang disertakan:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

Buka `http://127.0.0.1:4173`. Server lokal melayani `dist/`; setelah mengedit source, jalankan build dan refresh browser. Tidak ada hot reload. Untuk melihat hasil build: `npm run preview`.

## Konfigurasi sebelum publikasi

Ubah `site.config.json`:

```json
{
  "siteUrl": "https://domain-demo-anda.netlify.app",
  "whatsappNumber": "",
  "brand": "Ritelindo",
  "defaultMessage": "Halo Ritelindo, saya ingin konsultasi gratis paket rak toko dan layout 3D."
}
```

URL di atas hanya contoh; gunakan URL hosting sebenarnya. Isi nomor resmi dalam format internasional, misalnya awalan `62`, tanpa simbol `+`, spasi, atau tanda hubung. Tidak ada nomor dummy di source. Build memvalidasi format angka, bukan kepemilikan atau keaktifan nomor. Pastikan nomor benar dengan pemilik bisnis.

Jika `siteUrl` kosong, build mencoba `URL`, `DEPLOY_PRIME_URL`, atau `VERCEL_PROJECT_PRODUCTION_URL` dari hosting. URL harus HTTPS. Jika domain belum diketahui, `robots.txt` menolak crawl dan canonical/OG URL/sitemap belum diterbitkan. Setelah memperoleh domain tetap, isi `siteUrl` dan deploy ulang. Jangan menyimpan token atau rahasia dalam config ini: nilainya dikirim ke browser.

## Struktur

```text
src/
  index.html          Konten, heading, metadata, form, dan dialog
  styles.css          Tailwind lokal, token, komponen, responsive
  app.js              CTA WhatsApp, menu, pesan, dialog, clipboard
public/assets/
  store-hero.webp     Ilustrasi konsep yang dioptimasi
scripts/
  build.mjs           Kompilasi CSS dan metadata sesuai URL hosting
  serve.mjs           Server preview lokal
site.config.json      Nomor WA dan URL publik
netlify.toml          Build serta header hosting
vercel.json           Build serta header hosting
pnpm-lock.yaml        Versi dependency terkunci
```

## Alur konversi

1. Hero menyebut kategori produk serta manfaat layout 3D gratis.
2. Pilihan solusi membedakan toko baru, kebutuhan custom, dan proyek retail.
3. Penjelasan layanan menampilkan seluruh value proposition dari brief.
4. Proses dan FAQ menjawab kebutuhan awal calon pembeli tanpa mengarang harga.
5. CTA tersedia di header desktop, hero, solusi, layanan, FAQ, penutup, dan bar tetap pada mobile.
6. Form opsional menyiapkan pesan WA berisi jenis usaha, lokasi, ukuran, dan rencana. Form tidak menyimpan atau mengirim data ke backend. WhatsApp menerima teks ketika tautannya dibuka; pengunjung sendiri mengirim pesan.
7. Semua CTA membuka pop-up dengan pesan yang dapat diedit. Jika nomor kosong, tombol lanjut WA tidak aktif dan pesan dapat disalin. Tidak ada klaim konsultasi berhasil dikirim.

## SEO on-page

- Satu H1 dengan hierarki H2/H3.
- Title keyword: Pabrik Rak Minimarket, Paket Rak Toko.
- Meta description spesifik, bahasa `id`, viewport mobile.
- OG type, locale, site name, title, description, image alt; OG URL/image absolut ditambahkan saat domain tersedia.
- Twitter summary large image dan metadata pendukung.
- Canonical, robots, dan sitemap berdasarkan origin HTTPS hosting.
- Konten HTML dapat dibaca crawler tanpa rendering JavaScript.
- Gambar memiliki alt deskriptif, dimensi, preload, dan fetch priority tinggi.

Structured data testimonial, rating, harga, dan Product offer sengaja tidak ditambahkan karena data tersebut belum terverifikasi.

## Aksesibilitas dan responsive

Navigasi semantik, skip link, label form, focus ring, target tombol minimum 44 px, menu dengan aria-expanded, FAQ native details/summary, dialog native dengan Escape/focus return, feedback clipboard aria-live, dan prefers-reduced-motion. Layout mobile menjadi satu kolom; form tidak memakai field wajib agar konsultasi mudah dimulai.

## Google Ads dan analytics

Hook `whatsapp_click` dengan `cta_placement` tersedia jika `window.dataLayer` sudah dikonfigurasi. Event hanya mencatat klik dengan nomor yang dikonfigurasi, tidak mencatat pesan form. Hook belum terhubung ke akun Google Ads/GTM dan klik tidak membuktikan chat terkirim atau lead valid. Pasang ID resmi serta conversion label, tentukan kebutuhan consent sesuai kebijakan yang berlaku, lalu uji melalui Tag Assistant sebelum mengaktifkan iklan. Tidak ada tracking pihak ketiga aktif pada demo ini.

## Hosting

**Netlify (repository):** Import repository → build command `npm run build` → publish directory `dist`. File `netlify.toml` sudah memuat pengaturan. Hosting perlu akun milik Anda.

**Vercel:** Import repository → framework `Other` → build command `npm run build` → output `dist`. `vercel.json` sudah disertakan.

**Netlify Drop:** Jalankan build, lalu unggah isi/folder `dist` lewat Netlify Drop. Sesudah mendapatkan URL tetap, isi `siteUrl`, build ulang, dan upload ulang agar metadata absolut benar.

Untuk langkah repository dan pengumpulan yang lebih rinci, baca `PANDUAN-PENGUMPULAN.md`. Pemeriksaan aktual dicatat dalam `HASIL-PEMERIKSAAN.md`.

## Batasan

Nomor WA, URL live, foto produk resmi, spesifikasi katalog, harga, detail syarat promo, serta jadwal produksi harus dikonfirmasi ke pihak perusahaan. Simulator 3D interaktif tersedia sebagai gambaran awal penempatan rak. Ukuran rak contoh dan perhitungan geometri sederhana perlu dikonfirmasi ke tim untuk layout final. Tidak ada janji uptime atau skor Lighthouse sebelum pengukuran deployment publik.


## Pembaruan simulator dan pop-up

Studio terbaru menambahkan OrbitControls 360°, zoom/pan, mode kamera dan edit terpisah, kontrol keyboard, duplikasi rak, serta inspector bertab. Kontrak desain ada di `DESIGN-CONTRACT.md`. Source OrbitControls dari versi dependency yang sama disalin ke output lokal saat build; tidak memakai CDN tambahan.

Simulasi penempatan rak 3D ditambahkan sesuai permintaan, lengkap dengan room sizing, tambah/hapus/putar/geser rak, validasi geometri dan ringkasan konsultasi. Detail penggunaan serta batasan ada di SIMULATOR-3D.md. Three.js dimuat hanya setelah tombol simulator ditekan sehingga pengunjung awal tidak perlu memuat engine grafis. Tombol CTA membuka pop-up konsultasi sebelum lanjut ke WhatsApp.


## Animasi scroll

Konten muncul sekali dengan fade dan pergeseran 22 px saat masuk layar, dengan jeda pendek antar-item. Petunjuk panah di hero menuju pilihan rak tanpa hash. Garis oranye di atas mengikuti progres scroll. Implementasi memakai IntersectionObserver dan Web Animations API lokal, tanpa CDN atau dependency tambahan. Pengaturan `prefers-reduced-motion` menonaktifkan efek reveal dan gerakan panah. Fokus keyboard langsung menampilkan konten yang diperlukan. Area kerja 3D tidak diberi transform animasi.

## Navigasi tanpa hash

Tautan `/simulasi-3d`, `/pilihan-rak`, `/layanan`, `/cara-pesan`, `/konsultasi`, dan `/pertanyaan` membuka bagian terkait tanpa `#`. Build menghasilkan folder HTML untuk tiap rute agar tautan langsung dan refresh bekerja pada hosting static. Navigasi di halaman mempertahankan perubahan simulator; refresh memulai simulasi baru. Jalankan preview lewat server, bukan membuka HTML dengan file://.


## Referensi produk Storack

Simulator memiliki 10 preset dari katalog Storack, pilihan tinggi, bentuk single/double/dinding/keranjang/backmesh, dan penandaan ukuran yang perlu dikonfirmasi. Default terbaru Double 30–25 berukuran 90 × 65 × 180 cm. Cara penggunaan dan seluruh sumber terdapat di KATALOG-RAK-STORACK.md. Kontak WA merek tidak diganti.


## Pembaruan katalog dan halaman produk

Katalog lengkap memuat 18 jenis produk dari Storack dengan 21 pilihan awal di simulator. Buka `/produk/` untuk pencarian dan kategori; tiap produk memiliki URL `/produk/nama-produk/`. Tombol Coba di toko 3D meneruskan varian dan ukuran melalui query ke `/simulasi-3d/`, lalu membuka simulator otomatis.

Tambahan: Meja Kasir Standard dan Alfa (panjang 100/125/150/180 cm), Keranjang Jinjing (46,3 × 34 × 22,5 cm), Keranjang Tarik Roda (45,5 × 36 × 40 cm), Trolley Besi 60/100 L, Pricetag Mika (86,3 cm), Stopper tipe 90/70 (aktual 87/67 cm), Single Hook (15/20/25/30 cm), dan Double Hook (25/30 cm).

Kedalaman/tinggi kasir, dimensi luar troli, dan ukuran dudukan aksesoris yang belum tersedia memakai perkiraan yang ditandai di antarmuka. Konsul kecil meja kasir belum dimodelkan karena ukuran tidak tersedia. Gambar katalog merupakan ilustrasi SVG lokal; model 3D sederhana, bukan CAD pabrikan. Harga dan stok tidak diasumsikan.

Aksesoris ditempelkan pada modul penopang; hook memerlukan backmesh. Aksesoris mengikuti posisi penopang, tidak menambah luas lantai, dan ikut terhapus saat penopang dihapus. Ukuran dan kecocokan pemasangan akhir tetap perlu dikonfirmasi.

Sumber tambahan (dibaca 7 Oktober 2026):
- https://www.storack.id/produk/meja-kasir-standard
- https://www.storack.id/produk/meja-kasir-alfa-shelving-depan
- https://www.storack.id/produk/keranjang-jinjing
- https://www.storack.id/produk/keranjang-tarik-roda
- https://www.storack.id/produk/trolley-besi-beroda
- https://www.storack.id/produk/pricetag-label-harga-mika
- https://www.storack.id/produk/stopper-pagar-pembatas-rak
- https://www.storack.id/produk/single-hook-gantungan-ram
- https://www.storack.id/produk/double-hook-gantungan-ram


## Layout otomatis campuran dan tumpukan keranjang

Susun otomatis menata seluruh inventaris yang sudah ditambahkan, mempertahankan jumlah/jenis/ukuran. Algoritma mempertahankan jalur tengah kontinu minimal 1,2 m, area pintu bebas, serta jarak antar-modul minimal 1,2 m atau target yang lebih besar. Kasir dan pengambilan keranjang diprioritaskan di depan, rak satu sisi di tepi, rak dinding dekat dinding penopang. Ruang yang tidak cukup tidak mengganti layout lama; nomor produk yang belum muat ditampilkan.

Keranjang jinjing sejenis disusun dalam satu titik pengambilan, offset visual 8 cm, batas tumpukan 1,2 m. Ukuran nesting belum tersedia sehingga ilustrasi perlu konfirmasi. Keranjang beroda dan troli tidak ditumpuk. Tumpukan mengikuti posisi induk dan hanya memakai satu tapak lantai. Menghapus induk menghapus anggota tumpukan.

Aturan ini merupakan bantuan perencanaan, bukan sertifikasi SOP. Verifikasi dimensi aktual, ruang operator kasir, aksesibilitas, evakuasi, dan operasional toko sebelum implementasi. Tidak ada tautan spesifikasi keluar ke Storack di simulator ataupun halaman produk; catatan asal data tetap disimpan.

Pengujian: check-auto-layout.mjs lulus untuk inventaris campuran, jalur bebas, batas lorong/tumpukan, ruang sempit, dan input tetap utuh. Browser berhasil menata 6 objek campuran di ruang 8 × 10 m tanpa konflik dan menumpuk 3 keranjang jinjing. Build dan pemeriksaan katalog lulus.


## Perilaku final: display seluruh katalog otomatis

Menggantikan perilaku tombol otomatis sebelumnya: Display semua produk membuat inventaris lengkap secara langsung, tanpa input produk satu per satu. Seluruh 18 keluarga / 21 varian muncul sebagai 24 objek (termasuk empat keranjang jinjing sejenis dalam satu tumpukan). Aksesoris dipasang pada rak penopang. Pembukaan studio tanpa tautan produk juga langsung memakai display ini; tautan detail produk tetap membuka produk pilihan saja, dan tombol Display semua produk tersedia pada panel Ruangan.

Jika ukuran ruang tidak cukup, ruang contoh diperbesar bertahap dalam batas simulator dan perubahan dijelaskan di panel. Ukuran contoh bukan ukuran toko pengguna. Contoh awal 6 × 8 m menjadi 7 × 9 m dengan seluruh katalog, jarak minimum 1,2 m, serta jalur tengah bebas. Pemeriksaan otomatis dan browser berhasil: 24 objek, 21 ID varian unik, 0 konflik, tidak ada error browser.


## Penyempurnaan katalog dan navigasi

Katalog memakai kanvas hangat, ilustrasi besar, aksen hijau lembut, kategori yang lebih ringan, dan kartu dengan hover/fokus yang jelas. Gerakan dinonaktifkan sesuai preferensi reduced-motion. Halaman detail menerapkan gaya yang sama. Tombol Kembali ke beranda tersedia di katalog dan setiap detail; detail juga memiliki Semua produk dan breadcrumb Beranda.

Pada landing, Rak satuan & custom memiliki tautan Lihat produk & ukuran menuju /produk/. Pemeriksaan browser memastikan tautan landing membuka katalog, tombol beranda pada katalog/detail membuka root, kategori mobile Keranjang & Troli menghasilkan 3 produk, dan tidak ada overflow horizontal pada layar ponsel. Build berhasil.
