"use client";

/*
 * `react-hooks/immutability` is disabled for this file.
 *
 * It flags the mutation of the shared `dummy`/`tmpColor` scratch objects and of
 * `mesh.instanceMatrix.needsUpdate`. Those writes happen inside `useFrame`,
 * which r3f runs from its own rAF loop, entirely outside React's render cycle.
 * Mutating three.js objects in place is the whole point of the animation loop —
 * reallocating an Object3D per voxel per frame would churn thousands of objects
 * at 60fps. The rule cannot distinguish this from a render-phase mutation.
 */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { VoxelModel } from "@/lib/voxels";

const dummy = new THREE.Object3D();
const tmpColor = new THREE.Color();

/** Deterministic 0..1 hash so the materialize stagger is stable across renders. */
function hash01(i: number) {
  const s = Math.sin(i * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

type Props = {
  model: VoxelModel;
  /** World-space size of the model's longest axis. */
  targetSize?: number;
  /** Whether this model is the visible one; drives the materialize animation. */
  active?: boolean;
  spinSpeed?: number;
  /** -1..1 pointer offsets used for parallax tilt. */
  pointer?: { x: number; y: number };
  floatAmount?: number;
  reducedMotion?: boolean;
};

export default function VoxelObject({
  model,
  targetSize = 22,
  active = true,
  spinSpeed = 0.22,
  pointer,
  floatAmount = 0.7,
  reducedMotion = false,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(active ? 1 : 0);

  const { count, unit, offsets, delays } = useMemo(() => {
    const unit = targetSize / model.extent;
    const n = model.voxels.length;
    const offsets = new Float32Array(n * 3);
    const delays = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = model.voxels[i];
      offsets[i * 3] = v.x * unit;
      offsets[i * 3 + 1] = v.y * unit;
      offsets[i * 3 + 2] = v.z * unit;
      delays[i] = hash01(i) * 0.55;
    }
    return { count: n, unit, offsets, delays };
  }, [model, targetSize]);

  /**
   * Built imperatively so `instanceColor` exists before the material compiles:
   * three only defines `USE_INSTANCING_COLOR` when the attribute is present at
   * program-build time.
   *
   * Note `vertexColors` is deliberately NOT set. It would define `USE_COLOR`,
   * making the shader multiply by a per-vertex `color` attribute that
   * BoxGeometry does not have — an unbound attribute reads as zero, which
   * renders every instance solid black.
   */
  const mesh = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ toneMapped: false });
    const m = new THREE.InstancedMesh(geometry, material, count);
    m.frustumCulled = false;

    for (let i = 0; i < count; i++) {
      tmpColor.set(model.voxels[i].color);
      m.setColorAt(i, tmpColor);

      // Seed matrices so the first frame is never a pile of unit cubes at 0,0,0
      dummy.position.set(
        offsets[i * 3],
        offsets[i * 3 + 1],
        offsets[i * 3 + 2],
      );
      const s = active ? unit * 0.92 : 0;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.instanceMatrix.needsUpdate = true;

    return m;
    // `active` is intentionally excluded: it only seeds the first frame, and
    // useFrame owns the matrices from then on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, count, unit, offsets]);

  // Release GPU resources when the model swaps or the scene unmounts.
  useEffect(() => {
    return () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      mesh.dispose();
    };
  }, [mesh]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Ease the materialize/dissolve progress toward the active state.
    const target = active ? 1 : 0;
    const speed = reducedMotion ? 12 : 2.6;
    progress.current += (target - progress.current) * Math.min(1, delta * speed);
    const p = progress.current;

    // Fully hidden: skip the per-instance work entirely.
    if (p < 0.001) {
      group.visible = false;
      return;
    }
    group.visible = true;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      // Staggered reveal: each voxel pops in over its own slice of the curve.
      const d = delays[i];
      const local = Math.max(0, Math.min(1, (p - d) / 0.45));
      const eased = local < 1 ? 1 - Math.pow(1 - local, 3) : 1;

      dummy.position.set(
        offsets[i * 3],
        offsets[i * 3 + 1],
        offsets[i * 3 + 2],
      );

      // Voxels drift outward while dissolving, so transitions read as a scatter.
      if (eased < 1) {
        const spread = (1 - eased) * 6;
        dummy.position.x += (hash01(i * 3.1) - 0.5) * spread;
        dummy.position.y += (hash01(i * 5.7) - 0.5) * spread;
        dummy.position.z += (hash01(i * 9.3) - 0.5) * spread;
      }

      const s = eased * unit * 0.92;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    if (reducedMotion) {
      group.rotation.set(0, 0.5, 0);
      group.position.y = 0;
      return;
    }

    // Idle spin + gentle bob
    group.rotation.y += delta * spinSpeed;
    group.position.y = Math.sin(t * 0.9) * floatAmount;

    // Pointer parallax: the object leans toward the cursor
    if (pointer) {
      const targetRotX = pointer.y * 0.28;
      const targetRotZ = -pointer.x * 0.12;
      group.rotation.x +=
        (targetRotX - group.rotation.x) * Math.min(1, delta * 3);
      group.rotation.z +=
        (targetRotZ - group.rotation.z) * Math.min(1, delta * 3);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={mesh} />
    </group>
  );
}
