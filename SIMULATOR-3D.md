# Simulasi 3D rak dan pop-up WhatsApp

Fitur tambahan sesuai permintaan: pengunjung dapat mengatur ruang dan penempatan rak sebelum mengonsultasikan kebutuhannya.

## Cara memakai

1. Pilih **Coba layout rak 3D** atau menu **Simulasi 3D**.
2. Tekan **Mulai merancang**. Modul grafis diunduh dari aset lokal hanya ketika dibuka.
3. Pada tab **Ruangan**, atur lebar, panjang, tinggi ruang, serta target jarak antar-rak. Tekan **Terapkan ukuran**.
4. Pada tab **Rak**, pilih model katalog Storack dan tinggi, atau gunakan Custom. Tekan **Tambah rak**, atau pilih rak dan tekan **Terapkan ukuran**. Catatan sumber menunjukkan ukuran yang belum pasti. **Duplikat** membuat salinan dekat rak terpilih; cek catatan jika posisi salinan berkonflik.
5. Mode **Lihat 360°**: drag satu jari/mouse kiri untuk orbit, scroll/cubit untuk zoom, mouse kanan atau dua jari untuk pan. Klik tanpa drag memilih rak. Mode **Atur rak**: drag rak untuk memindahkannya. Posisi juga bisa diubah melalui X/Y.
6. Gunakan **Putar 90°**, tombol zoom +/−, **Denah**, dan **Reset sudut**. Saat canvas memiliki fokus, tombol panah memutar kamera dalam mode 360 atau menggeser rak 10 cm dalam mode edit.
7. Tab **Pemeriksaan** dan footer menampilkan catatan konflik. Pintu contoh berada di tengah sisi depan, dengan area bebas 1,2 × 1,2 m.
8. **Susun otomatis** pada tab Ruangan mengganti susunan menggunakan model dan ukuran yang sedang dipilih. Rak dinding disusun dekat dinding belakang. **Kosongkan** menghapus seluruh rak.
9. Pilih **Konsultasikan layout ini**. Pop-up menampilkan ringkasan ruang, setiap dimensi/posisi rak, putaran, target jarak, dan catatan konflik.
10. Edit pesan, lalu **Lanjut ke WhatsApp** setelah nomor resmi dikonfigurasi. Pengunjung tetap harus mengirim pesan sendiri di WhatsApp.

## Batas simulasi

- Ruang berbentuk persegi panjang, lebar 3–20 m, panjang 3–25 m, tinggi 2–5 m.
- Maksimum 24 modul rak. Dimensi awal Double 30–25 adalah 90 × 65 × 180 cm dari katalog Storack. Ada 10 preset dan pilihan Custom. Sumber, asumsi ukuran, dan batasan visual terdapat di KATALOG-RAK-STORACK.md.
- Posisi X/Y adalah pusat tapak rak dari sudut kiri depan. Di engine 3D, kedalaman memakai sumbu Z; label Y pada halaman adalah koordinat denah.
- Geser rak memakai grid 10 cm. Isian posisi mendukung langkah 10 cm.
- Pemeriksaan memakai persegi panjang tapak rak dengan rotasi 0°/90°, batas ruangan, tinggi, area pintu contoh, tabrakan dan jarak terdekat antar-tapak.
- Jarak adalah jarak lurus terdekat antar-tapak, bukan jaminan lebar semua lorong atau keberadaan jalur ke pintu. Perhitungan tidak memodelkan tiang, jendela, kasir, muatan barang, kapasitas struktur, atau keselamatan bangunan.
- Target 1,2 m adalah nilai contoh yang bisa diubah, bukan klaim standar/regulasi.
- Persentase adalah jumlah luas tapak dibagi luas lantai. Jika tapak bertabrakan atau keluar ruangan, persentase bukan luas penggunaan lantai unik yang valid.
- Hasil hanya tersimpan selama halaman terbuka. Reload mengembalikan contoh awal. Tidak ada backend atau unggahan denah.
- Ringkasan ke WA berupa teks; tidak mengirim file model atau gambar.
- Memerlukan WebGL. Jika WebGL gagal, halaman menampilkan pesan; konten landing page dan pop-up konsultasi tetap tersedia.

## Implementasi

Three.js 0.180.0 dan OrbitControls dari versi yang sama digunakan untuk kamera 360, zoom/pan, picking/drag dengan raycaster, dan render berdasarkan interaksi. Azimuth tidak dibatasi; sudut vertikal dijaga di atas lantai. Tidak ada loop render kontinu, inertia atau auto-rotate. Render kamera digabung lewat requestAnimationFrame; bayangan diperbarui ketika susunan berubah. Renderer dibatasi maksimal device pixel ratio 2. ResizeObserver menjaga proporsi canvas; label rak dan dimensi membantu orientasi.

UI memakai area 3D dominan, inspector Ruangan/Rak/Pemeriksaan, ringkasan metrik, dan footer konsultasi. Tinggi desktop 690 px; mobile beralih ke susunan vertikal.

Model dan logic ada pada `src/planner.js` dan `src/planner-math.mjs`. Build menyalin modul Three.js dan lisensi ke output lokal. Tidak ada CDN atau request pihak ketiga untuk simulator.

Pemeriksaan geometri dapat dijalankan dengan:

```sh
node scripts/check-planner.mjs
```

## Pop-up konsultasi

Semua CTA utama membuka pop-up yang sama, termasuk tombol WA mengambang dan sticky mobile. Pesan dapat diedit. Form konsultasi memasukkan kebutuhan usaha; simulator memasukkan ringkasan layout. Tombol lanjut hanya memiliki URL WA ketika nomor resmi tersedia dan pesan tidak kosong. Analytics `whatsapp_click` baru dipicu pada klik lanjut, bukan ketika membuka pop-up.

Isi nomor di `site.config.json` lalu build ulang. Nomor dummy tidak digunakan. Ini pop-up konsultasi, bukan layanan live chat atau bot; tidak menampilkan status online palsu.


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
