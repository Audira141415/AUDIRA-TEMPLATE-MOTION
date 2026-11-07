# GACHAREVEAL — Kit Guide

> Card / loot reveal spectacle: a glowing egg capsule on a hex pedestal shakes and cracks while its rarity light climbs blue → purple → gold, bursts in a flash with confetti, and a holographic foil card spins out and flips to reveal an original creature. Dramatic 360° camera spin, then a hero settle. No real game IP.

Style ID: 65

## Quick Start

```tsx
import { GacharevealExample } from "./example/GacharevealExample";
import { RevealStage3D, PEDESTAL_TOP } from "./scene/RevealStage3D";
import { Capsule3D, CAPSULE_CENTER } from "./scene/Capsule3D";
import { HoloCard3D, CARD_REST, cardPose } from "./scene/HoloCard3D";
import { Confetti3D } from "./scene/Confetti3D";
import { getGacharevealCamera } from "./camera/rig";
import { GacharevealOverlay } from "./camera/Overlay";
import { TIERS, BURST, RISE, FLIP, rarityColor, flash, shake } from "./core/motion";
import { makeCardFront, makeCardBack, makeFoilTexture } from "./lib/materials";
```

Compositions: `GacharevealPreview` (540x960@30) and `GacharevealFinal` (1080x1920@60).

## Signature Motion & Style Rules

1. **Rarity ladder drives everything:** `rarityColor(t)` colours floor rings, pedestal rim, beams, capsule core, cracks, the practical point light and the HUD. Each tier (`TIERS`) adds beams, cracks, shake amplitude, a flash and a shockwave ring.
2. **Anticipation before payoff:** 0–6 s the capsule only shakes, breathes and cracks; nothing opens before the gold tier has landed.
3. **Burst:** halves fly apart on `easeOutCubic`, white HUD flash, big shockwave, instanced confetti (520 quads, ballistic with drag).
4. **Card reveal:** card rises back-first while spinning fast, decelerates, then flips (`easeOutBack`) to the art. Front = canvas art on an iridescent physical material + additive rainbow foil overlay whose UV offset scrolls with time and yaw.
5. **Camera:** push-in during anticipation, full 360° orbit across the burst (`SPIN`), hero settle front-on; every flash adds a seeded camera kick and +2° FOV punch.
6. **Original IP only:** the capsule is an egg pill (violet iridescent base, gold band, cyan shell), never a red/white ball; the creature "Nebulin" and the card frame are original canvas drawings.

## Timeline of the example (12 s)

| Time | Beat |
| --- | --- |
| 0–1.8 s | Hook: capsule pulses and trembles on the pedestal, "MEMANGGIL…" |
| 1.8 / 3.4 / 5.0 s | Rarity upgrades LANGKA (blue) → EPIK (purple) → LEGENDARIS (gold) |
| 6.0 s | Burst: flash, shockwave, confetti, halves fly off; camera starts the 360° spin |
| 6.15–7.7 s | Card rises spinning, back facing |
| 8.45–9.45 s | Flip: Nebulin revealed, second confetti puff, gold motes |
| 9.5–12 s | Hero settle on the holo card |

## Adapting

- New reward: replace `makeCardFront` (keep the 600x850 canvas and the name plate), or swap the card for an item mesh at `CARD_REST`.
- Fewer tiers: edit `TIERS`; everything else reads from it.
- Overlay text stays inside the safe zone (top 180 px / bottom 380 px of 1080x1920).
