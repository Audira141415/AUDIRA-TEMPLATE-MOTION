// Sky dome + matching image-based light. The dome follows the camera (no parallax) and is
// drawn at the far plane; the same gradient, rendered once into a PMREM, lights every PBR
// material, so ground bounce, sky fill and reflections agree with what the camera sees.

import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { BackSide, Color, Mesh, PMREMGenerator, Scene, ShaderMaterial, SphereGeometry, Vector3, type Texture } from "three";
import type { V3 } from "./Stage.tsx";

export type SkyColors = { zenith: string; horizon: string; glow: string; halo: string; ground: string; sunDisk: number };

const makeSkyMaterial = (sun: V3, c: SkyColors, env: boolean) =>
  new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uSun: { value: new Vector3(...sun).normalize() },
      uZenith: { value: new Color(c.zenith) },
      uHorizon: { value: new Color(c.horizon) },
      uGlow: { value: new Color(c.glow) },
      uHalo: { value: new Color(c.halo) },
      uGround: { value: new Color(c.ground) },
      uDisk: { value: env ? 0 : c.sunDisk },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){
        vDir = position;
        vec4 p = projectionMatrix * viewMatrix * vec4(cameraPosition + position, 1.0);
        gl_Position = p.xyww;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun, uZenith, uHorizon, uGlow, uHalo, uGround; uniform float uDisk;
      varying vec3 vDir;
      void main(){
        vec3 d = normalize(vDir);
        float e = d.y;
        float up = max(e, 0.0);
        vec3 col = mix(uHorizon, uZenith, pow(up, 0.55));
        float mu = max(dot(d, uSun), 0.0);
        // broad golden forward scattering, a tight cool halo (dusty skies scatter blue near the sun)
        col += uGlow * (pow(mu, 5.0) * 0.55 + pow(mu, 24.0) * 0.45) * (1.0 - 0.5 * up);
        col = mix(col, uHalo * 1.6, pow(mu, 180.0) * 0.6);
        col += vec3(1.0, 0.93, 0.82) * uDisk * smoothstep(0.99993, 0.99997, mu);
        // below the horizon: haze first, then ground bounce
        col = mix(col, uGround, smoothstep(-0.02, -0.25, e));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });

/** PMREM environment rendered from the sky (no sun disk; the sun is a real light). */
export const useSkyEnvironment = (sun: V3, colors: SkyColors, intensity = 1): Texture => {
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    const scene = new Scene();
    const mat = makeSkyMaterial(sun, colors, true);
    if (intensity !== 1) {
      for (const k of ["uZenith", "uHorizon", "uGlow", "uHalo", "uGround"]) (mat.uniforms[k].value as Color).multiplyScalar(intensity);
    }
    // PMREM's cube camera sits at the origin, so "cameraPosition + position" is the dome itself.
    scene.add(new Mesh(new SphereGeometry(100, 48, 24), mat));
    const pmrem = new PMREMGenerator(gl);
    const rt = pmrem.fromScene(scene, 0.02, 0.1, 1000);
    pmrem.dispose();
    return rt.texture;
    // colours and sun are constants of a film
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);
};

export const SkyDome: React.FC<{ sun: V3; colors: SkyColors; visible?: boolean }> = ({ sun, colors, visible = true }) => {
  const mesh = useMemo(() => {
    const m = new Mesh(new SphereGeometry(1000, 64, 32), makeSkyMaterial(sun, colors, false));
    m.frustumCulled = false;
    m.renderOrder = -10;
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <primitive object={mesh} visible={visible} />;
};
