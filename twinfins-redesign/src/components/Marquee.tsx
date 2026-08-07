"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";

import { Monogram } from "./BrandMarks";
import s from "./Marquee.module.css";

/**
 * Pure-CSS ticker. The first pass coupled this to scroll velocity via a rAF
 * loop, which meant every scroll frame wrote a transform from JS — that plus
 * the pinned section is what made scrolling feel heavy. A CSS animation runs
 * on the compositor and costs the scroll thread nothing.
 *
 * The pointer adds one playful layer on top: the further it sits toward the
 * band's left or right edge, the faster the ticker rolls. That's done by
 * nudging the CSS animation's `playbackRate` through the Web Animations API
 * — a control-knob write, not a per-frame transform, so the animation itself
 * stays on the compositor.
 */
export default function Marquee({
  items,
  duration = 48,
  reverse = false,
  variant = "navy",
}: {
  items: readonly string[];
  /** Seconds for one full cycle. Higher = slower. */
  duration?: number;
  reverse?: boolean;
  variant?: "navy" | "sand" | "sea";
}) {
  const still = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  const setRate = (rate: number) => {
    const anim = track.current
      ?.getAnimations()
      .find((a) => a instanceof CSSAnimation);
    if (anim) anim.playbackRate = rate;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (still || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    // 0 at the band's centre, 1 at either edge. Squared so the middle half
    // barely changes and the acceleration lives out at the edges.
    const t = Math.min(1, Math.abs(e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    setRate(1 + 3 * t * t);
  };

  const group = (
    <span className={s.group}>
      {items.map((item) => (
        <span className={s.item} key={item}>
          <Monogram className={s.mark} />
          {item}
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={`${s.band} ${s[variant]}`}
      role="presentation"
      data-still={still || undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setRate(1)}
    >
      <div
        className={s.track}
        ref={track}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {/* Two identical groups; the track slides exactly one group width. */}
        {group}
        {group}
      </div>
    </div>
  );
}
