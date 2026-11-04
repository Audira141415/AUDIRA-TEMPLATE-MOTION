/**
 * URBANFORGE Core Motion Library
 * Solar path calculations, data projection sweeps, and architectural crane kinematics.
 */

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeInOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/**
 * Calculates solar position over the architectural model for a day sweep (morning to late afternoon).
 */
export function getSolarPosition(progress: number): {
  position: [number, number, number];
  intensity: number;
  timeString: string;
} {
  const p = clamp(progress, 0, 1);

  // Time from 08:30 to 17:30
  const totalMinutes = 8.5 * 60 + p * (9 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  // Solar arc
  const sunAngle = Math.PI * 0.15 + p * Math.PI * 0.7; // 27 deg to 153 deg
  const sunDistance = 14;
  const x = Math.cos(sunAngle) * sunDistance;
  const y = Math.sin(sunAngle) * (sunDistance * 0.8) + 2.0;
  const z = 6.0 - p * 4.0;

  // Midday sun is brighter than morning/evening
  const intensity = 1.0 + Math.sin(p * Math.PI) * 1.2;

  return {
    position: [x, y, z],
    intensity,
    timeString,
  };
}

/**
 * Projection sweep wave across the urban model.
 */
export function getProjectionWave(progress: number): {
  waveFrontZ: number;
  pulseBrightness: number;
} {
  const p = clamp(progress, 0, 1);
  const waveFrontZ = lerp(-6, 6, p);
  const pulseBrightness = 0.8 + Math.sin(p * Math.PI * 6) * 0.2;
  return { waveFrontZ, pulseBrightness };
}

