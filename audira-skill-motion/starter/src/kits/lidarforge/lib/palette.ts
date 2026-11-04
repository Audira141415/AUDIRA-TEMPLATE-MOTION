// LIDARFORGE Color Palette — True survey elevation colormaps, laser fronts & telemetry readouts.

export const LIDAR_PALETTE = {
  // Deep nocturnal survey ground
  surveyVoid: "#04070a",
  gridWireframe: "#0f1c24",

  // Elevation Colormap Ramps (Low to High)
  elevationBedrock: "#1e3a8a",   // Low valley returns
  elevationGround: "#059669",    // Mid-level ground bare earth
  elevationVegetation: "#10b981",// Canopy returns
  elevationRidge: "#f59e0b",     // High ridges and crests
  elevationPeak: "#ef4444",      // Extreme peaks and structures

  // Active Scan Front & Lasers
  laserScanFront: "#00f0ff",
  laserEmitter: "#38bdf8",
  measurementAccent: "#ffb703",
  hudReadout: "#f1f5f9",
} as const;
