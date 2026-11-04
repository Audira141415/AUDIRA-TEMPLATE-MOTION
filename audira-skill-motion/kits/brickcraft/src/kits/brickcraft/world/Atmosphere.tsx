import React from "react";

export const BrickAtmosphere: React.FC = () => {
  return (
    <>
      {/* 1. Neutral Studio Ambient */}
      <ambientLight intensity={0.55} color="#ffffff" />

      {/* 2. Main Key Softbox Light (Warm daylight from top-right) */}
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.8}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />

      {/* 3. Cool Studio Rim Light (Gives glossy plastic that crisp edge catchlight) */}
      <directionalLight position={[-6, 7, -6]} intensity={0.9} color="#d0ebff" />

      {/* 4. Front Fill Soft Bounce */}
      <pointLight position={[0, 3, 6]} intensity={0.6} color="#ffffff" distance={15} />
    </>
  );
};

