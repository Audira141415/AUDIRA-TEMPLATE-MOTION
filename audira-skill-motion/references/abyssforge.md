# ABYSSFORGE — Style 52: Bioluminescent Deep-Sea Descent

**In this package:** the deep-sea engine in `kits/abyssforge/` (depth-driven fog and water colour ramp, fading volumetric god-rays, 2,200 instanced marine-snow flakes, 520 twinkling plankton sparks, original lathe-bell jellyfish with per-frame tube tentacles and pulse-synced point lights, the "lanternmaw" anglerfish-like payoff creature with a flickering lure, silt seabed, bloom/ACES finishing, and a submersible sonar + depth-meter HUD); see `kits/abyssforge/KIT.md`.

- **Kit Path:** `kits/abyssforge/`
- **Style Number:** #52
- **Primary Scene:** `WaterColumn3D` + `Jellyfish3D` + `Lanternmaw3D`
- **Background Token:** `#020A14`
- **Badge:** `ABYSSFORGE // 52`

## Which briefs belong here?

Automatically select **ABYSSFORGE** for briefs involving:
- "Misteri laut dalam, zona tengah malam, palung Mariana, makhluk bercahaya"
- "Bioluminesensi: kenapa ubur-ubur / ikan laut dalam bisa bersinar"
- "Tekanan air, suhu, dan kedalaman laut dijelaskan dengan meteran kedalaman"
- "Horor alam yang tenang: sesuatu menunggu dalam gelap" (thriller sains, bukan gore)
- Metafora "turun ke kedalaman" untuk topik psikologi, data, atau eksplorasi

Describe the look in friendly Indonesian:
> *"Kamera menyelam pelan dari cahaya biru terakhir ke kegelapan total laut dalam; salju laut melayang, ubur-ubur berdenyut cahaya cyan dan magenta, meteran sonar menghitung kedalaman, lalu sebuah umpan cahaya menyala dan memperlihatkan predator bergigi jarum yang menunggu."*

## Visual Guardrails
1. Keep 9:16 safe zones (top 180 px / bottom 380 px at 1080×1920); the HUD gauge sits on the right edge between them.
2. Darkness is the canvas, but every frame needs one lit subject: schedule creatures with `at(time, …)`.
3. Bloom only emissive life (threshold ≥ 0.75); if the lure blows out the frame, lower the esca boost, not the exposure.
4. Pass the Mute Test: the depth counter + zone label explain the descent without audio.
5. HUD facts must stay true (zone limits 200 m / 1,000 m / 4,000 m; ~1 atm per 10 m of seawater).
