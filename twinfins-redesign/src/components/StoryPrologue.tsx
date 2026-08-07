"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { FOUNDER, STORY_FACTS } from "@/lib/content";
import { Surfboard } from "./Doodles";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./StoryPrologue.module.css";

/**
 * The opening beat of /story: one large statement, the founder in her own
 * words, and the four numbers that anchor everything the timeline unpacks.
 */
export default function StoryPrologue() {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const inlayY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section className={s.section} ref={ref} aria-labelledby="prologue-title">
      <div className={`shell ${s.inner}`}>
        <Reveal as="p" className={`eyebrow ${s.eyebrow}`}>
          Chapter zero
        </Reveal>

        <SplitText
          as="h2"
          className={`display ${s.statement}`}
          text="Twin Fins started the way most good things do — a job that stopped, a beach that didn’t, and one stubborn idea about mornings."
          stagger={0.035}
        />

        <div className={s.split}>
          <div className={s.mediaCol}>
            <motion.figure
              className={s.portrait}
              initial={still ? undefined : { clipPath: "inset(0 0 100% 0 round 2.25rem)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0 round 2.25rem)" }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                style={
                  still
                    ? { height: "100%" }
                    : { y: portraitY, height: "114%", marginTop: "-7%" }
                }
              >
                <Image
                  src="/images/natalia.webp"
                  alt="Natalia Tureta in a Twin Fins Surf Club trucker hat, holding a finished latte at the cart"
                  width={600}
                  height={800}
                  sizes="(max-width: 62rem) 88vw, 40vw"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </motion.div>

              <figcaption className={s.caption}>
                <span className={s.captionName}>{FOUNDER.name}</span>
                <span className={s.captionRole}>{FOUNDER.role}</span>
              </figcaption>

              <span className={s.seal} aria-hidden="true">
                <svg className={s.sealRing} viewBox="0 0 100 100">
                  <defs>
                    <path
                      id="prologue-seal"
                      d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0"
                    />
                  </defs>
                  <text>
                    <textPath href="#prologue-seal" startOffset="0%">
                      Coffee + Surf · 2024
                    </textPath>
                  </text>
                </svg>
                <span className={s.sealCore}>
                  <Surfboard />
                </span>
              </span>
            </motion.figure>

            <motion.div
              className={s.inlay}
              initial={still ? undefined : { opacity: 0, y: 40, rotate: 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 3 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                style={
                  still
                    ? { height: "100%" }
                    : { y: inlayY, height: "122%", marginTop: "-11%" }
                }
              >
                <Image
                  src="/images/tote-street.jpg"
                  alt="Natalia carrying the Twin Fins Coffee canvas tote down a brick side street"
                  width={800}
                  height={1100}
                  sizes="(max-width: 62rem) 38vw, 20vw"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </motion.div>
            </motion.div>
          </div>

          <div className={s.copyCol}>
            <h2 id="prologue-title" className="sr-only">
              How Twin Fins Coffee began
            </h2>

            <Reveal as="p" className={s.lead}>
              <span className={s.drop} aria-hidden="true">
                N
              </span>
              atalia Tureta was a production assistant on Atlanta film sets
              until the strike went long and the calls stopped coming. She
              spent the quiet months behind an espresso bar instead, and by the
              time the industry restarted she had a different question in her
              head: what would it take to build the coffee cart everyone on set
              actually looks forward to?
            </Reveal>

            <Reveal as="p" className={s.body} delay={0.06}>
              A trip to the beach answered the other half of it. The cart would
              be a twin fin — loose, warm, built for cruising rather than
              conquering — a little piece of a coastal morning wheeled into
              whatever room needed one. In April 2024 she asked for help
              building it. Thirty-two people said yes.
            </Reveal>

            <Reveal className={s.quoteWrap} delay={0.12}>
              <blockquote className={s.quote}>
                <p>&ldquo;{FOUNDER.quote}&rdquo;</p>
                <cite>
                  {FOUNDER.name} <span>— launching the cart, April 2024</span>
                </cite>
              </blockquote>
            </Reveal>

            <Reveal className={s.facts} delay={0.18}>
              {STORY_FACTS.map((fact) => (
                <div key={fact.label} className={s.fact}>
                  <span className={s.factValue}>{fact.value}</span>
                  <span className={s.factLabel}>{fact.label}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
