# TACTICBOARD — Kit Guide

> Broadcast football tactics on a miniature 3D pitch board: mowed-grass stripes and painted chalk lines, two fictional teams of numbered acrylic puck tokens, passing lanes that draw themselves on, dashed run arrows, a ball trail, a bulging goal net and a golden replay path, framed by a coach-board HUD (score bug, minute clock, 4-3-3 vs 4-4-2 chips).

Style ID: 46

## Quick Start

```tsx
import { TacticboardExample } from "./example/TacticboardExample";
import { PitchBoard3D } from "./scene/PitchBoard3D";
import { PlayerTokens3D } from "./scene/PlayerTokens3D";
import { PlayLines3D } from "./scene/PlayLines3D";
import { getTacticCamera } from "./camera/rig";
import { TacticOverlay } from "./camera/Overlay";
import { PLAYERS, BEATS, ballPos, playerPos } from "./core/motion";
```

Compositions: `TacticboardPreview` (540x960 @ 30) and `TacticboardFinal` (1080x1920 @ 60).

## How a new play is authored

1. Edit `PLAYERS` in `core/motion.ts`: each token has timed `(x, z)` keys on a 6.8 x 10.4 pitch (home attacks toward -z).
2. Edit `BEATS` (pass windows) and the `ballPos` chain: the ball sits 0.24 in front of its holder and travels between holders with a lift arc.
3. `LANES` draws one lane per pass (draws on 0.6 s before the pass, fades 0.8 s after). Run arrows are placed in `PlayLines3D` with a start, end and bend.
4. Re-key the camera in `camera/rig.ts` (Catmull-Rom through timed keys): high overhead for the shape, low pitch-side for the finish.

## Signature Motion & Style Rules

1. **Painted pitch, not a texture photo:** stripes, speckle and chalk lines are painted on one CanvasTexture; keep the 14-stripe mow and 0.035-unit lines.
2. **Tokens are acrylic pucks:** white base ring + team-colour side + numbered top. Fictional teams only (HARBOUR FC coral `#FF5A3C`, VALLEY UNITED cobalt `#2F7BFF`), never real clubs, crests or players.
3. **Telestrator colour code:** yellow `#FFE27A` = ball / passes, coral dashes = off-ball runs, gold `#FFC94A` = the goal and the replay path.
4. **Broadcast camera grammar:** start high and tactical (whole shape readable), sweep down the flank with the play, finish low pitch-side at goal height.
5. **Background is a stadium bowl of bokeh lights** (instanced, twinkling) with floodlight towers; never a flat colour behind the board.
