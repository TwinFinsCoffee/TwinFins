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
/* Remembered for the session: turn the transmission's sound off once and
   it stays off, including across replays and re-entries. */
const SOUND_KEY = "tf-vault-sound-off";

function readSoundOff() {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SOUND_KEY) === "1";
}

function PipBoyHero({ still }: { still: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<"boot" | "live">(still ? "live" : "boot");
  const [shown, setShown] = useState(still ? PIPBOY_BOOT.length : 0);
  const [muted, setMuted] = useState(false);

  /* the boot SFX starts the moment the page does — best effort, and never
     if sound was switched off earlier in the session */
  useEffect(() => {
    if (still || readSoundOff()) return;
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

  /* Once live: honour the remembered preference. Only try an un-muted
     autoplay if the visitor hasn't already switched sound off. */
  useEffect(() => {
    const el = videoRef.current;
    if (phase !== "live" || !el) return;
    if (readSoundOff()) {
      el.muted = true;
      setMuted(true);
      void el.play().catch(() => {});
      return;
    }
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
              onClick={() =>
                setMuted((v) => {
                  const next = !v;
                  try {
                    if (next) sessionStorage.setItem(SOUND_KEY, "1");
                    else sessionStorage.removeItem(SOUND_KEY);
                  } catch {
                    /* private mode — preference just won't persist */
                  }
                  return next;
                })
              }
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

/* ------------------------------------------------------------ roaches */

/** Side-view roach: segmented shell, six legs, twitching antennae. */
function Roach(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 30" fill="none" aria-hidden="true" {...props}>
      <g stroke="#241c12" strokeWidth="2.4" strokeLinecap="round">
        <path d="M20 21 L13 29" />
        <path d="M30 22 L28 30" />
        <path d="M40 21 L47 29" />
        <path d="M22 11 L15 3" />
        <path d="M32 10 L31 2" />
        <path d="M42 11 L49 3" />
      </g>
      <g stroke="#241c12" strokeWidth="1.7" strokeLinecap="round">
        <path d="M50 13 L59 7" />
        <path d="M50 17 L59 18" />
      </g>
      <ellipse cx="30" cy="16" rx="21" ry="9" fill="#43341f" />
      <ellipse cx="29" cy="14.5" rx="15" ry="6" fill="#57452a" />
      <path d="M30 8 L30 24" stroke="#2b2116" strokeWidth="1.6" />
      <circle cx="48" cy="16" r="7.5" fill="#372b1a" />
      <circle cx="51" cy="13.6" r="1.3" fill="#9ad6a6" />
    </svg>
  );
}

/* Staggered lanes and long delays: one skitters past every few seconds
   rather than a swarm arriving at once. */
const ROACHES = [
  { top: "9%", dur: 11, delay: 2, size: 34, dir: 1 },
  { top: "31%", dur: 15, delay: 9, size: 26, dir: -1 },
  { top: "54%", dur: 13, delay: 19, size: 30, dir: 1 },
  { top: "72%", dur: 17, delay: 28, size: 22, dir: -1 },
  { top: "90%", dur: 12, delay: 37, size: 28, dir: 1 },
] as const;

/** Roaches crossing the sublevel, behind everything — nav bar included. */
function Radroaches() {
  return (
    <div className={s.roaches} aria-hidden="true">
      {ROACHES.map((r, i) => (
        <span
          key={i}
          className={r.dir === 1 ? `${s.roachLane} ${s.roachRight}` : `${s.roachLane} ${s.roachLeft}`}
          style={
            {
              top: r.top,
              width: `${r.size}px`,
              animationDuration: `${r.dur}s`,
              animationDelay: `${r.delay}s`,
            } as React.CSSProperties
          }
        >
          <Roach className={s.roachBody} />
        </span>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- game */

/* Cues sliced out of the 8-bit pack: rising blips read as good, falling
   as bad, so catch/win rise and miss/lose fall. Kept quiet on purpose. */
const GAME_SFX = {
  catch: { src: "/audio/dragoncon/catch.mp3", vol: 0.22 },
  miss: { src: "/audio/dragoncon/miss.mp3", vol: 0.16 },
  start: { src: "/audio/dragoncon/start.mp3", vol: 0.25 },
  win: { src: "/audio/dragoncon/win.mp3", vol: 0.28 },
  lose: { src: "/audio/dragoncon/lose.mp3", vol: 0.24 },
} as const;

type SfxName = keyof typeof GAME_SFX;

const LANES = 3;
const GAME_SECONDS = 20;
const DRIP_FALL_MS = 1500;

type Drip = { id: number; lane: number; started: number };

/**
 * CATCH THE POUR. Drips fall down three lanes; move the cup with ← → or by
 * tapping a lane. Twenty seconds, one score, nothing at stake — it's a
 * coffee cart, not a casino.
 */
function PourGame() {
  const [state, setState] = useState<"idle" | "live" | "over">("idle");
  const [lane, setLane] = useState(1);
  const [drips, setDrips] = useState<Drip[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [left, setLeft] = useState(GAME_SECONDS);
  const nextId = useRef(0);
  const laneRef = useRef(lane);
  laneRef.current = lane;
  const scoreRef = useRef(0);
  const dripsRef = useRef<Drip[]>([]);
  dripsRef.current = drips;
  const boardRef = useRef<HTMLDivElement>(null);
  const [audioOff, setAudioOff] = useState(false);

  /* One element per cue, cloned on play so rapid catches overlap instead
     of cutting each other off. */
  const sfx = useRef<Partial<Record<SfxName, HTMLAudioElement>>>({});
  useEffect(() => {
    (Object.keys(GAME_SFX) as SfxName[]).forEach((k) => {
      const el = new Audio(GAME_SFX[k].src);
      el.preload = "auto";
      el.volume = GAME_SFX[k].vol;
      el.load();
      sfx.current[k] = el;
    });
  }, []);

  const play = (name: SfxName) => {
    /* deliberately NOT gated on the transmission's mute preference: the
       video and the arcade are separate sound sources to the player */
    if (audioOff) return;
    const base = sfx.current[name];
    if (!base) return;
    const node = base.cloneNode() as HTMLAudioElement;
    node.volume = GAME_SFX[name].vol;
    void node.play().catch(() => {});
  };

  const start = () => {
    setScore(0);
    setMissed(0);
    setDrips([]);
    setLeft(GAME_SECONDS);
    setLane(1);
    scoreRef.current = 0;
    setState("live");
    play("start");
  };

  /* the result jingle belongs to the transition into "over", not to the
     timer tick that caused it */
  useEffect(() => {
    if (state !== "over") return;
    play(scoreRef.current >= 12 ? "win" : "lose");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (state !== "live") return;
    const id = setInterval(
      () =>
        setLeft((v) => {
          if (v <= 1) {
            setState("over");
            return 0;
          }
          return v - 1;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => {
    if (state !== "live") return;
    const id = setInterval(() => {
      setDrips((d) => [
        ...d,
        {
          id: nextId.current++,
          lane: Math.floor(Math.random() * LANES),
          started: Date.now(),
        },
      ]);
    }, 620);
    return () => clearInterval(id);
  }, [state]);

  /* Resolve each drip when it reaches the cup line.
     The scoring and the cue deliberately happen in the interval callback,
     not inside a setDrips updater: React invokes updaters twice in
     StrictMode, which double-counted every catch and fired every blip
     twice. The updater below is now pure. */
  useEffect(() => {
    if (state !== "live") return;
    const id = setInterval(() => {
      const now = Date.now();
      const landed = dripsRef.current.filter(
        (d) => now - d.started >= DRIP_FALL_MS,
      );
      if (!landed.length) return;

      let caught = 0;
      let spilled = 0;
      for (const drip of landed) {
        if (drip.lane === laneRef.current) caught++;
        else spilled++;
      }
      if (caught) {
        scoreRef.current += caught;
        setScore((v) => v + caught);
        play("catch");
      }
      if (spilled) {
        setMissed((v) => v + spilled);
        play("miss");
      }

      const landedIds = new Set(landed.map((d) => d.id));
      setDrips((d) => d.filter((drip) => !landedIds.has(drip.id)));
    }, 90);
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => {
    if (state !== "live") return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") {
        e.preventDefault();
        setLane((v) => Math.max(0, v - 1));
      }
      if (k === "arrowright" || k === "d") {
        e.preventDefault();
        setLane((v) => Math.min(LANES - 1, v + 1));
      }
      if (k === "1") setLane(0);
      if (k === "2") setLane(1);
      if (k === "3") setLane(2);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  return (
    <div className={s.game}>
      <div className={s.gameHud}>
        <span>CAUGHT {String(score).padStart(2, "0")}</span>
        <span>SPILLED {String(missed).padStart(2, "0")}</span>
        <span>{String(left).padStart(2, "0")}s</span>
        <button
          type="button"
          className={s.sfxBtn}
          onClick={() => setAudioOff((v) => !v)}
          aria-pressed={audioOff}
        >
          {audioOff ? "SFX OFF" : "SFX ON"}
        </button>
      </div>

      {/* The cup follows the pointer anywhere over the board — press,
          hover or drag, no need to hit a specific lane button. */}
      <div
        className={s.board}
        ref={boardRef}
        onPointerMove={(e) => {
          if (state !== "live" || e.pointerType === "touch") return;
          const r = e.currentTarget.getBoundingClientRect();
          const i = Math.floor(((e.clientX - r.left) / r.width) * LANES);
          setLane(Math.min(LANES - 1, Math.max(0, i)));
        }}
        onPointerDown={(e) => {
          if (state !== "live") return;
          const r = e.currentTarget.getBoundingClientRect();
          const i = Math.floor(((e.clientX - r.left) / r.width) * LANES);
          setLane(Math.min(LANES - 1, Math.max(0, i)));
        }}
        onTouchMove={(e) => {
          if (state !== "live") return;
          const r = e.currentTarget.getBoundingClientRect();
          const i = Math.floor(((e.touches[0].clientX - r.left) / r.width) * LANES);
          setLane(Math.min(LANES - 1, Math.max(0, i)));
        }}
      >
        {Array.from({ length: LANES }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={s.laneBtn}
            data-active={lane === i}
            aria-label={`Move cup to lane ${i + 1}`}
            onClick={() => state === "live" && setLane(i)}
          >
            <span className={s.spout} aria-hidden="true" />
          </button>
        ))}

        {state === "live" &&
          drips.map((drip) => (
            <i
              key={drip.id}
              className={s.drip}
              style={
                {
                  left: `calc(${(drip.lane + 0.5) * (100 / LANES)}% - 5px)`,
                  animationDuration: `${DRIP_FALL_MS}ms`,
                } as React.CSSProperties
              }
            />
          ))}

        <i
          className={s.cup}
          style={
            {
              left: `calc(${(lane + 0.5) * (100 / LANES)}% - 1.4rem)`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />

        {state !== "live" && (
          <div className={s.gameOverlay}>
            {state === "idle" ? (
              <>
                <p>CATCH THE POUR</p>
                <span>MOVE: &larr; &rarr; / A D / drag</span>
              </>
            ) : (
              <>
                <p>{score >= 12 ? "BARISTA CERTIFIED" : "KEEP PRACTICING"}</p>
                <span>
                  {score} caught &middot; {missed} spilled
                </span>
              </>
            )}
            <button type="button" className={s.gameBtn} onClick={start}>
              {state === "idle" ? "▶ RUN PROGRAM" : "▶ RUN AGAIN"}
            </button>
          </div>
        )}
      </div>
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
      {!still && <Radroaches />}

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

      {/* ------------------------------------------------- rec. room */}
      <section className={s.rec} aria-labelledby="rec-title">
        <div className={`shell ${s.recHead}`}>
          <p className={s.stamp}>RECREATION TERMINAL — SUBLEVEL 2</p>
          <h2 className={s.recTitle} id="rec-title">
            Two hundred years is a long shift.
          </h2>
          <p className={s.recLede}>
            The crew had to do something between pours. Catch the drips,
            don&rsquo;t spill the bean water. Twelve or better and the
            machine considers you staff.
          </p>
        </div>

        <div className={`shell ${s.recCabinet}`}>
          <article className={s.terminal}>
            <header className={s.termHead}>
              <span />
              <span />
              <p>PROGRAM 07 — CATCH THE POUR</p>
            </header>
            <div className={s.termBody}>
              <PourGame />
            </div>
          </article>
        </div>
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
