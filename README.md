# Shivam Sheth — Voxel Arcade Portfolio

A retro-arcade personal site: real 3D voxel objects rendered through a chunky
pixel look, parallax starfields, and a game-HUD interface.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Three.js via React Three Fiber

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## How the 3D works

Every object — guitar, headphones, football, dumbbell — is **generated from
math at runtime** in [`src/lib/voxels.ts`](src/lib/voxels.ts). There are no
`.gltf`/`.obj` files, no loaders, and no network fetches, so a model can never
fail to load and every shape is reviewable in a diff.

- The football's black patches sit at the 12 vertex directions of an
  icosahedron, which is where a real truncated-icosahedron ball puts its
  pentagons.
- The guitar body is the union of two ellipses, which produces the classic
  waisted silhouette.
- Each model renders as a single `InstancedMesh`, so a few thousand voxels cost
  one draw call.

The pixelation is not a post-processing pass. The canvas renders at a fraction
of device resolution (`dpr` 0.34–0.42) and the browser upscales it with
`image-rendering: pixelated`. Fewer moving parts, and nothing to go wrong on
low-end GPUs.

Two gotchas worth knowing if you edit `VoxelObject.tsx`:

1. **Do not set `vertexColors: true`.** It defines `USE_COLOR`, which makes the
   shader multiply by a per-vertex `color` attribute that `BoxGeometry` lacks.
   Unbound attributes read as zero, so every voxel renders solid black. Instance
   colours come from `USE_INSTANCING_COLOR`, which three defines on its own.
2. The mesh is built imperatively in a `useMemo` so `instanceColor` exists
   before the material compiles — that define is set at program-build time.

## Editing content

All copy lives in [`src/lib/content.ts`](src/lib/content.ts). The components are
presentational; you should not need to touch JSX to update a role, project, or
skill.

## Deploying

`next.config.ts` sets `output: 'export'`, so `npm run build` emits a fully
static `out/` directory that any host can serve.

- **Vercel** — import the repo; it detects Next.js and needs no configuration.
- **GitHub Pages** — publish `out/`. If the site lives at
  `user.github.io/<repo>` rather than a custom domain, add
  `basePath: '/<repo>'` and `assetPrefix: '/<repo>'` to `next.config.ts` first,
  or asset URLs will 404.

## Accessibility

`prefers-reduced-motion` is honoured throughout: it stops the idle spin, the
float, the marquee, the pointer parallax, and the scroll-driven camera, and
reveals all content immediately instead of animating it in.
