// Turns a component list + construction timeline into a three.js scene graph and poses it for
// any frame. Built once (imperatively, no React per component); `update(frame)` is pure in
// the frame: it sets transforms, material state, blueprint ghosts and crane rigging.

import {
  BoxGeometry, Color, CylinderGeometry, DynamicDrawUsage, EdgesGeometry, Group, InstancedBufferAttribute, InstancedMesh,
  LineBasicMaterial, LineSegments, Matrix4, Mesh, Quaternion, Vector3, type BufferGeometry, type Material,
} from "three";
import { pieceProgress, stateOf, type RigState } from "../assembly/motion.ts";
import type { Slot, Timeline } from "../assembly/schedule.ts";
import { pieceBounds } from "../geometry/shapes.ts";
import type { Library, BuildUniforms } from "../materials/library.ts";
import { ease } from "../motion/easing.ts";
import type { Component, Piece, Vec3 } from "../types.ts";

type Bounds = { min: Vec3; max: Vec3 };
type Base = { opacity: number; transparent: boolean; cast: boolean };
type Common = { c: Component; slot: Slot; root: Group; inner: Group; bounds: Bounds; ghost: LineSegments; ghostMat: LineBasicMaterial };
type SolidItem = Common & {
  kind: "solid";
  meshes: Mesh[];
  mats: Material[];
  base: Base[];
  spread?: { geom: BufferGeometry; rest: Float32Array };
};
type PiecesItem = Common & { kind: "pieces"; mesh: InstancedMesh; mat: Material; alpha: InstancedBufferAttribute; pieces: Piece[]; settled: boolean };
type Item = SolidItem | PiecesItem;

const GHOST = new Color("#1fae95");
const CABLE_R = 0.016;
const MAX_CABLES = 240;
const MAX_HOOKS = 60;

const bfOf = (m: Material) => m.userData.bf as BuildUniforms | undefined;

const ghostFor = (b: Bounds) => {
  const size = b.max.map((v, i) => v - b.min[i]);
  const g = new EdgesGeometry(new BoxGeometry(size[0] + 0.03, size[1] + 0.03, size[2] + 0.03));
  const mat = new LineBasicMaterial({ color: GHOST, transparent: true, opacity: 0, depthWrite: false, fog: false });
  const l = new LineSegments(g, mat);
  l.position.set(...(b.min.map((v, i) => (v + b.max[i]) / 2) as Vec3));
  l.renderOrder = 2;
  return { ghost: l, ghostMat: mat };
};

export class Site {
  readonly group = new Group();
  private items: Item[] = [];
  private cables: InstancedMesh;
  private mains: InstancedMesh;
  private hooks: InstancedMesh;

  constructor(components: Component[], timeline: Timeline, lib: Library) {
    for (const c of components) {
      const slot = timeline.get(c.id)!;
      const root = new Group();
      root.position.set(...c.at);
      root.rotation.y = c.rotY ?? 0;
      const inner = new Group();
      root.add(inner);
      this.group.add(root);
      if (c.part.kind === "solid") {
        const bounds = c.part.bounds;
        const subs = c.part.build();
        const meshes: Mesh[] = [], mats: Material[] = [], base: Base[] = [];
        for (const s of subs) {
          const id = s.material ?? c.material;
          const mat = lib.make(id, { finish: id === c.material ? c.finish : undefined });
          const mesh = new Mesh(s.geom, mat);
          const cast = c.shadow !== false && id !== "glass" && c.method.kind !== "coat";
          mesh.receiveShadow = true;
          inner.add(mesh);
          meshes.push(mesh);
          mats.push(mat);
          base.push({ opacity: mat.opacity, transparent: mat.transparent, cast });
        }
        const item: SolidItem = { kind: "solid", c, slot, root, inner, bounds, meshes, mats, base, ...ghostFor(bounds) };
        if (c.method.kind === "spread") item.spread = { geom: subs[0].geom, rest: (subs[0].geom.attributes.position.array as Float32Array).slice() };
        root.add(item.ghost);
        this.items.push(item);
      } else {
        if (c.method.kind !== "lay") throw new Error(`BUILDFORGE: pieces component ${c.id} must use "lay"`);
        const pieces = c.part.pieces;
        const bounds = pieceBounds(pieces);
        const mat = lib.make(c.material, { finish: c.finish, pieces: true });
        const mesh = new InstancedMesh(new BoxGeometry(1, 1, 1), mat, pieces.length);
        mesh.instanceMatrix.setUsage(DynamicDrawUsage);
        const alpha = new InstancedBufferAttribute(new Float32Array(pieces.length).fill(1), 1);
        alpha.setUsage(DynamicDrawUsage);
        mesh.geometry.setAttribute("aAlpha", alpha);
        const tone = new Color();
        pieces.forEach((p, i) => mesh.setColorAt(i, tone.setScalar(p.tone ?? 1)));
        mesh.castShadow = c.shadow !== false;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        inner.add(mesh);
        const item: PiecesItem = { kind: "pieces", c, slot, root, inner, bounds, mesh, mat, alpha, pieces, settled: false, ...ghostFor(bounds) };
        root.add(item.ghost);
        this.items.push(item);
      }
    }
    // crane rigging: one pool of cable segments and hook blocks shared by every lift
    const pool = (geom: BufferGeometry, mat: Material, n: number) => {
      mat.transparent = true;
      const m = new InstancedMesh(geom, mat, n);
      m.geometry.setAttribute("aAlpha", new InstancedBufferAttribute(new Float32Array(n), 1));
      m.frustumCulled = false;
      m.instanceMatrix.setUsage(DynamicDrawUsage);
      this.group.add(m);
      return m;
    };
    // slings, the main hoist line (fades out upward, so the crane stays implied) and hook blocks
    this.cables = pool(new CylinderGeometry(1, 1, 1, 6, 1, true), lib.make("cable", { pieces: true }), MAX_CABLES);
    this.mains = pool(new CylinderGeometry(1, 1, 1, 6, 1, true), lib.make("cable", { pieces: true, fade: true }), MAX_HOOKS);
    this.hooks = pool(new BoxGeometry(0.26, 0.36, 0.2), lib.make("hook", { pieces: true }), MAX_HOOKS);
  }

  /**
   * Pose everything for construction-clock value `frame`. `blueprint` (0..1) draws the plan
   * outline over every installed element, bottom to top — the drawing behind the building.
   */
  update(frame: number, blueprint = 0) {
    const rigs: { item: Item; rig: RigState }[] = [];
    for (const item of this.items) {
      const s = stateOf(item.c, item.slot, frame);
      item.inner.visible = s.visible;
      let ghost = s.ghost;
      if (blueprint > 0 && s.visible && s.lin >= 1 && !item.c.exit && !["grow", "drive", "draw"].includes(item.c.method.kind)) {
        const h = (item.c.at[1] + item.bounds.min[1] + 0.5) / 8;
        ghost = Math.max(ghost, Math.min(1, Math.max(0, blueprint * 1.6 - h * 0.6)));
      }
      item.ghostMat.opacity = ghost * 0.95;
      item.ghost.visible = ghost > 0.003;
      item.inner.position.set(...s.offset);
      item.inner.scale.set(...s.scale);
      item.inner.rotation.y = s.yaw;
      if (item.kind === "solid") this.poseSolid(item, s.opacity, s.wet, s.u, s.lin);
      else this.posePieces(item, s.lin);
      if (s.rig && s.visible) rigs.push({ item, rig: s.rig });
    }
    this.group.updateMatrixWorld(true);
    this.poseRigs(rigs);
  }

  private poseSolid(item: SolidItem, opacity: number, wet: number, u: number, lin: number) {
    item.mats.forEach((m, i) => {
      const b = item.base[i];
      const tr = b.transparent || opacity < 0.999;
      if (m.transparent !== tr) {
        m.transparent = tr;
        m.needsUpdate = true;
      }
      m.opacity = b.opacity * opacity;
      const bf = bfOf(m);
      if (bf) {
        bf.uWet.value = wet;
        if (item.c.method.kind === "coat") {
          const y0 = item.c.at[1] + item.bounds.min[1], y1 = item.c.at[1] + item.bounds.max[1];
          bf.uCoat.value = lin >= 1 ? 1e5 : y0 - 0.02 + u * (y1 - y0 + 0.04);
        }
      }
    });
    item.meshes.forEach((mesh, i) => (mesh.castShadow = item.base[i].cast && opacity > 0.3));
    if (item.spread) this.deformPour(item, u);
  }

  /** Pour front: top vertices ahead of the front sink below the base, a ramp leads it. */
  private deformPour(item: SolidItem, u: number) {
    const m = item.c.method;
    if (m.kind !== "spread" || !item.spread) return;
    const { geom, rest } = item.spread;
    const pos = geom.attributes.position.array as Float32Array;
    const a = m.axis === "x" ? 0 : 2;
    const lo = item.bounds.min[a], hi = item.bounds.max[a], y0 = item.bounds.min[1], sink = y0 - 0.06;
    const front = m.dir > 0 ? lo + (hi - lo + m.ramp) * u : hi - (hi - lo + m.ramp) * u;
    for (let i = 0; i < pos.length; i += 3) {
      const x = rest[i + a], y = rest[i + 1];
      const k = u >= 1 ? 1 : Math.min(1, Math.max(0, (m.dir > 0 ? front - x : x - front) / m.ramp));
      pos[i] = rest[i];
      pos[i + 2] = rest[i + 2];
      pos[i + 1] = y > y0 + 1e-4 ? sink + (y - sink) * k : y;
    }
    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
  }

  private posePieces(item: PiecesItem, lin: number) {
    const m = item.c.method;
    if (m.kind !== "lay") return;
    const n = item.pieces.length;
    const done = lin >= 1;
    if (done && item.settled) return;
    const mtx = new Matrix4(), q = new Quaternion(), p = new Vector3(), sc = new Vector3();
    let fading = false;
    item.pieces.forEach((pc, i) => {
      const t = pieceProgress(i, n, lin, m.each);
      let a = 1;
      if (pc.instant ? t < 1 : t <= 0) sc.set(0, 0, 0);
      else sc.set(...pc.s);
      const e = pc.instant ? 1 : ease.glide(t);
      p.set(pc.c[0] + m.from[0] * (1 - e), pc.c[1] + m.from[1] * (1 - e), pc.c[2] + m.from[2] * (1 - e));
      if (!pc.instant) a = Math.min(1, t / 0.3);
      if (a < 1 && t > 0) fading = true;
      mtx.compose(p, q, sc);
      item.mesh.setMatrixAt(i, mtx);
      item.alpha.setX(i, a);
    });
    item.mesh.instanceMatrix.needsUpdate = true;
    item.alpha.needsUpdate = true;
    if (item.mat.transparent !== fading) {
      item.mat.transparent = fading;
      item.mat.needsUpdate = true;
    }
    item.settled = done;
  }

  private poseRigs(rigs: { item: Item; rig: RigState }[]) {
    const n = { cables: 0, mains: 0, hooks: 0 };
    const mtx = new Matrix4(), q = new Quaternion(), up = new Vector3(0, 1, 0), d = new Vector3(), mid = new Vector3(), sc = new Vector3();
    const put = (key: "cables" | "mains" | "hooks", alpha: number) => {
      const mesh = this[key];
      if (n[key] >= (key === "cables" ? MAX_CABLES : MAX_HOOKS)) return;
      mesh.setMatrixAt(n[key], mtx);
      (mesh.geometry.attributes.aAlpha as InstancedBufferAttribute).setX(n[key]++, alpha);
    };
    const seg = (a: Vector3, b: Vector3, alpha: number, key: "cables" | "mains") => {
      d.subVectors(b, a);
      const len = d.length();
      q.setFromUnitVectors(up, d.normalize());
      mid.addVectors(a, b).multiplyScalar(0.5);
      mtx.compose(mid, q, sc.set(CABLE_R, len, CABLE_R));
      put(key, alpha);
    };
    for (const { item, rig } of rigs) {
      const { min, max } = item.bounds;
      const cx = (min[0] + max[0]) / 2, cz = (min[2] + max[2]) / 2, top = max[1];
      const lx = max[0] - min[0], lz = max[2] - min[2];
      const local: Vec3[] =
        rig.kind === "single"
          ? [[cx, top, cz]]
          : rig.kind === "sling"
            ? lx >= lz
              ? [[cx - 0.38 * lx, top, cz], [cx + 0.38 * lx, top, cz]]
              : [[cx, top, cz - 0.38 * lz], [cx, top, cz + 0.38 * lz]]
            : [[cx - 0.4 * lx, top, cz - 0.4 * lz], [cx + 0.4 * lx, top, cz - 0.4 * lz], [cx + 0.4 * lx, top, cz + 0.4 * lz], [cx - 0.4 * lx, top, cz + 0.4 * lz]];
      const lift = new Vector3(0, rig.lift * 7, 0);
      const ends = local.map((v) => item.inner.localToWorld(new Vector3(...v)).add(lift));
      const centre = item.inner.localToWorld(new Vector3(cx, top, cz)).add(lift);
      const span = Math.max(lx, lz);
      const rise = rig.kind === "single" ? 0.45 : Math.min(rig.kind === "four" ? 4.2 : 3.2, 0.46 * span) + 0.2;
      const hook = centre.clone().add(new Vector3(0, rise, 0));
      for (const e of ends) seg(e, hook, rig.alpha, "cables");
      seg(hook.clone().add(new Vector3(0, 0.36, 0)), hook.clone().add(new Vector3(0, 80, 0)), rig.alpha, "mains");
      mtx.compose(hook.clone().add(new Vector3(0, 0.18, 0)), new Quaternion(), sc.set(1, 1, 1));
      put("hooks", rig.alpha);
    }
    for (const key of ["cables", "mains", "hooks"] as const) {
      const mesh = this[key];
      mesh.count = n[key];
      mesh.visible = n[key] > 0;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.geometry.attributes.aAlpha.needsUpdate = true;
    }
  }
}
