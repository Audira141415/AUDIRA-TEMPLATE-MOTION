/**
 * BRICKCRAFT Core Motion Library
 * Stop-motion stepping on 12/15 FPS for toys/bricks while camera glides at full 60 FPS.
 */

export function stepFrame(frame: number, stepInterval = 4): number {
  return Math.floor(frame / stepInterval) * stepInterval;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeOutBack(t: number, s = 1.70158): number {
  const c = clamp(t, 0, 1) - 1;
  return c * c * ((s + 1) * c + s) + 1;
}

/**
 * Brick snap arrival: flies in on an arc, snaps into place with a subtle physical click overshoot.
 */
export function snapOvershoot(progress: number): { yOffset: number; scaleY: number } {
  const p = clamp(progress, 0, 1);
  if (p < 0.8) {
    const t = p / 0.8;
    return {
      yOffset: (1 - t * t) * 4.0,
      scaleY: 1.0,
    };
  }
  // Snap impact and settle
  const settle = (p - 0.8) / 0.2;
  const bounce = Math.sin(settle * Math.PI * 3) * Math.exp(-settle * 5) * 0.15;
  return {
    yOffset: bounce,
    scaleY: 1.0 + bounce * 0.5,
  };
}

/**
 * Stepped character walk cycle
 */
export function characterWalk(steppedFrame: number, speed = 0.15): {
  leftLegAngle: number;
  rightLegAngle: number;
  leftArmAngle: number;
  rightArmAngle: number;
  bodyBob: number;
} {
  const phase = steppedFrame * speed;
  const swing = Math.sin(phase) * 0.6; // ~35 degrees swing
  const bob = Math.abs(Math.sin(phase * 2)) * 0.08;

  return {
    leftLegAngle: swing,
    rightLegAngle: -swing,
    leftArmAngle: -swing * 0.8,
    rightArmAngle: swing * 0.8,
    bodyBob: bob,
  };
}

