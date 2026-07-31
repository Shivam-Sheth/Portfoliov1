"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query. `useSyncExternalStore` is the right tool here:
 * it reads the current value during render instead of assigning state inside an
 * effect (which causes a cascading re-render), and its separate server snapshot
 * keeps the static export's HTML consistent with first client paint.
 */
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // Prerender assumes "no match": no reduced motion, mobile-first widths.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Tracks the user's reduced-motion preference, reactively. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True once the viewport is at least `px` wide. Starts false (mobile-first). */
export function useMinWidth(px: number) {
  return useMediaQuery(`(min-width: ${px}px)`);
}

/**
 * Normalised pointer position in -1..1, written to a ref so consumers can read
 * it inside an animation loop without triggering React re-renders.
 */
export function usePointer(enabled = true) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  return pointer;
}

/** Adds `is-visible` to elements with `.reveal` as they scroll into view. */
export function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Current scroll progress of the document, 0..1. */
export function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? window.scrollY / max : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}
