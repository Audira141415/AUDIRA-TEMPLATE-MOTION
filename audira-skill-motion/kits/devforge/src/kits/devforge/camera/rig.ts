export interface DevCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export function getDevCameraPose(f: number, totalFrames: number): DevCameraPose {
  const p = Math.min(Math.max(f / totalFrames, 0), 1);

  // Subtle organic breathing drift
  const dx = Math.sin(f * 0.04) * 0.02;
  const dy = Math.sin(f * 0.035) * 0.025;
  const dz = Math.cos(f * 0.03) * 0.015;

  // 3-Act Cinematic Pacing:
  // Act 1 (0-35%): Wide 3D isometric studio establishing shot
  // Act 2 (35-70%): Dramatic macro punch-in to code syntax line
  // Act 3 (70-100%): Dynamic pull-back revealing the 3D spawned game reward
  if (p < 0.35) {
    const t = p / 0.35;
    return {
      position: [0.8 - t * 0.4 + dx, 0.4 + t * 0.2 + dy, 4.2 - t * 0.8 + dz],
      target: [0, 0, 0],
      fov: 38,
    };
  } else if (p < 0.7) {
    const t = (p - 0.35) / 0.35;
    return {
      position: [0.4 - t * 0.6 + dx, 0.6 - t * 0.3 + dy, 3.4 - t * 0.6 + dz],
      target: [-0.3, 0.1, 0],
      fov: 32,
    };
  } else {
    const t = (p - 0.7) / 0.3;
    return {
      position: [-0.2 + t * 1.2 + dx, 0.3 + t * 0.3 + dy, 2.8 + t * 1.4 + dz],
      target: [0.3, 0, 0],
      fov: 36,
    };
  }
}
