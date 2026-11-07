# STYLE DNA: Nusantara Folk Horror — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Moon Rim vs Oil Lamp Rig

```
        [Full Moon + Halo (fog-free)]          [Weak Front Fill 0.25]
                    |                                   |
                    v                                   v
   [Treeline] - [Rumah Panggung (window practical)] - [Banyan roots] - [Path]
                    ^                                   ^
                    |                                   |
        [Pelita point lights 1900K, flicker]    [Hemisphere sky/ground bounce]
```

### 1.1 Light Source Specifications
1. **Moon Rim Key:** directional `#8FAACC`, intensity `1.6` (surges to `3.0` at the payoff), from behind the set so silhouettes get blue edges.
2. **Hemisphere Bounce:** sky `#5C7AA6` / ground `#1A1610`, intensity `0.9`. Keeps the night readable, never crushed black.
3. **Pelita Practicals:** point lights `#FFA94A`, intensity `5.5`, distance `9`, decay `1.6`, multiplied by `pelitaFlicker` (0.82–1.0) and by `lanternGutter` (drops to 0.22 at 9–11 s).
4. **Window Practical:** `#FFA14A` point light inside the house, intensity `3.5`; emissive window `2.4`.

### 1.2 Atmosphere
- `FogExp2("#24364F", 0.055)` for distance haze.
- 46 drifting fog sprites tinted `#7E92AC`, opacity 0.22–0.52 scaled by `fogBuild` (0.55 to 1.0).
- Moon disc and halo use `fog={false}` so the moon always cuts through.
