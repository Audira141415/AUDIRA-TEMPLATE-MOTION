export interface IslamicDocumentaryState {
  starRotation: number;
  domeReveal: number;
  lightPulse: number;
}

export const computeIslamicDocumentaryState = (f: number): IslamicDocumentaryState => {
  const t = f / 60;
  return {
    starRotation: t * 0.25,
    domeReveal: Math.min(1, f / 60),
    lightPulse: 1 + Math.sin(t * 2.5) * 0.12,
  };
};