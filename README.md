# 📊 SIAK — Sistem Informasi Akuntansi Keuangan

**SIAK** adalah sistem akuntansi keuangan profesional berbasis web yang dibangun menggunakan [Vite](https://vitejs.dev/) dan dapat dengan mudah di-deploy di [Vercel](https://vercel.com). Dirancang untuk bisnis manufaktur makanan dan minuman, SIAK menyediakan alat lengkap untuk pencatatan transaksi, pelaporan keuangan, dan manajemen akun dengan fokus pada akurasi dan kemudahan penggunaan.

🔗 **Demo Langsung**: [https://sikeu.vercel.app](https://sikeu.vercel.app)  
🔗 **GitHub**: [https://github.com/hoed/siak](https://github.com/hoed/siak)

---

## ✨ Fitur Utama

- 📚 **Chart of Accounts (CoA)** — Struktur akun yang dapat disesuaikan untuk pelacakan keuangan yang akurat.
- 🔄 **CRUD Kategori Pemasukan & Pengeluaran** — Manajemen kategori transaksi yang fleksibel.
- 💰 **Manajemen Transaksi** — Mencatat dan mengelola pemasukan dan pengeluaran.
- 📉 **Pelacakan Utang** — Memantau dan mengelola utang yang belum dibayar.
- 📈 **Pelacakan Piutang** — Melacak dan mengelola piutang secara efisien.
- 🏦 **Manajemen Rekening Bank** — Mengelola banyak rekening bank dengan mudah.
- 🧮 **Perhitungan Otomatis** — Komputasi real-time atas saldo dan transaksi.
- 👤 **Manajemen Pengguna** — Kelola profil pengguna dan hak akses.
- 🛡️ **Akses Berbasis Peran** — Administrator dan Manajemen untuk kontrol yang aman.
- 📅 **Filter Laporan Keuangan** — Laporan harian, mingguan, dan bulanan.
- 🔁 **Arus Kas** — Pantau uang masuk dan keluar.
- 🔑 **Manajemen Kata Sandi** — Update password secara aman.
- 📆 **Dashboard Ringkasan** — Ringkasan harian, bulanan, dan tahunan.
- 🧾 **Laporan Transaksi** — Laporan harian, bulanan, dan tahunan.
- 📅 **Tampilan Kalender** — Kalender interaktif untuk kegiatan finansial.
- 📊 **Grafik Keuangan** — Visualisasi pemasukan/pengeluaran bulanan dan tahunan.
- 🖼️ **Kustomisasi Profil** — Pengguna bisa unggah foto profil mereka.
- 👥 **Dukungan Multi-User** — Administrator dan Manajemen login.
- 📋 **Laporan Pemotongan Pajak** — Ringkasan pemotongan pajak tahunan.
- 📦 **Inventaris Produk & Aset** — Kelola stok produk dan aset tetap.
- 📘 **Kas Buku Besar (General Ledger)** — Rekap lengkap semua transaksi.

---

## 🚀 Teknologi yang Digunakan

- **Frontend:** Vite
- **Styling:** Tailwind CSS
- **Penyimpanan Data:** LocalStorage
- **Deployment:** Vercel

---

## ⚙️ Instalasi & Jalankan Lokal

```bash
git clone https://github.com/hoed/siak.git
cd siak
npm install
npm run dev
```

Akses aplikasi di: [http://localhost:5173](http://localhost:5173)

---

## 🧾 Struktur Proyek

```
siak/
├── public/             # Aset publik (ikon, gambar)
├── src/
│   ├── components/     # Komponen UI
│   ├── pages/          # Halaman aplikasi
│   ├── utils/          # Fungsi utilitas
│   ├── assets/         # Aset statis
│   └── App.jsx         # Komponen utama
├── index.html          # Titik masuk HTML
└── vite.config.js      # Konfigurasi Vite
```

---

## 🌐 Deployment ke Vercel

1. Login ke Vercel.
2. Hubungkan GitHub repo: `hoed/siak`
3. Klik **Deploy**
4. Akses: [https://sikeu.vercel.app](https://sikeu.vercel.app)

---

## 👥 Peran & Hak Akses

| Peran         | Hak Akses                                                                 |
|---------------|---------------------------------------------------------------------------|
| Administrator | Akses penuh: data master, pengguna, akun, transaksi, dan pengaturan       |
| Manajemen     | Input transaksi, lihat laporan, grafik, ubah password & profil            |

Pengguna dapat mengubah foto profil & kata sandi mereka.

---

## 📸 Fitur Dashboard

- **Ringkasan Keuangan:** Pendapatan/pengeluaran harian, bulanan, tahunan.
- **Kalender Interaktif:** Jadwal dan peristiwa keuangan.
- **Grafik Tren Keuangan:** Visualisasi tahunan dan bulanan.
- **Transaksi Terkini:** Aktivitas terbaru.
- **Inventaris:** Pantau produk dan aset.
- **Ringkasan Buku Besar:** Statistik penting dari buku besar.

---

## 📊 Fitur Pelaporan

- 🧾 **Laporan Transaksi:** Harian, bulanan, dan tahunan.
- 📋 **Laporan Pemotongan Pajak:** Ringkasan tahunan untuk keperluan pajak.
- 📦 **Laporan Inventaris:** Stok produk dan aset.
- 📘 **Kas Buku Besar:** Catatan lengkap transaksi keuangan.

---

## 💡 Praktik Terbaik

- Gunakan kategori untuk efisiensi pelaporan.
- Tinjau grafik secara berkala.
- Sesuaikan CoA dengan struktur bisnis.
- Jaga inventaris tetap akurat.
- Gunakan laporan pajak untuk kepatuhan tahunan.

---

## 👨‍💻 Kontribusi

1. Fork repo ini
2. Buat branch baru: `feature/nama-fitur`
3. Commit dan push
4. Buat pull request

Laporkan bug/saran via [GitHub Issues](https://github.com/hoed/siak/issues)

---

## 📄 Lisensi

MIT License © [hoed](https://github.com/hoed)
