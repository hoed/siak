# 📊 SIAK — Sistem Informasi Akuntansi Keuangan

**SIAK** adalah aplikasi keuangan berbasis web yang dibangun menggunakan [Vite](https://vitejs.dev/), dan dapat langsung dideploy di [Vercel](https://vercel.com). Aplikasi ini dirancang untuk mengelola keuangan pribadi atau bisnis kecil, dengan fitur-fitur lengkap seperti pencatatan transaksi, laporan keuangan, dan pengelolaan akun.

Live demo: [https://sikeu.vercel.app](https://sikeu.vercel.app)

---

## ✨ Fitur Utama

1. 📚 **Chart of Account (CoA)**
2. 🔄 CRUD kategori pengeluaran dan pemasukan
3. 💰 Manajemen transaksi pengeluaran dan pemasukan
4. 📉 Pencatatan utang
5. 📈 Pencatatan piutang
6. 🏦 Manajemen akun rekening bank
7. 🧮 Perhitungan otomatis pengeluaran dan pemasukan tiap rekening
8. 👤 Manajemen data pengguna aplikasi
9. 🛡️ Hak akses: **Administrator** dan **Manajemen**
10. 📅 Filter laporan keuangan berdasarkan tanggal (harian, mingguan, bulanan)
11. 🗂️ Filter laporan keuangan berdasarkan kategori
12. 🔁 Pencatatan arus kas (cash flow)
13. 🔑 Fitur ganti password
14. 📆 Ringkasan pendapatan harian, bulanan, tahunan, dan total di dashboard
15. 🧾 Ringkasan pengeluaran harian, bulanan, tahunan, dan total di dashboard
16. 📅 Tersedia kalender di dashboard
17. 📊 Grafik pengeluaran & pemasukan per bulan
18. 📈 Grafik pengeluaran & pemasukan per tahun
19. 🖼️ Pengguna bisa mengganti foto profil sendiri
20. 👥 Multi-user login (admin dan manajemen)

---

## 🚀 Teknologi yang Digunakan

- **Frontend:** Vite + JavaScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **State & Data:** LocalStorage

---

## ⚙️ Cara Install dan Jalankan di Lokal

### 1. Clone repositori

```bash
git clone https://github.com/hoed/siak.git
cd siak
npm install
npm run dev

🛠️ Pengembangan
Menambahkan Fitur Baru
Tambahkan komponen baru di folder src/components
Tambahkan route atau logika di src/pages
Simpan data sementara di localStorage atau tambahkan backend jika diperlukan

🌐 Deployment
SIAK didesain untuk bisa dideploy langsung ke Vercel. Cukup login ke Vercel, connect ke repo GitHub ini, dan klik Deploy. Done!

👥 Hak Akses

Peran	Hak Akses
Administrator	Semua fitur, termasuk pengelolaan user, pengaturan akun, data master
Manajemen	Input transaksi, lihat laporan, akses dashboard

📸 Tampilan Dashboard
Ringkasan total pendapatan & pengeluaran
Kalender
Grafik per bulan dan per tahun
Daftar transaksi terakhir

👨‍💻 Kontribusi
Pull request sangat diterima. Kalau kamu menemukan bug atau ingin menambahkan fitur, silakan fork dan ajukan PR.

📄 Lisensi
MIT License © hoed
