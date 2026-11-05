# 📖 Panduan Lengkap Instalasi & Setup AUDIRA Skill Motion + Agentic Skill Mesh

*Versi 3.0.0 Commercial Release — Oleh Agus Dwi Rianto (AUDIRA MDA)*  
*Website Resmi: [AUDIRA Motion](http://localhost:3788) | WhatsApp Support: +62 857-0966-6240*

---

## 🌟 1. Ikhtisar Ekosistem

Ekosistem AUDIRA Motion terdiri dari dua komponen utama yang saling melengkapi:
1. **`audira-skill-motion` (Visual 3D Engine)**: Engine visual berbasis Remotion 4.0, React Three Fiber, dan Three.js yang memuat seluruh 29 Kit Gaya Sinematik 3D (Buildforge, Precision, Cyberforge, Origami, dll.).
2. **`audira-skill-mesh` (Agentic MCP Orchestrator)**: Otak Model Context Protocol (MCP) yang menghubungkan AI (Claude Code, Cursor, Antigravity, Ollama) ke tools nyata:
   - `audira_auto_orchestrate`: Sutradara otonom pemilihan kit 3D & storyboard.
   - `audira_generate_voiceover`: Sintesis narasi suara Cartesia TTS + timestamp JSON per kata.
   - `audira_validate_social_captions`: Generator caption otomatis untuk TikTok, Reels, dan Shorts.

---

## 💻 2. Prasyarat Sistem (Hanya Perlu Sekali Saja)

### A. Pasang Node.js LTS (v20 atau v22)
1. Unduh Node.js versi **LTS** dari [https://nodejs.org](https://nodejs.org).
2. Instal seperti aplikasi biasa hingga selesai.
3. Periksa instalasi di terminal / PowerShell:
   ```bash
   node -v
   npm -v
   ```

### B. Pasang FFmpeg (Wajib untuk Audio Sync & Normalisasi)
- **Windows (via PowerShell):**
  ```powershell
  winget install ffmpeg
  ```
- **macOS (via Terminal / Homebrew):**
  ```bash
  brew install ffmpeg
  ```
- Tutup dan buka kembali terminal setelah instalasi selesai.

### C. Kebutuhan Hardware
- **macOS:** Sangat direkomendasikan chip Apple Silicon (M1, M2, M3, M4).
- **Windows PC:** Kartu grafis (GPU) diskrit NVIDIA / AMD / Intel Arc dengan VRAM 4 GB+.
- **RAM:** Minimal 8 GB (16 GB lebih disarankan).

---

## 📦 3. Memasang Skill ke Claude (Claude Code CLI & Claude Desktop)

Paket instalasi ini berisi file inti: **`SKILL.md`**, folder **`kits/`** (29 gaya 3D), dan template **`starter/`**.

> [!IMPORTANT]
> **Kebutuhan Akun Claude Code**:
> Skill ini dijalankan melalui **Claude Code** (CLI terminal resmi Anthropic) atau aplikasi **Claude Desktop**. Diperlukan akun Claude berbayar (Claude Pro, Max, Team, Enterprise) atau Anthropic API Key (`ANTHROPIC_API_KEY`).
> *Catatan: Obrolan web biasa di browser (claude.ai) tidak memiliki akses terminal komputer lokal untuk merender video MP4 60 FPS.*

### Struktur Folder Paket Skill:
```text
audira-skill-motion/
├── SKILL.md               # 🌟 FILE UTAMA: Doktrin sutradara otonom & instruksi Claude
├── kits/                  # 29 Kit Gaya Sinematik 3D (Three.js + R3F Shaders)
├── starter/               # Template proyek Remotion 4.0 siap pakai
│   ├── src/               # Source code React Three Fiber & Shaders
│   ├── remotion.config.ts # Preset resolusi 1080x1920 60 FPS
│   └── package.json       # Dependensi proyek
├── audira-brand.json      # Konfigurasi logo watermark & brand
├── PANDUAN_INSTALASI.md   # Buku manual instalasi offline
└── START_HERE.md          # Panduan kilat memulai 3 langkah
```

---

### METODE A — Salin ke Direktori Skill Global Claude Code CLI (Paling Direkomendasikan)
Claude Code membaca seluruh skill kustom dari folder konfigurasi pengguna `.claude/skills/`:

#### 1. Untuk Pengguna Windows (PowerShell):
Buka PowerShell, lalu jalankan dua baris perintah ini:
```powershell
# Buat folder skill di direktori profil pengguna
mkdir -p $HOME\.claude\skills\audira-motion

# Salin seluruh isi folder audira-skill-motion
Copy-Item -Path "audira-skill-motion\*" -Destination "$HOME\.claude\skills\audira-motion\" -Recurse -Force
```
*Pastikan file `SKILL.md` berada di: `C:\Users\<NamaUser>\.claude\skills\audira-motion\SKILL.md`*

#### 2. Untuk Pengguna macOS / Linux (Terminal):
Buka Terminal, lalu jalankan:
```bash
# Buat folder skill di direktori home
mkdir -p ~/.claude/skills/audira-motion

# Salin file skill
cp -r audira-skill-motion/* ~/.claude/skills/audira-motion/
```
*Pastikan file `SKILL.md` berada di: `~/.claude/skills/audira-motion/SKILL.md`*

---

### METODE B — Upload Skill di Aplikasi Claude Desktop (Antarmuka Grafis / GUI)
1. Buka aplikasi **Claude Desktop**.
2. Klik foto profil Anda di pojok bawah → pilih **Settings** (atau **Preferences**).
3. Pilih menu **Capabilities** atau **Skills** (atau **Customize** → **Skills**).
4. Klik tombol **+ Add Skill** atau **Upload a Skill**.
5. Pilih file arsip ZIP `audira-skill-motion.zip` (atau pilih folder yang memuat `SKILL.md`).
6. Beri nama skill: `audira-motion`.
7. Pastikan toggle status skill menyala hijau (**Active**).

---

### METODE C — Pasang di Workspace Proyek Khusus (Project-Level)
Jika ingin skill hanya aktif di dalam satu proyek tertentu:
1. Buka folder proyek Anda di terminal atau Cursor / VS Code.
2. Buat folder `.claude/skills/audira-motion/` di root proyek tersebut.
3. Masukkan file `SKILL.md` dan folder `kits/` ke dalamnya.
4. Buka terminal Claude Code di proyek tersebut, skill akan otomatis aktif secara lokal.

---

### ✅ Cara Verifikasi Bahwa Skill Sudah Aktif di Claude:
1. Buka terminal, lalu jalankan Claude Code:
   ```bash
   claude
   ```
2. Ketik perintah:
   ```text
   /skills
   ```
   Pastikan skill `audira-motion` tercantum dalam daftar.
3. Jalankan perintah tes pertama:
   ```text
   /audira-motion Halo! Tes aktivasi sutradara 3D AUDIRA
   ```
   Claude Code akan langsung membalas sebagai Sutradara 3D resmi AUDIRA!

---

## ⚡ 4. Mengaktifkan `audira-skill-mesh` (MCP Server Engine)

Agar AI Anda memiliki kapabilitas penuh sebagai sutradara otonom dan hasil render identik dengan video demo studio:

### A. Konfigurasi Claude Desktop / Claude Code
Buka file `claude_desktop_config.json`:
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Tambahkan blok konfigurasi server MCP berikut:
```json
{
  "mcpServers": {
    "audira": {
      "command": "node",
      "args": [
        "F:/AUDIRA-ALL-SKILL/mcp-server/src/index.js"
      ]
    }
  }
}
```

### B. Konfigurasi di Cursor IDE
1. Buka Cursor → **Settings** (Ikon roda gigi) → **Features** → **MCP Servers**.
2. Klik **+ Add New MCP Server**.
3. Masukkan data:
   - **Name:** `audira`
   - **Type:** `command`
   - **Command:** `node F:/AUDIRA-ALL-SKILL/mcp-server/src/index.js`
4. Status akan berubah menjadi hijau (*Connected*).

---

## 🎬 5. Menjalankan Video Pertama

### 1. Perintah Otonom via AI (Claude Code / Cursor)
Ketik langsung di terminal AI:
```bash
/audira-motion Buatkan video 3D promosi jam tangan titanium dengan narasi suara jernih dan caption viral
```
AI Anda akan otomatis merancang naskah, memanggil audio Cartesia TTS, merakit scene 3D, dan merender tes tampilan.

### 2. Preview Interaktif di Browser (Remotion Studio UI)
```bash
npm run remotion:dev
```
Buka peramban di `http://localhost:3000` untuk memutar video, menggeser timeline, dan memeriksa pencahayaan per frame.

### 3. Smoke Test Cepat (Still HD)
```bash
npm run remotion:smoke
```

### 4. Render Video Final Siap Tayang (1080×1920 60 FPS)
```bash
npm run remotion:render
```
Video MP4 Full HD tanpa watermark akan otomatis tersedia di folder `out/`.

---

## 🛠️ 6. Solusi Kendala (Troubleshooting Runbook)

| Kendala | Penyebab | Solusi |
|---|---|---|
| `ffmpeg is not recognized` | FFmpeg belum masuk ke System PATH | Buka PowerShell Administrator, jalankan `winget install ffmpeg`, lalu restart terminal. |
| `Node version mismatch` | Menggunakan versi Node.js ganjil/lama | Pasang Node.js versi LTS (v20 atau v22) dari [nodejs.org](https://nodejs.org). |
| Render lambat / WebGL warning | Render berjalan di mode CPU software | Perbarui driver GPU NVIDIA/AMD dan aktifkan *Hardware Acceleration* di browser. |
| Narasi tidak bersuara | File audio belum ter-generate | Pastikan audio TTS Cartesia telah dibuat di folder `public/audio/`. |

---

## 🤝 7. Garansi & Dukungan Teknis 1-on-1

Jika Anda membutuhkan bantuan setup atau ingin dipandu langsung:
- **WhatsApp Mas Agus:** [+62 857-0966-6240](https://wa.me/6285709666240)
- **Garansi:** Pendampingan 1-on-1 via remote desktop / video call hingga video pertama Anda berhasil dirender di komputer Anda!

