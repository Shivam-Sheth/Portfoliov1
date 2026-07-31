"use client";

/*
 * `react-hooks/immutability` is disabled for this file: `CameraRig` writes to
 * `camera.position` and to a scroll ref inside `useFrame`, which r3f drives
 * from its own rAF loop outside React's render cycle. See VoxelObject.tsx.
 */
/* eslint-disable react-hooks/immutability */

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import VoxelObject from "./VoxelObject";
import { MODEL_BUILDERS, type ModelKey } from "@/lib/voxels";
import { useMinWidth, usePointer, useReducedMotion } from "@/lib/hooks";

const ORDER: ModelKey[] = ["guitar", "headphones", "football", "dumbbell"];

/** Drives camera drift from the pointer, plus a slow scroll-linked dolly. */
function CameraRig({
  pointer,
  reduced,
  scrollDolly,
  distance,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  reduced: boolean;
  scrollDolly: boolean;
  distance: number;
}) {
  const { camera } = useThree();
  const scroll = useRef(0);

  useFrame((_, delta) => {
    if (reduced) {
      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
      return;
    }

    if (scrollDolly) {
      // Read scroll each frame; cheap, and avoids a listener fighting React state.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      scroll.current += (p - scroll.current) * Math.min(1, delta * 4);
    }

    const px = pointer.current?.x ?? 0;
    const py = pointer.current?.y ?? 0;

    // Pull back and rise slightly as the page scrolls
    const targetX = px * 5;
    const targetY = -py * 3 + scroll.current * 4;
    const targetZ = distance + scroll.current * 12;

    camera.position.x += (targetX - camera.position.x) * Math.min(1, delta * 2.5);
    camera.position.y += (targetY - camera.position.y) * Math.min(1, delta * 2.5);
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 2.5);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

type Props = {
  activeKey: ModelKey;
  className?: string;
  /** Hero scene dollies the camera with page scroll; inline scenes should not. */
  scrollDolly?: boolean;
  /** Base camera distance. Lower fills more of a narrow container. */
  distance?: number;
};

export default function VoxelScene({
  activeKey,
  className,
  scrollDolly = true,
  distance = 46,
}: Props) {
  const reduced = useReducedMotion();
  const isDesktop = useMinWidth(768);
  const pointer = usePointer(!reduced);

  // Models are pure math; build them once and keep them for the session.
  const models = useMemo(() => {
    return ORDER.map((key) => ({ key, model: MODEL_BUILDERS[key]() }));
  }, []);

  return (
    <div className={className}>
      <Canvas
        // Low DPR + nearest-neighbour upscaling is what produces the chunky
        // pixel look, with no post-processing pass to go wrong.
        dpr={isDesktop ? 0.42 : 0.34}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, distance], fov: 42, near: 0.1, far: 400 }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <ambientLight intensity={1.15} />
        <hemisphereLight
          intensity={0.7}
          color="#9fb4ff"
          groundColor="#1a1030"
        />
        <directionalLight position={[18, 26, 20]} intensity={1.5} />
        {/* Arcade rim lights: cyan from the left, magenta from the right */}
        <pointLight position={[-26, 6, 18]} intensity={620} color="#35f2d4" />
        <pointLight position={[26, -8, 14]} intensity={520} color="#ff3d8b" />

        <CameraRig
          pointer={pointer}
          reduced={reduced}
          scrollDolly={scrollDolly}
          distance={distance}
        />

        {models.map(({ key, model }) => (
          <VoxelObject
            key={key}
            model={model}
            active={key === activeKey}
            targetSize={key === "guitar" ? 30 : 24}
            pointer={reduced ? undefined : pointer.current}
            reducedMotion={reduced}
            spinSpeed={key === "football" ? 0.3 : 0.2}
          />
        ))}
      </Canvas>
    </div>
  );
}
