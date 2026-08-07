"use client";

import { useReducedMotion } from "motion/react";

import { Reveal, SplitText } from "./motion-primitives";
import { ButtonLink } from "./Button";
import s from "./PourBand.module.css";

/**
 * A band of the espresso pour, animated as stop-motion.
 *
 * The loop is built from a burst of frames off the brand's own shoot,
 * encoded forward-then-reversed so it cycles with no seam. It sits behind
 * the copy as texture — the whole point is the hand-made, shot-on-the-cart
 * feeling, which a smooth video would flatten out.
 */
const SPECS = [
  { label: "Ground", value: "Fresh, to order" },
  { label: "Milk", value: "Dairy + oat, always" },
  { label: "Matcha", value: "Whisked at the bar" },
  { label: "Syrups", value: "Rotating seasonals" },
];

export default function PourBand() {
  const still = useReducedMotion();

  return (
    <section className={s.band} aria-labelledby="pour-title">
      <div className={s.media}>
        {still ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/video/pour-loop-poster.jpg" alt="" />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/video/pour-loop-poster.jpg"
          >
            <source src="/video/pour-loop.webm" type="video/webm" />
            <source src="/video/pour-loop.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div className={s.scrim} />

      <div className="shell">
        <div className={s.inner}>
          <Reveal as="p" className="eyebrow eyebrow-light">
            In the cup
          </Reveal>
          <SplitText
            as="h2"
            className={`display ${s.title}`}
            text="Bold, flavorful, every single time."
          />
          <Reveal as="p" className={s.body} delay={0.06}>
            Top-tier equipment, beans ground to order, and a crew that
            actually cares what lands in your hand. No burnt shots, no matter
            how long the line gets.
          </Reveal>

          <Reveal className={s.specs} delay={0.1}>
            {SPECS.map((spec) => (
              <div className={s.spec} key={spec.label}>
                <span className={s.specLabel}>{spec.label}</span>
                <span className={s.specValue}>{spec.value}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.14}>
            <ButtonLink href="/menu" variant="light">
              See the full menu
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
