// TACTICBOARD — 22 acrylic puck tokens (numbered tops), ball-holder ring, scorer spotlight.
import React, { useMemo } from "react";
import * as THREE from "three";
import { TACTIC_PALETTE as P } from "../lib/palette";
import { makeTokenTexture } from "../lib/materials";
import { ballPos, BEATS, clamp, idx, playerPos, PLAYERS } from "../core/motion";

const R = 0.17;
const H = 0.075;

export const PlayerTokens3D: React.FC<{ t: number }> = ({ t }) => {
  const mats = useMemo(
    () =>
      PLAYERS.map((p) => {
        const top = new THREE.MeshStandardMaterial({ map: makeTokenTexture(p.team, p.n), roughness: 0.28, metalness: 0.05 });
        const side = new THREE.MeshStandardMaterial({ color: p.team === 0 ? P.homeDeep : P.awayDeep, roughness: 0.3, metalness: 0.15 });
        return [side, top, side];
      }),
    [],
  );

  // who has the ball: nearest home token to the ball when the ball is on the ground
  const b = ballPos(t);
  let holder = -1;
  let best = 0.45;
  PLAYERS.forEach((p, i) => {
    if (p.team !== 0) return;
    const q = playerPos(i, t);
    const d = Math.hypot(q[0] - b[0], q[1] - (b[2] + 0.24));
    if (d < best && b[1] < 0.1) {
      best = d;
      holder = i;
    }
  });
  const scorer = idx(0, 9);
  const spot = clamp((t - BEATS.goal - 0.3) / 0.6);

  return (
    <group>
      {PLAYERS.map((p, i) => {
        const q = playerPos(i, t);
        const lift = i === scorer ? spot * 0.05 * (1 + Math.sin(t * 6) * 0.3) : 0;
        return (
          <group key={i} position={[q[0], 0.012 + lift, q[1]]}>
            {/* white acrylic base ring */}
            <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[R + 0.018, R + 0.024, 0.024, 32]} />
              <meshStandardMaterial color="#F3F5F7" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.024 + H / 2, 0]} castShadow material={mats[i]}>
              <cylinderGeometry args={[R, R, H, 32]} />
            </mesh>
          </group>
        );
      })}

      {/* ball-holder halo */}
      {holder >= 0 && (
        <mesh position={[playerPos(holder, t)[0], 0.016, playerPos(holder, t)[1]]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[R + 0.06, R + 0.1, 48]} />
          <meshBasicMaterial color={P.lane} transparent opacity={0.85} toneMapped={false} />
        </mesh>
      )}

      {/* scorer spotlight + expanding goal pulses */}
      {spot > 0 && (
        <group position={[playerPos(scorer, t)[0], 0.018, playerPos(scorer, t)[1]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.42, 48]} />
            <meshBasicMaterial color={P.goalGold} transparent opacity={0.28 * spot} depthWrite={false} toneMapped={false} />
          </mesh>
          {[0, 1, 2].map((k) => {
            const ph = ((t - BEATS.goal - 0.3 + k * 0.45) % 1.35) / 1.35;
            return (
              <mesh key={k} rotation={[-Math.PI / 2, 0, 0]} scale={0.3 + ph * 1.4}>
                <ringGeometry args={[0.36, 0.4, 64]} />
                <meshBasicMaterial color={P.goalGold} transparent opacity={(1 - ph) * spot} depthWrite={false} toneMapped={false} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
};
