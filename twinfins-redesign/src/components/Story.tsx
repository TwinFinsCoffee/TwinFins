"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Monogram } from "./BrandMarks";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./Story.module.css";
import { ButtonLink } from "./Button";

const STATS = [
  { value: "2024", label: "Established" },
  { value: "100%", label: "Mobile" },
  { value: "1%", label: "Back to the ocean" },
];

export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The frames stay put; the photographs drift inside them. Cheap parallax,
  // and it reads more like a camera move than a page scroll.
  const bigY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const smallY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section className={s.section} ref={ref} id="story">
      <div className={`shell ${s.grid}`}>
        <div className={s.mediaCol}>
          <Reveal className={s.frame}>
            <motion.div
              className={s.frameInner}
              style={still ? { inset: 0 } : { y: bigY }}
            >
              <Image
                src="/images/cart-street.jpg"
                alt="The Twin Fins cart parked on a shaded street beneath a fringed umbrella, a longboard leaning against it"
                fill
                sizes="(max-width: 62rem) 92vw, 45vw"
                quality={80}
              />
            </motion.div>

            <span className={s.seal} aria-hidden="true">
              <svg className={s.sealRing} viewBox="0 0 100 100">
                <defs>
                  <path
                    id="seal-path"
                    d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0"
                  />
                </defs>
                <text>
                  <textPath href="#seal-path" startOffset="0%">
                    Twin Fins · Est 2024
                  </textPath>
                </text>
              </svg>
              <span className={s.sealCore}>
                <Monogram />
              </span>
            </span>
          </Reveal>

          <Reveal className={s.frameSmall} delay={0.15}>
            <motion.div
              style={
                still
                  ? { height: "100%" }
                  : { y: smallY, height: "118%", marginTop: "-9%" }
              }
            >
              <Image
                src="/images/lineup.jpg"
                alt="Surfers waiting in the lineup on glassy green water"
                width={900}
                height={1200}
                sizes="(max-width: 62rem) 40vw, 22vw"
                quality={76}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          </Reveal>
        </div>

        <div className={s.copy}>
          <Reveal as="p" className="eyebrow">
            About Twin Fins
          </Reveal>
          <SplitText
            as="h2"
            className={`display ${s.title}`}
            text="Born from saltwater and good coffee."
          />

          <Reveal as="p" className={s.body} delay={0.06}>
            We&rsquo;re a mobile coffee cart built around one idea: the feeling
            you get paddling out at first light belongs in a cup. Freshly ground
            beans, top-tier equipment, and a crew that actually surfs.
          </Reveal>

          <Reveal as="p" className={s.pull} delay={0.1}>
            Each sip is like a day at the beach.
          </Reveal>

          <Reveal as="p" className={s.body} delay={0.14}>
            We use eco-friendly products, work with local suppliers to keep our
            footprint small, and donate a percentage of every sale to charities
            that support marine wildlife.
          </Reveal>

          <Reveal delay={0.18}>
            <ButtonLink href="/booking" variant="outline">
              Bring us to your event
            </ButtonLink>
          </Reveal>

          <Reveal className={s.stats} delay={0.22}>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <span className={s.statValue}>{stat.value}</span>
                <span className={s.statLabel}>{stat.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
