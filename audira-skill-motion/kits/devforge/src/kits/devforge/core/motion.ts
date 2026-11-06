export interface DevforgeState {
  codeCharCount: number;
  windowTiltX: number;
  windowTiltY: number;
  windowHoverZ: number;
  spawnProgress: number; // 0..1 object pops out from screen
  metricScale: number;
}

export function computeDevforgeState(f: number): DevforgeState {
  // 1. Code typewriter reveals over time (starts fast at f=15)
  const codeCharCount = Math.min(320, Math.floor(Math.max(0, f - 15) * 2.2));

  // 2. Subtle 3D isometric floating motion
  const windowTiltX = 0.14 + Math.sin(f * 0.04) * 0.03;
  const windowTiltY = -0.22 + Math.cos(f * 0.035) * 0.04;
  const windowHoverZ = Math.sin(f * 0.05) * 0.12;

  // 3. 3D Game Asset pops out at f >= 160 (frame ~2.6s)
  let spawnProgress = 0;
  if (f > 160) {
    const t = (f - 160) / 35;
    // Damped spring overshoot: goes past 1.0 to 1.15 then settles
    spawnProgress = Math.min(1.0, t < 1.0 ? 1.0 + Math.exp(-4 * t) * Math.sin(t * Math.PI * 3) * 0.3 : 1.0);
  }

  // 4. Metric profit badge pops at f >= 240
  let metricScale = 0;
  if (f > 240) {
    const t = (f - 240) / 25;
    metricScale = Math.min(1.0, t < 1.0 ? t * 1.15 : 1.0);
  }

  return { codeCharCount, windowTiltX, windowTiltY, windowHoverZ, spawnProgress, metricScale };
}
