# STYLE DNA: Stained Glass — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Sun-Through-Glass Rig

```
        [Sun behind window: drives pane brightness sunGlow(t)]
                          │
                          ▼
   [Panes (unlit, HDR colour)] ─► [Tinted point lights on the jambs: ruby / azure / amber]
                          │
                          ▼
   [Spot key from window → floor]  +  [Additive shafts + blurred floor pool]
```

### 1.1 Light Source Specifications
1. **Sun glow:** `0.55 → 1.0` (1–7 s) then `+0.75` burst (8.6–10.2 s).
2. **Spot key:** `#FFE2A8`, intensity `40 × sunGlow`, angle 0.55, penumbra 0.8, from behind the glass to the floor.
3. **Jamb tints:** three point lights (ruby, azure, amber), intensity `3 × sunGlow`, distance 6.
4. **Ambient:** warm `#C9B79C` 0.22 + hemisphere 0.25; stone stays dim.
5. **Finishing:** bloom 0.55 → 0.9 at the payoff, radius 0.5, threshold 0.82 → ACES → vignette 0.45 → grain 0.025.
