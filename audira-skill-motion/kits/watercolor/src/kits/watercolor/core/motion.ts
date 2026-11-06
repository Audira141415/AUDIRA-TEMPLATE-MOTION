export interface WatercolorState {
  // Layered scenery flats gentle breathing
  hillSway1: number;
  hillSway2: number;
  treeSway: number;
  // Character hop / hand gesture
  characterY: number;
  characterArmRot: number;
  // Floating whimsical pollen / petal particles
  pollenDriftX: number;
  pollenDriftY: number;
}

export const computeWatercolorState = (f: number): WatercolorState => {
  const t = f / 60;
  
  // Gentle organic breeze across storybook cutouts
  const hillSway1 = Math.sin(t * 1.1) * 0.02;
  const hillSway2 = Math.sin(t * 0.9 + 0.5) * 0.025;
  const treeSway = Math.sin(t * 1.4) * 0.035;
  
  // Whimsical gentle character breathing
  const characterY = Math.sin(t * 2.2) * 0.03;
  const characterArmRot = Math.sin(t * 1.8) * 0.15;
  
  // Floating storybook dandelion pollen particles
  const pollenDriftX = Math.sin(t * 0.6) * 0.25;
  const pollenDriftY = (t * 0.15) % 1.2;
  
  return {
    hillSway1,
    hillSway2,
    treeSway,
    characterY,
    characterArmRot,
    pollenDriftX,
    pollenDriftY,
  };
};
