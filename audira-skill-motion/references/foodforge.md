# FOODFORGE — Style 45: Macro Food Commercial Tabletop

**In this package:** the food-commercial engine in `kits/foodforge/` (oiled walnut tabletop, stoneware hero bowl with glossy broth and tube noodles, slow-motion ingredient drops with landing ripples, backlit additive steam, chili-oil drip from a spoon, chopstick noodle-lift payoff, bokeh back wall, warm tungsten key with hot rim, slow orbit then push-in); see `kits/foodforge/KIT.md`.

## Which briefs belong here?

Automatically select **FOODFORGE** for briefs involving:
- "Video iklan makanan atau minuman yang menggugah selera (food commercial)"
- "Resep, kuliner, review makanan, menu restoran, UMKM kuliner"
- "Bahan-bahan berjatuhan slow motion lalu mendarat di mangkuk atau piring"
- "Uap panas mengepul, saus menetes, close-up makro"
- "Promo menu baru kafe, warung, bakmi, burger, kopi"

Describe the look in friendly Indonesian:
> *"Gaya iklan makanan makro yang menggugah selera: hidangan utama di atas meja kayu gelap, bahan-bahan jatuh pelan dalam gerak lambat lalu mendarat sempurna, uap panas mengepul diterangi cahaya dari belakang, saus menetes berkilau, dan kamera berputar pelan lalu mendekat."*

## Visual DNA

| Layer | Content |
| --- | --- |
| Background | Dark warm studio wall `#140C08` with a glow pool and defocused bokeh practicals |
| Midground | Walnut planks, side props (soy dish, linen, scallion stalks), sesame crumbs |
| Subject | Hero dish with glossy food materials, toppings, garnish |
| Foreground / FX | Steam sprites, falling garnish, drips, ripples, chopsticks |
| HUD | Serif italic title, camera-spec kicker (`MACRO 100MM // F2.8`), caption box, `FOODFORGE // 45` badge, `Creator: AUDIRA` |

## Rules

1. Food must look edible: warm saturated colours, clearcoat gloss, never grey or cold-lit.
2. Keep the background dark so steam, gloss and rim light read.
3. One hero dish per shot; props stay smaller and off-centre.
4. Every falling item lands with visible contact (bounce, squash, ripple); nothing pops in.
5. Original dishes and props only: no restaurant logos, brand packaging or chef likeness.

## Known limits

- No fluid simulation: drips are stretched spheres and ripples are rings; melting cheese or pouring sauce needs authored geometry.
- Lifted noodle strands rebuild their tube geometry each frame; keep lifted strands at 8 or fewer.
- Depth of field is faked (bokeh sprites + vignette), not a post pass.
