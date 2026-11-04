// LIDARFORGE Overlay — Geospatial LiDAR Survey telemetry, elevation scale bar & sensor readouts.

import React from "react";
import { lerp, seg, ease } from "../core/motion";
import { LIDAR_PALETTE } from "../lib/palette";

export interface LidarOverlayProps {
  f: number;
}

export const LidarOverlay: React.FC<LidarOverlayProps> = ({ f }) => {
  const introFade = seg(f, 0, 40, ease.smooth);
  const pointsCount = Math.floor(lerp(240000, 1850000, seg(f, 20, 360, ease.droneGlide)));
  const elevMeters = (124.5 + Math.sin(f * 0.03) * 18.2).toFixed(1);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'SF Mono', Consolas, Monaco, monospace",
        color: "#ffffff",
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: introFade,
      }}
    >
      {/* Top Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: LIDAR_PALETTE.laserScanFront, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            AUDIRA LIDARFORGE // SURVEY 17
          </div>
          <div style={{ fontSize: 24, fontWeight: 300, color: "#ffffff", marginTop: 4, letterSpacing: "0.02em" }}>
            AIRBORNE LASER BATHYMETRY
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255, 255, 255, 0.65)" }}>
          <div>PRF: 400 kHz // CHIRP 1064nm</div>
          <div style={{ color: LIDAR_PALETTE.measurementAccent }}>POINTS: {pointsCount.toLocaleString()}</div>
        </div>
      </div>

      {/* Mid Elevation Color Ramp Legend */}
      <div
        style={{
          alignSelf: "flex-end",
          background: "rgba(4, 7, 10, 0.75)",
          border: `1px solid ${LIDAR_PALETTE.gridWireframe}`,
          borderRadius: 6,
          padding: "10px 14px",
          fontSize: 10,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Elevation (AMSL)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 70,
              background: `linear-gradient(to top, ${LIDAR_PALETTE.elevationBedrock}, ${LIDAR_PALETTE.elevationGround}, ${LIDAR_PALETTE.elevationRidge}, ${LIDAR_PALETTE.elevationPeak})`,
              borderRadius: 2,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 70, color: "rgba(255, 255, 255, 0.7)" }}>
            <span>+180m</span>
            <span>+140m</span>
            <span>+100m</span>
            <span>+60m</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, color: LIDAR_PALETTE.measurementAccent, marginBottom: 2 }}>
            ALTITUDE: {elevMeters} m // SENSOR: RIEGL VUX-120
          </div>
          <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.45)" }}>
            LAT: 47°36'22"N • LON: 122°19'55"W • WGS84
          </div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)" }}>
          FRAME {String(Math.floor(f)).padStart(4, "0")} / 0480
        </div>
      </div>
    </div>
  );
};

