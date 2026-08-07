"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { GALLERY, BRAND } from "@/lib/content";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./Gallery.module.css";
import { ButtonLink } from "./Button";

export default function Gallery({
  heading = "Take a look at our paradise in the making.",
  eyebrow = "Gallery",
}: {
  heading?: string;
  eyebrow?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? i : (i + delta + GALLERY.length) % GALLERY.length)),
    []
  );

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  const active = open === null ? null : GALLERY[open];

  return (
    <section className={s.section} id="gallery">
      <div className="shell">
        <div className={s.head}>
          <div>
            <Reveal as="p" className="eyebrow">
              {eyebrow}
            </Reveal>
            <SplitText as="h2" className={`display ${s.title}`} text={heading} />
          </div>
          <Reveal delay={0.1}>
            <ButtonLink href={BRAND.instagramUrl} variant="outline">
              @{BRAND.instagram}
            </ButtonLink>
          </Reveal>
        </div>

        <ul className={s.grid}>
          {GALLERY.map((shot, i) => (
            <Reveal
              as="li"
              key={shot.src}
              delay={(i % 4) * 0.07}
              className={`${s.cell} ${shot.span === "tall" ? s.cellTall : s.cellWide}`}
            >
              <button
                type="button"
                className={s.trigger}
                onClick={() => setOpen(i)}
                aria-label={`Open image: ${shot.alt}`}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 48rem) 50vw, 25vw"
                  quality={74}
                  style={
                    "pos" in shot ? { objectPosition: shot.pos } : undefined
                  }
                />
                <span className={s.expand} aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M9 3H3v6M15 21h6v-6M3 3l7 7M21 21l-7-7" />
                  </svg>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className={s.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              type="button"
              className={s.close}
              onClick={() => setOpen(null)}
              aria-label="Close viewer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>

            <button
              type="button"
              className={`${s.nav} ${s.navPrev}`}
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 4 7 12l8 8" />
              </svg>
            </button>
            <button
              type="button"
              className={`${s.nav} ${s.navNext}`}
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 4 8 8-8 8" />
              </svg>
            </button>

            <motion.figure
              key={active.src}
              className={s.lightbox}
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={1400}
                height={1800}
                sizes="90vw"
                quality={88}
              />
              <figcaption className={s.caption}>{active.alt}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
