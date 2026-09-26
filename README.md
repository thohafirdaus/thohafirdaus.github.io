# Website Profil Thoha Firdaus

Website profil akademik dan profesional Dr. Thoha Firdaus, M.Pd.Si. Situs ini menampilkan informasi profil, pendidikan, riset, publikasi, aktivitas digital, serta tautan sosial media.

## Fitur

- Tema "laboratorium kosmik" bernuansa fisika: medan partikel interaktif, orbit atom, dan animasi saat di-scroll.
- Section riset dengan grafik jumlah publikasi dan sitasi per tahun, serta total sitasi, h-index, dan i10-index yang dihitung otomatis.
- Daftar seluruh publikasi dari Google Scholar lengkap dengan jumlah sitasi dan fitur pencarian.
- Publikasi ditampilkan ringkas sebanyak 6 item terbaru, dengan tombol untuk melihat semua publikasi.
- Informasi pendidikan, pengalaman organisasi, aktivitas digital, dan kontak profesional.
- Footer berisi tautan sosial media dalam bentuk ikon.

## Teknologi

- HTML
- CSS murni (tanpa build step)
- JavaScript vanilla
- GitHub Pages

## Struktur Penting

- `index.html` — halaman utama website.
- `css/style.css` — seluruh stylesheet dan animasi.
- `js/main.js` — interaksi, efek partikel, grafik, dan daftar publikasi.
- `data/publications.json` — metadata publikasi yang digunakan untuk daftar publikasi dan grafik riset.
- `img/` — aset gambar dan logo.

## Menjalankan Secara Lokal

Jalankan server statis dari root project:

```bash
python3 -m http.server 4173
```

Lalu buka:

```text
http://127.0.0.1:4173
```

## Catatan Publikasi

Data publikasi disimpan secara statis di `data/publications.json`. Jika data Google Scholar diperbarui, metadata pada file tersebut perlu diperbarui kembali agar daftar publikasi dan grafik mengikuti data terbaru.

## Lisensi

Konten profil, foto, dan data akademik merupakan milik Thoha Firdaus. Kode website mengikuti lisensi project ini.
