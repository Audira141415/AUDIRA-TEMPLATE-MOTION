# DISASTERSIM — Style 48: Geohazard Cross-Section & Calm Hazard Explainer

**In this package:** the geohazard engine in `kits/disastersim/` (extruded earth block from 2D profiles with canvas strata textures, emissive mantle, locked fault tube with stress colour, elastic rebound, seismic rings on the cut face and sea surface, per-frame displaced tsunami surface and cut-face water curtain with run-up, instanced coastal town, trees and marching evacuation route, high-ground beacon, sprite labels, and a HUD with magnitude, seismograph, wave ETA and a four-step warning ramp); see `kits/disastersim/KIT.md`.

- **Kit Path:** `kits/disastersim/`
- **Style Number:** #48
- **Primary Scene:** `EarthBlock3D` + `TsunamiWater3D` + `CoastalTown3D`
- **Background Token:** `#0B141C`
- **Badge:** `DISASTERSIM // 48`

## Which briefs belong here?

Automatically select **DISASTERSIM** for briefs involving:
- "Bagaimana tsunami terbentuk? Jelaskan lempeng tektonik dan subduksi"
- "Edukasi mitigasi bencana gempa dan tsunami untuk sekolah atau BPBD"
- "Penampang bumi: kerak, mantel, patahan, episentrum dan hiposentrum"
- "Kenapa gelombang makin tinggi saat mendekati pantai?"
- "Video kesiapsiagaan: jalur evakuasi ke dataran tinggi"

Describe the look in friendly Indonesian:
> *"Gaya penampang bumi 3D yang tenang dan edukatif: balok tanah yang dibelah memperlihatkan lapisan kerak, lempeng samudra yang menunjam, dan mantel yang berpendar; patahan menegang lalu bergeser, cincin gempa menyebar, lalu gelombang tsunami melambat dan meninggi menuju kota pesisir mini, lengkap dengan angka magnitudo dan tingkat peringatan."*

## Not this style
- Satellite imagery zoom onto real terrain and target reticles: use SATELLITEBRIEFING.
- Territorial maps, front lines and dated campaigns: use HISTORYMAP.
- Machine cutaways: use INNERWORKS.

## Visual Guardrails
1. Educational and calm: no casualties, collapsing buildings, panic imagery or sensational sound design.
2. Real events need sourced numbers (magnitude, depth, arrival time) in `research/SOURCE_REGISTER.md`; otherwise label the scenario fictional.
3. Safety message must match official guidance: strong or long shaking near the coast means go to high ground immediately.
4. Maintain 9:16 safe zones (top 180 px / bottom 380 px of 1080x1920 clear of text).
5. Mute Test: the warning ramp and caption explain the stage without audio.
