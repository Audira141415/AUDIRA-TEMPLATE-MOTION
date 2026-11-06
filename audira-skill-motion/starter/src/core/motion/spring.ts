/**
 * Analytical Damped Spring Physics & Secondary Motion Engine.
 *
 * Implements exact closed-form solutions of the damped harmonic oscillator
 * differential equation (m*x'' + c*x' + k*x = 0).
 * 100% frame-accurate and deterministic: given the same frame, it produces
 * the exact same floating-point value with zero accumulated simulation error.
 *
 * Authored by: AUDIRA (Agus Dwi R)
 */

export interface SpringConfig {
  /** Mass of the moving object (default: 1.0) */
  mass?: number;
  /** Spring stiffness / tension (default: 120.0). Higher = faster snap. */
  stiffness?: number;
  /** Damping coefficient (default: 14.0). Higher = less bounce. */
  damping?: number;
  /** Initial velocity at t=0 (default: 0.0) */
  initialVelocity?: number;
}

export const SPRING_PRESETS = {
  /** Snappy with slight subtle overshoot (ideal for UI cards & HUD popups) */
  snappy: { mass: 1.0, stiffness: 180, damping: 18 },
  /** Weighty with distinct organic bounce (robot limbs, heavy doors) */
  bouncy: { mass: 1.2, stiffness: 110, damping: 10 },
  /** Critically damped: fast arrival with zero overshoot */
  gentle: { mass: 1.0, stiffness: 90, damping: 19 },
  /** High elasticity jiggle (antennas, drops, elastic wires) */
  elastic: { mass: 0.8, stiffness: 220, damping: 8 },
} as const;

/**
 * Calculates analytical spring progress from 0.0 to 1.0 over time.
 * @param frame Current frame
 * @param startFrame Frame when spring starts
 * @param fps Video framerate (default: 60)
 * @param config Spring parameters (mass, stiffness, damping)
 */
export function solveSpring(
  frame: number,
  startFrame: number = 0,
  fps: number = 60,
  config: SpringConfig = SPRING_PRESETS.snappy
): number {
  if (frame <= startFrame) return 0;

  const t = (frame - startFrame) / fps;
  const m = config.mass ?? 1.0;
  const k = config.stiffness ?? 120.0;
  const c = config.damping ?? 14.0;
  const v0 = config.initialVelocity ?? 0.0;

  // Damping ratio zeta and undamped angular frequency omega0
  const omega0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(m * k));

  let displacement = 0;

  if (zeta < 1.0) {
    // Underdamped (oscillates with decaying amplitude)
    const omegaD = omega0 * Math.sqrt(1.0 - zeta * zeta);
    const decay = Math.exp(-zeta * omega0 * t);
    const A = -1.0; // initial displacement relative to target (0 - 1)
    const B = (v0 + zeta * omega0 * A) / omegaD;
    displacement = decay * (A * Math.cos(omegaD * t) + B * Math.sin(omegaD * t));
  } else if (Math.abs(zeta - 1.0) < 1e-5) {
    // Critically damped (fastest return without oscillating)
    const decay = Math.exp(-omega0 * t);
    const c1 = -1.0;
    const c2 = v0 + omega0 * c1;
    displacement = decay * (c1 + c2 * t);
  } else {
    // Overdamped
    const s = omega0 * Math.sqrt(zeta * zeta - 1.0);
    const r1 = -zeta * omega0 + s;
    const r2 = -zeta * omega0 - s;
    const c2 = (v0 - r1 * (-1.0)) / (r2 - r1);
    const c1 = -1.0 - c2;
    displacement = c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
  }

  // Value approaches target (1.0) as displacement approaches 0.0
  const result = 1.0 + displacement;
  return Math.abs(result - 1.0) < 1e-4 && t > 1.5 ? 1.0 : result;
}

/**
 * Secondary motion wobble for antennas, liquid surfaces, or dangling cables.
 * Decays over time from t=0.
 */
export function wobble(
  t: number,
  frequency: number = 3.5,
  decayRate: number = 2.5,
  amplitude: number = 1.0
): number {
  if (t < 0) return 0;
  return Math.exp(-decayRate * t) * Math.sin(frequency * Math.PI * 2 * t) * amplitude;
}

/**
 * Disney Principle: Anticipation.
 * Pulls back slightly in reverse before launching forward.
 * @param t Normalised progress 0..1
 * @param strength How far back it pulls (default: 0.25)
 */
export function anticipation(t: number, strength: number = 0.25): number {
  const p = Math.max(0, Math.min(1, t));
  // Anticipation curve: dips negative during the first 30%, then snaps forward
  return (p * p * ((strength + 1) * p - strength));
}

/**
 * Inertial follow-through offset for multi-segment hierarchy
 * (e.g. body -> shoulder -> arm -> hand).
 */
export function followThroughOffset(
  frame: number,
  baseProgressFn: (f: number) => number,
  lagFrames: number = 4
): number {
  const delayedFrame = Math.max(0, frame - lagFrames);
  return baseProgressFn(delayedFrame);
}

