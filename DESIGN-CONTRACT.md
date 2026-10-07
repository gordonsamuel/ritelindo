# Kontrak desain — Studio Layout Ritelindo

Objek utama adalah ruang toko dan modul rak; aktivitas utama adalah melihat susunan, menyesuaikan penempatan, dan membawa rencana ke konsultasi.

- Pertahankan biru pabrik, putih, oranye rak, dan hijau hanya untuk kontak/seleksi yang bermakna.
- Canvas menjadi area dominan. Inspector memakai tiga bagian: Ruangan, Rak, Pemeriksaan. Tinggi desktop dibatasi; footer konsultasi selalu mudah ditemukan.
- Pisahkan Lihat 360° dan Atur rak. Putaran kamera tidak memindahkan produk. Klik memilih; drag memindahkan hanya dalam mode edit.
- Tampilkan metrik ruang yang berguna, bukan badge dekoratif. Catatan konflik terhubung ke objek dan warna merah.
- Gunakan batas ruang, tekstur material, bayangan, label rak, dan area pintu untuk orientasi model. Hindari ilustrasi UI palsu.
- Default, loading, gagal WebGL, kosong, rak terpilih, konflik, batas jumlah, mobile, keyboard, dan reduced motion harus tetap jelas.
- Tombol fokus minimum 44 px, label field eksplisit, status aksi terlihat, dan pop-up konsultasi tetap editable.
- Jangan menambah testimoni atau bukti usaha yang belum diberikan. Tidak memakai full-screen animasi pemasaran.

Pemeriksaan akhir: orbit seluruh azimuth, zoom/pan, pemisahan mode drag, tab inspector, rotasi/duplikasi/hapus, ukuran ruang, konflik, pop-up, desktop/mobile tanpa overflow.


## Penyempurnaan seluruh halaman

Bahasa konkret tentang rak dan ukuran ruang; headline bukan slogan abstrak. Pilihan produk memakai kolom katalog putih dengan garis pemisah, bukan tumpukan kartu. Proses menjadi daftar vertikal di ponsel. Navy menandai layanan dan studio, oranye menandai tindakan utama. Satu CTA tetap di bawah ponsel; launcher tambahan disembunyikan. Navigasi aktif, fokus keyboard, FAQ terbuka, dan pesan siap edit memberi umpan balik yang jelas.


## Penyempurnaan katalog dan navigasi

Katalog memakai kanvas hangat, ilustrasi besar, aksen hijau lembut, kategori yang lebih ringan, dan kartu dengan hover/fokus yang jelas. Gerakan dinonaktifkan sesuai preferensi reduced-motion. Halaman detail menerapkan gaya yang sama. Tombol Kembali ke beranda tersedia di katalog dan setiap detail; detail juga memiliki Semua produk dan breadcrumb Beranda.

Pada landing, Rak satuan & custom memiliki tautan Lihat produk & ukuran menuju /produk/. Pemeriksaan browser memastikan tautan landing membuka katalog, tombol beranda pada katalog/detail membuka root, kategori mobile Keranjang & Troli menghasilkan 3 produk, dan tidak ada overflow horizontal pada layar ponsel. Build berhasil.
