"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import s from "./Vault.module.css";

/* Dragon Con runs Labor Day weekend; 2026 puts opening day at Sep 4. */
const DOORS_OPEN = new Date("2026-09-04T09:00:00-04:00");

const BOOT_LINES = [
  "TWIN-TEC (TM) TERMLINK PROTOCOL v2.026",
  "ESTABLISHING SECURE CONNECTION....... OK",
  "SUBLEVEL ATMOSPHERICS................ OK",
  "ESPRESSO PRESSURE — 9 BAR............ OK",
  "LOCATION: [REDACTED], ATLANTA GA",
  "CLEARANCE: CON BADGE REQUIRED",
  "> DECRYPTING TRANSMISSION_",
];

/** Fully encrypted — the notes are the only tease that escapes. */
const MANIFEST = [
  { code: "BREW-001", length: 14, note: "irradiated glow, zero rads" },
  { code: "BREW-002", length: 16, note: "cold. very cold." },
  { code: "BREW-003", length: 12, note: "sweet enough to survive on" },
  { code: "BREW-004", length: 15, note: "overseer's eyes only" },
];

const CIPHER_GLYPHS = "█▓▒░#@%&$§Ø×ΔΞΨ01";

/**
 * A drink name behind live encryption: a fixed-width strip of cipher
 * glyphs that keeps re-scrambling, never resolving. SSR renders solid
 * blocks (deterministic), the scramble starts client-side only.
 */
function CipherText({ length, still }: { length: number; still: boolean }) {
  const [text, setText] = useState("█".repeat(length));

  useEffect(() => {
    if (still) return;
    const scramble = () =>
      setText(
        Array.from({ length }, () =>
          CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)],
        ).join(""),
      );
    scramble();
    const id = setInterval(scramble, 140);
    return () => clearInterval(id);
  }, [length, still]);

  return (
    <span aria-label="Encrypted drink name">{text}</span>
  );
}

const SPECIAL = [
  { letter: "S", word: "Steam", value: 9 },
  { letter: "P", word: "Pour", value: 8 },
  { letter: "E", word: "Espresso", value: 10 },
  { letter: "C", word: "Cold Brew", value: 9 },
  { letter: "I", word: "Ice", value: 7 },
  { letter: "A", word: "Aesthetic", value: 10 },
  { letter: "L", word: "Latte Art", value: 8 },
];

/** One boot line typed on at a time, cursor always on the newest line. */
function BootSequence({ still }: { still: boolean }) {
  const [shown, setShown] = useState(still ? BOOT_LINES.length : 0);

  useEffect(() => {
    if (still) return;
    if (shown >= BOOT_LINES.length) return;
    const id = setTimeout(() => setShown((v) => v + 1), 380);
    return () => clearTimeout(id);
  }, [shown, still]);

  return (
    <div className={s.boot} role="status" aria-label="Terminal boot sequence">
      {BOOT_LINES.slice(0, shown).map((line, i) => (
        <p key={line} className={s.bootLine}>
          {line}
          {i === shown - 1 && <span className={s.cursor} aria-hidden="true" />}
        </p>
      ))}
    </div>
  );
}

/** The vault door: a toothed gear ring that slowly turns, hub stamped DC 2026. */
function GearDoor({ still }: { still: boolean }) {
  const teeth = Array.from({ length: 24 });
  return (
    <div className={s.doorWrap} aria-hidden="true">
      <svg viewBox="0 0 400 400" className={still ? s.door : `${s.door} ${s.doorTurning}`}>
        <circle cx="200" cy="200" r="188" fill="#20241f" stroke="#3a4034" strokeWidth="6" />
        {teeth.map((_, i) => {
          const a = (i / teeth.length) * Math.PI * 2;
          /* rounded so SSR (Node) and the client agree on the exact string —
             raw Math.cos differs in the last float digit across engines,
             which shows up as a hydration mismatch on the <rect> attrs */
          const x = Math.round((200 + Math.cos(a) * 188) * 100) / 100;
          const y = Math.round((200 + Math.sin(a) * 188) * 100) / 100;
          return (
            <rect
              key={i}
              x={x - 9}
              y={y - 22}
              width="18"
              height="44"
              rx="4"
              fill="#2c322a"
              stroke="#454c3e"
              strokeWidth="3"
              transform={`rotate(${Math.round(((a * 180) / Math.PI + 90) * 100) / 100} ${x} ${y})`}
            />
          );
        })}
        <circle cx="200" cy="200" r="150" fill="#242921" stroke="#454c3e" strokeWidth="4" />
        {/* radial spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <rect
            key={deg}
            x="194"
            y="66"
            width="12"
            height="120"
            rx="6"
            fill="#2e342b"
            stroke="#454c3e"
            strokeWidth="2.5"
            transform={`rotate(${deg} 200 200)`}
          />
        ))}
        <circle cx="200" cy="200" r="78" fill="#1c201a" stroke="#5a6350" strokeWidth="5" />
        <text x="200" y="185" textAnchor="middle" className={s.doorTextTop}>
          DC
        </text>
        <text x="200" y="252" textAnchor="middle" className={s.doorTextYear}>
          2026
        </text>
      </svg>
    </div>
  );
}

function Countdown({ still }: { still: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (still) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [still]);

  if (now === null) {
    return <p className={s.countRow} aria-hidden="true">— : — : — : —</p>;
  }

  const diff = Math.max(0, DOORS_OPEN.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <p className={s.countRow}>
      <span>
        <b>{d}</b> <i>days</i>
      </span>
      <span>
        <b>{pad(h)}</b> <i>hrs</i>
      </span>
      <span>
        <b>{pad(m)}</b> <i>min</i>
      </span>
      <span>
        <b>{pad(sec)}</b> <i>sec</i>
      </span>
    </p>
  );
}

const PIPBOY_BOOT = [
  "*************** TWIN-TEC INDUSTRIES (TM) ***************",
  "COPYRIGHT 2201-2026 TWIN-TEC INDUSTRIES",
  "-EXEC VERSION 41.10",
  "64K RAM SYSTEM",
  "38911 BYTES FREE",
  "NO HOLOTAPE FOUND",
  "LOAD ROM(1): DEITRIX 303",
  "> RUN TRANSMISSION.EXE_",
];

/**
 * The wrist terminal. Boots like the real thing — ROM chatter, a loading
 * bar, the boot SFX — and only then does the intercepted footage roll,
 * with its own audio up if the browser lets an un-gestured unmute through
 * (Chromium usually does after the SFX primes the media session; Safari
 * won't, so the sound toggle stays as the fallback).
 */
function PipBoyHero({ still }: { still: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<"boot" | "live">(still ? "live" : "boot");
  const [shown, setShown] = useState(still ? PIPBOY_BOOT.length : 0);
  const [muted, setMuted] = useState(false);

  /* the boot SFX starts the moment the page does — best effort */
  useEffect(() => {
    if (still) return;
    void sfxRef.current?.play().catch(() => {});
  }, [still]);

  /* ROM lines rattle on quickly, then the bar, then the feed */
  useEffect(() => {
    if (still || phase !== "boot") return;
    if (shown < PIPBOY_BOOT.length) {
      const id = setTimeout(() => setShown((v) => v + 1), 330);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setPhase("live"), 2400);
    return () => clearTimeout(id);
  }, [shown, phase, still]);

  /* once live: try sound-on first, fall back to muted autoplay */
  useEffect(() => {
    const el = videoRef.current;
    if (phase !== "live" || !el) return;
    el.muted = false;
    el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      void el.play().catch(() => {});
    });
  }, [phase]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  return (
    <div className={s.pipboy}>
      {/* housing hardware, laid out like the reference wrist unit:
          gauge / nameplate / slot / model plate / stick down the left,
          screen centre with a three-button pod, barrel hinge on the right */}
      <span className={s.pipWear} aria-hidden="true" />
      <span className={s.pipHullScrews} aria-hidden="true" />

      <div className={s.pipLeft} aria-hidden="true">
        <span className={s.pipGaugeDial}>
          <i />
        </span>
        <span className={s.pipPlate}>Twin-Tec</span>
        <span className={s.pipSlot} />
        <span className={s.pipModel}>MODEL 2026</span>
        <span className={s.pipToggle}>
          <i />
        </span>
        <span className={s.pipStick}>
          <i />
        </span>
      </div>

      <div className={s.pipCenter}>
        <div className={s.pipScreen}>
          <span className={s.pipScrews} aria-hidden="true" />
        {phase === "boot" ? (
          <div className={s.pipBoot} role="status" aria-label="Terminal booting">
            {PIPBOY_BOOT.slice(0, shown).map((line, i) => (
              <p key={line} className={s.bootLine}>
                {line}
                {i === shown - 1 && shown < PIPBOY_BOOT.length && (
                  <span className={s.cursor} aria-hidden="true" />
                )}
              </p>
            ))}
            {shown >= PIPBOY_BOOT.length && (
              <div className={s.pipLoad} aria-hidden="true">
                <span className={s.pipLoadLabel}>INITIATING</span>
                <span className={s.pipLoadBar}>
                  <i />
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span className={s.playerLabel} aria-hidden="true">
              ◉ REC — SIGNAL FRAGMENT 00:16
            </span>
            <video
              ref={videoRef}
              className={s.player}
              src="/videos/dragoncon/transmission.mp4"
              autoPlay
              loop
              playsInline
              preload="auto"
            />
            <button
              type="button"
              className={s.soundBtn}
              onClick={() => setMuted((v) => !v)}
              aria-pressed={!muted}
            >
              {muted ? "◄ SOUND: OFF" : "◄ SOUND: ON"}
            </button>
          </>
        )}
            <span className={s.scanlines} aria-hidden="true" />
            <span className={s.pipGlass} aria-hidden="true" />
        </div>

        <div className={s.pipPod} aria-hidden="true">
          <span className={s.pipBtn}>
            <i />
            LOG
          </span>
          <span className={s.pipBtn}>
            <i />
            BREW
          </span>
          <span className={s.pipBtn}>
            <i />
            DATA
          </span>
        </div>
      </div>

      <span className={s.pipBarrel} aria-hidden="true" />

      <audio ref={sfxRef} src="/videos/dragoncon/pipboy-boot.mp3" preload="auto" />
    </div>
  );
}

/**
 * /dragon-con. The page is staged as a working sublevel: riveted bulkheads,
 * a turning vault door, and CRT terminals set into the walls. Everything a
 * visitor learns comes off those terminals, and every terminal stops one
 * word short of the reveal — the theme is the tease.
 */
export default function Vault() {
  const still = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const doorY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <div className={s.vault}>
      {/* corridor dressing: bulkhead walls + overhead light cones */}
      <span className={s.wallLeft} aria-hidden="true" />
      <span className={s.wallRight} aria-hidden="true" />
      <span className={s.lights} aria-hidden="true" />
      {!still && <span className={s.flicker} aria-hidden="true" />}

      {/* the room comes up from blackout — vault power cycling on */}
      {!still && <span className={s.blackout} aria-hidden="true" />}

      {/* --------------------------------------------- pipboy feature */}
      <section className={s.pipHero}>
        <p className={s.stamp}>SUBLEVEL ACCESS — AUTHORIZED PERSONNEL</p>
        <PipBoyHero still={still} />
      </section>

      {/* ------------------------------------------------ door + title */}
      <section className={s.hero} ref={ref}>
        <motion.div style={still ? undefined : { y: doorY }} className={s.heroDoor}>
          <GearDoor still={still} />
        </motion.div>

        <div className={s.heroCopy}>
          <h1 className={s.title}>
            <span>DRAGON CON</span>
            <b>2026</b>
          </h1>
          <p className={s.tagline}>
            War never changes. <em>Coffee does.</em>
          </p>
          <BootSequence still={still} />
        </div>

        <span className={s.heroFloor} aria-hidden="true" />
      </section>

      {/* ---------------------------------------------- caution band */}
      <div className={s.caution} aria-hidden="true">
        <div className={s.cautionTrack}>
          {[0, 1].map((copy) => (
            <span key={copy}>
              PLEASE STAND BY — PLEASE STAND BY — PLEASE STAND BY — PLEASE
              STAND BY — PLEASE STAND BY —&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------- terminals */}
      <section className={`shell ${s.deck}`}>
        <article className={s.terminal}>
          <header className={s.termHead}>
            <span />
            <span />
            <p>OVERSEER LOG — ENTRY 001</p>
          </header>
          <div className={s.termBody}>
            <p>
              This Labor Day weekend, the cart goes underground. Custom
              drinks. A full build-out. A theme we have been quietly welding
              together for months.
            </p>
            <p>
              We could tell you what it is. But some doors are better opened
              in person.
            </p>
            <p className={s.termSign}>— The Overseer</p>
          </div>
        </article>

        <article className={s.terminal}>
          <header className={s.termHead}>
            <span />
            <span />
            <p>DRINK MANIFEST — ENCRYPTED</p>
          </header>
          <div className={s.termBody}>
            <ul className={s.manifest}>
              {MANIFEST.map((item) => (
                <li key={item.code}>
                  <span className={s.manCode}>{item.code} — ENCRYPTION: ACTIVE</span>
                  <span className={s.manName}>
                    <CipherText length={item.length} still={still} />
                  </span>
                  <span className={s.manNote}>{item.note}</span>
                </li>
              ))}
            </ul>
            <p className={s.termFoot}>
              FULL MENU DECRYPTS ON THE CON FLOOR.
            </p>
          </div>
        </article>

        <article className={`${s.terminal} ${s.terminalWide}`}>
          <header className={s.termHead}>
            <span />
            <span />
            <p>CREW VITALS — S.P.E.C.I.A.L.</p>
          </header>
          <div className={s.termBody}>
            <ul className={s.special}>
              {SPECIAL.map((stat) => (
                <li key={stat.letter}>
                  <b>{stat.letter}</b>
                  <span className={s.specialWord}>{stat.word}</span>
                  <span className={s.specialBar}>
                    <motion.i
                      initial={still ? { width: `${stat.value * 10}%` } : { width: 0 }}
                      whileInView={{ width: `${stat.value * 10}%` }}
                      viewport={{ once: true, margin: "-15% 0px" }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                  <span className={s.specialVal}>{stat.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      {/* -------------------------------------------------- crew file */}
      <section className={s.crew} aria-label="Crew file 001">
        <div className={`shell ${s.crewGrid}`}>
          <div className={s.alcove} aria-hidden="true">
            <span className={s.alcoveBurst} />
            <span className={s.alcoveSpot} />
            <span className={s.motes}>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className={s.crewGirl}>
              <Image
                src="/images/dragoncon/vault-girl.png"
                alt=""
                width={800}
                height={1200}
                sizes="(max-width: 62rem) 64vw, 24rem"
              />
              <i className={s.wristGlow} />
            </span>
            <span className={s.alcoveBase} />
          </div>

          <article className={s.dossier}>
            <header className={s.termHead}>
              <span />
              <span />
              <p>CREW FILE 001 — RESTRICTED</p>
            </header>
            <div className={s.dossierBody}>
              <dl className={s.dossierRows}>
                <div>
                  <dt>DESIGNATION</dt>
                  <dd>&ldquo;THE OVERSEER&rdquo;</dd>
                </div>
                <div>
                  <dt>STATION</dt>
                  <dd>ESPRESSO BAY 01</dd>
                </div>
                <div>
                  <dt>STATUS</dt>
                  <dd>
                    EN ROUTE <em className={s.tracking}>· TRACKING</em>
                  </dd>
                </div>
                <div>
                  <dt>LOADOUT</dt>
                  <dd>ICED LATTE / CANVAS TOTE / LUCKY CAP</dd>
                </div>
                <div>
                  <dt>THREAT LEVEL</dt>
                  <dd>FULLY CAFFEINATED</dd>
                </div>
              </dl>

              <div className={s.radarRow}>
                <span className={s.radar} aria-hidden="true">
                  <i />
                  <b />
                  <b />
                  <b />
                </span>
                <p className={s.radarNote}>
                  Signal strongest near the espresso machine. Approach and
                  order freely. Do not ask what BREW-004 is — she will not
                  tell you.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ------------------------------------------------- countdown */}
      <section className={`shell ${s.countdown}`}>
        <p className={s.stamp}>VAULT OPENS — LABOR DAY WEEKEND · ATLANTA</p>
        <Countdown still={still} />
        <p className={s.countNote}>
          Find the cart. Say the password. There is no password — just order
          something.
        </p>
      </section>

      {/* ------------------------------------------------ disclaimer */}
      <footer className={s.legal}>
        <p>
          This event page is a fan tribute. Fallout® is a registered
          trademark of Bethesda Softworks LLC, a ZeniMax Media company.
          Twin Fins Coffee is not affiliated with, sponsored by, or endorsed
          by Bethesda Softworks LLC, ZeniMax Media Inc., or Microsoft
          Corporation, and no such affiliation is implied. Dragon Con® is a
          registered trademark of Dragon Con, Inc. All other trademarks are
          the property of their respective owners.
        </p>
      </footer>
    </div>
  );
}
