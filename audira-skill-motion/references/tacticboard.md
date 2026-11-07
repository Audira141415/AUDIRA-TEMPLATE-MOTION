# TACTICBOARD — Style 46: Sports Tactics Board & Broadcast Analysis

**In this package:** the tactics-board engine in `kits/tacticboard/` (miniature pitch board with painted chalk lines, 22 numbered puck tokens in two fictional teams, keyed player tracks, ball path with lift arcs, draw-on passing lanes, dashed run arrows, ball trail, bulging net, golden replay path, stadium-bowl bokeh, and a coach-board HUD with score bug, minute clock and formation chips); see `kits/tacticboard/KIT.md`.

- **Kit Path:** `kits/tacticboard/`
- **Style Number:** #46
- **Primary Scene:** `PitchBoard3D` + `PlayerTokens3D` + `PlayLines3D`
- **Background Token:** `#070B10`
- **Badge:** `TACTICBOARD // 46`

## Which briefs belong here?

Automatically select **TACTICBOARD** for briefs involving:
- "Analisis taktik sepak bola: formasi 4-3-3, overlap, umpan terobosan"
- "Breakdown gol / replay taktik ala studio analisis TV"
- "Penjelasan strategi tim, pressing, build-up, transisi"
- "Konten olahraga edukatif: cara kerja offside, set-piece, pola serangan"
- "Futsal, basket, atau olahraga papan taktik lain (ganti lapangan dan jumlah token)"

Describe the look in friendly Indonesian:
> *"Gaya papan taktik 3D seperti studio analisis siaran sepak bola: lapangan mini berumput garis-garis dengan garis kapur, pemain berupa koin bernomor dari dua tim fiktif, jalur umpan yang tergambar sendiri, panah lari putus-putus, dan replay gol berwarna emas."*

## Visual Guardrails
1. Fictional teams only: no real club names, crests, kits, sponsors or player likenesses.
2. Keep every play readable from the overhead shot first; go low only after the shape is understood.
3. Maximum two telestrator elements drawing at once (one lane + one run) so the eye is never split.
4. Maintain the 9:16 safe zones (top 180 px / bottom 380 px of 1080x1920 clear of text).
5. Mute Test: score bug, clock and step card must explain the beat without audio.
