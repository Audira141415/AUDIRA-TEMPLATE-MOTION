# LIDARFORGE kit — 3D point cloud aerial survey, laser scanning & elevation bathymetry

Copy `kits/lidarforge/src/` into the project's `src/` (on top of the starter). It adds `src/kits/lidarforge/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, PointCloudTerrain, LaserScanPlane, SurveyWorld and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic drone flight easing (`droneGlide`, `scanSweep`, `smooth`), and `scanFrontZ` |
| `core/noise.ts` | Deterministic terrain height synthesis, hash functions, and topography generation |
| `lib/palette.ts` | Geospatial survey palette (`elevationBedrock`, `elevationGround`, `elevationRidge`, `elevationPeak`, `laserScanFront`, `surveyVoid`) |
| `lib/materials.ts` | `createPointCloudMaterial`, `createLaserPlaneMaterial`, `createSurveyBoxMaterial` |
| `survey/PointCloudTerrain.tsx` | Dense 8,400+ point returns with vertex color elevation colormapping and leading laser scanline |
| `survey/LaserScanPlane.tsx` | Vertical translucent laser sweep curtain with overhead drone projector beam |
| `world/SurveyWorld.tsx` | Complete geospatial survey stage: point cloud, laser curtain, coordinate grid base, and bounding volume box |
| `world/Atmosphere.tsx` | Cold nocturnal ambient, drone downlight, and laser front illumination |
| `camera/rig.ts` | Deterministic 3-act drone flight trajectory (high oblique survey → low skimming canopy glide → ascending orbital pullback) |
| `camera/Overlay.tsx` | LiDAR survey HUD: GPS coordinates (WGS84), altitude AMSL, pulse repetition frequency (400 kHz), point counter, and elevation legend |
| `example/` | `LidarforgeExample` — 8 s aerial survey sequence: laser plane sweep, terrain reveal, and full valley payoff |

## Register the example

In `src/Root.tsx`:

```tsx
import { LidarforgeExample, LIDARFORGE_EXAMPLE_SECONDS } from "./kits/lidarforge/example/LidarforgeExample.tsx";

<Composition
  id="LidarforgePreview"
  component={LidarforgeExample}
  durationInFrames={LIDARFORGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

## Directing a LIDARFORGE film

1. **Elevation-Driven Color Logic:** Point color must directly reflect elevation or classification (deep indigo bedrock $\to$ emerald ground $\to$ amber ridges $\to$ coral peaks). Never use random unmotivated rainbow ramps.
2. **Dynamic Laser Sweep:** The laser front plane must physically slice through the point cloud, illuminating the leading edge as returns are detected.
3. **Drone Cinematography:** Cameras move like survey drones or aircraft: continuous steady momentum, controlled pitch angles ($15^\circ - 35^\circ$), and smooth banking curves without sudden robotic jerks.

