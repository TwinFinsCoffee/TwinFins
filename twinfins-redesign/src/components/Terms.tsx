"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { BOOKING_TERMS, BRAND } from "@/lib/content";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./Terms.module.css";
import { ButtonLink } from "./Button";

/**
 * The original site dumped the booking agreement as one wall of text.
 * Same terms, verbatim — just made scannable, with the first one open so
 * it never reads as hidden fine print.
 */
export default function Terms() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={s.section} id="agreement">
      <div className="shell">
        <div className={s.head}>
          <Reveal as="p" className="eyebrow">
            Booking agreement
          </Reveal>
          <SplitText
            as="h2"
            className={`display ${s.title}`}
            text="Read this before you book."
          />
          <Reveal as="p" className="lede" delay={0.08}>
            All parties are required to follow each agreement in order to book a
            Twin Fins Coffee cart.
          </Reveal>
        </div>

        <ul className={s.list}>
          {BOOKING_TERMS.map((term, i) => {
            const expanded = open === i;
            return (
              <Reveal as="li" key={term.title} className={s.item} delay={i * 0.05}>
                <button
                  type="button"
                  className={s.row}
                  aria-expanded={expanded}
                  aria-controls={`term-${i}`}
                  onClick={() => setOpen(expanded ? null : i)}
                >
                  <span className={s.num}>0{i + 1}</span>
                  <span className={s.rowTitle}>{term.title}</span>
                  <span className={s.plus} aria-hidden="true" />
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={`term-${i}`}
                      className={s.panel}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className={s.panelInner}>{term.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className={s.note}>
          <span>
            For any questions or concerns, email us — we answer every one.
          </span>
          <ButtonLink href={`mailto:${BRAND.email}`} variant="outline">
            {BRAND.email}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
