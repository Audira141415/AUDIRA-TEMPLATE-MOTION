/**
 * Kinetic Number Counter & Telemetry Metric Component.
 *
 * Smoothly interpolates numeric values (e.g. 0 to 100%, 0 to 4,800 RPM)
 * with configurable easing, decimals, prefix, and suffix.
 *
 * Authored by: AUDIRA (Agus Dwi R)
 */

import React from "react";
import { solveSpring, SPRING_PRESETS } from "../motion/spring";

export interface KineticCounterProps {
  from?: number;
  to: number;
  frame: number;
  startFrame?: number;
  durationFrames?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}

export const KineticCounter: React.FC<KineticCounterProps> = ({
  from = 0,
  to,
  frame,
  startFrame = 0,
  durationFrames = 45,
  decimals = 0,
  prefix = "",
  suffix = "",
  style = {},
}) => {
  // Use damped spring for natural snappy deceleration
  const progress = solveSpring(frame, startFrame, 60, SPRING_PRESETS.snappy);
  const clampedProgress = Math.max(0, Math.min(1.0, progress));

  const currentValue = from + (to - from) * clampedProgress;
  const formattedNumber = currentValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span style={{ fontFamily: "monospace", fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

