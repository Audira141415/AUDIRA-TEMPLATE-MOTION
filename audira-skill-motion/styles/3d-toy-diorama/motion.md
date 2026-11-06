# STYLE DNA: 3D Toy Diorama — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` constant in Remotion (or simulated `12 / 24 FPS` stop-motion stepped character cadence when nostalgic puppet feel is requested).
- **Physics Model:** Spring Damped Harmonic Oscillator.

---

## 2. Spring Physics Parameters

```typescript
export const TOY_SPRING_CONFIG = {
  // Main character gesture spring
  characterGesture: {
    stiffness: 180,
    damping: 15,
    mass: 1.0,
  },
  // Prop drop-in / slide-in spring (chunky bounce overshoot)
  propOvershoot: {
    stiffness: 220,
    damping: 12,
    mass: 1.2,
  },
  // Washi tape stick down
  tapeSnap: {
    stiffness: 300,
    damping: 24,
    mass: 0.8,
  },
};
```

---

## 3. Characteristic Gesture Choreography
1. **The Toy Wave:**
   - Arm raises with a 3-frame anticipation dip.
   - Rotates along $Z$-axis from $-15^\circ$ to $+35^\circ$ in 3 rapid pendulum oscillations.
   - Settles smoothly with gentle secondary wrist lag.
2. **The Natural Eye Blink:**
   - Eyelid scales vertically to $0.05$ over 2 frames, holds for 2 frames, returns to $1.0$ over 3 frames.
   - Recurs pseudo-randomly every $180 \pm 40$ frames.
3. **Prop Entry (Physical Drop-in):**
   - Objects slide in from the top or stage wings with noticeable momentum.
   - Contact with the wooden floor triggers a discrete micro-rebound ($0.08$ unit bounce) before settling.
   - Floor footlights flicker slightly on heavy impacts.

