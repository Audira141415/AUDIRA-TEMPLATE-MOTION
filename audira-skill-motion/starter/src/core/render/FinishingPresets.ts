/**
 * Cinematic Finishing Presets & Color Profiles.
 *
 * Provides calibrated finishing profiles inspired by Hollywood grading LUTs:
 * - CINEMA_TEAL_ORANGE: High-contrast warm highlights with deep cyan shadows.
 * - DOCUMENTARY_WARM: Natural rich tones with gentle film contrast.
 * - APPLE_STUDIO_CLEAN: Minimalist pristine white, crisp speculars, zero tint.
 * - CYBER_NEON_VOID: Deep black void, saturated electric neons, intense bloom.
 * - VINTAGE_SEPIA_FILM: Warm antique paper tint, enhanced grain and heavy vignette.
 *
 * Authored by: AUDIRA (Agus Dwi R)
 */

export interface ColorGradeProfile {
  name: string;
  vignette: number;
  grain: number;
  chromaticAberration: number;
  contrastCurve: number; // S-curve intensity 0..1
  highlightTint: [number, number, number]; // RGB tint offset
  shadowTint: [number, number, number];
}

export const COLOR_PROFILES: Record<string, ColorGradeProfile> = {
  CINEMA_TEAL_ORANGE: {
    name: "Cinema Teal & Orange",
    vignette: 0.18,
    grain: 0.015,
    chromaticAberration: 0.003,
    contrastCurve: 0.32,
    highlightTint: [0.03, 0.01, -0.02], // warm amber
    shadowTint: [-0.02, 0.01, 0.04],    // cool teal
  },
  DOCUMENTARY_WARM: {
    name: "Documentary Warm Natural",
    vignette: 0.12,
    grain: 0.010,
    chromaticAberration: 0.001,
    contrastCurve: 0.20,
    highlightTint: [0.015, 0.01, 0.00],
    shadowTint: [0.0, 0.005, 0.01],
  },
  APPLE_STUDIO_CLEAN: {
    name: "Apple Studio Minimalist",
    vignette: 0.06,
    grain: 0.004,
    chromaticAberration: 0.0,
    contrastCurve: 0.15,
    highlightTint: [0.0, 0.0, 0.0],
    shadowTint: [0.0, 0.0, 0.0],
  },
  CYBER_NEON_VOID: {
    name: "Cyber Neon Void",
    vignette: 0.28,
    grain: 0.018,
    chromaticAberration: 0.005,
    contrastCurve: 0.40,
    highlightTint: [0.0, 0.03, 0.04],
    shadowTint: [0.02, 0.0, 0.05],
  },
  VINTAGE_SEPIA_FILM: {
    name: "Vintage Sepia Manuscript",
    vignette: 0.25,
    grain: 0.035,
    chromaticAberration: 0.004,
    contrastCurve: 0.28,
    highlightTint: [0.04, 0.025, -0.02],
    shadowTint: [0.02, 0.01, -0.01],
  },
};

