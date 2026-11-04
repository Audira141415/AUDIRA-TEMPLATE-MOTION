# INNERWORKS kit — cutaway technical explainer & internal mechanical kinematics

Copy `kits/innerworks/src/` into the project's `src/` (on top of the starter). It adds `src/kits/innerworks/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, GearTrain, CutawayStage and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Mechanical kinematic timing, gear teeth ratios, x-ray progression, and easing functions |
| `lib/palette.ts` | Machine cutaway palette (`xrayCyan`, `brassGear`, `steelChassis`, `hardenedShaft`, `hydraulicAmber`, `machineDark`) |
| `lib/materials.ts` | `createGhostHousingMaterial`, `createBrassGearMaterial`, `createSteelShaftMaterial` |
| `mechanisms/GearTrain.tsx` | Procedural interlocking spur gears with strict angular velocity ratios ($N_1 \cdot \omega_1 = -N_2 \cdot \omega_2$) and piston linkage |
| `world/CutawayStage.tsx` | Translucent cutaway enclosure, multi-point internal inspection lighting, and mechanism housing |
| `camera/rig.ts` | Outer shell approach → penetrating cutaway dive into gear teeth → broad internal cross-section reveal |
| `camera/Overlay.tsx` | Technical cutaway telemetry, RPM meters, gear ratios, and cross-section plane indicators |
| `example/` | `InnerworksExample` — 8 s mechanical x-ray transition, gear train acceleration, and kinematic analysis |

## Register the example

In `src/Root.tsx`:

```tsx
import { InnerworksExample, INNERWORKS_EXAMPLE_SECONDS } from "./kits/innerworks/example/InnerworksExample.tsx";

<Composition
  id="InnerworksPreview"
  component={InnerworksExample}
  durationInFrames={INNERWORKS_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

