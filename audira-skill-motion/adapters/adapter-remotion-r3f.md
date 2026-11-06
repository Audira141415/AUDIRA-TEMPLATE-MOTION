# ADAPTER: Remotion + React Three Fiber (Direct Code Mapper)
# AUDIRA MULTI-MODEL PROMPT COMPILERS

This adapter translates any Audira Modular `dna.json` manifest into pure, deterministic React Three Fiber (R3F) code props.

---

## 1. Mapping Matrix: `dna.json` to R3F Components

```typescript
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Canvas } from '@react-three/fiber';

// 1. Map Camera from DNA
export const DioramaCamera = ({ dna }) => {
  return (
    <perspectiveCamera
      makeDefault
      position={dna.camera.position} // e.g. [0, 1.25, 4.6]
      fov={dna.camera.fovDeg}        // e.g. 32
    />
  );
};

// 2. Map Studio Lights from DNA
export const DioramaLighting = ({ dna }) => {
  return (
    <>
      {/* Key Light */}
      <spotLight
        position={dna.lighting.keyLight.angle}
        intensity={dna.lighting.keyLight.intensity}
        color="#FFE4B5" // Converted from 3200K Kelvin
        castShadow
        shadow-bias={-0.0001}
      />
      {/* Fill Light */}
      <directionalLight
        position={dna.lighting.fillLight.angle}
        intensity={dna.lighting.fillLight.intensity}
        color="#E0E6ED"
      />
      {/* Rim Light */}
      <directionalLight
        position={dna.lighting.rimLight.angle}
        intensity={dna.lighting.rimLight.intensity}
        color="#F0F8FF"
      />
      {/* Ambient Floor Shadow */}
      <ambientLight intensity={dna.lighting.ambientOcclusion.intensity * 0.4} />
    </>
  );
};

// 3. Map PBR Material from DNA
export const DioramaMaterial = ({ dna, color }) => {
  return (
    <meshStandardMaterial
      color={color || dna.palette.primary}
      roughness={dna.materials.roughness}     // e.g. 0.78
      metalness={dna.materials.metalness}     // e.g. 0.02
      clearcoat={dna.materials.clearcoat || 0}
      envMapIntensity={0.6}
    />
  );
};

// 4. Map Motion Spring from DNA
export const useDioramaSpring = (dna, startFrame = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: dna.motion.spring.damping,     // e.g. 15
      stiffness: dna.motion.spring.stiffness, // e.g. 180
      mass: dna.motion.spring.mass,           // e.g. 1.0
    },
  });
};
```

