// Daylight sky: soft blue zenith, warm-white haze at the horizon, a sun glow, static cloud
// layer (uShift drifts it for time-lapses). The same dome is rendered once into a PMREM so
// glass and metal reflect the sky the camera sees.

import { BackSide, Color, Mesh, PMREMGenerator, Scene, ShaderMaterial, SphereGeometry, Vector2, type Vector3, type WebGLRenderer, CircleGeometry, MeshBasicMaterial } from "three";

export type SkyLook = { zenith: string; horizon: string; ground: string; sun: string; cloud: string };

export const skyMaterial = (look: SkyLook, sunDir: Vector3) =>
  new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uZenith: { value: new Color(look.zenith) },
      uHorizon: { value: new Color(look.horizon) },
      uGround: { value: new Color(look.ground) },
      uSun: { value: new Color(look.sun) },
      uCloud: { value: new Color(look.cloud) },
      uSunDir: { value: sunDir.clone().normalize() },
      uShift: { value: new Vector2() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.0);
        vDir = w.xyz - cameraPosition;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uGround; uniform vec3 uSun; uniform vec3 uSunDir; uniform vec3 uCloud; uniform vec2 uShift;
      varying vec3 vDir;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * vnoise(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
      void main(){
        vec3 d = normalize(vDir);
        float y = d.y;
        vec3 c = mix(uHorizon, uZenith, pow(smoothstep(0.0, 0.65, y), 0.5));
        c = mix(c, uGround, smoothstep(0.0, -0.12, y));
        // soft fair-weather clouds on a flat layer (static: the sky never flickers)
        if (y > 0.0) {
          vec2 uv = d.xz / (y + 0.1) * 0.9 + vec2(4.0, 2.0) + uShift;
          float cl = smoothstep(0.46, 0.8, fbm(uv)) * smoothstep(0.015, 0.1, y) * (1.0 - smoothstep(0.55, 0.9, y));
          // lit tops, softly shaded undersides
          vec3 cc = mix(uCloud * 0.86, uCloud, smoothstep(0.5, 0.75, fbm(uv + vec2(0.05, 0.12))));
          c = mix(c, cc, cl * 0.85);
        }
        float s = max(dot(d, normalize(uSunDir)), 0.0);
        c += uSun * (pow(s, 5.0) * 0.16 + pow(s, 60.0) * 0.3 + smoothstep(0.99955, 0.9998, s) * 5.0);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });

export const createSky = (look: SkyLook, sunDir: Vector3, radius = 1800) => {
  const m = new Mesh(new SphereGeometry(radius, 64, 32), skyMaterial(look, sunDir));
  m.frustumCulled = false;
  m.renderOrder = -10;
  return m;
};

/** Environment map from the sky dome plus a sunlit ground disc (what a facade "sees"). */
export const skyEnvironment = (gl: WebGLRenderer, look: SkyLook, sunDir: Vector3) => {
  const scene = new Scene();
  scene.add(new Mesh(new SphereGeometry(50, 48, 24), skyMaterial(look, sunDir)));
  const ground = new Mesh(new CircleGeometry(49, 48), new MeshBasicMaterial({ color: new Color(look.ground).multiplyScalar(0.85) }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.5;
  scene.add(ground);
  const pm = new PMREMGenerator(gl);
  const rt = pm.fromScene(scene, 0.02);
  pm.dispose();
  return rt.texture;
};
