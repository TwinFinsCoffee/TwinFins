"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { TAKEOVER_END } from "@/lib/dragoncon";
import { setVaultMode } from "@/lib/vaultMode";
import s from "./Takeover.module.css";

/* Seen the takeover this session? Then the surface barely gets a frame —
   a fast glitch-cut instead of the whole slow-burn intrusion. */
const DONE_KEY = "tf-takeover-done";

/**
 * The home-page hijack for Dragon Con week. The surface site loads exactly
 * as always; a couple of seconds later the signal breaks through — static
 * bursts, a rolling CRT bar, phosphor bleeding up from below — and the page
 * cuts to black and powers back on as the vault. The vault then stays: it
 * IS the home page until the con ends, at which point this component stops
 * firing entirely and the surface site quietly returns.
 *
 * Photosensitivity: the interference frames are dark noise at partial
 * opacity, never full-luminance white flashes, and reduced-motion visitors
 * get a plain crossfade with no strobing at all.
 */
export default function Takeover({
  surface,
  vault,
}: {
  surface: React.ReactNode;
  vault: React.ReactNode;
}) {
  const still = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"surface" | "glitch" | "vault">("surface");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    /* Con's over — the surface site is home again, no theatrics. */
    if (Date.now() >= TAKEOVER_END.getTime()) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(DONE_KEY) === "1";
    } catch {
      /* private browsing — they just get the full show each load */
    }

    const settle = () => {
      setPhase("vault");
      setVaultMode(true);
      window.scrollTo(0, 0);
      try {
        sessionStorage.setItem(DONE_KEY, "1");
      } catch {
        /* fine */
      }
    };

    const t = timers.current;
    if (still) {
      /* No strobe: a beat of the surface, then a straight cut. The vault's
         own power-on blackout provides all the transition needed. */
      t.push(window.setTimeout(settle, seen ? 150 : 800));
    } else if (seen) {
      /* Repeat visitor this session: instant-ish glitch-cut. */
      t.push(window.setTimeout(() => setPhase("glitch"), 120));
      t.push(window.setTimeout(settle, 120 + 450));
    } else {
      /* First contact: one glimpse of the surface, then the signal takes
         it. No slow burn — the seizure is the point. */
      t.push(window.setTimeout(() => setPhase("glitch"), 600));
      t.push(window.setTimeout(settle, 600 + 900));
    }
    return () => {
      t.forEach(clearTimeout);
      timers.current = [];
    };
  }, [still]);

  /* Leaving the home page hands the nav back to whatever route it's on. */
  useEffect(() => () => setVaultMode(false), []);

  if (phase === "vault") return <>{vault}</>;

  const quick = (() => {
    try {
      return sessionStorage.getItem(DONE_KEY) === "1";
    } catch {
      return false;
    }
  })();

  return (
    <div
      className={phase === "glitch" ? s.seized : undefined}
      data-takeover={phase}
    >
      {surface}
      {phase === "glitch" && !still && (
        <div
          className={quick ? `${s.overlay} ${s.quick}` : s.overlay}
          aria-hidden="true"
        >
          <span className={s.noise} />
          <span className={s.noiseHeavy} />
          <span className={s.rollbar} />
          <span className={s.phosRise} />
          <span className={s.frame}>
            <b>◤ SIGNAL INTRUSION — CHANNEL SEIZED</b>
            <i>TWIN-TEC (TM) OVERRIDE · TRANSMISSION LOCKED</i>
          </span>
          <span className={s.blackcut} />
        </div>
      )}
    </div>
  );
}
