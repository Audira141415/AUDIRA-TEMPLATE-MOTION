export type BotEmotion = "CURIOUS" | "THINKING" | "ALERT" | "HAPPY";

export interface BotState {
  hoverY: number;
  tiltZ: number;
  turnY: number;
  blinkScaleY: number;
  armAngle: number;
  emotion: BotEmotion;
}

export function computeBotState(f: number): BotState {
  // 1. Natural levitation hover breathing
  const hoverY = Math.sin(f * 0.06) * 0.14;
  const tiltZ = Math.sin(f * 0.035) * 0.06;
  const turnY = Math.sin(f * 0.02) * 0.25;

  // 2. Periodic natural eye blinking cycle (every ~140 frames)
  const blinkCycle = f % 140;
  let blinkScaleY = 1.0;
  if (blinkCycle > 132 && blinkCycle < 138) {
    blinkScaleY = 0.08; // Closed / blinking slit
  }

  // 3. Gesturing arm wave/point motion
  const armAngle = -0.4 + Math.sin(f * 0.08) * 0.35;

  // 4. Emotion shift over time
  let emotion: BotEmotion = "CURIOUS";
  if (f > 120 && f <= 260) emotion = "THINKING";
  else if (f > 260 && f <= 380) emotion = "HAPPY";
  else if (f > 380) emotion = "CURIOUS";

  return { hoverY, tiltZ, turnY, blinkScaleY, armAngle, emotion };
}
