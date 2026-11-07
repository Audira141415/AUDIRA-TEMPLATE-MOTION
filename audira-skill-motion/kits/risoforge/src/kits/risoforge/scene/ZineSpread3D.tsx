import React, { useMemo } from "react";
import * as THREE from "three";
import { RISO_PALETTE as P, DRUM } from "../lib/palette";
import { makeMatTexture, makePaperTexture } from "../lib/materials";
import { RisoState, misregister } from "../core/motion";
import { RisoInks } from "./inks";

export const PAGE_W = 4.6;
export const FLOOR_D = 7.2;
export const BACK_H = 6.6;

// The open zine: floor page (lying, z 0..7.2) hinged at the stapled spine to a standing backdrop page.
// Ink printed directly on the backdrop: pink horizon glow, blue halftone sky, the rising yellow sun, birds.
export const ZineSpread3D: React.FC<{ s: RisoState; inks: RisoInks }> = ({ s, inks }) => {
  const tex = useMemo(() => {
    const floor = makePaperTexture(53);
    const back = makePaperTexture(35);
    const mat = makeMatTexture();
    mat.wrapS = mat.wrapT = THREE.RepeatWrapping;
    mat.repeat.set(3, 3);
    return { floor, back, mat };
  }, []);
  const geo = useMemo(
    () => ({
      sun: new THREE.CircleGeometry(1.05, 64),
      bird: (() => {
        const sh = new THREE.Shape();
        sh.moveTo(-0.22, 0.08);
        sh.quadraticCurveTo(-0.1, 0.02, 0, -0.04);
        sh.quadraticCurveTo(0.1, 0.02, 0.22, 0.08);
        sh.quadraticCurveTo(0.1, 0.0, 0, -0.1);
        sh.quadraticCurveTo(-0.1, 0.0, -0.22, 0.08);
        return new THREE.ShapeGeometry(sh);
      })(),
    }),
    [],
  );
  const pink = misregister(s.t, DRUM.pink);
  const blue = misregister(s.t, DRUM.blue);
  const yellow = misregister(s.t, DRUM.yellow);

  return (
    <group>
      {/* desk: cutting mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 3]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={tex.mat} roughness={0.85} />
      </mesh>
      {/* stacked zine signatures under the floor page (visible paper edges) */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.01 * i, -0.012 - i * 0.012, FLOOR_D / 2 + 0.004 * i]} receiveShadow castShadow>
          <boxGeometry args={[PAGE_W - 0.02 * i, 0.011, FLOOR_D - 0.01 * i]} />
          <meshStandardMaterial color={i % 2 ? P.paperShade : P.paper} roughness={1} />
        </mesh>
      ))}
      {/* floor page */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, FLOOR_D / 2]} receiveShadow>
        <planeGeometry args={[PAGE_W, FLOOR_D]} />
        <meshStandardMaterial map={tex.floor} roughness={1} />
      </mesh>
      {/* standing backdrop page + its stiff back board */}
      <mesh position={[0, BACK_H / 2, 0]} receiveShadow>
        <planeGeometry args={[PAGE_W, BACK_H]} />
        <meshStandardMaterial map={tex.back} roughness={1} />
      </mesh>
      <mesh position={[0, BACK_H / 2, -0.03]} castShadow>
        <boxGeometry args={[PAGE_W, BACK_H, 0.05]} />
        <meshStandardMaterial color={P.paperShade} roughness={1} />
      </mesh>
      {/* staples on the spine */}
      {[-1.25, 1.25].map((x) => (
        <group key={x} position={[x, 0.012, 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.02, 0.03]} />
            <meshStandardMaterial color={P.staple} metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* ---- ink printed on the backdrop (multiply) ---- */}
      <group position={[pink[0], pink[1], 0.02]}>
        <mesh position={[0, 1.5, 0]} material={inks.pinkGlow} renderOrder={2}>
          <planeGeometry args={[PAGE_W - 0.5, 2.6]} />
        </mesh>
      </group>
      <group position={[blue[0], blue[1], 0.025]}>
        <mesh position={[0, 4.35, 0]} material={inks.blueSky} renderOrder={2}>
          <planeGeometry args={[PAGE_W - 0.5, 3.9]} />
        </mesh>
        {[0, 1, 2, 3].map((i) => {
          const x = ((s.birdsX + i * 1.1 + 3) % 6.2) - 2.6;
          const y = 4.9 + Math.sin(i * 2.3) * 0.45 + Math.sin(s.t * 3 + i) * 0.05;
          const flap = 0.75 + 0.25 * Math.sin(s.t * 9 + i * 1.7);
          if (Math.abs(x) > 1.9) return null;
          return <mesh key={i} geometry={geo.bird} material={inks.blueSolid} position={[x, y, 0.004]} scale={[0.9, flap * 0.9, 1]} renderOrder={3} />;
        })}
      </group>
      <group position={[yellow[0], yellow[1], 0.03]}>
        <mesh geometry={geo.sun} material={inks.yellowSolid} position={[0.55, s.sunY, 0]} renderOrder={2} />
      </group>
    </group>
  );
};
