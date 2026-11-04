# NANOFORGE kit — molecular biology, DNA double-helix & Cryo-EM nanotech cinematics

Copy `kits/nanoforge/src/` into the project's `src/` (on top of the starter). It adds `src/kits/nanoforge/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, DnaHelix, CellularVesicle, MicroCosmos and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic biological easing (`bioFlow`, `organicPulse`, `smooth`), `brownianDrift`, and `membranePulse` |
| `core/noise.ts` | Deterministic pseudo-random number generator, hash functions, and spherical coordinate dispersion |
| `lib/palette.ts` | Fluorescent microscopy palette (`thymineCyan`, `adenineGold`, `cytosineViolet`, `guanineRuby`, `membraneGlow`, `microscopyVoid`) |
| `lib/materials.ts` | `createBioMembraneMaterial`, `createNucleotideMaterial`, `createDnaBackboneMaterial`, `createNanobotMaterial` |
| `cellular/DnaHelix.tsx` | Procedural double-helix with rotating complementary nucleotide base-pair rungs and hydrogen bonds |
| `cellular/CellularVesicle.tsx` | Undulating phospholipid bilayer spheres with internal organelle cores and surface receptor proteins |
| `world/MicroCosmos.tsx` | Hero nanotech scene: DNA core, floating cellular bodies, and Brownian molecular solutes |
| `world/Atmosphere.tsx` | Deep cytoplasm fluid ambiance, electron beam illuminator, and dual cyan/magenta bioluminescent rim lights |
| `camera/rig.ts` | Deterministic 3-act microscopy trajectory (macro base-pair zoom → helical ascending sweep → wide cellular pull-back) |
| `camera/Overlay.tsx` | Cryo-EM microscopy HUD: scale bar (25nm), magnification telemetry (650,000×), voltage, and targeting reticle |
| `example/` | `NanoforgeExample` — 8 s molecular journey: DNA base-pair scan, helical ascent, and cellular cosmos payoff |

## Register the example

In `src/Root.tsx`:

```tsx
import { NanoforgeExample, NANOFORGE_EXAMPLE_SECONDS } from "./kits/nanoforge/example/NanoforgeExample.tsx";

<Composition
  id="NanoforgePreview"
  component={NanoforgeExample}
  durationInFrames={NANOFORGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

## Directing a NANOFORGE film

1. **Fluid Brownian Dynamics:** Objects in the micro-world are perpetually suspended in fluid. Avoid static poses; always incorporate subtle `brownianDrift(f)` on both geometry and camera.
2. **Bioluminescent Contrast:** Contrast bright fluorescent emissive base pairs against deep cytoplasm void backgrounds (`#02050f`).
3. **Organic Membrane Transmission:** Cell walls and vesicles must feel soft and hydrated; use `meshPhysicalMaterial` with transmission $\approx 0.7$ and IOR $1.33$ (water).

