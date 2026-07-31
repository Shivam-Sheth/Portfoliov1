/**
 * Procedural voxel model generators.
 *
 * Every object Shivam cares about — guitar, headphones, football, dumbbell —
 * is built here from pure math on an integer lattice. No .gltf/.obj assets,
 * no loaders, no network fetch: the models cannot fail to load, and they are
 * fully diffable in git.
 *
 * Each generator returns voxels on an integer grid, recentered on the origin.
 */

export type Voxel = {
  x: number;
  y: number;
  z: number;
  color: string;
};

export type VoxelModel = {
  voxels: Voxel[];
  /** Longest bounding-box axis, used to normalize models to a common size. */
  extent: number;
};

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

const C = {
  white: "#eef2ff",
  bone: "#cdd4f0",
  black: "#12142a",
  charcoal: "#39406b",
  steel: "#7f8ab5",
  steelLight: "#aab3d8",
  magenta: "#ff3d8b",
  magentaDeep: "#c2185f",
  violet: "#8b6bff",
  violetDeep: "#5b42c4",
  cyan: "#35f2d4",
  cyanDeep: "#12b39c",
  amber: "#ffc53d",
  wood: "#b5762f",
  woodDark: "#7a4a1c",
  cream: "#ffe9b8",
} as const;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Recenter voxels on the origin and measure the model. */
function finalize(voxels: Voxel[]): VoxelModel {
  if (voxels.length === 0) return { voxels, extent: 1 };

  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;

  for (const v of voxels) {
    if (v.x < minX) minX = v.x;
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
    if (v.z < minZ) minZ = v.z;
    if (v.z > maxZ) maxZ = v.z;
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;

  for (const v of voxels) {
    v.x -= cx;
    v.y -= cy;
    v.z -= cz;
  }

  const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
  return { voxels, extent };
}

/** Walk an integer bounding box, letting `fn` claim voxels by returning a color. */
function carve(
  bounds: { x: number; y: number; z: number },
  fn: (x: number, y: number, z: number) => string | null,
): Voxel[] {
  const out: Voxel[] = [];
  for (let x = -bounds.x; x <= bounds.x; x++) {
    for (let y = -bounds.y; y <= bounds.y; y++) {
      for (let z = -bounds.z; z <= bounds.z; z++) {
        const color = fn(x, y, z);
        if (color) out.push({ x, y, z, color });
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Football (soccer ball)                                              */
/* ------------------------------------------------------------------ */

/**
 * A truncated icosahedron's black patches sit exactly at the 12 vertex
 * directions of an icosahedron. So we voxelize a sphere shell, then paint a
 * voxel black when its surface normal points near one of those 12 directions.
 * That yields a genuinely correct panel layout rather than random blotches.
 */
function icosahedronDirections(): [number, number, number][] {
  const p = (1 + Math.sqrt(5)) / 2;
  const raw: [number, number, number][] = [];
  for (const s1 of [1, -1]) {
    for (const s2 of [1, -1]) {
      raw.push([0, s1 * 1, s2 * p]);
      raw.push([s1 * 1, s2 * p, 0]);
      raw.push([s1 * p, 0, s2 * 1]);
    }
  }
  const len = Math.hypot(1, p);
  return raw.map(([x, y, z]) => [x / len, y / len, z / len]);
}

export function makeFootball(radius = 8): VoxelModel {
  const dirs = icosahedronDirections();
  // cos of the angular radius of each black pentagon
  const patchCos = Math.cos(0.32);

  // Solid rather than a shell. A hollow ball lets sightlines slip between
  // voxels at grazing angles, which reads as speckle instead of a ball;
  // the interior instances are always occluded, so they cost nothing visually.
  const voxels = carve({ x: radius, y: radius, z: radius }, (x, y, z) => {
    const d = Math.sqrt(x * x + y * y + z * z);
    if (d > radius) return null;

    const nx = x / (d || 1);
    const ny = y / (d || 1);
    const nz = z / (d || 1);

    for (const [dx, dy, dz] of dirs) {
      if (nx * dx + ny * dy + nz * dz > patchCos) return C.black;
    }
    return C.white;
  });

  return finalize(voxels);
}

/* ------------------------------------------------------------------ */
/* Dumbbell                                                            */
/* ------------------------------------------------------------------ */

export function makeDumbbell(): VoxelModel {
  const HANDLE_HALF = 5;
  const PLATE_INNER = 5;
  const PLATE_MID = 8;
  const PLATE_OUTER = 11;

  const voxels = carve({ x: 12, y: 7, z: 7 }, (x, y, z) => {
    const r = Math.sqrt(y * y + z * z);
    const ax = Math.abs(x);

    // Knurled grip bar
    if (ax <= HANDLE_HALF && r <= 1.9) {
      // Knurling: alternating rings read as grip texture
      return x % 2 === 0 ? C.steel : C.steelLight;
    }

    // Inner (large) plate
    if (ax > PLATE_INNER && ax <= PLATE_MID && r <= 6.2) {
      return r > 5.2 ? C.cyan : C.charcoal;
    }

    // Outer (smaller) plate
    if (ax > PLATE_MID && ax <= PLATE_OUTER && r <= 4.4) {
      return r > 3.5 ? C.cyanDeep : C.charcoal;
    }

    return null;
  });

  return finalize(voxels);
}

/* ------------------------------------------------------------------ */
/* Electric guitar                                                     */
/* ------------------------------------------------------------------ */

/** Axis-aligned ellipse test in the XY plane. */
function inEllipse(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): boolean {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

export function makeGuitar(): VoxelModel {
  const voxels = carve({ x: 10, y: 22, z: 3 }, (x, y, z) => {
    const az = Math.abs(z);

    /* ---- Body: union of two ellipses gives the classic waisted shape ---- */
    const lowerBout = inEllipse(x, y, 0, -12, 7.5, 6.5);
    const upperBout = inEllipse(x, y, 0, -4.5, 6.0, 5.2);
    const inBody = lowerBout || upperBout;

    if (inBody && az <= 1) {
      // Bridge
      if (y >= -15 && y <= -13 && Math.abs(x) <= 3) return C.steelLight;
      // Two pickups
      if (y >= -10 && y <= -9 && Math.abs(x) <= 3.5) return C.cream;
      if (y >= -7 && y <= -6 && Math.abs(x) <= 3.5) return C.cream;
      // Control knobs
      if (y >= -13 && y <= -12 && x >= 4 && x <= 5) return C.amber;
      // Edge binding: lighter rim so the silhouette pops
      const rimLower = inEllipse(x, y, 0, -12, 6.6, 5.7);
      const rimUpper = inEllipse(x, y, 0, -4.5, 5.2, 4.5);
      if (!(rimLower || rimUpper)) return C.magentaDeep;
      return C.magenta;
    }

    /* ---- Neck ---- */
    if (y > -6 && y <= 15 && Math.abs(x) <= 1.8 && az <= 1) {
      // Fretboard on the front face, with frets every 3 voxels
      if (z === 1) return y % 3 === 0 ? C.steelLight : C.woodDark;
      return C.wood;
    }

    /* ---- Headstock ---- */
    if (y > 15 && y <= 20 && Math.abs(x) <= 3 && az <= 1) {
      // Tuning pegs poking out either side
      if (Math.abs(x) === 3 && y % 2 === 0) return C.steelLight;
      return C.woodDark;
    }

    return null;
  });

  return finalize(voxels);
}

/* ------------------------------------------------------------------ */
/* Headphones                                                          */
/* ------------------------------------------------------------------ */

export function makeHeadphones(): VoxelModel {
  const BAND_R = 9;
  const CUP_X = 9;

  const voxels = carve({ x: 13, y: 12, z: 5 }, (x, y, z) => {
    /* ---- Headband: upper half of a thick ring ---- */
    const ringR = Math.sqrt(x * x + y * y);
    if (y >= 0 && ringR <= BAND_R + 1.2 && ringR >= BAND_R - 1.2 && Math.abs(z) <= 1.6) {
      // Highlight along the crown
      return y > BAND_R - 2 ? C.violet : C.violetDeep;
    }

    /* ---- Ear cups: cylinders on the X axis at each end of the band ---- */
    const ax = Math.abs(x);
    const cupR = Math.sqrt(y * y + z * z);
    if (ax >= CUP_X - 1 && ax <= CUP_X + 2 && cupR <= 4.2) {
      // Outer face gets a cyan accent ring; inner is the padded charcoal
      if (ax > CUP_X + 0.5) {
        return cupR > 3.2 ? C.cyan : C.charcoal;
      }
      return cupR > 3.4 ? C.violetDeep : C.charcoal;
    }

    return null;
  });

  return finalize(voxels);
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export type ModelKey = "guitar" | "headphones" | "football" | "dumbbell";

export const MODEL_BUILDERS: Record<ModelKey, () => VoxelModel> = {
  guitar: makeGuitar,
  headphones: makeHeadphones,
  football: () => makeFootball(10),
  dumbbell: makeDumbbell,
};

export const MODEL_META: Record<
  ModelKey,
  { label: string; blurb: string; accent: string }
> = {
  guitar: {
    label: "Guitar",
    blurb:
      "Six strings and a loud amp. The fastest way I know to stop thinking about a bug for an hour.",
    accent: "#ff3d8b",
  },
  headphones: {
    label: "Music",
    blurb:
      "Something is always playing while I build. The playlist changes; the volume does not.",
    accent: "#8b6bff",
  },
  football: {
    label: "Football",
    blurb:
      "Weekend pickup games and far too many opinions about the transfer window.",
    accent: "#eef2ff",
  },
  dumbbell: {
    label: "Lifting",
    blurb:
      "Progressive overload is just refactoring for your body. I am in the gym most mornings.",
    accent: "#35f2d4",
  },
};
