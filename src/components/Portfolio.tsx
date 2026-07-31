"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ACTIVE_ROLES,
  EDUCATION,
  EXPERIENCE,
  HIGH_SCORES,
  LEADERSHIP,
  LOADOUT,
  MARQUEE,
  OPEN_TO,
  PROFILE,
  PROJECTS,
  RESEARCH,
  STATS,
  type Paper,
  type Project,
} from "@/lib/content";
import { MODEL_META, type ModelKey } from "@/lib/voxels";
import { useScrollReveal } from "@/lib/hooks";
import Backdrop from "./Backdrop";
import Hud from "./Hud";

// WebGL has no server-side equivalent; keep the scene out of the static export.
const VoxelScene = dynamic(() => import("./VoxelScene"), {
  ssr: false,
  loading: () => <SceneSkeleton />,
});

const ORDER: ModelKey[] = ["guitar", "headphones", "football", "dumbbell"];

function SceneSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="label text-inkmute">
        Loading<span className="blink">_</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

function SectionHead({
  index,
  kicker,
  title,
  blurb,
  accent = "text-cyan",
}: {
  index: string;
  kicker: string;
  title: string;
  blurb?: string;
  accent?: string;
}) {
  return (
    <div className="reveal mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className={`label mb-3 ${accent}`}>
          <span className="text-inkmute">{index}</span> / {kicker}
        </p>
        <h2 className="section-title text-ink">{title}</h2>
      </div>
      {blurb && (
        <p className="max-w-md text-sm leading-relaxed text-inksoft">{blurb}</p>
      )}
    </div>
  );
}

function Section({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-edge/50 py-20 md:py-28"
    >
      {children}
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-edge px-2.5 py-1 text-[11px] text-inksoft">
      {children}
    </span>
  );
}

const ACCENT_MAP = {
  cyan: { text: "text-cyan", border: "border-cyan/50", bg: "bg-cyan" },
  magenta: { text: "text-magenta", border: "border-magenta/50", bg: "bg-magenta" },
  violet: { text: "text-violet", border: "border-violet/50", bg: "bg-violet" },
  amber: { text: "text-amber", border: "border-amber/50", bg: "bg-amber" },
} as const;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Portfolio() {
  useScrollReveal();

  const [heroKey, setHeroKey] = useState<ModelKey>("guitar");
  const [playerKey, setPlayerKey] = useState<ModelKey>("guitar");

  // Auto-cycle the hero object. Re-runs on manual selection, which naturally
  // restarts the timer so a click gives you a full dwell on your choice.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setHeroKey((k) => ORDER[(ORDER.indexOf(k) + 1) % ORDER.length]);
    }, 5600);
    return () => window.clearTimeout(id);
  }, [heroKey]);

  const selectHero = useCallback((k: ModelKey) => setHeroKey(k), []);

  return (
    <>
      <Backdrop />
      <div className="crt-overlay" />
      <div className="vignette" />
      <Hud />

      <main id="top" className="relative z-10 mx-auto w-full max-w-6xl px-5">
        {/* ============================ HERO ============================ */}
        <section className="grid min-h-[92vh] items-center gap-8 pt-28 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="reveal is-visible order-2 lg:order-1">
            <p className="label mb-5 text-cyan glow-cyan">
              <span className="blink">▮</span> Player 1 - Ready
            </p>

            <h1 className="hero-title text-ink">
              SHIVAM
              <br />
              <span className="text-magenta glow-magenta">SHETH</span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-relaxed text-inksoft md:text-base">
              {PROFILE.tagline}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 border border-cyan/40 bg-cyan/5 px-3 py-1.5 text-[11px] text-cyan">
                <span className="h-2 w-2 bg-cyan" />
                Currently at Xpnse AI + Northwestern FORGE
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="pixel-btn bg-cyan/10 text-cyan">
                View Projects
              </a>
              <a href="#contact" className="pixel-btn text-inksoft">
                Contact
              </a>
            </div>

            {/* Object selector: doubles as the hero's interactive toy */}
            <div className="mt-10">
              <p className="label mb-3 text-inkmute">Select object</p>
              <div className="flex flex-wrap gap-2">
                {ORDER.map((key) => {
                  const on = key === heroKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectHero(key)}
                      aria-pressed={on}
                      className={`border px-3 py-2 text-[11px] transition-all ${
                        on
                          ? "border-cyan text-cyan shadow-[3px_3px_0_0] shadow-cyan/40"
                          : "border-edge text-inkmute hover:border-edgehot hover:text-inksoft"
                      }`}
                      style={on ? { color: MODEL_META[key].accent } : undefined}
                    >
                      {MODEL_META[key].label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3D stage */}
          <div className="order-1 h-[46vh] min-h-[300px] w-full lg:order-2 lg:h-[62vh]">
            <VoxelScene
              activeKey={heroKey}
              className="pixel-canvas h-full w-full"
            />
          </div>
        </section>

        {/* ========================== STATS ============================ */}
        <div className="reveal grid grid-cols-2 gap-3 pb-16 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="pixel-panel p-4">
              <p className="label text-inkmute">{s.label}</p>
              <p className="mt-2 text-sm text-ink">{s.value}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ========================= MARQUEE ============================ */}
      <div className="relative z-10 overflow-hidden border-y border-edge bg-abyss/60 py-3">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE.map((word) => (
                <span
                  key={`${dup}-${word}`}
                  className="label flex items-center gap-6 px-6 text-inkmute"
                >
                  {word}
                  <span className="text-cyan">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-5">
        {/* ============================ NOW ============================ */}
        <Section id="now">
          <SectionHead
            index="01"
            kicker="Now"
            title="What I'm doing right now"
            blurb="Two roles running concurrently this summer, alongside my master's at Northwestern."
          />

          {/* Active roles get their own lit band so a recruiter's eye lands
              here first; everything else in this section is deliberately calmer. */}
          <div className="reveal mb-3 flex items-center gap-3">
            <span className="pulse-dot h-2.5 w-2.5 shrink-0 bg-lime text-lime" />
            <span className="label text-lime">Currently working</span>
            <span className="h-px flex-1 bg-gradient-to-r from-lime/40 to-transparent" />
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-2">
            {ACTIVE_ROLES.map((item) => (
              <NowCard key={item.org} item={item} />
            ))}
          </div>

          <div className="reveal mb-3 flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 border border-violet" />
            <span className="label text-violet">Education</span>
            <span className="h-px flex-1 bg-gradient-to-r from-violet/30 to-transparent" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {EDUCATION.map((ed) => {
              const a = ACCENT_MAP[ed.accent];
              return (
                <article key={ed.school} className="reveal pixel-panel p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center border ${a.border} font-display text-[0.55rem] ${a.text}`}
                    >
                      {ed.badge}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-display text-[0.7rem] ${a.text}`}>
                        {ed.school}
                      </h3>
                      <p className="mt-1.5 text-xs text-ink">{ed.degree}</p>
                      <p className="text-[11px] text-inkmute">
                        {ed.location} · {ed.period}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-inksoft">
                    {ed.courses}
                  </p>
                </article>
              );
            })}
          </div>
        </Section>

        {/* ========================= EXPERIENCE ======================== */}
        <Section id="quests">
          <SectionHead
            index="02"
            kicker="Quest Log"
            title="Completed engineering runs"
            blurb="Internships and AI development work focused on automation and measurable operational outcomes."
            accent="text-magenta"
          />
          <div className="space-y-4">
            {EXPERIENCE.map((job) => (
              <article key={job.company} className="reveal pixel-panel p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-[0.78rem] text-ink">
                    {job.company}
                  </h3>
                  <span className="border border-edge px-2 py-1 text-[11px] text-inkmute">
                    {job.period}
                  </span>
                </div>
                <p className="mt-2 text-xs text-magenta">
                  {job.role} - {job.location}
                </p>
                <ul className="mt-4 space-y-2">
                  {job.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-sm leading-relaxed text-inksoft"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-magenta" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* ========================== PROJECTS ========================= */}
        <Section id="projects">
          <SectionHead
            index="03"
            kicker="Projects"
            title="Things I built and shipped"
            blurb="Live products, automation pipelines, and a puzzle game that lets you bet on yourself."
            accent="text-amber"
          />
          {/* items-start: one card carries a screenshot, so equal-height rows
              would leave a large dead gap beside it. */}
          <div className="grid items-start gap-4 md:grid-cols-2">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        </Section>

        {/* ========================= HIGH SCORES ======================= */}
        <Section id="scores">
          <SectionHead
            index="04"
            kicker="High Scores"
            title="Hackathon leaderboard"
            blurb="Podium finishes and rankings from ML and AI-focused competitions."
            accent="text-amber"
          />
          <div className="reveal pixel-panel overflow-hidden">
            {/* Header columns mirror the row layout below so labels sit above
                the data they describe. */}
            <div className="hidden items-center gap-5 border-b border-edge bg-abyss/60 px-5 py-3 sm:flex">
              <span className="label w-24 shrink-0 text-amber">Rank</span>
              <span className="label flex-1 text-inkmute">Event</span>
              <span className="label text-inkmute">#</span>
            </div>
            <ul>
              {HIGH_SCORES.map((s, i) => (
                <li
                  key={s.event}
                  className="flex flex-col gap-1 border-b border-edge/50 px-5 py-4 transition-colors last:border-b-0 hover:bg-panel2/60 sm:flex-row sm:items-center sm:gap-5"
                >
                  <span
                    className="font-display text-[0.7rem] sm:w-24 sm:shrink-0"
                    style={{ color: s.accent }}
                  >
                    {s.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">{s.event}</p>
                    <p className="text-[11px] text-inkmute">{s.detail}</p>
                  </div>
                  <span className="hidden font-display text-[0.55rem] text-inkmute sm:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Leadership sits with the achievements rather than in its own
              section — it is the same kind of signal. */}
          <div className="reveal mt-10 mb-3 flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 border border-violet" />
            <span className="label text-violet">Leadership</span>
            <span className="h-px flex-1 bg-gradient-to-r from-violet/30 to-transparent" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {LEADERSHIP.map((l) => (
              <article key={l.org} className="reveal pixel-panel p-5">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0"
                    style={{ background: l.accent }}
                  />
                  <h3
                    className="font-display text-[0.62rem]"
                    style={{ color: l.accent }}
                  >
                    {l.role}
                  </h3>
                </div>
                <p className="mt-2 text-xs text-ink">{l.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-inksoft">
                  {l.detail}
                </p>
              </article>
            ))}
          </div>
        </Section>

        {/* ========================== RESEARCH ========================= */}
        {RESEARCH.length > 0 && (
          <Section id="research">
            <SectionHead
              index="05"
              kicker="Research"
              title="Published work"
              blurb="Peer-reviewed and preprint work in applied AI and data systems."
              accent="text-lime"
            />
            <div className="space-y-4">
              {RESEARCH.map((paper) => (
                <article key={paper.title} className="reveal pixel-panel p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span
                      className={`border px-2 py-1 font-display text-[0.45rem] tracking-widest ${
                        PAPER_STATUS[paper.status]
                      }`}
                    >
                      {paper.status}
                    </span>
                    {paper.featured && (
                      <span className="border border-amber px-2 py-1 font-display text-[0.45rem] tracking-widest text-amber">
                        FEATURED
                      </span>
                    )}
                    <span className="text-[11px] text-inkmute">
                      {[paper.venue, paper.year].filter(Boolean).join(" · ")}
                    </span>
                  </div>

                  <h3 className="font-display text-[0.8rem] leading-relaxed text-ink">
                    {paper.title}
                  </h3>

                  {paper.authors && (
                    <p className="mt-2 text-xs text-lime">{paper.authors}</p>
                  )}

                  {paper.abstract && (
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-inksoft">
                      {paper.abstract}
                    </p>
                  )}

                  {paper.links.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-4 border-t border-edge/60 pt-4">
                      {paper.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-lime underline-offset-4 hover:underline"
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 border-t border-edge/60 pt-4">
                      <span className="text-[11px] text-inkmute">
                        Link coming soon
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* ========================== LOADOUT ========================== */}
        <Section id="loadout">
          <SectionHead
            index="06"
            kicker="Loadout"
            title="Equipped tech stack"
            accent="text-violet"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {LOADOUT.map((slot) => (
              <div key={slot.slot} className="reveal pixel-panel p-5">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5"
                    style={{ background: slot.accent }}
                  />
                  <h3 className="label" style={{ color: slot.accent }}>
                    {slot.slot}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {slot.items.map((item) => (
                    <span
                      key={item}
                      className="border border-edge bg-void/40 px-2.5 py-1.5 text-[11px] text-inksoft transition-colors hover:border-edgehot hover:text-ink"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* =========================== PLAYER ========================== */}
        <Section id="player">
          <SectionHead
            index="07"
            kicker="Player Profile"
            title="Outside the terminal"
            blurb="Pick an object to inspect it. The models are generated from pure math, not asset files."
          />
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="reveal h-[300px] w-full lg:h-[420px]">
              <VoxelScene
                activeKey={playerKey}
                scrollDolly={false}
                distance={44}
                className="pixel-canvas h-full w-full"
              />
            </div>
            <div className="reveal space-y-3">
              {ORDER.map((key) => {
                const meta = MODEL_META[key];
                const on = key === playerKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPlayerKey(key)}
                    aria-pressed={on}
                    className={`block w-full border p-4 text-left transition-all ${
                      on
                        ? "border-edgehot bg-panel2/80"
                        : "border-edge/60 bg-panel/40 hover:border-edgehot"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 shrink-0"
                        style={{
                          background: on ? meta.accent : "transparent",
                          border: `1px solid ${meta.accent}`,
                        }}
                      />
                      <span
                        className="font-display text-[0.68rem]"
                        style={{ color: on ? meta.accent : undefined }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p
                      className={`mt-2 pl-6 text-sm leading-relaxed transition-colors ${
                        on ? "text-inksoft" : "text-inkmute"
                      }`}
                    >
                      {meta.blurb}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ========================== CONTACT ========================== */}
        <Section id="contact">
          <SectionHead
            index="08"
            kicker="Contact"
            title="Insert coin to continue"
            accent="text-magenta"
          />

          <div className="reveal pixel-panel p-8 text-center md:p-12">
            <p className="label mb-6 text-inkmute">Open to</p>
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {OPEN_TO.map((r) => (
                <span
                  key={r}
                  className="border border-violet/40 px-3 py-1.5 text-[11px] text-violet"
                >
                  {r}
                </span>
              ))}
            </div>

            <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-inksoft">
              Hiring for software or applied AI roles? I&apos;d love to talk.
            </p>

            <a
              href={`mailto:${PROFILE.email}`}
              className="font-display text-[0.68rem] text-cyan glow-cyan hover:underline md:text-[0.85rem]"
            >
              {PROFILE.email}
            </a>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn text-inksoft hover:text-cyan"
              >
                LinkedIn
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn text-inksoft hover:text-cyan"
              >
                GitHub
              </a>
              <a
                href={`tel:${PROFILE.phone.replace(/[^\d+]/g, "")}`}
                className="pixel-btn text-inksoft hover:text-cyan"
              >
                {PROFILE.phone}
              </a>
            </div>
          </div>
        </Section>

        <footer className="py-10 text-center">
          <p className="label text-inkmute">
            Built by Shivam Sheth - {PROFILE.location}
          </p>
          <p className="mt-3 text-[11px] text-inkmute/70">
            Next.js - React Three Fiber - procedural voxels
          </p>
        </footer>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Now card                                                            */
/* ------------------------------------------------------------------ */

function NowCard({ item }: { item: (typeof ACTIVE_ROLES)[number] }) {
  const a = ACCENT_MAP[item.accent];
  return (
    <article
      className={`reveal pixel-panel p-6 ${
        item.live ? `panel-live ${a.border}` : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center border ${a.border} font-display text-[0.55rem] ${a.text}`}
        >
          {item.badge}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className={`font-display text-[0.72rem] ${a.text}`}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.org} ↗
                </a>
              ) : (
                item.org
              )}
            </h3>
            <div className="flex items-center gap-2">
              {item.live && (
                <span className="flex items-center gap-1.5 border border-lime/50 bg-lime/10 px-2 py-0.5 font-display text-[0.4rem] tracking-widest text-lime">
                  <span className="pulse-dot h-1.5 w-1.5 bg-lime text-lime" />
                  ACTIVE
                </span>
              )}
              <span className="text-[11px] text-inkmute">{item.period}</span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-ink">{item.role}</p>
          <p className="text-[11px] text-inkmute">{item.meta}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink">{item.body}</p>

      <ul className="mt-3 space-y-2">
        {item.bullets.map((b) => (
          <li
            key={b}
            className="flex gap-3 text-[13px] leading-relaxed text-inksoft"
          >
            <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 ${a.bg}`} />
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Project card                                                        */
/* ------------------------------------------------------------------ */

const STATUS_STYLE: Record<Project["status"], string> = {
  NEW: "border-magenta text-magenta",
  LIVE: "border-cyan text-cyan",
  SHIPPED: "border-inkmute text-inkmute",
};

const PAPER_STATUS: Record<Paper["status"], string> = {
  PUBLISHED: "border-lime text-lime",
  PREPRINT: "border-amber text-amber",
  "IN REVIEW": "border-inkmute text-inkmute",
};

/**
 * Preview pane: shows a screenshot by default and swaps to a live iframe of the
 * real site on demand. Lazy — the iframe is only mounted once requested, so the
 * page never loads four third-party sites up front.
 */
function ProjectPreview({ p }: { p: Project }) {
  const [live, setLive] = useState(false);
  if (!p.image && !p.demo) return null;

  return (
    <div className="relative mb-4 aspect-16/10 w-full overflow-hidden border border-edge bg-void">
      {live && p.demo ? (
        <iframe
          src={p.demo}
          title={`${p.name} live demo`}
          loading="lazy"
          className="h-full w-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
        />
      ) : p.image ? (
        <Image
          src={p.image}
          alt={`${p.name} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="label text-inkmute">Preview pending</span>
        </div>
      )}

      {p.demo && (
        <button
          type="button"
          onClick={() => setLive((v) => !v)}
          className="absolute bottom-2 right-2 z-10 border border-edgehot bg-void/90 px-2.5 py-1.5 font-display text-[0.45rem] tracking-widest text-cyan backdrop-blur-sm transition-colors hover:bg-void hover:text-ink"
        >
          {live ? "◼ Show preview" : "▶ Run it live"}
        </button>
      )}
    </div>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article
      className={`reveal pixel-panel group flex flex-col p-6 ${
        p.featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3
          className={`font-display leading-snug ${
            p.featured ? "text-[1rem]" : "text-[0.8rem]"
          }`}
          style={{ color: p.accent }}
        >
          {p.name}
        </h3>
        <span
          className={`shrink-0 border px-2 py-1 font-display text-[0.45rem] tracking-widest ${
            STATUS_STYLE[p.status]
          }`}
        >
          {p.status}
        </span>
      </div>

      <ProjectPreview p={p} />

      <p className="text-[11px] text-inkmute">{p.stack}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink">{p.summary}</p>

      <ul className="mt-4 flex-1 space-y-2">
        {p.bullets.map((b) => (
          <li
            key={b}
            className="flex gap-3 text-[13px] leading-relaxed text-inksoft"
          >
            <span
              className="mt-[7px] h-1.5 w-1.5 shrink-0"
              style={{ background: p.accent }}
            />
            {b}
          </li>
        ))}
      </ul>

      {p.links.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-edge/60 pt-4">
          {p.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-inksoft underline-offset-4 hover:underline"
              style={{ color: p.accent }}
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-5 border-t border-edge/60 pt-4">
          <span className="text-[11px] text-inkmute">Link coming soon</span>
        </div>
      )}
    </article>
  );
}
