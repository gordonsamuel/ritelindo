# Hasil pemeriksaan

Tanggal pemeriksaan: 7 Oktober 2026. Pemeriksaan pada build lokal; belum deployment publik.

| Pemeriksaan | Hasil |
| --- | --- |
| Instalasi dependency dengan lockfile pnpm | Berhasil, frozen lockfile |
| Build Tailwind dan static output | Berhasil |
| Syntax JavaScript aplikasi | Lulus pemeriksaan syntax Node |
| Single H1 dan bahasa halaman Indonesia | Lulus |
| Target anchor internal | Seluruh target ditemukan |
| Referensi stylesheet, JS, dan gambar | Semua file output tersedia |
| Gambar hero | Berhasil dimuat, natural width 1536 px |
| Desktop 1366 × 900 | Hero diperiksa secara visual, tidak ada horizontal overflow |
| Mobile 390 × 844 | Tidak ada horizontal overflow, sticky CTA terlihat |
| Mobile kecil 320 × 720 | Tidak ada horizontal overflow |
| Menu mobile | Terbuka, aria-expanded berubah, menutup setelah memilih navigasi |
| FAQ pembelian satuan | Jawaban terbuka melalui interaksi summary |
| CTA tanpa nomor WA | Dialog pemberitahuan tampil |
| Form konsultasi tanpa nomor WA | Pesan memuat usaha Minimarket, Surabaya, ukuran 6 × 10 m, rencana buka toko baru |
| Console browser selama pemeriksaan | Tidak ada error/warning yang tercatat |
| Build metadata dengan origin HTTPS uji | Canonical, og:url, og:image absolut, robots Allow, dan sitemap lulus |
| Build final | Dikembalikan ke konfigurasi lokal; tidak memakai domain uji |

Ukuran output static terbaru: **2,260,887 byte**. CSS: **29,210 byte**. JS utama: **4,888 byte**. Three.js dan OrbitControls dimuat saat studio dibuka. Ukuran ini bukan skor kecepatan atau Core Web Vitals.

## Belum terverifikasi

- Nomor WhatsApp resmi, keaktifan nomor, dan chat yang benar-benar diterima tim.
- Live demo serta akses repository public: pengguna memilih untuk upload sendiri.
- Skor Lighthouse/PageSpeed, Core Web Vitals, dan perilaku di perangkat iOS/Android fisik.
- Preview sosial dari domain live; metadata absolut akan lengkap setelah `siteUrl` atau domain hosting tersedia.
- Google Ads conversion: hook event tersedia, akun tracking belum dipasang.
- Cakupan rinci promo, harga, lead time, dan spesifikasi katalog yang belum diberikan.

## Pemetaan ke brief

| Kebutuhan PDF | Implementasi |
| --- | --- |
| Single-page landing page B2B | Satu index.html, seluruh section dalam satu halaman |
| CTA Konsultasi WA Gratis | Header, hero, layanan, penutup, sticky mobile; solusi & FAQ punya CTA kontekstual |
| Free konsultasi & layout 3D | Hero, layanan, proses, FAQ |
| Free ongkir Jawa–Bali | Hero, layanan, FAQ |
| Free perakitan Jatim/Jateng/DIY | Strip benefit, layanan, FAQ, catatan footer |
| Custom sesuai ruang | Solusi custom, layanan, FAQ |
| Langsung pabrik & harga kompetitif | Hero, benefit strip, layanan |
| Satuan/paket/proyek | Tiga pilihan solusi, FAQ |
| Jasa interior toko | Solusi proyek, layanan |
| Meta title/description B2B | HTML head |
| Hierarki heading | Satu H1, section H2, subtopik H3 |
| Open Graph | Metadata dasar + URL/image absolut dari domain hosting |
| Responsive dan ringan | Mobile layout, CSS compiled, WebP lokal, JS kecil |
| Repo public & live demo | Paket source, config Vercel/Netlify, panduan upload; belum terbit |

## Pemeriksaan tambahan simulator dan pop-up

- Model WebGL berhasil tampil dengan 6 rak pada contoh ruang 6 × 8 m.
- Nomor rak, dimensi ruang, dan area pintu tampil pada model.
- Tampak atas bekerja.
- Mengubah X rak menjadi 0 memunculkan peringatan melewati batas ruang.
- Geser langsung pada canvas memilih Rak 3 dan mengubah posisi ke X 1,90 m / Y 2,70 m; catatan geometri diperbarui.
- Tambah rak mengubah jumlah 6 menjadi 7; hapus mengembalikannya ke 6.
- Putaran 90° tercantum dalam ringkasan WA bersama catatan jarak yang berubah.
- Susun ulang otomatis menghasilkan susunan contoh tanpa konflik.
- Pop-up tampil di tengah desktop. Pesan bisa diedit pada mobile 390 px tanpa horizontal overflow.
- Nomor kosong membuat tombol lanjut WA tidak aktif. Chat sungguhan belum diuji karena nomor resmi belum tersedia.
- Test geometri otomatis lulus: rotasi tapak, tabrakan, batas ruang, pintu, tinggi, jarak, layout otomatis pada ruang kecil/besar, dan ringkasan pesan.
- Fallback WebGL dan perangkat fisik belum diuji. Pemeriksaan geometri tidak memvalidasi sirkulasi toko secara lengkap.


## Pemeriksaan Studio 360 dan UI

- Drag kamera mengubah sudut 212° menjadi 43° tanpa mengubah koordinat rak 0,90 / 1,60 m.
- Putaran keyboard penuh lulus: 58° → 238° → 58°, tanpa batas azimuth 180°.
- Mode Atur rak mengubah posisi X 0,90 menjadi 1,00 m melalui keyboard, tanpa mencampurkannya dengan orbit.
- Zoom +/−, Denah, dan Reset sudut dapat dioperasikan.
- Duplikat menambah jumlah 6 → 7; Hapus mengembalikan 7 → 6. Catatan konflik pada salinan tampil.
- Inspector Ruangan / Rak / Pemeriksaan beralih sesuai tombol dan pemilihan objek.
- Workspace desktop dibatasi 690 px; footer konsultasi tetap berada di bawah inspector.
- Mobile 390 px: tab, pemilihan rak, mode edit, dan pop-up WA bekerja. Semua tombol kamera tersedia dalam dua baris.
- Desktop 1366 px dan mobile 390/320 px tidak memiliki overflow horizontal.
- Tidak ada error console yang tercatat selama pemeriksaan UI.
- Geometri otomatis tetap lulus. Gesture multitouch pada perangkat fisik belum diuji; dukungannya memakai OrbitControls versi dependency lokal.
- Finish gate diperiksa terhadap DESIGN-CONTRACT.md: hirarki canvas/inspector, hover/focus, loading, empty, selection, collision, keyboard, dan mobile.


## Penyempurnaan UI dan rute halaman

- Desktop 1366 px: halaman utama, pilihan rak, layanan, FAQ, dan workspace 3D ditinjau di browser.
- Mobile 390 px: menu menutup setelah memilih Cara pesan; formulir menyiapkan pesan berisi Minimarket, Surabaya, dan 6 × 8 m; popup menampilkan pesan dan keadaan nomor belum tersedia.
- Tidak ada overflow horizontal pada pemeriksaan desktop dan mobile.
- Tidak ada href anchor hash di HTML. Klik navigasi menghasilkan /pilihan-rak, /layanan, dan /cara-pesan.
- Refresh /pilihan-rak memuat konten dan stylesheet; akses langsung /simulasi-3d membuka studio dan menampilkan 6 rak setelah diaktifkan.
- Tombol kembali dari FAQ mengembalikan /layanan. FAQ membatasi satu pertanyaan terbuka.
- Geometri simulator dan build diperiksa ulang setelah perubahan.
- Rute adalah pintasan ke bagian dalam landing page yang sama, bukan halaman produk terpisah.


## Menu mobile

Panel dropdown diperiksa pada 390 dan 320 piksel tanpa overflow horizontal. Buka/tutup, Escape, klik backdrop, navigasi /pilihan-rak, dan CTA konsultasi bekerja. Konten belakang inert saat menu terbuka. Menutup popup dari menu mengembalikan fokus ke tombol Menu. Build dan pemeriksaan sintaks lulus.


## Katalog Storack

10 preset diperiksa terhadap halaman produk yang dibaca pada 7 Oktober 2026. Uji katalog, konversi cm, varian, identitas custom, pemasangan dinding, sumber pesan, dan layout otomatis lulus. Perhitungan jarak otomatis mendapat toleransi 1 cm untuk pembulatan koordinat. Browser desktop menampilkan 12 Double 30–25 awal tanpa konflik; layout campuran 5 jenis tanpa konflik; single tinggi 200 cm serta rak dinding terpasang 100 cm bekerja. Mobile 390 px memuat pemilihan rak dinding 3 susun, tinggi 60 cm, tambah dan perubahan panjang tanpa overflow horizontal. Tidak ada error console pada pemeriksaan akhir. Model bukan CAD pabrikan; satuan Chiki, panjang dinding, kedalaman Mundo, serta kedalaman Double 35–30 ditandai untuk konfirmasi.

## Pemeriksaan halaman produk

Build berhasil. Pemeriksaan katalog: 21 preset, 18 keluarga produk, varian ukuran, induk aksesoris, dan sumber. Pemeriksaan matematika planner lulus. Browser: pencarian kasir menghasilkan 2 produk; pencarian kosong hasil menampilkan pesan; reset berfungsi. Kasir panjang 125 cm membuka simulator dengan satu meja dan ukuran 125 cm. Hook 15 cm membuka backmesh beserta hook dengan 0 konflik. Menu mobile dapat dibuka/ditutup dengan Escape; popup konsultasi memakai nama produk.


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
