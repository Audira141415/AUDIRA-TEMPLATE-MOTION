# Panduan Pemecahan Masalah (Troubleshooting) — Audira Skill Motion

*Versi 4.1.0 Commercial Release — By AUDIRA (Agus Dwi R)*

| Masalah | Penyebab Umum | Solusi Cepat |
|---|---|---|
| Perintah `/audira-motion` tidak muncul | Skill belum dipasang di folder Claude Code yang tepat | Pastikan file `SKILL.md` berada di `~/.claude/skills/audira-motion/SKILL.md` (lihat Cara B di `INSTALLATION_GUIDE.md`), lalu buka ulang Claude Code. |
| Muncul pesan "Claude tidak bisa merender" | Anda sedang memakai chat browser claude.ai biasa | Gunakan **Claude Code** (tab *Code* pada aplikasi desktop Claude atau via terminal) yang memiliki akses runtime komputer lokal. |
| Node.js tidak terdeteksi atau versinya usang | Node.js belum dipasang atau di bawah versi 22.13 | Unduh dan pasang versi Node.js LTS terbaru dari <https://nodejs.org>, lalu buka ulang terminal. |
| ffmpeg tidak ditemukan | ffmpeg belum terpasang di sistem | macOS: jalankan `brew install ffmpeg`; Windows: jalankan `winget install ffmpeg` di PowerShell. |
| Penyiapan pertama berlangsung beberapa menit | Mengunduh paket npm (±370 MB) dan headless Chrome (±170 MB) | Tunggu hingga selesai dengan koneksi internet stabil. Pengunduhan ini hanya terjadi satu kali per proyek. |
| Pesan "switched to software rendering" | Kartu grafis (GPU) tidak terdeteksi oleh browser headless | Render tetap berjalan menggunakan CPU (`swangle`). Video tetap selesai dengan kualitas 1080×1920 yang sama, namun memakan waktu lebih lama. |
| Gambar uji coba hitam atau kosong | Shader Three.js mengalami kegagalan inisialisasi | Minta Claude memeriksa kembali console log dan memperbaiki parameter material shader. |
| Ruang disk penuh (*disk full*) | Cache bundler `node_modules/.cache` menumpuk | Minta Claude menghapus folder `.cache` pada proyek (sangat aman dilakukan), lalu lanjutkan proses render. |
| Suara narator tidak selaras dengan beat visual | File audio voice-over diganti setelah shot list dikunci | Kirimkan file voice-over final yang sudah pasti; Claude akan mengukur ulang jeda bicara dan mengunci ulang cut keys. |
| Volume audio terlalu pelan atau terlalu keras | — | Audio final otomatis dinormalisasi ke standar penyiaran media sosial (−14 LUFS). |

---

Jika Anda menemukan kendala yang tidak tercantum di atas, hubungi dukungan teknis resmi:  
- **Website Resmi:** https://audira.my.id/  
- **AUDIRA Support:** `contact@audira.my.id` / `info@audira.my.id`
