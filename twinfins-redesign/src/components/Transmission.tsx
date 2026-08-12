"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import s from "./Transmission.module.css";

/* The tear is one shared jagged polygon: the wrapper clips to it, the glow
   and static fill it, so every layer agrees on the shape of the "break". */
const TEAR =
  "polygon(12% 0%, 55% 6%, 78% 0%, 100% 10%, 96% 34%, 100% 55%, 92% 72%, 100% 88%, 74% 100%, 42% 94%, 18% 100%, 0% 78%, 7% 52%, 0% 26%)";

/**
 * The teaser doorway. After a few quiet seconds a jagged hole "breaks"
 * through the page surface on the right edge — through it, green phosphor
 * light and a signal that shouldn't be there. Clicking it goes down to
 * /dragon-con.
 *
 * Deliberately not a toast and not a modal: it never covers content, never
 * interrupts, and dismissing it (the ✕) keeps it gone for the rest of the
 * session. It also never shows on the vault page itself — once you're
 * underground, the signal found you.
 */
/* The signal goes live Thursday Aug 13, 2026 (ET). Before then the hole
   simply never opens — no countdown, no trace it exists. */
const SIGNAL_START = new Date("2026-08-13T00:00:00-04:00");

export default function Transmission() {
  const pathname = usePathname();
  const still = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (Date.now() < SIGNAL_START.getTime()) return;
    if (sessionStorage.getItem("tf-transmission-dismissed")) return;
    const id = setTimeout(() => setShow(true), 6000);
    return () => clearTimeout(id);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem("tf-transmission-dismissed", "1");
    } catch {
      /* private browsing — it just reappears next load, which is fine */
    }
  };

  if (pathname?.startsWith("/dragon-con")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          className={s.wrap}
          initial={{ opacity: 0, scale: 0.6, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.7, x: 30 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Incoming transmission teaser"
        >
          <Link
            href="/dragon-con"
            className={s.hole}
            style={{ clipPath: TEAR }}
            aria-label="Incoming transmission — open Dragon Con 2026 page"
          >
            <span className={s.glow} aria-hidden="true" />
            <span className={still ? s.static : `${s.static} ${s.staticLive}`} aria-hidden="true" />
            <span className={s.text} aria-hidden="true">
              <b>▲ INCOMING</b>
              <b>TRANSMISSION</b>
              <i>tap to trace signal</i>
            </span>
          </Link>

          <button
            type="button"
            className={s.dismiss}
            onClick={dismiss}
            aria-label="Dismiss transmission"
          >
            ✕
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
