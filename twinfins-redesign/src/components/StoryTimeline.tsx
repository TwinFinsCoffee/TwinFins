"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { STORY_CHAPTERS } from "@/lib/content";
import {
  Coconut,
  Cup,
  Palm,
  SandDollar,
  Star,
  Sunrise,
  Surfboard,
  Wave,
} from "./Doodles";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./StoryTimeline.module.css";

const ICONS = {
  Cup,
  Sunrise,
  Surfboard,
  SandDollar,
  Palm,
  Coconut,
  Star,
  Wave,
} as const;

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve",
] as const;

/** Keeps the headline honest when a chapter is added. */
const COUNT_WORD =
  NUMBER_WORDS[STORY_CHAPTERS.length] ?? String(STORY_CHAPTERS.length);

/** Side-view camper bus, drawn facing right; the motion path steers it. */
function Bus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 30" fill="none" aria-hidden="true" {...props}>
      {/* surfboard on the roof */}
      <path
        d="M6 6.5c10-3.4 26-3.4 36 0"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* body */}
      <path
        d="M3 17.5c0-5 3-9 9-9h24c6 0 9 4 9 9v3.5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.5Z"
        fill="currentColor"
      />
      {/* split windows */}
      <rect x="8" y="11.5" width="9" height="5.5" rx="1.6" fill="var(--tl-bus-window, #2a3947)" />
      <rect x="20" y="11.5" width="9" height="5.5" rx="1.6" fill="var(--tl-bus-window, #2a3947)" />
      <rect x="32" y="11.5" width="8" height="5.5" rx="1.6" fill="var(--tl-bus-window, #2a3947)" />
      {/* wheels */}
      <circle cx="13" cy="24.5" r="4" fill="currentColor" stroke="var(--tl-bus-window, #2a3947)" strokeWidth="2" />
      <circle cx="35" cy="24.5" r="4" fill="currentColor" stroke="var(--tl-bus-window, #2a3947)" strokeWidth="2" />
    </svg>
  );
}

/** Catmull-Rom → cubic beziers: a smooth road through every waypoint. */
function roadThrough(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  const d: string[] = [`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(
      `C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`,
    );
  }
  return d.join(" ");
}

/**
 * The chapter list as a road trip. The trail is generated at runtime from
 * where the cards actually landed: a waypoint beside each card, swung toward
 * its shoulder, joined into one smooth serpentine. The bus rides the same
 * path via CSS motion-path, so it steers through the bends — nose following
 * the curve — while scroll (through a spring) sets how far along it is.
 */
export default function StoryTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const seaRef = useRef<HTMLVideoElement>(null);
  const still = useReducedMotion();
  const [trail, setTrail] = useState<{ d: string; w: number; h: number } | null>(null);
  /* Older Safari has no CSS motion path — the trail still draws, the bus
     just stays home rather than sitting frozen in the top-left corner. */
  const [canDrive, setCanDrive] = useState(false);
  useEffect(() => {
    setCanDrive(
      typeof CSS !== "undefined" &&
        CSS.supports("offset-path", 'path("M 0 0 L 10 10")'),
    );
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 55%", "end 80%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });
  const busDistance = useTransform(progress, (v) => `${(v * 100).toFixed(2)}%`);
  /* The caramel path spans the whole rail, so every pathLength write
     repaints a section-sized SVG layer. Quantized to 0.4% steps it repaints
     a few hundred times across the full trip instead of every frame. */
  const drawn = useTransform(progress, (v) => Math.round(v * 250) / 250);

  /* The backdrop only spends battery while the section is on screen. */
  useEffect(() => {
    const section = sectionRef.current;
    const sea = seaRef.current;
    if (!section || !sea || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void sea.play().catch(() => {});
        else sea.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  /* Measure the rail and lay the road: one waypoint per chapter, pulled
     toward that chapter's shoulder, plus gentle jitter so no two bends are
     identical. Re-laid whenever the list resizes (images loading, viewport
     changes) — the road always matches where the cards really are. */
  useEffect(() => {
    const rail = ref.current;
    const list = listRef.current;
    if (!rail || !list) return;

    const lay = () => {
      const railBox = rail.getBoundingClientRect();
      if (railBox.width === 0) return;
      const wide = railBox.width >= 896; /* 56rem — matches the CSS split */
      const centre = wide ? railBox.width / 2 : 20;
      const amp = wide ? Math.min(railBox.width * 0.09, 110) : 14;

      const items = Array.from(list.children) as HTMLElement[];
      const pts: { x: number; y: number }[] = [{ x: centre, y: 0 }];
      items.forEach((item, i) => {
        const side = item.dataset.side === "left" ? 1 : -1;
        /* jitter keyed to the index so the layout is stable across passes */
        const wobble = 0.72 + 0.28 * Math.abs(Math.sin(i * 2.7 + 1.3));
        const y = item.offsetTop + 40;
        pts.push({ x: centre + side * amp * wobble, y });
        /* park the chapter node right on the trail */
        item.style.setProperty("--node-x", `${(centre + side * amp * wobble).toFixed(1)}px`);
      });
      pts.push({ x: centre, y: railBox.height });

      setTrail({ d: roadThrough(pts), w: railBox.width, h: railBox.height });
    };

    lay();
    const ro = new ResizeObserver(lay);
    ro.observe(list);
    ro.observe(rail);
    return () => ro.disconnect();
  }, []);

  return (
    <section className={s.section} aria-labelledby="timeline-title" ref={sectionRef}>
      {/* The sea under the road: a portrait aerial clip stretched over the
          whole section, dimmed by a navy veil so the cards keep their
          contrast. Paused whenever the section is offscreen. */}
      <div className={s.sea} aria-hidden="true">
        <video
          ref={seaRef}
          className={s.seaClip}
          src="/videos/marine/ocean-tall.mp4"
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      <div className={s.seaVeil} aria-hidden="true" />

      <div className={`shell ${s.head}`}>
        <Reveal as="p" className={s.eyebrow}>
          The long paddle out
        </Reveal>
        <SplitText
          as="h2"
          className={`display ${s.title}`}
          text={`${COUNT_WORD} chapters, one cart.`}
        />
        <Reveal as="p" className={s.headLede} delay={0.08}>
          From a stalled film season to an Eggo Latte at a small-town Piggly
          Wiggly — the actual order of events, dates and all.
        </Reveal>
        <span id="timeline-title" className="sr-only">
          Twin Fins Coffee timeline
        </span>
      </div>

      <div className={`shell ${s.rail}`} ref={ref}>
        {trail && (
          <>
            <svg
              className={s.trail}
              viewBox={`0 0 ${trail.w} ${trail.h}`}
              width={trail.w}
              height={trail.h}
              aria-hidden="true"
            >
              {/* the untravelled road: dotted, faint */}
              <path
                d={trail.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="0.1 14"
                opacity="0.35"
              />
              {/* the travelled road draws in behind the bus */}
              {!still && (
                <motion.path
                  d={trail.d}
                  fill="none"
                  stroke="var(--caramel)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ pathLength: drawn }}
                  opacity="0.85"
                />
              )}
            </svg>

            {canDrive && (
              <motion.div
                className={s.bus}
                aria-hidden="true"
                style={{
                  offsetPath: `path("${trail.d}")`,
                  offsetDistance: still ? "100%" : busDistance,
                  offsetRotate: "auto",
                }}
              >
                <Bus className={s.busGlyph} />
              </motion.div>
            )}
          </>
        )}

        <ol className={s.list} ref={listRef}>
          {STORY_CHAPTERS.map((chapter, i) => {
            const Icon = ICONS[chapter.icon as keyof typeof ICONS] ?? Wave;
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <li key={chapter.id} className={s.item} data-side={side}>
                <motion.div
                  className={s.node}
                  aria-hidden="true"
                  initial={still ? undefined : { scale: 0.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Icon className={s.nodeIcon} />
                </motion.div>

                <motion.article
                  className={s.card}
                  initial={
                    still
                      ? undefined
                      : { opacity: 0, x: side === "left" ? -36 : 36 }
                  }
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  <header className={s.cardHead}>
                    <span className={s.marker}>{chapter.marker}</span>
                    <span className={s.kicker}>{chapter.kicker}</span>
                  </header>
                  <h3 className={`serif ${s.cardTitle}`}>{chapter.title}</h3>
                  <p className={s.cardBody}>{chapter.body}</p>

                  {"media" in chapter && chapter.media.length > 0 && (
                    <div
                      className={s.media}
                      data-count={Math.min(chapter.media.length, 3)}
                    >
                      {chapter.media.slice(0, 3).map((shot) => (
                        <Image
                          key={shot.src}
                          src={shot.src}
                          alt={shot.alt}
                          width={800}
                          height={600}
                          sizes="(max-width: 48rem) 86vw, 26rem"
                        />
                      ))}
                    </div>
                  )}
                </motion.article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
