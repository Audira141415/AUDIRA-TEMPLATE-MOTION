# Audira Skill Motion 3D — Mulai di Sini

*Versi 3.0.0 Commercial Release — By Audira (Agus Dwi Rianto)*

**Audira Skill Motion** adalah *skill* cerdas untuk Claude Code yang menciptakan **video animasi 3D sinematik vertikal (9:16)** berkualitas tinggi dari ide cerita Anda, atau dari naskah + narasi audio (Voice-Over MP3). 

Anda tidak perlu memiliki keahlian coding atau 3D modelling. Cukup deskripsikan ide Anda; Claude akan memilih gaya terbaik dari **20 signature styles**, menyiapkan panggung 3D, menyajikan preview cepat, lalu merender video final **1080×1920 pada 60 FPS**.

---

## 3 Langkah Cepat Memulai

1. **Siapkan Komputer** (sekali saja): Pasang Claude Code, Node.js, dan ffmpeg → lihat [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md).
2. **Pasang Skill ini** ke Claude Code → lihat [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md), bagian "Pasang Skill".
3. **Ketik di Claude Code:**

   ```bash
   /audira-motion Aku mau bikin video evolusi kamera dari kamera film sampai mirrorless modern.
   ```

   *(Perintah lama `/voynann-motion` tetap didukung sebagai alias kompatibilitas).*

Claude akan menanyakan apakah Anda menggunakan rekaman suara (voice-over), lalu segera merancang video Anda.

---

## Indeks Panduan Lengkap

| File | Isi & Tujuan |
|---|---|
| [`README.md`](README.md) | Ikhtisar produk, arsitektur, dan katalog 20 signature styles |
| [`LICENSE.md`](LICENSE.md) | Lisensi perangkat lunak komersial berbayar resmi (By Agus Dwi Rianto) |
| [`LICENSE_AND_REQUIREMENTS.md`](LICENSE_AND_REQUIREMENTS.md) | Persyaratan sistem, lisensi komersial, dan lisensi pihak ketiga |
| [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md) | Kebutuhan perangkat dan instruksi instalasi lengkap |
| [`USER_GUIDE.md`](USER_GUIDE.md) | Alur kerja: pengajuan ide, review preview, revisi, dan render final |
| [`EXAMPLE_PROMPTS.md`](EXAMPLE_PROMPTS.md) | Contoh ide prompt yang siap dijalankan untuk seluruh 20 gaya |
| [`BRAND_KIT.md`](BRAND_KIT.md) | Panduan penyelarasan identitas brand (`audira-brand.json`) |
| [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) | Panduan pemecahan masalah dan pesan error |
| [`CHANGELOG.md`](CHANGELOG.md) | Riwayat pembaruan dan rilis versi |

---

## Hal Penting Sebelum Memulai

- Video dirender **langsung di komputer lokal Anda** melalui **Claude Code** (aplikasi desktop tab *Code*, atau terminal). Percakapan web biasa di claude.ai tidak memiliki akses terminal untuk merender video.
- **Rekomendasi Perangkat:** Mac dengan chip Apple Silicon (M1/M2/M3/M4) atau PC dengan GPU terdedikasi (NVIDIA RTX / AMD Radeon). Komputer tanpa GPU tetap dapat merender dengan mode software CPU, namun membutuhkan waktu pemrosesan lebih lama.
- Render pertama pada komputer baru akan otomatis mengunduh paket dependensi Three.js/Remotion dan browser render headless (±1,2 GB total di disk).
- **Proses Preview:** Setiap ide baru umumnya melalui 1–2 putaran penyempurnaan preview resolusi 540×960 sebelum render tajam 1080×1920 60 FPS final dieksekusi.

---

## Status 20 Signature Styles

Seluruh **20 gaya kini memiliki mesin khusus dan kit mandiri lengkap** di dalam direktori `kits/<style>/` beserta contoh teknis Remotion 60 FPS:

- **Edukasi, Arsitektur & Mesin:** `INNERWORKS`, `BUILDFORGE`, `TIMEFORGE`, `DRAFTFORGE`, `URBANFORGE`
- **Karakter & Cerita Taktil:** `PIXELSTORY`, `PAPERWORLD`, `CLAYWORLD`, `TOONFORGE`, `BRICKCRAFT`
- **Dunia Geometris & Alam:** `VOXELVERSE`, `WORLDFORGE`, `POLYVERSE`
- **Sains, Medis & Geografi:** `NANOFORGE`, `INKSTORY`, `LIDARFORGE`
- **Teknologi Tinggi & Komersial:** `CYBERFORGE`, `PRECISION`, `GLASSCRAFT`, `CIRCUITFORGE`

---

*Hak Cipta © 2026 Agus Dwi Rianto (AUDIRA MDA). Seluruh hak dilindungi undang-undang.*
