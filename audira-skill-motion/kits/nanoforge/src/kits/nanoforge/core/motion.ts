// NANOFORGE deterministic motion core — 60 FPS clock, Brownian micro-drift & helical mechanics.

export const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const remap = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1): number => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

export const ease = {
  smooth: (t: number): number => t * t * (3 - 2 * t),
  organicPulse: (t: number): number => Math.sin(t * Math.PI),
  // Microscopic Brownian current acceleration
  bioFlow: (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

export const seg = (f: number, start: number, end: number, easing = ease.smooth): number => {
  return easing(remap(f, start, end, 0, 1));
};

/** Deterministic Brownian thermal agitation jitter for nanometer particles */
export const brownianDrift = (f: number, freq = 0.05, amp = 0.08, phase = 0): number => {
  return (
    Math.sin(f * freq + phase) * amp * 0.6 +
    Math.sin(f * freq * 2.3 + phase * 1.5) * amp * 0.3 +
    Math.cos(f * freq * 4.7 + phase * 0.8) * amp * 0.1
  );
};

/** Bio-membrane pulsation rhythm (cell respiration) */
export const membranePulse = (f: number, rate = 0.04, scaleAmp = 0.06): number => {
  return 1 + Math.sin(f * rate) * scaleAmp;
};

