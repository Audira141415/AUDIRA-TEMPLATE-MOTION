export interface BotCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * Harmonic handheld breathing drift calculator.
 */
function getBreathingDrift(f: number): [number, number, number] {
  const dx = Math.sin(f * 0.04) * 0.02 + Math.sin(f * 0.09) * 0.008;
  const dy = Math.sin(f * 0.035) * 0.025 + Math.cos(f * 0.07) * 0.01;
  const dz = Math.cos(f * 0.03) * 0.015;
  return [dx, dy, dz];
}

export function getBotCameraPose(f: number, totalFrames: number): BotCameraPose {
  const p = Math.min(Math.max(f / totalFrames, 0), 1);
  const [dx, dy, dz] = getBreathingDrift(f);

  // 3-Act Mascot Choreography:
  // Act 1 (0-30%): Dramatic low-angle orbital hero entrance
  // Act 2 (30-70%): Medium close-up companion dialogue tracking
  // Act 3 (70-100%): Wide pull-back with dynamic 3/4 framing
  if (p < 0.3) {
    const t = p / 0.3;
    return {
      position: [Math.sin(t * 0.8) * 1.8 + dx, 0.3 + t * 0.5 + dy, 3.2 - t * 0.4 + dz],
      target: [0, 0.1, 0],
      fov: 36,
    };
  } else if (p < 0.7) {
    const t = (p - 0.3) / 0.4;
    return {
      position: [0.6 - t * 1.2 + dx, 0.8 + Math.sin(t * Math.PI) * 0.2 + dy, 2.7 + dz],
      target: [0, 0.15, 0],
      fov: 32,
    };
  } else {
    const t = (p - 0.7) / 0.3;
    return {
      position: [-0.6 + t * 1.8 + dx, 1.0 + t * 0.4 + dy, 2.7 + t * 1.2 + dz],
      target: [0, 0.1, 0],
      fov: 35,
    };
  }
}
