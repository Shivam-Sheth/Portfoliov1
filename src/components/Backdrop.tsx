"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Three fixed layers that translate at different rates as the page scrolls,
 * producing depth behind the content: far stars, near stars, and a synthwave
 * grid horizon. Driven by rAF writing transforms directly (no React state, so
 * scrolling never triggers a re-render).
 */
export default function Backdrop() {
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const y = window.scrollY;
      if (farRef.current) {
        farRef.current.style.transform = `translate3d(${mouseX * -6}px, ${
          y * -0.03 + mouseY * -4
        }px, 0)`;
      }
      if (nearRef.current) {
        nearRef.current.style.transform = `translate3d(${mouseX * -16}px, ${
          y * -0.08 + mouseY * -10
        }px, 0)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${y * 0.05}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, #16143a 0%, #0a0b1c 45%, #05060f 100%)",
        }}
      />

      {/* Far starfield */}
      <div
        ref={farRef}
        className="absolute will-change-transform"
        style={{
          inset: "-12%",
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(200,214,255,0.55) 50%, transparent 50%)," +
            "radial-gradient(1px 1px at 70% 65%, rgba(200,214,255,0.4) 50%, transparent 50%)," +
            "radial-gradient(1px 1px at 45% 85%, rgba(200,214,255,0.45) 50%, transparent 50%)",
          backgroundSize: "180px 180px, 240px 240px, 300px 300px",
        }}
      />

      {/* Near starfield, brighter and tinted */}
      <div
        ref={nearRef}
        className="absolute will-change-transform"
        style={{
          inset: "-18%",
          backgroundImage:
            "radial-gradient(2px 2px at 15% 20%, rgba(53,242,212,0.5) 50%, transparent 50%)," +
            "radial-gradient(2px 2px at 80% 55%, rgba(255,61,139,0.45) 50%, transparent 50%)," +
            "radial-gradient(2px 2px at 55% 78%, rgba(232,236,255,0.5) 50%, transparent 50%)",
          backgroundSize: "420px 420px, 520px 520px, 620px 620px",
        }}
      />

      {/* Synthwave grid horizon */}
      <div
        ref={gridRef}
        className="absolute inset-x-0 bottom-0 h-[45vh] will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,107,255,0.22) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(53,242,212,0.16) 1px, transparent 1px)",
          backgroundSize: "64px 64px, 64px 64px",
          transformOrigin: "50% 100%",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.85), transparent 85%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.85), transparent 85%)",
        }}
      />
    </div>
  );
}
