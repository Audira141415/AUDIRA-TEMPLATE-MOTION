# Audira Brand Kit System

*Versi 3.0.0 Commercial Release — By Audira (Agus Dwi Rianto)*

Gunakan file konfigurasi brand tunggal: **`audira-brand.json`** (atau kompatibel dengan `voynann-brand.json`) untuk seluruh video yang dihasilkan. File ini mendefinisikan nama channel/merek, handle media sosial, ajakan (Call to Action / CTA), palet warna identitas, font, dan file logo.

---

## 1. Struktur Format `audira-brand.json`

Simpan file dengan nama `audira-brand.json` di dalam folder kerja Anda:

```json
{
  "version": 1,
  "brand": "Audira Media",
  "handle": "@audiramedia",
  "cta": "Follow & subscribe untuk inovasi 3D berikutnya",
  "colors": {
    "primary": "#0f172a",
    "accent": "#00f0ff",
    "background": "#f8fafc"
  },
  "font": "Space Grotesk",
  "logo": "logo.png"
}
```

### Penjelasan Parameter:

| Properti | Deskripsi | Status |
|---|---|---|
| `brand` | Nama merek, studio, atau channel YouTube/TikTok Anda | Sangat disarankan |
| `handle` | Akun media sosial (misal: `@audiramedia`) | Opsional |
| `cta` | Pesan teks penutup / ajakan bertindak di layar | Opsional |
| `colors.primary` | Warna dominan gelap untuk overlay dan tipografi | Opsional |
| `colors.accent` | Warna aksen berpendar untuk sorotan teks dan badge | Opsional |
| `colors.background` | Warna latar belakang terang jika diperlukan | Opsional |
| `font` | Pilihan tipografi: *Space Grotesk*, *Manrope*, *Silkscreen*, *Instrument Serif* | Opsional |
| `logo` | File gambar logo (PNG transparan) di folder kerja | Opsional |

---

## 2. Cara Kerja di Audira Skill Motion

1. Taruh file `audira-brand.json` (dan file logo PNG jika ada) di folder proyek kerja Anda.
2. Claude Code secara otomatis membaca identitas brand tersebut dan menerapkannya pada:
   - Judul awal (*cinematic title kicker*).
   - Badge penanda kategori dan label telemetri.
   - Kartu penutup (*end-card overlay*) lengkap dengan handle dan CTA Anda.
3. Warna dunia 3D tetap mempertahankan integritas artistik dari style yang dipilih, memastikan estetika visual tetap spektakuler dan profesional.
4. **Pemeriksaan Kontras Otomatis (WCAG):** Sistem secara otomatis menghitung rasio kontras warna. Jika warna aksen Anda tidak cukup kontras di atas latar belakang adegan, sistem akan memilih fallback warna yang tetap terbaca jelas oleh penonton.
