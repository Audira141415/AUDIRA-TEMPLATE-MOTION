/**
 * Organic Handheld Camera Kinematics & Cinematic Lens Helpers.
 *
 * Provides deterministic pseudo-noise camera drift to eliminate
 * sterile mathematical rigidity ("Anti-Robotic Camera"), plus
 * Dolly-Zoom (Vertigo effect) and Whip-Pan transition curves.
 *
 * Authored by: AUDIRA (Agus Dwi R)
 */

export interface HandheldConfig {
  /** Positional drift amplitude in world units (default: 0.025) */
  posIntensity?: number;
  /** Rotational drift amplitude in radians (default: 0.008, approx 0.45 deg) */
  rotIntensity?: number;
  /** Speed / frequency of breathing motion (default: 1.0) */
  speed?: number;
  /** Seed offset to vary between shots */
  seed?: number;
}

/**
 * Deterministic pseudo-random harmonic octave noise generator.
 * Produces smooth, non-repeating continuous values without external heavy noise libs.
 */
function harmonicNoise(t: number, seed: number): number {
  return (
    Math.sin(t * 1.13 + seed) * 0.5 +
    Math.sin(t * 2.37 + seed * 1.7) * 0.3 +
    Math.sin(t * 4.71 + seed * 3.1) * 0.15 +
    Math.sin(t * 8.19 + seed * 5.3) * 0.05
  );
}

export interface CameraDrift {
  posOffset: [number, number, number];
  rotOffset: [number, number, number];
}

/**
 * Computes organic handheld micro-drift for the current frame.
 * Apply by adding posOffset to camera position and rotOffset to camera rotation.
 */
export function getHandheldDrift(
  frame: number,
  config: HandheldConfig = {}
): CameraDrift {
  const pAmp = config.posIntensity ?? 0.025;
  const rAmp = config.rotIntensity ?? 0.008;
  const spd = (config.speed ?? 1.0) * 0.02;
  const s = config.seed ?? 42;

  const t = frame * spd;

  const px = harmonicNoise(t, s + 1.1) * pAmp;
  const py = harmonicNoise(t * 0.85, s + 2.7) * pAmp * 1.2; // vertical breathing is slightly stronger
  const pz = harmonicNoise(t * 0.65, s + 4.3) * (pAmp * 0.6);

  const rx = harmonicNoise(t * 0.9, s + 5.9) * rAmp;
  const ry = harmonicNoise(t * 1.1, s + 7.1) * rAmp;
  const rz = harmonicNoise(t * 0.7, s + 8.4) * (rAmp * 0.5); // subtle roll

  return {
    posOffset: [px, py, pz],
    rotOffset: [rx, ry, rz],
  };
}

/**
 * Calculates Hitchcock Dolly-Zoom (Vertigo effect) FOV:
 * Keeps the subject size constant in frame while the camera distance changes.
 *
 * @param currentDistance Current distance between camera and subject
 * @param baseDistance Reference distance where baseFov was set
 * @param baseFov Reference field-of-view in degrees (e.g. 35)
 * @returns Corrected FOV in degrees
 */
export function computeDollyZoomFov(
  currentDistance: number,
  baseDistance: number,
  baseFov: number = 35
): number {
  if (currentDistance <= 0.01) return baseFov;
  const baseFovRad = (baseFov * Math.PI) / 180;
  // half-height = baseDistance * tan(baseFov / 2)
  const halfHeight = baseDistance * Math.tan(baseFovRad * 0.5);
  // tan(newFov / 2) = halfHeight / currentDistance
  const newFovRad = 2 * Math.atan(halfHeight / currentDistance);
  const newFovDeg = (newFovRad * 180) / Math.PI;
  // Clamp between safe camera limits (10 deg telephoto to 120 deg ultra-wide)
  return Math.max(10, Math.min(120, newFovDeg));
}

/**
 * Speed-ramped Whip-Pan camera transition.
 * Rapidly rotates the camera across a short burst of frames with extreme velocity.
 */
export function whipPanOffset(
  frame: number,
  startFrame: number,
  durationFrames: number = 12,
  angleDegrees: number = 45
): { angleOffsetRad: number; motionBlurFactor: number } {
  if (frame < startFrame || frame > startFrame + durationFrames) {
    return { angleOffsetRad: 0, motionBlurFactor: 0 };
  }

  const p = (frame - startFrame) / durationFrames;
  // S-curve with maximum velocity at p = 0.5
  const eased = p * p * (3 - 2 * p);
  const velocity = 6 * p * (1 - p); // derivative peaks at 1.5 when p=0.5

  const rad = (angleDegrees * Math.PI) / 180;
  return {
    angleOffsetRad: eased * rad,
    motionBlurFactor: Math.min(1.0, velocity * 0.8),
  };
}

