// CIRCUITFORGE Circuit Stage — Complete motherboard assembly with traces, BGA silicon & active electron currents.

import React from "react";
import { PcbSubstrate } from "../pcb/PcbSubstrate";
import { MicrochipBga } from "../pcb/MicrochipBga";
import { ElectronPulse } from "../pcb/ElectronPulse";
import { CIRCUIT_PALETTE } from "../lib/palette";

interface CircuitStageProps {
  f: number;
}

export const CircuitStage: React.FC<CircuitStageProps> = ({ f }) => {
  const ledBlink = Math.sin(f * 0.1) > 0;

  return (
    <group>
      {/* 1. PCB Substrate with Copper Traces */}
      <PcbSubstrate />

      {/* 2. Central BGA Processor Package */}
      <MicrochipBga />

      {/* 3. Glowing Electron Pulse Streams */}
      <ElectronPulse f={f} />

      {/* 4. Power Indicator SMT LED */}
      <group position={[-5.2, 0.08, -5.2]}>
        <mesh>
          <boxGeometry args={[0.3, 0.15, 0.2]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
          <meshBasicMaterial
            color={ledBlink ? CIRCUIT_PALETTE.powerGreen : "#064e3b"}
          />
        </mesh>
      </group>
    </group>
  );
};

