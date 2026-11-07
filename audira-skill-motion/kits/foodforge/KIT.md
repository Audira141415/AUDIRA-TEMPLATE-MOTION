# FOODFORGE — Kit Guide

> Macro food commercial: a hero dish on an oiled walnut tabletop, ingredients falling in slow motion and landing, rising backlit steam, a glossy sauce drip, warm tungsten key with hot rim light, and a slow orbit that ends in a push-in.

Style ID: 45

## Quick Start

```tsx
import { FoodforgeExample } from "./example/FoodforgeExample";
import { TabletopSet3D } from "./scene/TabletopSet3D";
import { RamenBowl3D, BROTH_Y, chopTip } from "./scene/RamenBowl3D";
import { SteamWisps3D } from "./scene/SteamWisps3D";
import { getFoodforgeCamera } from "./camera/rig";
import { FoodforgeOverlay } from "./camera/Overlay";
import { computeFoodState, dropLand } from "./core/motion";
```

Compositions: `FoodforgePreview` (540x960@30) and `FoodforgeFinal` (1080x1920@60).

## Signature Motion & Style Rules

1. **Dark warm void + walnut:** studio background `#140C08`, oiled walnut planks (procedural grain, clearcoat 0.35). Never a bright kitchen.
2. **Backlit steam:** additive camera-facing sprites lit by a warm spot from behind the dish. Steam only reads against a dark background.
3. **Slow-motion drop and land:** every ingredient uses `dropLand(t, landSecond)`: suspended drift, accelerating fall, one damped bounce, a short squash and a broth ripple ring. Stagger landings 0.5–0.6 s apart.
4. **Appetising gloss:** food uses `MeshPhysicalMaterial` with clearcoat 0.6–1.0 and low roughness; reflections come from a procedural `RoomEnvironment` at intensity ~0.28.
5. **Shallow-focus feel without post:** defocused bokeh sprites on the back wall plus a soft vignette in the overlay. Keep props in the foreground to sell depth.
6. **Camera:** slow orbit (−0.62 → 0.55 rad) for the whole clip, push-in from 8.6 s that follows the payoff (chopstick lift).

## Timeline of the example (12 s)

| Time | Beat |
| --- | --- |
| 0–2.4 s | Hook: nori, chashu, eggs, scallions and sesame suspended above the bowl |
| 2.4–6.5 s | Ingredients land one by one; chili oil drips from the spoon (3.3, 5.7, 7.7 s) |
| 7–9 s | Steam builds, camera rises to a 3/4 hero angle |
| 9–11 s | Payoff: chopsticks lift a glossy noodle bundle, push-in |

## Adapting

- New dish: replace `RamenBowl3D` and keep the rest-surface constant and the `TOPPINGS` schedule pattern. Burgers: stack lathe/box layers with the same `dropLand` schedule.
- Use instanced meshes for garnish (scallion rings, seeds, crumbs).
- Overlay text stays inside the safe zone (top 180 px / bottom 380 px of 1080x1920).
