import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp01, dropLand, lerp, mulberry32, win } from "../core/motion";
import { FOODFORGE_PALETTE as P } from "../lib/palette";
import { makeChashuTexture, makeEggFaceTexture } from "../lib/materials";

// Hero dish: stoneware bowl, glossy broth, swirling noodles, toppings that fall in slow motion
// and land (egg halves, chashu, nori, scallion shower), chili-oil drips from a spoon, and the
// payoff chopstick lift of a noodle bundle. Rest surface of the broth: y = BROTH_Y.

export const BROTH_Y = 0.44;
const BROTH_R = 0.74;

// ---------- Bowl ----------
const Bowl: React.FC = () => {
  const outer = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          [0.0, 0.0],
          [0.3, 0.0],
          [0.34, 0.015],
          [0.33, 0.06],
          [0.48, 0.12],
          [0.7, 0.33],
          [0.83, 0.55],
          [0.86, 0.585],
        ].map(([x, y]) => new THREE.Vector2(x, y)),
        96,
      ),
    [],
  );
  const inner = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          [0.0, 0.13],
          [0.46, 0.16],
          [0.69, 0.36],
          [0.8, 0.55],
          [0.86, 0.585],
        ].map(([x, y]) => new THREE.Vector2(x, y)),
        96,
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={outer} castShadow receiveShadow>
        <meshPhysicalMaterial color={P.glazeOuter} roughness={0.32} clearcoat={0.9} clearcoatRoughness={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={inner} receiveShadow>
        <meshPhysicalMaterial color={P.glazeInner} roughness={0.22} clearcoat={1} side={THREE.BackSide} />
      </mesh>
      {/* iron-oxide rim line */}
      <mesh position={[0, 0.585, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.86, 0.012, 8, 96]} />
        <meshStandardMaterial color={P.rimIron} roughness={0.5} />
      </mesh>
    </group>
  );
};

// ---------- Noodles ----------
type Noodle = { pts: THREE.Vector3[]; lifted: boolean };
const NOODLE_SEG = 26;

const buildNoodles = (): Noodle[] => {
  const rnd = mulberry32(4561);
  const out: Noodle[] = [];
  for (let n = 0; n < 24; n++) {
    const a0 = rnd() * Math.PI * 2;
    const r0 = 0.12 + rnd() * 0.45;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= NOODLE_SEG; i++) {
      const u = i / NOODLE_SEG;
      const a = a0 + u * (2.2 + rnd() * 0.15);
      const r = Math.min(0.66, r0 + Math.sin(u * 7 + n) * 0.12 + u * 0.08);
      const y = BROTH_Y + 0.005 + Math.sin(u * 11 + n * 1.7) * 0.018 + (n % 3) * 0.01;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    out.push({ pts, lifted: n < 7 });
  }
  return out;
};

const NoodleTube: React.FC<{ pts: THREE.Vector3[] }> = ({ pts }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 72, 0.021, 7, false), [pts]);
  useLayoutEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} castShadow>
      <meshPhysicalMaterial color={P.noodle} roughness={0.32} clearcoat={0.7} clearcoatRoughness={0.2} sheen={0.3} />
    </mesh>
  );
};

export const chopTip = (lift: number) => new THREE.Vector3(0.06, BROTH_Y + 0.08 + lift * 1.05, 0.14);

const Noodles: React.FC<{ lift: number; t: number }> = ({ lift, t }) => {
  const noodles = useMemo(buildNoodles, []);
  const tip = chopTip(lift);
  return (
    <group>
      {noodles.map((nd, k) => {
        if (!nd.lifted || lift <= 0) return <NoodleTube key={k} pts={nd.pts} />;
        // lifted bundle: first 60% of the strand hangs from the chopstick tip, rest stays in broth
        const hang = Math.floor(NOODLE_SEG * 0.6);
        const pts = nd.pts.map((b, i) => {
          if (i > hang) return b;
          const u = i / hang;
          const sway = Math.sin(t * 3 + k * 1.3 + u * 4) * 0.025 * u;
          const h = new THREE.Vector3(
            tip.x + (k - 3) * 0.012 + sway + Math.pow(u, 2.2) * (b.x - tip.x),
            lerp(tip.y, BROTH_Y + 0.01, Math.pow(u, 1.15)),
            tip.z + (k - 3) * 0.006 + Math.pow(u, 2.2) * (b.z - tip.z),
          );
          const w = clamp01(lift * 1.4 - u * 0.4);
          return b.clone().lerp(h, w);
        });
        return <NoodleTube key={k} pts={pts} />;
      })}
    </group>
  );
};

// ---------- Toppings ----------
type Topping = {
  kind: "egg" | "chashu" | "nori";
  rest: [number, number, number];
  restRot: [number, number, number];
  air: [number, number, number];
  land: number;
  spin: number;
};

const TOPPINGS: Topping[] = [
  { kind: "nori", rest: [0.05, 0.62, -0.5], restRot: [-0.38, 0.1, 0.05], air: [0.1, 2.05, -0.55], land: 2.6, spin: 0.9 },
  { kind: "chashu", rest: [-0.33, 0.5, -0.18], restRot: [-0.55, 0.5, 0.25], air: [-0.62, 1.75, -0.1], land: 3.2, spin: 1.4 },
  { kind: "chashu", rest: [-0.12, 0.49, -0.35], restRot: [-0.5, -0.2, 0.1], air: [-0.3, 2.25, 0.1], land: 3.8, spin: 1.1 },
  { kind: "egg", rest: [0.36, 0.47, 0.12], restRot: [-0.35, 0.4, -0.2], air: [0.62, 1.6, 0.25], land: 4.4, spin: 1.6 },
  { kind: "egg", rest: [0.42, 0.47, -0.17], restRot: [-0.25, -0.5, -0.3], air: [0.45, 2.35, -0.25], land: 5.0, spin: 1.2 },
];

const EggHalf: React.FC<{ face: THREE.Texture }> = ({ face }) => (
  <group scale={[0.17, 0.13, 0.13]}>
    <mesh castShadow rotation={[Math.PI, 0, 0]}>
      <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial color={P.eggWhite} roughness={0.25} clearcoat={0.8} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
      <circleGeometry args={[1, 40]} />
      <meshPhysicalMaterial map={face} roughness={0.2} clearcoat={1} clearcoatRoughness={0.05} />
    </mesh>
  </group>
);

const Chashu: React.FC<{ face: THREE.Texture }> = ({ face }) => {
  const mats = useMemo(
    () => [
      new THREE.MeshPhysicalMaterial({ color: P.chashuEdge, roughness: 0.35, clearcoat: 0.8 }),
      new THREE.MeshPhysicalMaterial({ map: face, roughness: 0.35, clearcoat: 0.7 }),
      new THREE.MeshPhysicalMaterial({ map: face, roughness: 0.35, clearcoat: 0.7 }),
    ],
    [face],
  );
  return (
    <mesh castShadow material={mats}>
      <cylinderGeometry args={[0.21, 0.2, 0.045, 40]} />
    </mesh>
  );
};

const Nori: React.FC = () => (
  <mesh castShadow>
    <boxGeometry args={[0.42, 0.56, 0.006]} />
    <meshPhysicalMaterial color={P.nori} roughness={0.85} metalness={0} envMapIntensity={0.05} />
  </mesh>
);

const Toppings: React.FC<{ t: number }> = ({ t }) => {
  const eggFace = useMemo(makeEggFaceTexture, []);
  const chashuFace = useMemo(makeChashuTexture, []);
  return (
    <group>
      {TOPPINGS.map((tp, i) => {
        const d = dropLand(t, tp.land, 1.2);
        const hover = (1 - d.fallP) * Math.sin(t * 0.9 + i) * 0.05;
        const pos = new THREE.Vector3(...tp.air).lerp(new THREE.Vector3(...tp.rest), d.fallP);
        pos.y += hover + d.bounce;
        // slow-motion tumble that decays as it settles
        const tumble = (1 - d.fallP) * (t * 0.5 * tp.spin + i);
        const rot = new THREE.Euler(tp.restRot[0] + tumble * 0.6, tp.restRot[1] + tumble, tp.restRot[2] + tumble * 0.4);
        const sq = 1 - d.squash * 0.4;
        return (
          <group key={i} position={pos} rotation={rot} scale={[1 + d.squash * 0.2, sq, 1 + d.squash * 0.2]}>
            {tp.kind === "egg" && <EggHalf face={eggFace} />}
            {tp.kind === "chashu" && <Chashu face={chashuFace} />}
            {tp.kind === "nori" && <Nori />}
          </group>
        );
      })}
      {/* landing ripples on the broth */}
      {TOPPINGS.map((tp, i) => {
        const a = t - tp.land;
        if (a < 0 || a > 0.9) return null;
        const k = a / 0.9;
        return (
          <mesh key={`r${i}`} position={[tp.rest[0], BROTH_Y + 0.004, tp.rest[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1 + k * 0.35, 0.115 + k * 0.36, 48]} />
            <meshBasicMaterial color="#FFE3B0" transparent opacity={(1 - k) * 0.55} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Scallion shower, sesame, chili-oil beads ----------
const Garnish: React.FC<{ t: number }> = ({ t }) => {
  const scal = useRef<THREE.InstancedMesh>(null);
  const ses = useRef<THREE.InstancedMesh>(null);
  const oil = useRef<THREE.InstancedMesh>(null);
  const NS = 70;
  const NSE = 110;
  const NO = 34;
  const seeds = useMemo(() => {
    const rnd = mulberry32(4577);
    const mk = (n: number, cx: number, cz: number, spread: number) =>
      Array.from({ length: n }, () => {
        const a = rnd() * Math.PI * 2;
        const r = Math.sqrt(rnd()) * spread;
        return {
          rx: cx + Math.cos(a) * r,
          rz: cz + Math.sin(a) * r,
          ax: (rnd() - 0.5) * 1.4,
          ay: 1.2 + rnd() * 1.1,
          az: (rnd() - 0.5) * 1.0,
          delay: rnd() * 1.0,
          rot: rnd() * 6.28,
          s: 0.8 + rnd() * 0.45,
        };
      });
    return { s: mk(NS, -0.02, 0.28, 0.3), se: mk(NSE, 0.0, 0.05, 0.55), o: mk(NO, 0, 0, 0.62) };
  }, []);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const place = (m: THREE.InstancedMesh | null, arr: typeof seeds.s, start: number, restY: number, flat: boolean) => {
      if (!m) return;
      arr.forEach((p, i) => {
        const d = dropLand(t, start + p.delay, 0.9);
        o.position.set(lerp(p.rx + p.ax, p.rx, d.fallP), lerp(restY + p.ay, restY, d.fallP) + d.bounce * 0.5, lerp(p.rz + p.az, p.rz, d.fallP));
        const tumble = (1 - d.fallP) * (t * 2 + p.rot);
        o.rotation.set(flat ? Math.PI / 2 + tumble : tumble, p.rot + tumble, tumble * 0.5);
        o.scale.setScalar(p.s);
        o.updateMatrix();
        m.setMatrixAt(i, o.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    };
    place(scal.current, seeds.s, 5.3, BROTH_Y + 0.035, true);
    place(ses.current, seeds.se, 6.1, BROTH_Y + 0.02, false);
    // chili-oil beads bloom outward on the surface after the first drip
    const m = oil.current;
    if (m) {
      const bloom = clamp01((t - 3.6) / 2.5);
      seeds.o.forEach((p, i) => {
        o.position.set(p.rx * (0.4 + bloom * 0.6), BROTH_Y + 0.003, p.rz * (0.4 + bloom * 0.6));
        o.rotation.set(-Math.PI / 2, 0, 0);
        o.scale.setScalar(p.s * (0.2 + bloom * 0.8));
        o.updateMatrix();
        m.setMatrixAt(i, o.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    }
  }, [t, seeds]);

  return (
    <group>
      <instancedMesh ref={scal} args={[undefined, undefined, NS]} castShadow>
        <torusGeometry args={[0.024, 0.009, 6, 14]} />
        <meshPhysicalMaterial color={P.scallion} roughness={0.3} clearcoat={0.8} />
      </instancedMesh>
      <instancedMesh ref={ses} args={[undefined, undefined, NSE]}>
        <sphereGeometry args={[0.011, 6, 5]} />
        <meshStandardMaterial color={P.sesame} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={oil} args={[undefined, undefined, NO]}>
        <circleGeometry args={[0.032, 20]} />
        <meshPhysicalMaterial color={P.chiliOil} emissive={P.chiliOil} emissiveIntensity={0.25} roughness={0.05} clearcoat={1} transparent opacity={0.85} />
      </instancedMesh>
    </group>
  );
};

// ---------- Spoon + chili-oil drip ----------
const DRIPS = [3.3, 5.7, 7.7];
const SPOON_TIP = new THREE.Vector3(-0.42, 1.32, 0.22);

const SpoonDrip: React.FC<{ t: number }> = ({ t }) => {
  const enter = clamp01((t - 2.4) / 0.8);
  const leave = clamp01((t - 8.2) / 0.7);
  const off = (1 - enter) * 1.2 + leave * 1.4;
  const drops = DRIPS.map((d0) => {
    const grow = win(t, d0 - 0.5, d0);
    const fall = clamp01((t - d0) / 0.38);
    if (grow <= 0 || fall >= 1) return null;
    const y = SPOON_TIP.y - 0.03 - fall * fall * (SPOON_TIP.y - BROTH_Y);
    const stretch = 1 + grow * 0.6 + fall * 1.4;
    return { y, s: 0.022 + grow * 0.014, stretch };
  });
  return (
    <group>
      <group position={[SPOON_TIP.x - off, SPOON_TIP.y + off * 0.6, SPOON_TIP.z]} rotation={[0, 0, 0.35]}>
        {/* bowl of the spoon */}
        <mesh position={[-0.13, 0.03, 0]} scale={[1.6, 0.45, 1]} castShadow>
          <sphereGeometry args={[0.1, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshPhysicalMaterial color="#D9D4CC" roughness={0.12} metalness={1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.13, 0.025, 0]} scale={[1.5, 1, 0.92]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.095, 28]} />
          <meshPhysicalMaterial color={P.chiliOil} emissive="#7A1A04" emissiveIntensity={0.4} roughness={0.04} clearcoat={1} />
        </mesh>
        <mesh position={[-0.55, 0.12, 0]} rotation={[0, 0, Math.PI / 2 - 0.25]} castShadow>
          <cylinderGeometry args={[0.018, 0.024, 0.62, 12]} />
          <meshPhysicalMaterial color="#D9D4CC" roughness={0.12} metalness={1} />
        </mesh>
      </group>
      {drops.map((d, i) =>
        d ? (
          <mesh key={i} position={[SPOON_TIP.x, d.y, SPOON_TIP.z]} scale={[d.s, d.s * d.stretch, d.s]}>
            <sphereGeometry args={[1, 18, 14]} />
            <meshPhysicalMaterial color={P.chiliOil} emissive="#8A2006" emissiveIntensity={0.5} roughness={0.03} clearcoat={1} />
          </mesh>
        ) : null,
      )}
      {DRIPS.map((d0, i) => {
        const a = t - d0 - 0.38;
        if (a < 0 || a > 1.0) return null;
        return (
          <mesh key={`rp${i}`} position={[SPOON_TIP.x, BROTH_Y + 0.006, SPOON_TIP.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.03 + a * 0.3, 0.042 + a * 0.31, 40]} />
            <meshBasicMaterial color="#FFC98A" transparent opacity={(1 - a) * 0.6} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Chopsticks (payoff) ----------
const Chopsticks: React.FC<{ chopIn: number; lift: number }> = ({ chopIn, lift }) => {
  if (chopIn <= 0) return null;
  const tip = chopTip(lift);
  const dir = new THREE.Vector3(0.5, 0.78, 0.38).normalize();
  const L = 1.7;
  const back = (1 - chopIn) * 1.6;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return (
    <group>
      {[-1, 1].map((s) => {
        const c = tip
          .clone()
          .add(dir.clone().multiplyScalar(L / 2 + back))
          .add(new THREE.Vector3(-0.38, 0, 0.5).normalize().multiplyScalar(s * 0.03));
        return (
          <mesh key={s} position={c} quaternion={q} castShadow>
            <cylinderGeometry args={[0.022, 0.009, L, 12]} />
            <meshPhysicalMaterial color="#5A1E12" roughness={0.18} clearcoat={1} clearcoatRoughness={0.06} />
          </mesh>
        );
      })}
    </group>
  );
};

export const RamenBowl3D: React.FC<{ t: number; lift: number; chopIn: number }> = ({ t, lift, chopIn }) => (
  <group>
    <Bowl />
    {/* broth */}
    <mesh position={[0, BROTH_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[BROTH_R, 72]} />
      <meshPhysicalMaterial color={P.broth} roughness={0.08} clearcoat={1} clearcoatRoughness={0.03} sheen={0.4} sheenColor={P.brothDeep} />
    </mesh>
    <Noodles lift={lift} t={t} />
    <Toppings t={t} />
    <Garnish t={t} />
    <SpoonDrip t={t} />
    <Chopsticks chopIn={chopIn} lift={lift} />
  </group>
);
