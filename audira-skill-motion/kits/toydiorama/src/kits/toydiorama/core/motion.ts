export interface ToyDioramaState {
  // Toy Character Animation
  charBodyY: number;
  charBodyRotY: number;
  charHeadTiltZ: number;
  charHeadTurnY: number;
  rightArmRotX: number;
  rightArmRotZ: number;
  leftArmRotX: number;
  leftArmRotZ: number;
  blinkScaleY: number;
  
  // Prop Spring Slide-in
  propProgress: number; // 0 to 1 spring
  propRotY: number;
  propHoverY: number;
  
  // Cloud & Scenery Drift
  cloudDriftX: number;
  
  // Paper Tag Sway
  labelSway: number;
}

export const computeToyDioramaState = (f: number): ToyDioramaState => {
  const t = f / 60; // time in seconds
  
  // Natural gentle toy idle breathing & sway
  const charBodyY = Math.sin(t * 2.4) * 0.035;
  const charBodyRotY = Math.sin(t * 1.2) * 0.06;
  const charHeadTiltZ = Math.sin(t * 1.8 + 0.4) * 0.05;
  const charHeadTurnY = Math.sin(t * 0.9) * 0.12;
  
  // Friendly waving gesture with right arm (smooth physical toy articulation)
  const isWaving = f > 25 && f < 300;
  const waveCycle = Math.sin((f - 25) * 0.18);
  const rightArmRotX = isWaving ? -1.8 + Math.cos((f - 25) * 0.09) * 0.12 : Math.sin(t * 2.4) * 0.1;
  const rightArmRotZ = isWaving ? -0.85 + waveCycle * 0.4 : -0.22;
  
  // Left arm natural rest
  const leftArmRotX = Math.cos(t * 2.4) * 0.1;
  const leftArmRotZ = 0.22;
  
  // Discrete natural blink every ~3.5s (lasts 6 frames)
  const blinkCycle = f % 210;
  const isBlinking = blinkCycle > 190 && blinkCycle < 196;
  const blinkScaleY = isBlinking ? 0.1 : 1.0;
  
  // Prop slides up onto table around frame 90 with damped spring
  const propStart = 85;
  let propProgress = 0;
  if (f > propStart) {
    const p = (f - propStart) / 45;
    if (p < 1) {
      propProgress = Math.min(1, 1 - Math.exp(-5 * p) * Math.cos(6 * p));
    } else {
      propProgress = 1;
    }
  }
  const propHoverY = propProgress * (0.85 + Math.sin(t * 2.5) * 0.03);
  const propRotY = (f - propStart) * 0.025;
  
  // Background cloud scenic drift
  const cloudDriftX = Math.sin(t * 0.5) * 0.22;
  
  // Paper tag gentle thermal sway
  const labelSway = Math.sin(t * 1.5) * 0.025;
  
  return {
    charBodyY,
    charBodyRotY,
    charHeadTiltZ,
    charHeadTurnY,
    rightArmRotX,
    rightArmRotZ,
    leftArmRotX,
    leftArmRotZ,
    blinkScaleY,
    propProgress,
    propRotY,
    propHoverY,
    cloudDriftX,
    labelSway,
  };
};
