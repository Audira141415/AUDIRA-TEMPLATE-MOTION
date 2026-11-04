# LIDARFORGE — Style 17: 3D point cloud aerial survey, laser scanning & elevation bathymetry

**In this package:** the geospatial point cloud survey engine in `kits/lidarforge/` (dense 3D point clouds with elevation vertex colormapping, sweeping laser scanline curtain, bounding survey volume box, drone flight camera trajectories, and real-world surveying telemetry HUD); see `kits/lidarforge/KIT.md`.

## Which briefs belong here?

Automatically select LIDARFORGE for briefs involving:
- "Survei udara drone (aerial drone survey), pemetaan topografi, atau LiDAR bathymetry"
- "Point cloud 3D, pemindaian laser lanskap, arkeologi hutan, atau eksplorasi reruntuhan kuno"
- "Kendaraan otonom (autonomous vehicles / robotika) dan visualisasi sensor spasial lingkungan"
- "Geospatial GIS, geologi, kontur ketinggian tanah, atau pemantauan erosi / tambang"
- "Visualisasi data ilmiah presisi tinggi di mana titik-titik data mewakili permukaan bumi asli"

Describe the look in friendly Indonesian: *"Gaya survei laser LiDAR 3D udara dengan ribuan titik awan data (point cloud) berketinggian warna, tirai pemindai laser yang menyapu permukaan, dan telemetri drone GPS presisi."*

## Signature visual and narrative grammar

- **Physical Point Returns:** Points represent genuine spatial measurements. Points are colored strictly by elevation (deep indigo for low ground to warm amber for high crests) or classification.
- **Dynamic Laser Sweep Front:** A luminous cyan laser plane slices across the scene along the Z axis, lighting up points as the pulse sweeps through them.
- **Flight Path Momentum:** The camera behaves like a surveyor aircraft: continuous forward movement, banked turns, and descending/ascending glides.
- **Survey HUD Telemetry:** Realistic coordinates (WGS84 lat/long), laser pulse frequency (400 kHz), altitude AMSL, and an elevation colormap legend.

## Act structure that works (8–20s films)

1. **Laser Front Awakening (0–25%):** High oblique flight begins; laser scanline plane ignites and sweeps across the dark nocturnal terrain.
2. **Canopy Skimming (25–65%):** Camera descends into a low skimming flight over the ridge crests; points illuminate in crisp detail as the laser front passes directly underneath.
3. **Ascending Parcel Payoff (65–100%):** Drone pulls up and orbits gently; the entire measured valley/parcel reveals itself in full elevation color; telemetry counters lock into final survey totals.

## Determinism & QA checklist

- **Strict Determinism:** All scanline positions, flight paths, and counters derive purely from `f = (frame / fps) * 60`.
- **Readability:** Always maintain dark nocturnal background (`#04070a`) so the colored points and laser front pop crisply on mobile OLED screens.
- **Performance:** Point counts stay within 10,000 returns for ultra-smooth 60 FPS mobile rendering.

