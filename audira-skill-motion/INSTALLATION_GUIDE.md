# Panduan Instalasi — Audira Skill Motion

*Versi 3.0.0 Commercial Release — By Audira (Agus Dwi Rianto)*

## 1. Kebutuhan Sistem

| Yang Dibutuhkan | Keterangan |
|---|---|
| **Akun Claude dengan akses Claude Code** | Paket berbayar Claude (Pro, Max, Team, atau Enterprise) atau akun API Anthropic. Satu video dapat memakan puluhan menit kerja komputasi Claude; paket **Max lebih lega** untuk alur kerja panjang |
| **Claude Code** | Aplikasi desktop Claude (tab *Code*) atau Claude Code di terminal |
| **Node.js versi 22.13 atau lebih baru** | Untuk menjalankan proyek video (sangat disarankan versi LTS) |
| **ffmpeg + ffprobe** | Untuk analisis voice-over dan sinkronisasi audio final |
| **Ruang Disk** | Minimal 5 GB kosong. Setiap proyek memakai sekitar 1,2 GB |
| **Internet** | Untuk mengunduh paket Three.js/Remotion dan browser render (±170 MB) saat proyek pertama |
| **Komputer** | Sangat disarankan Mac dengan chip Apple Silicon (M1 ke atas), atau PC dengan kartu grafis (GPU). Tanpa GPU, render 3D berjalan di mode CPU software yang lebih lambat |

---

## 2. Pasang Node.js (Sekali Saja)

1. Kunjungi situs resmi <https://nodejs.org>, unduh versi **LTS**.
2. Instal seperti aplikasi biasa (ikuti instruksi hingga selesai).
3. Tutup lalu buka kembali aplikasi Claude Code.

---

## 3. Pasang ffmpeg (Sekali Saja)

- **macOS:** Jika sudah menggunakan Homebrew, buka Terminal lalu ketik:
  ```bash
  brew install ffmpeg
  ```
- **Windows:** Buka PowerShell lalu ketik:
  ```powershell
  winget install ffmpeg
  ```
  Lalu tutup dan buka kembali jendela PowerShell / Claude Code.

---

## 4. Pasang Skill Audira Motion

Paket instalasi ini berisi folder utama: **`audira-motion`** (atau folder kerja yang memuat file `SKILL.md`).

### Cara A — Upload Skill di Aplikasi Desktop Claude
1. Buka Claude → **Customize** → **Skills** → klik tombol **+** (**Create skill**) → **Upload a skill**.
2. Pilih file arsip ZIP `Audira_Skill_Motion_v3.0.0.zip` (atau folder skill).
3. Pastikan skill **audira-motion** dalam keadaan aktif (Active).
4. Buka Claude Code dengan akun yang sama, lalu panggil:
   ```bash
   /audira-motion
   ```

### Cara B — Salin Folder ke Folder Skill Pribadi (Direkomendasikan)
1. Ekstrak file ZIP `Audira_Skill_Motion`.
2. Salin folder skill ke direktori skill lokal Anda:
   - **macOS:** `~/.claude/skills/audira-motion/`
   - **Windows:** `C:\Users\<nama-pengguna>\.claude\skills\audira-motion\`
3. Pastikan struktur file berujung pada file `SKILL.md` (misalnya `.../skills/audira-motion/SKILL.md`).
4. Tutup dan buka kembali Claude Code, lalu ketik `/audira-motion`.

---

## 5. Menjalankan Proyek Pertama

Saat Anda meminta pembuatan video pertama kali, Claude akan:
1. Meminta izin membuat folder proyek (misalnya `~/AudiraMotion/nama-video`).
2. Menyiapkan paket dependensi (`npm ci`) dan memeriksa kapabilitas grafis GPU komputer Anda.
3. Merender tes uji coba singkat (smoke test).

Langkah penyiapan awal ini hanya memakan waktu 2–10 menit untuk pengunduhan pertama. Setelah itu, pengerjaan proyek berikutnya berlangsung instan.
