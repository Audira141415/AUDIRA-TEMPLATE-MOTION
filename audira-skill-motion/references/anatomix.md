# ANATOMIX — Style 56: Medical Anatomy Explainer & Clinical Hologram

**In this package:** the medical-anatomy engine in `kits/anatomix/` (deformed-sphere heart with clearcoat/sheen myocardium and opacity-driven reveal, four squeezing chambers, valves, glass great vessels and coronary arteries, instanced blood-flow streams with per-beat surge, imaging-suite dome, hologram projector floor, rotating clinical rings, scanning slice, motes, and a HUD with heart rate, scrolling stylised ECG, projected anatomy labels with leader lines and stage captions); see `kits/anatomix/KIT.md`.

- **Kit Path:** `kits/anatomix/`
- **Style Number:** #56
- **Primary Scene:** `Heart3D` + `BloodFlow3D` + `HoloSuite3D`
- **Background Token:** `#03141A`
- **Badge:** `ANATOMIX // 56`

## Which briefs belong here?

Automatically select **ANATOMIX** for briefs involving:
- "Bagaimana jantung bekerja? Sirkulasi darah kecil dan besar"
- "Edukasi kesehatan: serangan jantung, tekanan darah, detak jantung"
- "Anatomi paru-paru, ginjal, atau organ lain untuk pelajar dan pasien"
- "Video rumah sakit / klinik: penjelasan prosedur secara visual yang bersih"
- "Biologi SMA: bilik dan serambi jantung, katup, pembuluh darah"

Describe the look in friendly Indonesian:
> *"Gaya penjelasan anatomi medis yang bersih dan berkelas rumah sakit: jantung bergaya (tanpa kesan seram) dengan lapisan luar yang menjadi transparan memperlihatkan bilik dan serambi, partikel darah merah dan biru yang mengalir setiap detak, cincin hologram teal ala ruang pencitraan, dan label beserta garis penunjuk."*

## Not this style
- Machines and mechanisms cut open: use INNERWORKS.
- Molecules, DNA, proteins, cells at nano scale: use NANOFORGE.
- Generic sci-fi hologram HUD without anatomy: use CYBERFORGE.

## Visual Guardrails
1. Non-gory and respectful: no realistic wounds, surgery footage look or distressing imagery.
2. Medical facts (rates, volumes, percentages) need sources in `research/SOURCE_REGISTER.md`; ECG is labelled stylised.
3. Always show the 'stylised model · educational only' line; no diagnosis or treatment advice.
4. Maintain 9:16 safe zones (top 180 px / bottom 380 px of 1080x1920 clear of text).
5. Mute Test: stage caption + colour legend (red/blue) must explain the circuit without audio.
