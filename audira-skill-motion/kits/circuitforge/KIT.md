# CIRCUITFORGE kit — 3D PCB electronics, SMT microchips & copper electron streams

Copy `kits/circuitforge/src/` into the project's `src/` (on top of the starter). It adds `src/kits/circuitforge/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, PcbSubstrate, MicrochipBga, ElectronPulse, CircuitStage and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Microcurrent propagation easing (`currentSnap`, `macroGlide`, `smooth`), and `pulseProgress` |
| `lib/palette.ts` | Hardware electronics palette (`solderMaskDark`, `copperTraceBevel`, `enigGold`, `siliconDie`, `electronAmber`, `clockCyan`) |
| `lib/materials.ts` | `createSolderMaskMaterial`, `createCopperTraceMaterial`, `createEnigGoldMaterial`, `createSiliconDieMaterial`, `createCurrentPulseMaterial` |
| `pcb/PcbSubstrate.tsx` | 3D FR-4 base with octilinear copper routing, ENIG vias, test pads, and silkscreen markings |
| `pcb/MicrochipBga.tsx` | Central BGA processor package with nickel heat spreader, pin 1 marker, and 0603 decoupling capacitors |
| `pcb/ElectronPulse.tsx` | Additive glowing current pulses (Amber DC power + Cyan high-frequency clock and data bus) |
| `world/CircuitStage.tsx` | Complete motherboard diorama with components, traces, current flow, and blinking power status LED |
| `world/Atmosphere.tsx` | Macro studio softbox lighting with specular highlights on gold contacts and copper bevels |
| `camera/rig.ts` | Deterministic 3-act camera rig (macro trace ride → 3/4 orbital chip reveal → top-down schematic pull-back) |
| `camera/Overlay.tsx` | Hardware diagnostic HUD: core clock (4.8 GHz), core voltage (1.15V), current draw, and pinout telemetry |
| `example/` | `CircuitforgeExample` — 8 s electronics sequence: power pulse arrival, BGA silicon reveal, and schematic payoff |

## Register the example

In `src/Root.tsx`:

```tsx
import { CircuitforgeExample, CIRCUITFORGE_EXAMPLE_SECONDS } from "./kits/circuitforge/example/CircuitforgeExample.tsx";

<Composition
  id="CircuitforgePreview"
  component={CircuitforgeExample}
  durationInFrames={CIRCUITFORGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

## Directing a CIRCUITFORGE film

1. **Octilinear Trace Geometry:** Traces follow authentic 0°, 45°, and 90° routing rules with chamfered mitered corners.
2. **Current Tells the Story:** Electrical current moves along the traces to explain cause and effect (e.g. power entering from the voltage regulator, clock signals entering from the crystal oscillator into the BGA core).
3. **Macro Cinematography:** Use shallow depth of field cues and low-angle camera tracks so small SMT components read with tangible physical scale.

