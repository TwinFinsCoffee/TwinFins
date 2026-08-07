"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";

/**
 * Shared motion vocabulary.
 *
 * Hard rule in here: animate `transform` and `opacity` only. Animated
 * `filter: blur()` is what made the first pass stutter — the compositor has
 * to re-rasterise every frame instead of just re-compositing a layer.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ Reveal */

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header" | "p" | "figure";
  style?: React.CSSProperties;
}) {
  const still = useReducedMotion();
  const Tag = motion[as];

  if (still) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      variants={revealVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------- SplitText */

/**
 * Word-by-word mask reveal. Each word rides up out of a clipped line box —
 * the effect display type needs, at a cost of one transform per word.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const still = useReducedMotion();
  // Once the reveal has played, the masks have done their job — drop the
  // clipping entirely so no descender or swash is ever sheared at rest.
  const [done, setDone] = useState(false);

  if (still) return <Tag className={className}>{text}</Tag>;

  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        onAnimationComplete={(definition) => {
          if (definition === "shown") setDone(true);
        }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={done ? "word-mask word-mask-done" : "word-mask"}
          >
            <motion.span
              className="word-inner"
              variants={{
                hidden: { y: "155%" },
                shown: { y: "0%", transition: { duration: 0.8, ease: EASE } },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* --------------------------------------------------------------- Magnetic */

/**
 * Pulls its child toward the pointer. Reserved for primary CTAs — the extra
 * weight is a signal, so it stops meaning anything if everything has it.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const still = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.35 });

  if (still) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
