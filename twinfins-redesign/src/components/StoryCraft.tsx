"use client";

import { useEffect, useRef, useState } from "react";

import { CRAFT_SPECS } from "@/lib/content";
import {
  Beans,
  Earth,
  MilkCarton,
  Portafilter,
  TapCard,
  Turtle,
  Whisk,
} from "./Doodles";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./StoryCraft.module.css";

/** The give-back band's rotating reef footage, ~12s a clip. */
const MARINE_CLIPS = [
  "/videos/marine/turtle.mp4",
  "/videos/marine/fish.mp4",
  "/videos/marine/rays.mp4",
];

const CLIP_SECONDS = 11;

/** One hand-drawn mark per spec, keyed by the content ids — each with a
    colour that says what it is: crema caramel, roast brown, milk white,
    matcha green, card-reader teal, sea turtle. */
const SPEC_ICONS = {
  espresso: { Icon: Portafilter, color: "#d9a05b" },
  beans: { Icon: Beans, color: "#a9714b" },
  milk: { Icon: MilkCarton, color: "#f2ede1" },
  matcha: { Icon: Whisk, color: "#8fbc6f" },
  payment: { Icon: TapCard, color: "#6fb3c6" },
  giveback: { Icon: Turtle, color: "#4fae8d" },
} as const;

/**
 * The spec sheet. Everything the timeline mentions in passing — the machine,
 * the roaster, the give-back — laid out as a bar you could actually audit.
 *
 * Structure is deliberately linear: intro, then a self-sizing card grid,
 * then one wide closing band. The earlier side-by-side arrangement had the
 * photograph and the spec list fighting for the same row, and the photo won.
 */
export default function StoryCraft() {
  return (
    <section className={s.section} aria-labelledby="craft-title">
      {/* The bar at work, behind everything: espresso pulling in slow
          motion under a dark wash, so the specs read like chalk on the
          machine rather than cards on a page. */}
      <CraftBackdrop />
      <div className={`shell ${s.inner}`}>
        <div className={s.head}>
          <Reveal as="p" className="eyebrow">
            What&rsquo;s on the cart
          </Reveal>
          <SplitText
            as="h2"
            className={`display ${s.title}`}
            text="No shortcuts, just a smaller bar."
          />
          <Reveal as="p" className={s.lede} delay={0.08}>
            Mobile doesn&rsquo;t mean makeshift. The cart runs the same gear and
            the same standards a good café would, in a footprint that fits
            through a service door.
          </Reveal>
          <h2 id="craft-title" className="sr-only">
            Twin Fins Coffee equipment and sourcing
          </h2>
        </div>

        <dl className={s.specs}>
          {CRAFT_SPECS.map((spec, i) => {
            const entry = SPEC_ICONS[spec.id as keyof typeof SPEC_ICONS];
            return (
              <Reveal
                key={spec.id}
                className={s.spec}
                delay={0.04 * i}
                style={{ "--accent": entry?.color } as React.CSSProperties}
              >
                {entry && <entry.Icon className={s.specIcon} aria-hidden="true" />}
                <dt className={s.specLabel}>{spec.label}</dt>
                <dd>
                  <span className={s.specValue}>{spec.value}</span>
                  <span className={s.specNote}>{spec.note}</span>
                </dd>
              </Reveal>
            );
          })}
        </dl>

        <Reveal className={s.band}>
          <MarineFootage />
          <span className={s.bandScrim} aria-hidden="true" />
          <div className={s.bandCopy}>
            <span className={s.bandKicker}>
              <Earth className={s.bandEarth} aria-hidden="true" />
              Good for you, and the planet.
            </span>
            <p>
              A percentage of every sale goes to charities protecting marine
              wildlife — the beach gave us the idea, so it gets a share.
            </p>
            <span className={s.bandCredit}>Since day one of service</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The reef, live. Three muted clips rotate on a slow cycle with a long
 * crossfade — only the visible one plays, the others sit paused so three
 * videos never decode at once.
 */
function MarineFootage() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);

  /* No rotation and no playback while the band is offscreen — three videos
     decoding under a section nobody is looking at is pure battery drain. */
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(
      () => setActive((v) => (v + 1) % MARINE_CLIPS.length),
      CLIP_SECONDS * 1000,
    );
    return () => clearInterval(id);
  }, [inView]);

  return (
    <span className={s.footage} aria-hidden="true" ref={wrap}>
      {MARINE_CLIPS.map((src, i) => (
        <video
          key={src}
          className={s.clip}
          data-active={i === active}
          src={src}
          muted
          loop
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          ref={(el) => {
            if (!el) return;
            if (inView && i === active) void el.play().catch(() => {});
            else el.pause();
          }}
        />
      ))}
    </span>
  );
}

/** The espresso clip under the section, IO-gated like the reef band. */
function CraftBackdrop() {
  const wrap = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const video = clip.current;
    if (!el || !video || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.backdrop} aria-hidden="true" ref={wrap}>
      <video
        ref={clip}
        className={s.backdropClip}
        src="/videos/craft/espresso.mp4"
        muted
        loop
        playsInline
        preload="metadata"
      />
      <span className={s.backdropVeil} />
    </div>
  );
}
