# GACHAREVEAL — Style 65: Gacha Capsule & Holo Card Reveal

**In this package:** the loot-reveal engine in `kits/gachareveal/` (indigo summon stage with rarity rings and rotating beams, hex pedestal, shaking egg capsule with tier cracks and glowing core, burst with flash/shockwave, 520-piece instanced confetti, spinning-then-flipping holographic foil card with original canvas art, gold motes, 360° spin camera, rarity-meter HUD); see `kits/gachareveal/KIT.md`.

## Which briefs belong here?

Automatically select **GACHAREVEAL** for briefs involving:
- "Pengumuman pemenang giveaway, undian, atau hadiah"
- "Reveal produk baru, edisi terbatas, atau kolaborasi rahasia"
- "Membuka kotak misteri / loot box / kartu langka (tanpa IP game asli)"
- "Teaser karakter atau maskot baru dengan efek 'langka' yang dramatis"
- "Konten hype: level up, pencapaian, rank naik"

Describe the look in friendly Indonesian:
> *"Gaya reveal ala gacha yang dramatis: kapsul bercahaya bergetar dan retak, warnanya naik dari biru ke ungu lalu emas, meledak dengan konfeti, lalu sebuah kartu hologram berputar keluar dan terbalik memperlihatkan makhluk orisinal yang langka, dengan kamera berputar penuh lalu berhenti megah."*

## Visual DNA

| Layer | Content |
| --- | --- |
| Background | Indigo void, star field, rarity-coloured back bloom, rotating light beams |
| Midground | Glossy floor with pulsing concentric rings, hex pedestal with glowing rim |
| Subject | Egg capsule (anticipation) → holographic foil card (payoff) |
| Foreground / FX | Confetti, shockwave rings, cracks, flash, gold motes, card aura |
| HUD | `◆ SUMMON x1` kicker, slamming tier label, 3-step rarity meter, `GACHAREVEAL // 65` badge, caption box, `Creator: AUDIRA` |

## Rules

1. Escalate in clear steps; every upgrade gets a flash, a shockwave and more beams.
2. The reveal must be readable: the card settles front-on, art and name fully on screen.
3. No real game IP: no existing gacha capsules, card frames, logos, creature designs or rarity marks from real games.
4. Do not present it as real gambling or paid odds; it is a spectacle for announcements and reveals.
5. Keep the background dark so additive beams and foil read.

## Known limits

- Foil is a scrolling additive texture, not a view-dependent shader; it looks best with camera motion.
- Card art is canvas-drawn 2D; a 3D creature needs its own model at `CARD_REST`.
- Confetti lands on a flat floor (y clamp) and does not collide with the pedestal.
