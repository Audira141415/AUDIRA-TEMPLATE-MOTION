# MARBLEMUSEUM — Kit Guide

> Style ID: 61

> Classical Marble Museum: an original Greco-Roman style "unknown thinker" bust sculpted procedurally (chisel-feature displacement on a dense sphere, drill-cut hair and beard locks, himation drapery folds) in veined statuary marble with a warm subsurface lift, on a turned socle and moulded plinth. Around it: an oxblood gallery with dado and gilt rail, fluted columns, a gilded frame holding an original dusk painting, a polished two-tone floor, and a skylight beam with dust motes. The camera makes a slow reverent orbit; at the payoff the sun lands on the face and a museum wall-label card slides in.

## Quick Start

```tsx
import { MarblemuseumExample } from "./example/MarblemuseumExample";
import { MarbleBust3D } from "./scene/MarbleBust3D"; // sculpted head, curls, torso drapery, socle, plinth
import { Gallery3D } from "./scene/Gallery3D"; // walls, floor, columns, gilded frame, skylight, beam, motes, lights
import { makeMarbleMaterial } from "./lib/materials"; // world-space procedural veins (no UV seams), works on instanced meshes
import { getMarbleCamera } from "./camera/rig";
import { MarblemuseumOverlay } from "./camera/Overlay";
import { MarbleCameraRig, MarblePost } from "./lib/post";
```

`makeMarbleMaterial({ color, scale, strength, roughness })` injects veining into `MeshPhysicalMaterial` via `onBeforeCompile` using world position, so any mesh (sculpted, lathe, instanced) gets continuous veins.

## Signature Motion & Style Rules

1. **Stone is still, light moves:** the bust never animates; the drama comes from the orbit and the skylight (`skylight(t)` 0.55 → 1.4).
2. **Marble truth:** warm white `#E9DFCF`, roughness 0.3, clearcoat 0.25, low sheen, veins grey→umber at 0.95 strength; emissive lift ≤ 0.05 (more reads as plastic glow).
3. **Exposure discipline:** marble blows out easily. Key spot ≤ 22 × skylight, ACES exposure 0.85, bloom threshold 0.95. Check stills for clipped white first.
4. **Gallery depth:** oxblood walls + dark dado behind, columns at mid depth, motes and beam in front; the gilded frame sits behind the head in the three-quarter view.
5. **Camera:** close three-quarter on the face (hook) → pull back to 4.3 units while orbiting from the bust's right to its left (easeInOut) → settle at eye-to-chest height with the label card.
6. **Label card:** white museum card (object number, title, material line, one italic line), bottom-left, inside the safe zone.

## Do / Don't

- Do keep the subject anonymous and original (no real emperors, philosophers' likenesses or museum objects).
- Do use the label card for facts in real episodes (date, material, place) once researched.
- Don't use neon, brutalist concrete or hard flat shadows (that is BRUTALFORGE); this style is hushed, warm and reverent.
