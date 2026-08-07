"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { SERVICES } from "@/lib/content";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./Services.module.css";
import { ButtonLink } from "./Button";

/**
 * Pinned horizontal pan.
 *
 * While the sticky child fills the viewport, vertical scroll is remapped
 * onto the card row's X. The mapping is direct — an earlier version put a
 * spring in the middle, which is exactly what made scrolling feel like it
 * was dragging something heavy behind it. The pan now tracks the wheel 1:1.
 *
 * Below 62rem there is no pin at all: the row is a normal swipeable
 * scroller, which is what a thumb expects.
 */
export default function Services({ id = "services" }: { id?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();

  const [distance, setDistance] = useState(0);
  const [canPin, setCanPin] = useState(false);

  const measure = useCallback(() => {
    const pin = window.matchMedia("(min-width: 62rem)").matches;
    setCanPin(pin);
    if (!row.current || !viewport.current) return;
    setDistance(
      Math.max(0, row.current.scrollWidth - viewport.current.clientWidth)
    );
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (row.current) ro.observe(row.current);
    if (viewport.current) ro.observe(viewport.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // canPin swaps which DOM node the refs point at, so re-observe after it
    // flips — otherwise the observer is still watching a detached element.
  }, [measure, canPin]);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  const pinned = canPin && !still && distance > 0;

  const header = (
    <div className={`shell ${s.head}`}>
      <div className={s.headMain}>
        <Reveal as="p" className="eyebrow eyebrow-light">
          How can we serve you?
        </Reveal>
        <SplitText
          as="h2"
          className={`display ${s.title}`}
          text="Three ways to bring the cart."
        />
      </div>
      <Reveal className={s.headMeta} delay={0.08}>
        <p>
          Every booking is quoted custom. Tell us the date, the headcount and
          the vibe — we&rsquo;ll handle the rest.
        </p>
        <ButtonLink href="/booking" variant="light">
          Get a quote
        </ButtonLink>
      </Reveal>
    </div>
  );

  const cards = SERVICES.map((service, i) => (
    <Card key={service.id} service={service} index={i} />
  ));

  if (!pinned) {
    return (
      <section className={s.section} id={id}>
        <div className={s.static}>
          {header}
          {/* Native horizontal scroll with snap — no JS in the scroll path. */}
          <div className={s.scroller}>
            <div className={s.rowStatic}>{cards}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={s.section} id={id}>
      <div
        className={s.track}
        ref={track}
        // Pin length scales with how far the row actually has to travel, so
        // the section is never taller than the motion it contains.
        style={{ height: `calc(100svh + ${distance}px)` }}
      >
        <div className={s.sticky}>
          {header}
          <div className={s.viewport} ref={viewport}>
            <motion.div className={s.row} ref={row} style={{ x }}>
              {cards}
            </motion.div>
          </div>
          <div className={`shell ${s.foot}`}>
            <span className={s.footHint}>Keep scrolling</span>
            <div className={s.progress}>
              <motion.div
                className={s.progressFill}
                style={{ scaleX: scrollYProgress }}
              />
            </div>
            <span className={s.footHint}>0{SERVICES.length} services</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* A measuring copy of the row has to exist even before we pin, so the
   ResizeObserver has something to read. It lives in the static branch. */

function Card({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  return (
    <article className={s.card}>
      <div className={s.cardMedia}>
        <Image
          src={service.image}
          alt={service.lead}
          fill
          sizes="(max-width: 62rem) 78vw, 30rem"
          quality={78}
          loading={index === 0 ? undefined : "lazy"}
        />
      </div>
      <div className={s.cardScrim} />
      <div className={s.cardBody}>
        <span className={s.cardIndex}>0{index + 1}</span>
        <h3 className={s.cardTitle}>{service.title}</h3>
        <p className={s.cardLead}>{service.lead}</p>
        <p className={s.cardText}>{service.body}</p>
        <ul className={s.tags}>
          {service.tags.map((tag) => (
            <li className={s.tag} key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
