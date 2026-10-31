# DESIGN SYSTEM — AUDIRA TEMPLATE MOTION

> Design Tokens, Aesthetics, Typography, Video Framing, and Anti-Slop Guidelines.  
> **Aesthetic Theme:** Neo-Brutalism Dark + Glassmorphism + Electric Terracotta & Cyberpunk Accents  
> **Author & Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  

---

## 1. Filosofi Desain

AUDIRA TEMPLATE MOTION memadukan kenyamanan studio kreatif modern ala BanterReels dengan identitas khas AUDIRA:

1. **Neo-Brutalism Dark Theme**:
   - Surface gelap pekat dengan garis tepi berpresisi tinggi (`border-zinc-800` dan hard offset shadow `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
   - Tombol tegas dengan micro-interaction klik responsif (translate 2px on active).
2. **High-Contrast Warm Sand & Terracotta**:
   - Palette terinspirasi dari skema warna BanterReels dan Claude: Off-black `#141413`, Sand Cream `#f4f3f0`, Warm Peach `#ffe9df`, dan Terracotta Solid `#c2410c`.
3. **Studio Glassmorphism**:
   - Floating video inspector, timeline scrubber, dan format picker memakai efek `backdrop-blur-xl bg-zinc-900/80`.
4. **Anti-Slop Strict Standards**:
   - Dilarang memakai gradient ungu-biru murahan tanpa konteks (*AI slop*).
   - Copywriting tajam dan langsung ke inti (tanpa kata basi seperti *"Unleash the power of AI"*).
   - Typography tegas: Inter / Geist Sans untuk UI, JetBrains Mono untuk timecodes dan status frame.

---

## 2. Token Warna & Palet Visual

| Token Name | Hex Code | Utility Class | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Canvas Deep** | `#0e0e11` | `bg-[#0e0e11]` | Background keseluruhan dashboard |
| **Card Surface** | `#18181b` | `bg-zinc-900` | Kartu generator, container preview |
| **Banter Dark** | `#141413` | `bg-[#141413]` | Background video stage dan kanvas motion |
| **Warm Sand** | `#f4f3f0` | `text-[#f4f3f0]` | Teks kontras tinggi, kartu template terpilih |
| **Peach Tint** | `#ffe9df` | `bg-[#ffe9df]` | Badge status, dialog bubble manusia |
| **Terracotta Brand**| `#c2410c` | `bg-[#c2410c]` | Tombol utama Generate & Export, aksen aktif |
| **Cyber Cyan** | `#06b6d4` | `text-cyan-400` | AI characters highlight, audio level bar |
| **Retro Emerald** | `#10b981` | `text-emerald-400` | RPG Level Up & HP bar, status render siap |

---

## 3. Safe-Zone & Dimensi Video Vertikal 9:16

- **Kanvas Rasio:** 9:16 (1080px × 1920px).
- **Safe Area:**
  - Top Safe Margin: 180px (bebas dari ikon platform / search bar Reels).
  - Bottom Safe Margin: 260px (bebas dari deskripsi akun, audio track, dan tombol like/share).
  - Left & Right Margin: 80px.
- **Ukuran Teks Subtitel:**
  - Font Size: 44px – 56px (Font weight 900 / ExtraBold).
  - Text Stroke: 4px black outline untuk keterbacaan di semua background.
  - Active Word Highlight: Kuning Emas (`#facc15`) atau Terracotta Neon (`#ff7849`).

