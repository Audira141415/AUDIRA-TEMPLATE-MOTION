# Panduan Penggunaan — Audira Skill Motion

*Versi 4.1.0 Commercial Release — By Audira (Agus Dwi Rianto)*

## Alur Produksi Video

1. **Panggil Skill dan Sampaikan Ide Anda:**
   Gunakan bahasa percakapan santai sehari-hari:
   ```bash
   /audira-motion Aku mau video yang memperlihatkan cara kerja mesin turbojet pesawat, casingnya terbuka dan bagian turbin berputar di dalamnya.
   ```
   Anda tidak perlu menghafal nama gaya; Claude otomatis menganalisis dan memilih style terbaik dari 68 styles yang tersedia.

2. **Jawab Pertanyaan Singkat:**
   Claude akan menanyakan satu per satu hal penting, terutama: **apakah Anda memiliki file rekaman suara narator (voice-over) atau ingin menggunakan musik/SFX saja?**

3. **Kirim File Audio Voice-Over (Jika Ada):**
   Kirimkan file **MP3 atau WAV** (misalnya hasil rekaman ElevenLabs atau studio). Lampirkan file tersebut atau sebutkan path-nya (misalnya `@/Users/kamu/Downloads/narasi.mp3`). Claude mengukur durasi dan jeda kalimat secara presisi, lalu menyelaraskan ritme animasi 3D mengikuti narasi suara.

4. **Konfirmasi Ringkasan Konsep:**
   Claude merangkum ide cerita, pilihan gaya, durasi, dan mood warna dalam 3–4 baris singkat untuk persetujuan Anda.

5. **Review Video Preview (540×960 @ 30 FPS):**
   Claude merender preview cepat dalam resolusi vertikal 540×960. Anda dapat memberikan catatan revisi secara bebas:
   - *"Gerakan kameranya tolong diperlambat di detik ke-5."*
   - *"Warnanya buat lebih cerah dan futuristik."*
   - *"Ganti teks judul di awal jadi huruf kapital."*

6. **Render Final (1080×1920 @ 60 FPS):**
   Setelah disetujui, Claude mengeksekusi render resolusi penuh ultra tajam 60 FPS, memadukan suara dengan mastering audio standar media sosial (−14 LUFS), dan memberikan lokasi file MP4 siap unggah.

---

## Lokasi File Hasil Render

Hasil render disimpan rapi di dalam subfolder `out/` pada direktori proyek Anda, misalnya:
`~/AudiraMotion/turbojet/out/final.mp4`.

---

## Estimasi Waktu Pemrosesan (Mac Apple Silicon / PC NVIDIA RTX)

| Tahapan | Perkiraan Waktu |
|---|---|
| Penyiapan proyek pertama | 2–10 menit (tergantung koneksi internet) |
| Pembuatan adegan & script 3D | Beberapa menit interaktif bersama Claude |
| Render preview 30 detik (540×960 @ 30 FPS) | ±20 detik |
| Render final 30 detik (1080×1920 @ 60 FPS) | ±1–2 menit |
| Render final durasi panjang (90–120 detik) | ±4–8 menit |

---

## Tips Memaksimalkan Kualitas Animasi

- **Tentukan Momen Puncak:** Sebutkan aksi visual utama yang dramatis (misalnya: "lensa kamera meluncur keluar", "laser pemindai menyapu lembah", atau "aliran elektron amber melesat masuk ke chip").
- **Kirim Voice-Over Final:** Gunakan audio yang sudah fixed agar sinkronisasi beat visual tidak perlu dihitung ulang.
- **Pemanfaatan Komersial:** Anda memiliki hak penuh atas hasil render video untuk monetisasi TikTok, YouTube Shorts, Reels, portofolio, dan pekerjaan agensi berbayar.
