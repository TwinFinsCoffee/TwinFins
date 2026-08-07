"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { BRAND } from "@/lib/content";
import { Wordmark } from "./BrandMarks";
import { Magnetic } from "./motion-primitives";
import s from "./Hero.module.css";
import { ButtonLink } from "./Button";

/**
 * The hero runs Twin Fins' own banner film — the surfer clip that was on the
 * original site — re-cropped below the burned-in logotype so the vector
 * lockup can sit on top of it crisply and animate.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Transform + opacity only. Two layers moving at different rates is all
  // the parallax this needs, and it composites on the GPU.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const copyFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section className={s.hero} ref={ref}>
      <motion.div className={s.media} style={still ? undefined : { y: mediaY }}>
        {still ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/video/hero-surf-poster.jpg" alt="" />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/video/hero-surf-poster.jpg"
          >
            <source src="/video/hero-surf.webm" type="video/webm" />
            <source src="/video/hero-surf.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>
      <div className={s.tone} />
      <div className={s.scrim} />

      <motion.div
        className={s.inner}
        style={still ? undefined : { y: copyY, opacity: copyFade }}
      >
        <motion.p
          className={s.eyebrow}
          initial={still ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Est. {BRAND.est} · {BRAND.tagline}
        </motion.p>

        <h1 className={s.lockupMask}>
          <span className="sr-only">
            {BRAND.name} — {BRAND.promise}
          </span>
          <motion.span
            style={{ display: "block" }}
            initial={still ? undefined : { y: "16%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Wordmark className={s.lockup} />
          </motion.span>
        </h1>

        <motion.p
          className={s.lede}
          initial={still ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          A mobile coffee cart with saltwater in its veins. We roll up to your
          wedding, market or brand launch and pour paradise, one cup at a time.
        </motion.p>

        <motion.div
          className={s.ctaRow}
          initial={still ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.62 }}
        >
          <Magnetic strength={0.24}>
            <ButtonLink href="/booking" variant="cream">
              Book the cart
            </ButtonLink>
          </Magnetic>
          <ButtonLink href="/menu" variant="light">
            See the menu
          </ButtonLink>
        </motion.div>
      </motion.div>

      <div className={s.meta}>
        <p className={s.metaItem}>
          Weddings · Brand activations · Markets · Private events
        </p>
        <motion.div
          className={s.cue}
          initial={still ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <span className={s.cueTrack} />
          Scroll
        </motion.div>
        <p className={s.metaItem} style={{ textAlign: "right" }}>
          Paradise in every sip
        </p>
      </div>

      {/* CSS drift, not a motion loop — see PageHero for the reasoning. */}
      <svg
        className={s.wave}
        viewBox="0 0 2880 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 58c160-30 320 16 480 8s320-34 480-14 320 28 480 6v42H0Zm1440 0c160-30 320 16 480 8s320-34 480-14 320 28 480 6v42H1440Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
