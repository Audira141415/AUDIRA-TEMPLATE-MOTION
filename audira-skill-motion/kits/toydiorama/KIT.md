# TOYDIORAMA — Kit Guide

> Commercial Stylized 3D Toy Diorama & Theatrical Miniature Stage. Characterized by blocky toy characters, matte plastic and soft clay PBR materials, wooden stage platforms with footlights, taped paper annotations, and a static theatrical macro camera.

## Quick Start

```tsx
import { ToyDioramaExample } from "./example/ToyDioramaExample";
import { TheaterStage3D } from "./diorama/TheaterStage3D";
import { ToyCharacter3D } from "./diorama/ToyCharacter3D";
import { PaperLabel3D } from "./diorama/PaperLabel3D";
import { getToyDioramaCamera } from "./camera/rig";
import { ToyDioramaOverlay } from "./camera/Overlay";
```

## Signature Motion & Style Rules

1. **Static Theatrical Camera:** `position: [0, 1.75, 6.4]`, `target: [0, 1.35, 0]`, FOV 32°. Strict rule: No pan, no tilt, no erratic zoom.
2. **Matte Plastic & Soft Clay:** PBR roughness between 0.70 and 0.85, metalness <= 0.05. Avoid glossy chrome or flat 2D cartoons.
3. **Theatrical Miniature Stage:** Layered wooden plank platform, glowing warm footlights, cardboard/clay scenery flats on wooden dowel rods.
4. **Articulated Toy Kinematics:** Smooth, natural body gestures (60 FPS breathing sway, waving mitten hands, discrete natural eye blinks).
5. **Physical Object Interactions:** Props slide or spring in on overdamped harmonic oscillations without instant teleportation.
6. **Bold Editorial Annotations:** Pinned kraft paper tags secured with semi-translucent washi tape strips.
