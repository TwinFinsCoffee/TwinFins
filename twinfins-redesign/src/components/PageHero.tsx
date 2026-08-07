"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { SplitText } from "./motion-primitives";
import s from "./PageHero.module.css";

export default function PageHero({
  title,
  lede,
  image,
  imageAlt = "",
  crumb,
  /** CSS object-position. These are tall shots in a wide band, so the crop
   *  has to be aimed deliberately or it lands on whatever was mid-frame. */
  focal = "50% 50%",
  waveColor = "var(--cream)",
}: {
  title: string;
  lede: string;
  image: string;
  imageAlt?: string;
  crumb: string;
  focal?: string;
  waveColor?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);


  return (
    <section className={s.hero} ref={ref}>
      <motion.div
        className={s.bg}
        style={
          {
            ...(still ? {} : { y }),
            "--focal": focal,
          } as React.CSSProperties
        }
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={80}
        />
      </motion.div>
      <div className={s.scrim} />

      <motion.div
        className={`shell ${s.inner}`}
        style={still ? undefined : { y: copyY, opacity: fade }}
      >
        <p className={s.crumb}>
          <Link href="/">Twin Fins</Link>
          <span aria-hidden="true">/</span>
          <span>{crumb}</span>
        </p>

        {/* Uses the shared SplitText rather than a local copy of the mask
            markup. The local copy carried its own padding value and sheared
            the descenders off words like "by" — one implementation, one fix. */}
        <SplitText
          as="h1"
          className={`display ${s.title}`}
          text={title}
          delay={0.15}
          stagger={0.07}
        />

        <motion.p
          className={s.lede}
          initial={still ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
        >
          {lede}
        </motion.p>
      </motion.div>

      {/* The drift is a CSS animation, not a motion loop: an infinite
          JS-driven tween writes a transform from the main thread every
          frame forever, so any entrance work makes the shoreline stutter.
          The CSS version runs on the compositor and costs the page
          nothing. (The global reduced-motion rule zeroes it.) */}
      <svg
        className={s.waves}
        viewBox="0 0 2880 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 62c160-30 320 18 480 8s320-36 480-16 320 30 480 8v38H0Zm1440 0c160-30 320 18 480 8s320-36 480-16 320 30 480 8v38H1440Z"
          fill={waveColor}
        />
      </svg>
    </section>
  );
}
