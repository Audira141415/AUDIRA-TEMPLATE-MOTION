# STYLE DNA: Illuminated Manuscript & Lontar — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Candlelight Scriptorium Rig

```
   [Window fill 0.45, cool-warm, from left]
                 |
                 v
 [Candle A 1900K, shadows] -> [Codex + Gold initial] <- [Gleam light glides over the gold]
                 |
                 v
        [Candle B 1900K] -> [Lontar bundle]
                 ^
     [Low warm ambient 0.22 + hemisphere 0.35, PMREM env 0.22]
```

### 1.1 Light Source Specifications
1. **Candles:** point lights `#FFAD55`, intensity `2.6 x flicker`, distance 5, decay 1.6. Candle A casts PCF soft shadows (1024).
2. **Flicker:** $0.84 + 0.11\,n(5.5t) + 0.05\,n(15t)$ (value noise), flame sway $0.02\sin(2.1t)$.
3. **Gleam:** point light `#FFF0C8`, intensity `1.6 x sin(pi k)`, distance 1.0, 0.22 m above the page, sweeping across the initial during 0–2.2 s and 9–11.2 s.
4. **Window Fill:** directional `#C9B8A0`, 0.45, from the left.
5. **Ambient:** `#6A4A30` 0.22 + hemisphere `#7A5A3A / #120A06` 0.35; environment `RoomEnvironment` at 0.22 for the gold.

### 1.2 Atmosphere
- Fog `#0E0906` 3.2–7 m, 36 additive dust motes in the candle light, radial vignette in the overlay.
