# AUDIRABOT Reference — Official 3D Mascot Companion

> **Style ID:** 29  
> **Name:** AUDIRABOT (Flagship Mascot Engine)  
> **Pilar:** 2. Karakter & Cerita Taktil (Universal Cross-Pillar Companion)  
> **Summary:** Robot 3D chibi cyber pendamping dengan visor ekspresif OLED, pendorong levitasi plasma, dan lengan artikulatif penunjuk scene.  

---

## 1. Visual Identity & Persona
- **Role:** Presenter, Pemandu Narasi, dan Maskot Resmi AUDIRA.
- **Form Factor:** Chibi aerodynamic egg capsule, helm kaca hitam lengkung, mata digital berekspresi, pendorong plasma biru di bawah.
- **Emosi Mata OLED:**
  - `eyeCyan` (`#00F0FF`): Normal / Penasaran / Menjelaskan
  - `eyeAmber` (`#FFB703`): Berpikir / Memindai data teknis
  - `eyeGreen` (`#25F482`): Berhasil / Senang / Mengangguk ramah
  - `eyePink` (`#FF3864`): Peringatan / Bahaya / Waspada

## 2. Best Practices
1. **Universal Embedding:** AUDIRA-BOT dirancang fleksibel untuk disisipkan ke dalam proyek gaya lain (misal melayang di atas motherboard `CIRCUITFORGE` atau menunjuk komponen `INNERWORKS`).
2. **Deterministic Blinking:** Berkedip alami setiap ~140 frame (scaleY turun ke 0.08 selama 6 frame lalu kembali).
3. **Dialogue Card:** Teks ucapan selalu berada dalam safe zone mobile (Bottom Safe: 380px).
