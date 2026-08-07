"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Surfboard } from "./Doodles";
import s from "./StoryHeader.module.css";

/* The headline lands in three beats; the last one is the point, so it's the
   one set in italic caramel. */
const TITLE: { text: string; accent?: boolean }[] = [
  { text: "A strike," },
  { text: "a beach," },
  { text: "a cart.", accent: true },
];

/**
 * Masthead for /story. One idea, told big: a centred three-beat sentence,
 * a quiet fact row, and a single cinematic strip of the cart underneath.
 * All the character lives in the type and the one rotating seal — nothing
 * else competes with the sentence.
 */
export default function StoryHeader() {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const stripY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className={s.header} ref={ref}>
      <motion.div
        className={`shell ${s.copy}`}
        style={still ? undefined : { y: copyY, opacity: fade }}
      >
        <motion.p
          className={s.crumb}
          initial={still ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Link href="/">Twin Fins</Link>
          <span aria-hidden="true">·</span>
          <span>Our story</span>
        </motion.p>

        <h1 className={`display ${s.title}`}>
          <span className="sr-only">A strike, a beach, a cart.</span>
          {TITLE.map((beat, i) => (
            <span className={s.line} key={beat.text} aria-hidden="true">
              <motion.span
                className={beat.accent ? `${s.lineInner} ${s.accent}` : s.lineInner}
                initial={still ? undefined : { y: "130%", rotate: 2 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{
                  duration: 1.05,
                  delay: 0.18 + i * 0.11,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {beat.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className={s.lede}
          initial={still ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.62 }}
        >
          A production assistant, a strike that stopped the calls, a trip to
          the beach — and the coffee cart that came out the other side.
        </motion.p>

        <motion.p
          className={s.meta}
          initial={still ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.75 }}
        >
          Founded 2024 <span aria-hidden="true">·</span> Atlanta, GA{" "}
          <span aria-hidden="true">·</span> Mobile cart
        </motion.p>
      </motion.div>

      <motion.div
        className={`shell ${s.stripWrap}`}
        initial={still ? undefined : { opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={s.strip}>
          <motion.div
            className={s.stripInner}
            style={still ? undefined : { y: stripY }}
          >
            <Image
              src="/images/cart-setup.jpg"
              alt="The full Twin Fins cart set up under a pergola, flanked by a painted surfboard sign"
              width={1800}
              height={1000}
              priority
              sizes="(max-width: 82rem) 94vw, 78rem"
            />
          </motion.div>

          <span className={s.seal} aria-hidden="true">
            <svg className={s.sealRing} viewBox="0 0 100 100">
              <defs>
                <path
                  id="story-header-seal"
                  d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0"
                />
              </defs>
              <text>
                <textPath href="#story-header-seal" startOffset="0%">
                  Our Story · Est 2024
                </textPath>
              </text>
            </svg>
            <span className={s.sealCore}>
              <Surfboard />
            </span>
          </span>
        </div>
      </motion.div>

      <svg
        className={s.waves}
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 54c160-28 320 16 480 6s320-32 480-14 320 26 480 6v38H0Z"
          fill="var(--cream)"
        />
      </svg>
    </section>
  );
}
