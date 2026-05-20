# Website Profil Thoha Firdaus

Website profil akademik dan profesional Dr. Thoha Firdaus, M.Pd.Si. Situs ini menampilkan informasi profil, pendidikan, riset, publikasi, aktivitas digital, serta tautan sosial media.

## Fitur

- Tampilan profil personal yang bersih, responsif, dan profesional.
- Section riset dengan grafik jumlah publikasi dan sitasi per tahun.
- Daftar publikasi relevan dari Google Scholar untuk topik teknologi, pengembangan media, dan fisika.
- Publikasi ditampilkan ringkas sebanyak 5 item terbaru, dengan tombol untuk melihat semua publikasi.
- Informasi pendidikan, pengalaman organisasi, aktivitas digital, dan kontak profesional.
- Footer berisi tautan sosial media dalam bentuk ikon.

## Teknologi

- HTML
- Tailwind CSS 3
- JavaScript vanilla
- GitHub Pages

## Struktur Penting

- `index.html` — halaman utama website.
- `src/input.css` — sumber stylesheet Tailwind dan custom component styles.
- `dist/output.css` — hasil build CSS untuk produksi.
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

## Build CSS

Setelah mengubah `src/input.css` atau class Tailwind di `index.html`, jalankan:

```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify
```

## Catatan Publikasi

Data publikasi disimpan secara statis di `data/publications.json`. Jika data Google Scholar diperbarui, metadata pada file tersebut perlu diperbarui kembali agar daftar publikasi dan grafik mengikuti data terbaru.

## Lisensi

Konten profil, foto, dan data akademik merupakan milik Thoha Firdaus. Kode website mengikuti lisensi project ini.
