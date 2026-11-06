export interface FilmNoirState {
  // Streetlight flicker (micro tungsten voltage dip)
  lightIntensity: number;
  // Mist & smoke drift
  smokeDriftX: number;
  smokeDriftY: number;
  // Venetian blinds shadow angle sweep
  shadowSlant: number;
  // Detective subtle breathing silhouette sway
  detectiveSwayY: number;
  detectiveSwayRot: number;
  // Rain puddle ripple scale
  rippleScale: number;
}

export const computeFilmNoirState = (f: number): FilmNoirState => {
  const t = f / 60;
  
  // Realistic tungsten street lamp subtle filament flicker
  const flicker = Math.sin(f * 0.45) * 0.08 + Math.sin(f * 1.8) * 0.05 + (Math.sin(f * 4.2) > 0.92 ? -0.25 : 0);
  const lightIntensity = Math.max(1.4, 2.4 + flicker);
  
  // Slow curling smoke particulate
  const smokeDriftX = Math.sin(t * 0.8) * 0.18 + t * 0.08;
  const smokeDriftY = (t * 0.25) % 1.5;
  
  // Venetian blind shadow slow optical track
  const shadowSlant = Math.sin(t * 0.4) * 0.06;
  
  // Detective slow brooding stance
  const detectiveSwayY = Math.sin(t * 1.2) * 0.02;
  const detectiveSwayRot = Math.sin(t * 0.6) * 0.03;
  
  // Periodic puddle ripple
  const rippleScale = (f % 90) / 90;
  
  return {
    lightIntensity,
    smokeDriftX,
    smokeDriftY,
    shadowSlant,
    detectiveSwayY,
    detectiveSwayRot,
    rippleScale,
  };
};
