# MISTISFORGE — Kit Guide

> Style ID: 44. Indonesian folk-horror night: a kampung path in thick ground fog, swinging pelita oil lamps, bamboo groves, a wooden rumah panggung, a banyan with a curtain of aerial roots, and a pale silhouette that only exists inside the fog. Cold moonlight blue against warm lamp amber. Suggestive, never gory.

## Quick Start

```tsx
import { MistisforgeExample } from "./example/MistisforgeExample";
import { KampungNight3D } from "./scene/KampungNight3D";
import { PelitaLanterns3D, PELITA_POSITIONS } from "./scene/PelitaLanterns3D";
import { FogVeil3D } from "./scene/FogVeil3D";
import { getMistisCamera } from "./camera/rig";
import { MistisOverlay } from "./camera/Overlay";
import { computeMistisState, pelitaFlicker, mulberry32 } from "./core/motion";
```

Compositions: `MistisforgePreview` (540x960@30) and `MistisforgeFinal` (1080x1920@60), 12 s.

## Signature Motion & Style Rules

1. **Two-temperature light:** cold moonlight rim (`#8FAACC`) from behind the set + warm pelita point lights (`#FFA94A`, decay 1.6). Never one flat colour.
2. **Ground fog is layered, not global:** `FogExp2` (`#24364F`, density 0.055) for depth + 40–50 billboard fog sprites hugging 0.2–1.2 m, drifting sideways at 0.1–0.3 m/s.
3. **Pelita flicker:** two-octave value noise (`pelitaFlicker`), never a pure sine. All lamps gutter together (×0.22) for the payoff beat.
4. **Slow creeping dolly:** forward 4–5 m in 12 s with low-frequency handheld breath (±4 cm); the gaze drifts toward the threat, then a small involuntary push-in and lens tightening (52°→45°).
5. **The presence is suggestive:** pale gown + long dark hair billboard, dark aura behind, fog veil at its feet; appears 5.6–8.6 s, holds through the payoff, gone by 11.3 s. No face, no blood, no gore.
6. **Instanced vegetation:** bamboo culms + leaf sprays, banyan aerial roots and grass tufts are `InstancedMesh`, swayed from `wind` in `computeMistisState`.
7. **Overlay:** inside 9:16 safe zones (top 180 px / bottom 380 px of 1080x1920), serif italic title, amber monospace kicker that changes per beat, badge `MISTISFORGE // 44`, `Creator: AUDIRA`.

## Story Arc (example)

| Time | Beat |
| --- | --- |
| 0–2 s | Hook: close on a swinging pelita, eye drifts down the fogged path |
| 2–6 s | Creep forward, rumah panggung window glows, fog builds |
| 6–9 s | Gaze pulled left to the banyan roots; a pale shape forms in the fog |
| 9–11 s | Payoff: lamps gutter, moon surges, push-in on the silhouette |
| 11–12 s | Lamps flare back, the shape is gone |

## Known Limits

- Fog is sprite-based, not volumetric; keep the camera outside fog sprites (near plane 0.05) to avoid hard sprite edges.
- The presence is a billboard; orbiting more than ~30° around it reveals its flatness.
- Cultural tone: keep it folklore (kampung, beringin, kunang-kunang), avoid mocking beliefs or real places/people.
