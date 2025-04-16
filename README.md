Berikut ini adalah **README lengkap dalam satu file Markdown (`README.md`)**, yang bisa langsung kamu **copy-paste seluruhnya sekaligus**:

---

```markdown
# 📊 SIAK — Sistem Informasi Akuntansi Keuangan

**SIAK** adalah aplikasi keuangan berbasis web yang dibangun menggunakan [Vite](https://vitejs.dev/), dan dapat langsung dideploy di [Vercel](https://vercel.com). Aplikasi ini dirancang untuk mengelola keuangan pribadi atau bisnis kecil, dengan fitur-fitur lengkap seperti pencatatan transaksi, laporan keuangan, dan pengelolaan akun.

🔗 Live demo: [https://sikeu.vercel.app](https://sikeu.vercel.app)  
🔗 GitHub: [https://github.com/hoed/siak](https://github.com/hoed/siak)

---

## ✨ Fitur Utama

1. 📚 Chart of Account (CoA)
2. 🔄 CRUD kategori pengeluaran dan pemasukan
3. 💰 Manajemen transaksi pengeluaran dan pemasukan
4. 📉 Pencatatan utang
5. 📈 Pencatatan piutang
6. 🏦 Manajemen akun rekening bank
7. 🧮 Perhitungan otomatis pengeluaran dan pemasukan tiap rekening
8. 👤 Manajemen data pengguna aplikasi
9. 🛡️ Hak akses: Administrator dan Manajemen
10. 📅 Filter laporan keuangan berdasarkan tanggal (harian, mingguan, bulanan)
11. 🗂️ Filter laporan keuangan berdasarkan kategori
12. 🔁 Pencatatan arus kas (cash flow)
13. 🔑 Fitur ganti password
14. 📆 Ringkasan pendapatan harian, bulanan, tahunan, dan total di dashboard
15. 🧾 Ringkasan pengeluaran harian, bulanan, tahunan, dan total di dashboard
16. 📅 Kalender di dashboard
17. 📊 Grafik pengeluaran & pemasukan per bulan
18. 📈 Grafik pengeluaran & pemasukan per tahun
19. 🖼️ Pengguna bisa mengganti foto profil sendiri
20. 👥 Multi-user login (Administrator & Manajemen)

---

## 🚀 Teknologi yang Digunakan

- **Frontend:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** LocalStorage
- **Deployment:** [Vercel](https://vercel.com)

---

## ⚙️ Cara Install dan Jalankan di Lokal

### 1. Clone repositori

```bash
git clone https://github.com/hoed/siak.git
cd siak
```

### 2. Install dependencies

Pastikan kamu sudah menginstall Node.js terlebih dahulu.

```bash
npm install
```

### 3. Jalankan aplikasi secara lokal

```bash
npm run dev
```

Akses aplikasinya di: [http://localhost:5173](http://localhost:5173)

---

## 🧾 Struktur Folder (Ringkasan)

```
siak/
├── public/             # Asset publik
├── src/
│   ├── components/     # Komponen UI
│   ├── pages/          # Halaman aplikasi
│   ├── utils/          # Fungsi utilitas
│   ├── assets/         # Ikon & gambar
│   └── App.jsx         # Root App
├── index.html
└── vite.config.js
```

---

## 🌐 Deployment

SIAK didesain agar bisa langsung dideploy ke [Vercel](https://vercel.com):

1. Login ke Vercel
2. Connect repo GitHub: `hoed/siak`
3. Klik **Deploy**
4. Aplikasi siap online di [https://sikeu.vercel.app](https://sikeu.vercel.app)

---

## 👥 Hak Akses & Login

| Role         | Akses Fitur                                                                 |
|--------------|-----------------------------------------------------------------------------|
| Administrator| Akses penuh: data master, user, akun, semua transaksi dan pengaturan       |
| Manajemen    | Input transaksi, lihat laporan, akses grafik, ubah password dan profil     |

Setiap user bisa mengatur foto profil dan password mereka sendiri.

---

## 📸 Dashboard

- Ringkasan pendapatan & pengeluaran harian, bulanan, tahunan
- Kalender aktif
- Grafik keuangan per bulan & tahun
- Data transaksi terbaru

---

## 💡 Tips Penggunaan

- Gunakan fitur kategori untuk memudahkan analisis keuangan
- Cek grafik rutin untuk melihat tren pemasukan dan pengeluaran
- Buat CoA yang sesuai dengan kebutuhan bisnismu

---

## 👨‍💻 Kontribusi

Pull request dan issue sangat diterima!  
Untuk kontribusi:

1. Fork repositori ini
2. Buat branch fitur (`feature/nama-fitur`)
3. Push dan buat pull request

---

## 📄 Lisensi

MIT License © [hoed](https://github.com/hoed)
```

---
