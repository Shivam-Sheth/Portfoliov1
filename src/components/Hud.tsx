"use client";

import { useEffect, useState } from "react";
import { NAV, PROFILE } from "@/lib/content";

export default function Hud() {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav entry for whichever section owns the viewport centre.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Power bar: scroll progress */}
      <div className="h-[3px] w-full bg-abyss">
        <div
          className="h-full bg-gradient-to-r from-cyan via-violet to-magenta transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav className="border-b border-edge bg-void/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a
            href="#top"
            className="font-display text-[0.62rem] tracking-widest text-ink hover:text-cyan transition-colors"
          >
            SHIVAM<span className="text-cyan">.DEV</span>
          </a>

          {/* Desktop nav. `whitespace-nowrap` keeps labels on one line — with
              eight entries the bar is tight and wrapping looks broken. */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`label whitespace-nowrap px-2 py-2 transition-colors ${
                    activeId === id
                      ? "text-cyan glow-cyan"
                      : "text-inkmute hover:text-ink"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Wrapper owns the visibility: `.pixel-btn` sets display:inline-flex
              and is declared after Tailwind's `hidden`, so it would win. */}
          <span className="hidden xl:block">
            <a
              href={`mailto:${PROFILE.email}`}
              className="pixel-btn whitespace-nowrap text-cyan"
            >
              Hire me
            </a>
          </span>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden flex h-9 w-9 flex-col items-center justify-center gap-[5px] border border-edge text-ink"
          >
            <span
              className={`block h-[2px] w-4 bg-current transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-4 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-4 bg-current transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <ul className="md:hidden border-t border-edge bg-void/95 px-5 pb-4 pt-2">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="label block border-b border-edge/60 py-3 text-inksoft hover:text-cyan"
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a
                href={`mailto:${PROFILE.email}`}
                className="pixel-btn text-cyan"
                onClick={() => setOpen(false)}
              >
                Hire me
              </a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
