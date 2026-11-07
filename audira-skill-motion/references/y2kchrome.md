# Y2KCHROME — Style 54: Y2K Liquid Chrome & Frutiger Aero

**In this package:** the Y2K chrome engine in `kits/y2kchrome/` (procedural sky env for chrome reflections, CPU-displaced liquid-chrome blob with metaball merges and elastic sparkle-star morph, chrome rings, extruded mini sparkles, iridescent soap bubbles, glossy instanced clouds, four-point lens sparkles, playful orbit camera, Frutiger-aero glossy HUD); see `kits/y2kchrome/KIT.md`.

## Which briefs belong here?

Automatically select **Y2KCHROME** for briefs involving:
- "Estetika Y2K, tahun 2000-an, Frutiger Aero, nostalgia internet awal"
- "Krom cair, gelembung mengilap, langit biru aqua, kilau lensa"
- "Promo produk anak muda, fashion, musik pop, teaser rilis yang ceria"
- "Intro channel atau bumper yang playful dan berkilau"
- "Konten tren nostalgia era ponsel lipat dan desktop mengilap"

Describe the look in friendly Indonesian:
> *"Gaya Y2K dan Frutiger Aero yang ceria: gumpalan krom cair yang memantulkan langit biru, gelembung sabun berkilau pelangi, awan lembut, cincin krom dan kilau bintang, bergerak memantul-mantul lalu berubah menjadi bintang krom yang berkilau."*

## Visual DNA

| Layer | Content |
| --- | --- |
| Background | Aqua vertex-gradient sky dome, additive sun glow |
| Midground | Instanced glossy cloud banks drifting below the hero |
| Subject | Liquid-chrome blob → sparkle star, chrome rings, mini chrome sparkles |
| Foreground / FX | Iridescent bubbles (some near the lens), four-point lens sparkles, payoff flare |
| HUD | `✦ MILLENNIUM MODE // 2000` kicker, blue-gradient title, glossy aero pill badge `Y2KCHROME // 54`, caption pill, `Creator: AUDIRA` |

## Rules

1. Chrome must reflect sky colours; the env scene is mandatory.
2. Lettering-free 3D: no chrome text, no logos, no real product shapes.
3. Distinct from GLASSCRAFT (no frosted glass panels), FLUIDFORGE (no ferrofluid spikes, no dark void) and RETROWAVE (no neon grid, no sunset).
4. Keep it bright and optimistic: the darkest value is the blue zenith.
5. Motion bounces; nothing moves linearly.

## Known limits

- The blob is a single displaced sphere: no topology change (it cannot split into two).
- Transparent bubbles are not depth-sorted against each other perfectly; keep them small and spread out.
- The star morph flattens in z; very oblique camera angles show the thin side.
