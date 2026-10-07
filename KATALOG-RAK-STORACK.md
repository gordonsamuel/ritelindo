# Referensi rak Storack untuk simulator

Dibaca dari halaman produk Storack pada 7 Oktober 2026. Data masuk ke `src/rack-catalog.mjs`, dibundel lokal saat build, dan tidak mengambil data langsung setiap kali pengunjung membuka simulator. Nama dan angka merupakan referensi katalog; model 3D dibangun ulang secara sederhana untuk penempatan, bukan file CAD pabrikan.

Urutan ukuran simulator: panjang sepanjang shelving × kedalaman tapak × tinggi. Angka tabel dalam cm, kecuali catatan Chiki tentang satuan yang tidak dicantumkan.

| Pilihan | Panjang | Kedalaman | Pilihan tinggi | Sumber |
|---|---:|---:|---|---|
| Single 30–25 | 90 | 35 | 120 / 150 / 180 / 200 | [Produk](https://www.storack.id/produk/rak-single-30-25) |
| Single 35–30 | 90 | 35 | 120 / 150 / 180 / 200 | [Produk](https://www.storack.id/produk/rak-single-35-30) |
| Double 30–25 | 90 | 65 | 120 / 150 / 180 | [Produk](https://www.storack.id/produk/rak-double-30-25) |
| Double 35–30 | 90 | 65, perlu konfirmasi | 120 / 150 / 180 | [Produk](https://www.storack.id/produk/rak-gudang-35-30) |
| Dinding 2 susun | Belum tercantum; contoh 90 | Shelving 25 / 30 | 60 / 80 | [Produk](https://www.storack.id/produk/rak-dinding-2-susun) |
| Dinding 3 susun | Belum tercantum; contoh 90 | Shelving 25 / 30 | 60 / 80 | [Produk](https://www.storack.id/produk/rak-dinding-3-susun) |
| Chiki sedang | 50 | 30 | 120 | [Produk](https://www.storack.id/produk/rak-keranjang-chiki) |
| Chiki besar | 90 | 30 | 120 | [Produk](https://www.storack.id/produk/rak-keranjang-chiki) |
| Mundo Backmesh Kaki | 90 | Belum tercantum; contoh 40 | 120 / 150 / 180 / 200 | [Produk](https://www.storack.id/produk/rak-mundo-rak-backmesh-kaki) |
| Mundo Backmesh Tiang | 90 | Belum tercantum; contoh 40 | 120 / 150 / 180 / 200 | [Produk](https://www.storack.id/produk/rak-mundo-rak-backmesh-tiang) |

## Catatan spesifikasi

- Single 30–25: shelving dasar 30 dan atas 25; tapak total yang tertulis 35. Single 35–30: dasar 35 dan atas 30; total yang tertulis tetap 35.
- Double 30–25: shelving dasar 30 dan atas 25 per sisi. Double 35–30: dasar 35 dan atas 30 per sisi, tetapi halaman tetap menulis total 65. Angka ini tidak dikoreksi diam-diam; model menyesuaikan tapak dan menampilkan catatan konfirmasi. URL double 35–30 menggunakan slug `rak-gudang-35-30`, tetapi judul dan kategori halamannya Rak Double.
- Halaman double menyebut rak end 70 cm, tanpa spesifikasi lengkap. Rak end tidak ditambahkan sebagai produk mandiri berdasarkan angka ini saja.
- Halaman Chiki menuliskan P × L × T tanpa satuan. Simulator menggunakan asumsi cm yang ditandai pada antarmuka dan pesan konsultasi.
- Rak dinding dipasang pada ketinggian dasar yang pengguna tentukan; nilai awal 100 cm bukan spesifikasi Storack. Panjang 90 cm untuk rak dinding dan kedalaman 40 cm untuk Mundo adalah asumsi yang harus dikonfirmasi.
- Warna Mundo Kaki disebut putih; warna tiang Mundo Tiang disebut merah. Bentuk mesh, braket, jumlah susun gondola/keranjang, ketebalan material, dan detail manufaktur hanya visualisasi sederhana.
- Tidak ada harga atau data stok pasti yang diimpor. Berat muatan, struktur bangunan, dan kekuatan braket tidak dihitung oleh simulator.
- Kontak WhatsApp Ritelindo tidak diubah menjadi kontak Storack. Referensi ini tidak menyatakan semua produk tersedia dari Ritelindo atau adanya afiliasi merek.

## Penggunaan

Buka tab Rak, pilih model dan tinggi, lalu Tambah rak atau Terapkan ukuran pada rak terpilih. Kedalaman rak dinding dapat diubah menjadi 25 atau 30 cm. Pilihan Custom tetap tersedia. Perubahan terhadap dimensi katalog ditandai sebagai ukuran disesuaikan dalam ringkasan konsultasi.

Rak dinding otomatis dicoba dekat dinding belakang. Putar 90° dan atur posisi agar dekat dinding kanan. Pemeriksaan meliputi ketinggian dasar + tinggi rak serta kedekatan ke dinding penopang. Pemeriksaan tabrakan tetap menggunakan proyeksi tapak secara konservatif, termasuk rak gantung; ini bukan validasi struktur atau jalur sirkulasi lengkap.

Jalankan `node scripts/check-catalog.mjs` dan `node scripts/check-planner.mjs` untuk pemeriksaan dimensi, sumber, asumsi, konversi satuan, jarak, dan pemasangan.


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
