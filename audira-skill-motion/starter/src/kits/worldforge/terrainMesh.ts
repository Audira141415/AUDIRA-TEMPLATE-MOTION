// Grid → BufferGeometry (position, normal, colour, baked shade). Quads are split along the
// diagonal that follows the terrain (shorter height difference), which keeps ridgelines and
// dune crests crisp instead of zig-zagging.

import { BufferAttribute, BufferGeometry, Sphere, Vector3 } from "three";
import type { Grid } from "./heightfield.ts";

export type GridMeshInput = {
  grid: Grid;
  normals: Float32Array;
  color: Float32Array;
  shade: Float32Array;
  /** Return true to drop the quad whose lower-left vertex is (i, j). */
  skip?: (x0: number, z0: number, x1: number, z1: number) => boolean;
};

export const gridGeometry = ({ grid, normals, color, shade, skip }: GridMeshInput) => {
  const nx = grid.ax.n, nz = grid.az.n;
  const pos = new Float32Array(nx * nz * 3);
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      pos[k * 3] = grid.ax.coord[i];
      pos[k * 3 + 1] = grid.h[k];
      pos[k * 3 + 2] = grid.az.coord[j];
    }
  }
  const idx = new Uint32Array((nx - 1) * (nz - 1) * 6);
  let n = 0;
  for (let j = 0; j < nz - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      if (skip && skip(grid.ax.coord[i], grid.az.coord[j], grid.ax.coord[i + 1], grid.az.coord[j + 1])) continue;
      const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
      // counter-clockwise seen from above (+y): a(x0,z0) c(x0,z1) b(x1,z0)
      if (Math.abs(grid.h[a] - grid.h[d]) < Math.abs(grid.h[b] - grid.h[c])) {
        idx[n++] = a; idx[n++] = c; idx[n++] = d;
        idx[n++] = a; idx[n++] = d; idx[n++] = b;
      } else {
        idx[n++] = a; idx[n++] = c; idx[n++] = b;
        idx[n++] = b; idx[n++] = c; idx[n++] = d;
      }
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("normal", new BufferAttribute(normals, 3));
  g.setAttribute("color", new BufferAttribute(color, 3));
  g.setAttribute("aShade", new BufferAttribute(shade, 2));
  g.setIndex(new BufferAttribute(idx.subarray(0, n), 1));
  g.computeBoundingBox();
  const bb = g.boundingBox!;
  g.boundingSphere = new Sphere(bb.getCenter(new Vector3()), bb.getSize(new Vector3()).length() / 2);
  return g;
};
