# RULES.md — AUDIRA TEMPLATE MOTION

> Aturan Baku Pengembangan, Render Integrity, Anti-Slop, dan Standar Koding.  
> Mengikat seluruh AI Assistant dan Pengembang tanpa pengecualian.

---

## 1. Aturan Mutlak Anti-Slop
1. **Dilarang Komentar Palsu AI**: Jangan memasukkan komentar kosong seperti `// implement here` atau komentar dekoratif tanpa nilai fungsi.
2. **Tanpa Delay Palsu**: Dilarang menggunakan `setTimeout` statis sebagai pura-pura "AI processing". Gunakan proses asinkron nyata atau fallback instan yang transparan.
3. **No Fluff Copy**: Gunakan copywriting yang langsung pada pokok bahasan, punchy, dan tidak klise.

---

## 2. Aturan Sinkronisasi Video & Audio
1. **The Voice is the Clock**: Waktu visual dan perubahan scene selalu dikunci ke durasi audio voiceover aktual dan word timestamps.
2. **Strict 9:16 Aspect Integrity**: Semua preview dan output video wajib mempertahankan rasio 9:16 (1080x1920) dengan safe-zone vertikal teruji.
3. **Looping & Timeline Bounds**: Setiap animasi Remotion / Canvas harus terikat pada `frame` index murni tanpa `Math.random()` tanpa seed acak.

---

## 3. Aturan Identitas & Kepemilikan
- Seluruh output proyek berafiliasi resmi dengan **AUDIRA** (Agus Dwi Rianto).
- Domain resmi: https://audira.my.id

