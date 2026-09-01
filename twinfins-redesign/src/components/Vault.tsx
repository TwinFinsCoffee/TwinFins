"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import VaultLocate from "./VaultLocate";
import { Monogram, Wordmark } from "./BrandMarks";
import { DOORS_OPEN, TAKEOVER_END } from "@/lib/dragoncon";
import s from "./Vault.module.css";

const BOOT_LINES = [
  "TWIN-TEC (TM) TERMLINK PROTOCOL v2.026",
  "ESTABLISHING SECURE CONNECTION....... OK",
  "SUBLEVEL ATMOSPHERICS................ OK",
  "ESPRESSO PRESSURE — 9 BAR............ OK",
  "LOCATION: THE VEGA — HOTEL CORRIDOR",
  "CLEARANCE: CON BADGE REQUIRED",
  "> DECRYPTING TRANSMISSION_",
];

/** Fully encrypted — the in-world ad lines are the only tease that
    escapes. Cipher lengths match the real names; let them count. */
const MANIFEST = [
  { code: "BREW-001", length: 14, note: "wake up to the winning side of history" },
  { code: "BREW-002", length: 6, note: "no cream. no sugar. no excuses." },
  { code: "BREW-003", length: 16, note: "a little wonder for the long road home" },
  { code: "BREW-004", length: 15, note: "proprietor's eyes only" },
];

const CIPHER_GLYPHS = "█▓▒░#@%&$§Ø×ΔΞΨ01";

/* Module scope on purpose: the door ceremony runs at most once per page
   LOAD. Client-side navigation back to home finds this already true and
   mounts the parked door; only a real reload resets it. */
let doorCeremonyDone = false;

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

/**
 * The home takeover's vault door, drawn to the cast-metal plate itself:
 * ten broad gear lugs with tread bars and corner rivets, an outer rim the
 * lugs bolt through, a riveted face band, eight strut spokes over recessed
 * wedge panels, and a raised hub boss carrying the TF monogram embossed in
 * the same steel — highlight above, shadow below, no second colour.
 */
function DoorPlate() {
  const LUGS = Array.from({ length: 10 });
  const SPOKES = Array.from({ length: 8 });
  const RIVETS = Array.from({ length: 20 });
  return (
    <svg viewBox="0 0 400 400" className={s.plate} aria-hidden="true">
      <defs>
        <radialGradient id="tfDoorFace" cx="38%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#353b2e" />
          <stop offset="55%" stopColor="#262b21" />
          <stop offset="100%" stopColor="#14170f" />
        </radialGradient>
        <radialGradient id="tfDoorHub" cx="42%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#404737" />
          <stop offset="70%" stopColor="#272c21" />
          <stop offset="100%" stopColor="#171a12" />
        </radialGradient>
        <linearGradient id="tfDoorLug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d4435" />
          <stop offset="100%" stopColor="#1e2219" />
        </linearGradient>
        {/* two centuries of weather, procedurally: fine cast-metal
            speckle, and slower rust blooms in a corroded brown */}
        <filter id="tfDoorGrime" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="7" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.7 0.45 0 -0.62 0" />
        </filter>
        <filter id="tfDoorRust" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="13" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.13  0 0 0 0 0.05  0.9 0.6 0 -1.05 0" />
        </filter>
        {/* one vertical shading pass over everything: light off the top
            edge, weight collecting at the bottom */}
        <linearGradient id="tfDoorShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(233,235,223,0.06)" />
          <stop offset="30%" stopColor="rgba(233,235,223,0)" />
          <stop offset="62%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.34)" />
        </linearGradient>
        {/* weathering clips to the plate's exact silhouette — face disc
            plus the ten lugs — so nothing paints in the gaps between */}
        <clipPath id="tfDoorClip">
          <circle cx="200" cy="200" r="169" />
          {Array.from({ length: 10 }).map((_, i) => (
            <path
              key={i}
              d="M168 48 L174 8 L184 4 L216 4 L226 8 L232 48 Z"
              transform={`rotate(${i * 36} 200 200)`}
            />
          ))}
        </clipPath>
      </defs>

      {/* rim the lugs are cast onto */}
      <circle cx="200" cy="200" r="168" fill="#20241b" stroke="#0e100b" strokeWidth="4" />

      {/* ten gear lugs, treaded like the plate's tire-blocks */}
      {LUGS.map((_, i) => (
        <g key={`lug-${i}`} transform={`rotate(${i * 36} 200 200)`}>
          <path
            d="M168 48 L174 8 L184 4 L216 4 L226 8 L232 48 Z"
            fill="url(#tfDoorLug)"
            stroke="#0e100b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* tread bars */}
          <rect x="186" y="12" width="8" height="26" rx="3" fill="#2b3025" stroke="#12150e" strokeWidth="1.5" />
          <rect x="206" y="12" width="8" height="26" rx="3" fill="#2b3025" stroke="#12150e" strokeWidth="1.5" />
          {/* cast light catching the lug's top edge */}
          <path d="M175 9 L184 5.5 L216 5.5" fill="none" stroke="rgba(233,235,223,0.14)" strokeWidth="2" strokeLinecap="round" />
          {/* corner rivets at the lug root */}
          <circle cx="173" cy="43" r="2.6" fill="#454c3e" stroke="#0e100b" strokeWidth="1" />
          <circle cx="227" cy="43" r="2.6" fill="#454c3e" stroke="#0e100b" strokeWidth="1" />
        </g>
      ))}

      {/* main face plate */}
      <circle cx="200" cy="200" r="160" fill="url(#tfDoorFace)" stroke="#454c3e" strokeWidth="3" />
      {/* recessed channel ring */}
      <circle cx="200" cy="200" r="143" fill="none" stroke="rgba(0,0,0,0.42)" strokeWidth="9" />
      <circle cx="200" cy="200" r="138" fill="none" stroke="rgba(233,235,223,0.05)" strokeWidth="1.5" />

      {/* rivet ring around the face band */}
      {RIVETS.map((_, i) => (
        <g key={`riv-${i}`} transform={`rotate(${i * 18 + 9} 200 200)`}>
          <circle cx="200" cy="48" r="2.8" fill="#4a5242" stroke="#0e100b" strokeWidth="1.2" />
        </g>
      ))}

      {/* recessed wedge panels between the spokes */}
      {SPOKES.map((_, i) => (
        <g key={`wedge-${i}`} transform={`rotate(${i * 45 + 22.5} 200 200)`}>
          <path
            d="M 163.1 71.2 A 134 134 0 0 1 236.9 71.2 L 219.3 132.7 A 70 70 0 0 0 180.7 132.7 Z"
            fill="rgba(0,0,0,0.30)"
            stroke="rgba(0,0,0,0.45)"
            strokeWidth="2"
          />
        </g>
      ))}

      {/* eight strut spokes, bolted at both ends */}
      {SPOKES.map((_, i) => (
        <g key={`spoke-${i}`} transform={`rotate(${i * 45} 200 200)`}>
          <rect x="192" y="58" width="16" height="86" rx="5" fill="url(#tfDoorLug)" stroke="#10130c" strokeWidth="2.5" />
          <rect x="194.5" y="61" width="3.5" height="80" rx="1.5" fill="rgba(233,235,223,0.07)" />
          <circle cx="200" cy="68" r="4" fill="#454c3e" stroke="#0e100b" strokeWidth="1.5" />
          <circle cx="200" cy="134" r="4" fill="#454c3e" stroke="#0e100b" strokeWidth="1.5" />
        </g>
      ))}

      {/* hub: outer collar, bolt ring, raised boss */}
      <circle cx="200" cy="200" r="62" fill="url(#tfDoorHub)" stroke="#454c3e" strokeWidth="4" />
      {SPOKES.map((_, i) => (
        <g key={`hbolt-${i}`} transform={`rotate(${i * 45 + 22.5} 200 200)`}>
          <circle cx="200" cy="148" r="3.6" fill="#454c3e" stroke="#0e100b" strokeWidth="1.4" />
        </g>
      ))}
      <circle cx="200" cy="200" r="42" fill="#2b3025" stroke="#10130c" strokeWidth="3" />
      <circle cx="200" cy="200" r="42" fill="none" stroke="rgba(233,235,223,0.06)" strokeWidth="1.5" />

      {/* TF monogram, embossed in the boss: light rim above, shadow below,
          face a half-step lighter than the boss it stands on */}
      <svg x="177" y="172.9" width="46" height="51.6" style={{ color: "#4d5643" }}>
        <Monogram />
      </svg>
      <svg x="177" y="175.7" width="46" height="51.6" style={{ color: "#0d100a" }}>
        <Monogram />
      </svg>
      <svg x="177" y="174.3" width="46" height="51.6" style={{ color: "#39412f" }}>
        <Monogram />
      </svg>

      {/* weathering pass, over everything (monogram included — the
          emboss has been wearing as long as the plate has) */}
      <g clipPath="url(#tfDoorClip)">
        <rect x="0" y="0" width="400" height="400" filter="url(#tfDoorGrime)" opacity="0.4" />
        <rect x="0" y="0" width="400" height="400" filter="url(#tfDoorRust)" opacity="0.45" />
        {/* drips bleeding down off the rivet band */}
        <g fill="none" strokeLinecap="round">
          <path d="M138 78 q -3 30 1 52" stroke="rgba(9,8,5,0.32)" strokeWidth="3.5" />
          <path d="M262 74 q 4 26 0 46" stroke="rgba(9,8,5,0.28)" strokeWidth="3" />
          <path d="M200 52 q 2 34 -1 58" stroke="rgba(84,52,24,0.30)" strokeWidth="4" />
          <path d="M96 132 q -4 24 -1 40" stroke="rgba(84,52,24,0.24)" strokeWidth="3" />
          <path d="M305 140 q 5 28 2 44" stroke="rgba(9,8,5,0.26)" strokeWidth="3" />
          <path d="M232 210 q 3 40 -2 66" stroke="rgba(84,52,24,0.20)" strokeWidth="3.5" />
        </g>
        {/* bare-metal scratches where the plate has been dragged shut */}
        <g stroke="rgba(233,235,223,0.07)" strokeWidth="1.3" strokeLinecap="round">
          <path d="M88 236 L146 262" />
          <path d="M110 116 L158 96" />
          <path d="M270 300 L318 268" />
          <path d="M292 118 L252 92" />
          <path d="M172 330 L216 342" />
        </g>
        <circle cx="200" cy="200" r="197" fill="url(#tfDoorShade)" />
      </g>
    </svg>
  );
}

/**
 * The opening the door leaves behind, cut to the door's own silhouette:
 * a heavy cast collar with ten lug sockets punched through it — the
 * recesses the gear teeth seat into — around a machined bore falling away
 * into the dark, green phosphor light rising from somewhere below. Same
 * viewBox and lug geometry as DoorPlate, so the door lifts out of a hole
 * that actually fits it.
 */
function DoorBore() {
  const SOCKETS = Array.from({ length: 10 });
  return (
    <svg viewBox="0 0 400 400" className={s.stageHole} aria-hidden="true">
      <defs>
        <radialGradient id="tfBoreDepth" cx="50%" cy="44%" r="72%">
          <stop offset="0%" stopColor="#030402" />
          <stop offset="58%" stopColor="#060805" />
          <stop offset="82%" stopColor="#0b0e08" />
          <stop offset="100%" stopColor="#131610" />
        </radialGradient>
        <radialGradient id="tfBoreGlow" cx="50%" cy="74%" r="65%">
          <stop offset="0%" stopColor="rgba(82,255,125,0.13)" />
          <stop offset="55%" stopColor="rgba(82,255,125,0.05)" />
          <stop offset="100%" stopColor="rgba(82,255,125,0)" />
        </radialGradient>
        <linearGradient id="tfBoreTopShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
          <stop offset="45%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <linearGradient id="tfBoreSocket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020302" />
          <stop offset="100%" stopColor="#0a0d08" />
        </linearGradient>
        <filter id="tfBoreGrime" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="21" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.7 0.45 0 -0.6 0" />
        </filter>
        <clipPath id="tfBoreCollarClip">
          <circle cx="200" cy="200" r="199" />
        </clipPath>
      </defs>

      {/* the cast collar the door seats into */}
      <circle cx="200" cy="200" r="198" fill="#1d2118" stroke="#0b0d08" strokeWidth="3" />

      {/* ten lug sockets punched through the collar */}
      {SOCKETS.map((_, i) => (
        <g key={`sock-${i}`} transform={`rotate(${i * 36} 200 200)`}>
          <path
            d="M164 54 L171 6 L182 1.5 L218 1.5 L229 6 L236 54 Z"
            fill="url(#tfBoreSocket)"
            stroke="#05070a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* light catching the socket's lower machined lip */}
          <path d="M167 52 L233 52" stroke="rgba(233,235,223,0.07)" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}

      {/* collar bolts between the sockets */}
      {SOCKETS.map((_, i) => (
        <g key={`cbolt-${i}`} transform={`rotate(${i * 36 + 18} 200 200)`}>
          <circle cx="200" cy="18" r="3.4" fill="#3c4434" stroke="#0b0d08" strokeWidth="1.3" />
        </g>
      ))}

      {/* the bore itself: machined rim, then nothing */}
      <circle cx="200" cy="200" r="170" fill="url(#tfBoreDepth)" />
      <circle cx="200" cy="200" r="170" fill="url(#tfBoreGlow)" />
      <circle cx="200" cy="200" r="170" fill="none" stroke="#262b20" strokeWidth="5" />
      <circle cx="200" cy="200" r="165" fill="none" stroke="#0a0c08" strokeWidth="3" />
      {/* shadow falling into the opening from above — across the WHOLE
          silhouette, sockets included, so no edge cuts the notches off */}
      <rect x="0" y="0" width="400" height="400" clipPath="url(#tfBoreCollarClip)" fill="url(#tfBoreTopShade)" />

      {/* the collar has weathered right along with the door */}
      <g clipPath="url(#tfBoreCollarClip)">
        <rect x="0" y="0" width="400" height="400" filter="url(#tfBoreGrime)" opacity="0.45" />
      </g>
    </svg>
  );
}

/** The vault door: a toothed gear ring, hub stamped DC 2026. */
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

function Countdown({ still, home = false }: { still: boolean; home?: boolean }) {
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

  /* The live states belong to the fused home page; the original
     activation page keeps its plain ticking countdown, untouched. */
  if (home) {
    /* After the con: the page stays up as an archive, so say so. */
    if (now >= TAKEOVER_END.getTime()) {
      return (
        <p className={s.countOpen}>TRANSMISSION ARCHIVED — SEE YOU IN 2027</p>
      );
    }

    /* During the con: the countdown's job is done — point at the carts. */
    if (now >= DOORS_OPEN.getTime()) {
      return (
        <div className={s.countOpenWrap}>
          <p className={s.countOpen}>THE DOORS ARE OPEN</p>
          <a className={s.countJump} href="#find-the-carts">
            FIND THE CARTS ↑
          </a>
        </div>
      );
    }
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
  "COPYRIGHT 2044-2077 TWIN-TEC INDUSTRIES",
  "-EXEC VERSION 41.10",
  "64K RAM SYSTEM",
  "38911 BYTES FREE",
  "NO HOLOTAPE FOUND",
  "LOAD ROM(1): DEITRIX 303",
  "> RUN TRANSMISSION.EXE_",
];

/* ------------------------------------------- the tabbed wrist console */

const PIP_TABS = ["STAT", "CREW", "LOG", "DATA", "BREW", "GAME"] as const;
type PipTab = (typeof PIP_TABS)[number];

/* The unit's own interface clicks — one picked at random per press so
   paging around doesn't sound like a sample on a key. */
const PIP_CLICKS = [
  "/audio/dragoncon/pip-click-0.mp3",
  "/audio/dragoncon/pip-click-1.mp3",
];

/**
 * The home page's pip-boy: same housing, bigger screen, no video feed —
 * a working interface instead. Everything that used to sprawl down the
 * page as separate terminals lives here as menus, the way the real unit
 * pages between STAT/INV/DATA: crew stats, the Junebug dossier, the
 * proprietor's log, the public record + house rules, the encrypted
 * manifest, and CATCH THE POUR. Click a tab, click a pod button, or
 * arrow-key across the tablist.
 */
function PipBoyConsole({ still }: { still: boolean }) {
  const [phase, setPhase] = useState<"boot" | "ui">(still ? "ui" : "boot");
  const [shown, setShown] = useState(still ? PIPBOY_BOOT.length : 0);
  const [tab, setTab] = useState<PipTab>("STAT");

  useEffect(() => {
    if (still || phase !== "boot") return;
    if (shown < PIPBOY_BOOT.length) {
      const id = setTimeout(() => setShown((v) => v + 1), 200);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setPhase("ui"), 650);
    return () => clearTimeout(id);
  }, [shown, phase, still]);

  /* Cloned on play like the game cues, so fast paging overlaps instead
     of cutting itself off. Honours the session's sound-off preference. */
  const clickSfx = useRef<HTMLAudioElement[]>([]);
  useEffect(() => {
    clickSfx.current = PIP_CLICKS.map((src) => {
      const el = new Audio(src);
      el.preload = "auto";
      el.load();
      return el;
    });
  }, []);

  const playClick = () => {
    if (readSoundOff()) return;
    const pool = clickSfx.current;
    const base = pool[Math.floor(Math.random() * pool.length)];
    if (!base) return;
    const node = base.cloneNode() as HTMLAudioElement;
    node.volume = 0.4;
    void node.play().catch(() => {});
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    const i = PIP_TABS.indexOf(tab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = PIP_TABS[(i + 1) % PIP_TABS.length];
      playClick();
      setTab(next);
      document.getElementById(`pip-tab-${next}`)?.focus();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = PIP_TABS[(i + PIP_TABS.length - 1) % PIP_TABS.length];
      playClick();
      setTab(prev);
      document.getElementById(`pip-tab-${prev}`)?.focus();
    }
  };

  return (
    <div className={`${s.pipboy} ${s.pipboyWide}`}>
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
        {/* somebody on the crew taped this to the bezel */}
        <span className={s.pipNote} aria-hidden="true">
          <i className={s.noteClick}>Click</i>
          <i className={s.noteTap}>Tap</i> to interact!
        </span>
        <div className={`${s.pipScreen} ${s.pipScreenTall}`}>
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
            </div>
          ) : (
            <div className={s.pipUi}>
              <div
                className={s.pipTabs}
                role="tablist"
                aria-label="Pip-Boy sections"
                onKeyDown={onTabKey}
              >
                {PIP_TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    id={`pip-tab-${t}`}
                    aria-selected={tab === t}
                    aria-controls="pip-pane"
                    tabIndex={tab === t ? 0 : -1}
                    className={s.pipTab}
                    data-active={tab === t || undefined}
                    onClick={() => {
                      playClick();
                      setTab(t);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div
                className={s.pipPane}
                role="tabpanel"
                id="pip-pane"
                aria-labelledby={`pip-tab-${tab}`}
              >
                {tab === "STAT" && (
                  <>
                    <p className={s.pipHeading}>CREW VITALS — S.P.E.C.I.A.L.</p>
                    <ul className={s.special}>
                      {SPECIAL.map((stat) => (
                        <li key={stat.letter}>
                          <b>{stat.letter}</b>
                          <span className={s.specialWord}>{stat.word}</span>
                          <span className={s.specialBar}>
                            <motion.i
                              initial={still ? { width: `${stat.value * 10}%` } : { width: 0 }}
                              animate={{ width: `${stat.value * 10}%` }}
                              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </span>
                          <span className={s.specialVal}>{stat.value}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {tab === "LOG" && (
                  <>
                    <p className={s.pipHeading}>PROPRIETOR&apos;S LOG — ENTRY 001</p>
                    <p>
                      Twin Fins opened on the Outer Banks in 2044 and walked
                      inland with the Banks Caravan when the storms took the
                      fresh water. The counter still has tidehouse wood in it.
                    </p>
                    <p>
                      This weekend, the cart goes underground. Some doors are
                      better opened in person.
                    </p>
                    <p className={s.termSign}>— Junebug, Proprietor</p>
                  </>
                )}

                {tab === "DATA" && (
                  <>
                    <p className={s.pipHeading}>PUBLIC RECORD — THE NINETEEN MINUTES</p>
                    <p>
                      October 23, 2077: Atlanta got nineteen minutes of
                      warning, and strangers kept the lights burning under the
                      city long after the last train stopped.
                    </p>
                    <p>
                      Two centuries later, downtown is the Vega — and beneath
                      a Hotel Corridor skybridge hangs a weathered caravan
                      sign with two fins on it.
                    </p>
                    <p className={s.pipHeading}>HOUSE RULES — POSTED AT THE DOOR</p>
                    <p>
                      NO DRAWN WEAPONS
                      <br />
                      NO UNPAID TABS
                      <br />
                      NO COUNCIL BUSINESS AFTER MIDNIGHT
                      <br />
                      YES, THE WATER IS FILTERED
                      <br />
                      NO, YOU MAY NOT INSPECT THE FILTER
                    </p>
                    <p className={s.termFoot}>
                      COME THIRSTY. LEAVE YOUR QUARREL OUTSIDE.
                    </p>
                  </>
                )}

                {tab === "CREW" && (
                  <>
                    <p className={s.pipHeading}>CREW FILE 001 — RESTRICTED</p>
                    <dl className={s.dossierRows}>
                      <div>
                        <dt>DESIGNATION</dt>
                        <dd>&ldquo;JUNEBUG&rdquo; — PROPRIETOR</dd>
                      </div>
                      <div>
                        <dt>AFFILIATION</dt>
                        <dd>THE CREW · BANKS CARAVAN LINE</dd>
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
                        <dt>THREAT LEVEL</dt>
                        <dd>FULLY CAFFEINATED</dd>
                      </div>
                    </dl>
                    <p className={s.termFoot}>
                      SIGNAL STRONGEST NEAR THE ESPRESSO MACHINE. DON&apos;T
                      ASK WHAT BREW-004 IS — SHE WON&apos;T TELL YOU.
                    </p>
                  </>
                )}

                {tab === "GAME" && (
                  <>
                    <p className={s.pipHeading}>
                      PROGRAM 07 — CATCH THE POUR · 12+ = STAFF
                    </p>
                    <PourGame />
                  </>
                )}

                {tab === "BREW" && (
                  <>
                    <p className={s.pipHeading}>DRINK MANIFEST — ENCRYPTED</p>
                    <ul className={s.manifest}>
                      {MANIFEST.map((item) => (
                        <li key={item.code}>
                          <span className={s.manCode}>
                            {item.code} — ENCRYPTION: ACTIVE
                          </span>
                          <span className={s.manName}>
                            <CipherText length={item.length} still={still} />
                          </span>
                          <span className={s.manNote}>{item.note}</span>
                        </li>
                      ))}
                    </ul>
                    <p className={s.termFoot}>FULL MENU DECRYPTS ON THE CON FLOOR.</p>
                  </>
                )}
              </div>
            </div>
          )}
          <span className={s.scanlines} aria-hidden="true" />
          <span className={s.pipGlass} aria-hidden="true" />
        </div>

        <div className={s.pipPod}>
          {(["LOG", "BREW", "DATA"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={s.pipBtn}
              data-active={phase === "ui" && tab === t ? true : undefined}
              onClick={() => {
                playClick();
                setPhase("ui");
                setTab(t);
              }}
            >
              <i />
              {t}
            </button>
          ))}
        </div>
      </div>

      <span className={s.pipBarrel} aria-hidden="true" />
    </div>
  );
}

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
export default function Vault({ home = false }: { home?: boolean }) {
  const still = useReducedMotion() ?? false;

  /* Original activation-page hero keeps its scroll parallax on the door
     backdrop. Hooks run unconditionally; the style is only applied there. */
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const doorY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  /* The door ceremony plays ONCE per page load — an in-memory flag, not
     sessionStorage, is the point: navigating away and back mounts the
     vault with the door already parked and the title lit (no re-spin, no
     second rumble), while an actual reload starts a fresh page and gets
     the full ceremony again. Safe to read in a lazy initializer: on the
     home page this component only ever mounts client-side (after the
     takeover), and on /dragon-con the home path is never taken. */
  const [doorPlayed] = useState(() => doorCeremonyDone);
  useEffect(() => {
    if (home) doorCeremonyDone = true;
  }, [home]);

  /* Reduced motion or an already-played ceremony both land on the same
     parked end-state. */
  const parked = still || doorPlayed;

  /* The vault-door opening sound, home takeover only. Autoplay is best
     effort (Chromium usually allows it; Safari never does un-gestured) —
     so the first pointer/key gesture starts the clip SEEKED to wherever
     the door animation already is, keeping sound and motion on the one
     timeline no matter how late the browser lets audio through. Past the
     door's useful window we stay silent — a rumble landing on a random
     click mid-scroll would be worse. Respects the session's sound-off
     preference. */
  const doorSfx = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!home || still || doorPlayed || readSoundOff()) return;
    const el = doorSfx.current;
    if (!el) return;
    el.volume = 0.55;
    /* the CSS timeline started with this mount — remember when, so a
       gesture-gated start can join it in progress */
    const t0 = performance.now();
    void el.play().catch(() => {});
    const onGesture = () => {
      cleanup();
      if (!el.paused || el.ended) return;
      const elapsed = (performance.now() - t0) / 1000;
      if (elapsed >= 13.5) return;
      el.currentTime = elapsed;
      void el.play().catch(() => {});
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      cleanup();
      el.pause();
    };
  }, [home, still, doorPlayed]);

  /* The sublevel's quiet ambient bed (cut at -9dB): fades in over ~2.5s
     as the door sound ends with the hole standing open — or right away on
     mounts where the ceremony already played — then loops until the page
     is left. Same sound-off preference as everything else. */
  const ambientSfx = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!home || readSoundOff()) return;
    const amb = ambientSfx.current;
    if (!amb) return;
    let raf = 0;
    let stopped = false;
    const fadeIn = () => {
      if (stopped) return;
      amb.volume = 0;
      amb
        .play()
        .then(() => {
          offGesture();
          const t0 = performance.now();
          const step = (t: number) => {
            if (stopped) return;
            /* rAF timestamps can land a hair BEFORE the performance.now()
               captured at schedule time — clamp both ends or volume throws */
            const k = Math.min(1, Math.max(0, (t - t0) / 2500));
            amb.volume = k;
            if (k < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        })
        .catch(() => {
          /* Safari refused an un-gestured start — stay armed and let the
             next tap bring the bed up instead */
          armGesture();
        });
    };

    /* the gesture fallback: if the same gesture just started the DOOR
       clip, hold off (the timeupdate hand-off below owns the fade-in);
       otherwise start the bed now */
    const onGesture = () => {
      if (stopped || !amb.paused) return;
      const door = doorSfx.current;
      if (door && !door.paused && !door.ended && door.currentTime < 13.8) return;
      fadeIn();
    };
    const armGesture = () => {
      window.addEventListener("pointerdown", onGesture);
      window.addEventListener("keydown", onGesture);
    };
    const offGesture = () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };

    const door = doorSfx.current;
    if (still || doorPlayed || !door) {
      fadeIn();
      return () => {
        stopped = true;
        offGesture();
        cancelAnimationFrame(raf);
        amb.pause();
      };
    }
    /* first play-through: come up under the door sound's own fade-out */
    const onTime = () => {
      if (door.currentTime >= 13.8) {
        door.removeEventListener("timeupdate", onTime);
        fadeIn();
      }
    };
    door.addEventListener("timeupdate", onTime);
    armGesture();
    return () => {
      stopped = true;
      offGesture();
      cancelAnimationFrame(raf);
      door.removeEventListener("timeupdate", onTime);
      amb.pause();
    };
  }, [home, still, doorPlayed]);

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

      {home ? (
        <>
          {/* ---------------------------------------- door + title
              Choreography transcribed from the Vault 101 opening, and the
              audio IS that clip's own track (cut at 15.0s), so sound and
              motion share one timeline — and the door moves from the very
              first grind: unseated while the machinery grinds (0–2s),
              breaking free OUT of the bore ON the slam, creeping left
              under the low rumble, then carried to the wall by the
              rolling screech (6.5–10.5s), parking with a third still in
              frame at the clunk. DRAGON CON 2026 lights up in the bore
              as the doorway clears. Pure CSS; reduced motion (and every
              later mount this page load) gets the parked end-state only.
              No pip-boy feature here — the door owns the home page's
              audio and attention; the transmission stays on /dragon-con. */}
          <section className={s.hero}>
            <div className={s.stage} data-still={parked || undefined}>
              <DoorBore />
              <div className={s.stageTitle}>
                {/* the full lockup glowing in the dark of the bore, the
                    headline under it, and the reason to keep scrolling */}
                <Wordmark className={s.stageMark} />
                <h1 className={s.title}>
                  <span>DRAGON CON</span>
                  <b>2026</b>
                </h1>
                <p className={s.tagline}>
                  War never changes. <em>Coffee does.</em>
                </p>
                <p className={s.stageHook}>
                  <b>
                    EXCLUSIVE <i className={s.noBreak}>CON-ONLY</i> DRINKS
                  </b>
                  <span>SEP 4–7 · AMERICASMART · ATLANTA</span>
                </p>
              </div>
              <div className={s.stageDoor} aria-hidden="true">
                <div className={s.doorShake}>
                  <DoorPlate />
                </div>
              </div>
            </div>

            <span className={s.heroFloor} aria-hidden="true" />
            <audio
              ref={doorSfx}
              src="/audio/dragoncon/vault-door.mp3"
              preload="auto"
            />
            <audio
              ref={ambientSfx}
              src="/audio/dragoncon/vault-ambience.mp3"
              preload="auto"
              loop
            />
          </section>

          {/* ------------------------------------------ wrist console */}
          <section className={s.pipHero}>
            <p className={s.stamp}>SUBLEVEL ACCESS — AUTHORIZED PERSONNEL</p>
            <PipBoyConsole still={still} />
          </section>
        </>
      ) : (
        <>
          {/* --------------------------------------- pipboy feature */}
          <section className={s.pipHero}>
            <p className={s.stamp}>SUBLEVEL ACCESS — AUTHORIZED PERSONNEL</p>
            <PipBoyHero still={still} />
          </section>

          {/* ---------------------------------------- door + title */}
          <section className={s.hero} ref={ref}>
            <motion.div
              style={still ? undefined : { y: doorY }}
              className={s.heroDoor}
            >
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
        </>
      )}

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

      {/* ------------------------------------- find the carts (IRL) */}
      {home && <VaultLocate />}

      {/* ------------- terminals (activation page only; on home these
          live inside the pip-boy console's menus) */}
      {!home && (
      <section className={`shell ${s.deck}`}>
        <article className={s.terminal}>
          <header className={s.termHead}>
            <span />
            <span />
            <p>PROPRIETOR&apos;S LOG — ENTRY 001</p>
          </header>
          <div className={s.termBody}>
            <p>
              The name on the sign is older than the crater. Twin Fins opened
              on the Outer Banks in 2044, fed a coast the bombs missed, and
              walked inland with the Banks Caravan when the storms took the
              fresh water. The counter still has tidehouse wood in it.
            </p>
            <p>
              This Labor Day weekend, the cart goes underground. Custom
              drinks. A full build-out. Two centuries of road behind the
              counter.
            </p>
            <p>
              We could tell you the rest. But some doors are better opened
              in person.
            </p>
            <p className={s.termSign}>— Junebug, Proprietor</p>
          </div>
        </article>

        <article className={s.terminal}>
          <header className={s.termHead}>
            <span />
            <span />
            <p>PUBLIC RECORD — THE NINETEEN MINUTES</p>
          </header>
          <div className={s.termBody}>
            <p>
              On October 23, 2077, Atlanta got nineteen minutes of warning.
              People fled below — parking decks, service corridors, MARTA
              stations — and strangers kept the emergency lights burning long
              after the last train stopped.
            </p>
            <p>
              Two centuries later, downtown is the Vega, named for the
              surviving letters on the ruined CORVEGA stadium sign. In its
              Hotel Corridor, beneath a skybridge, hangs a weathered caravan
              sign with two fins on it.
            </p>
            <p className={s.termFoot}>
              TWIN FINS CAME A LONG WAY TO GET HERE. SO DID EVERYBODY ELSE.
            </p>
          </div>
        </article>

        <article className={s.terminal}>
          <header className={s.termHead}>
            <span />
            <span />
            <p>HOUSE RULES — POSTED AT THE DOOR</p>
          </header>
          <div className={s.termBody}>
            <p>
              NO DRAWN WEAPONS
              <br />
              NO UNPAID TABS
              <br />
              NO COUNCIL BUSINESS AFTER MIDNIGHT
              <br />
              YES, THE WATER IS FILTERED
              <br />
              NO, YOU MAY NOT INSPECT THE FILTER
            </p>
            <p className={s.termFoot}>
              COME THIRSTY. LEAVE YOUR QUARREL OUTSIDE.
            </p>
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

      )}

      {/* ------------------------------------------------- rec. room */}
      {!home && (
      <section className={s.rec} aria-labelledby="rec-title">
        <div className={`shell ${s.recHead}`}>
          <p className={s.stamp}>RECREATION TERMINAL — SUBLEVEL 2</p>
          <h2 className={s.recTitle} id="rec-title">
            Two hundred years is a long shift.
          </h2>
          <p className={s.recLede}>
            The Crew had to do something between pours on the road from the
            Banks. Catch the drips, don&rsquo;t spill the bean water. Twelve
            or better and the machine considers you staff.
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

      )}

      {/* -------------------------------------------------- crew file */}
      {!home && (
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
                  <dd>&ldquo;JUNEBUG&rdquo; — PROPRIETOR</dd>
                </div>
                <div>
                  <dt>AFFILIATION</dt>
                  <dd>THE CREW · BANKS CARAVAN LINE</dd>
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
      )}

      {/* ------------------------------------------------- countdown */}
      <section className={`shell ${s.countdown}`}>
        <p className={s.stamp}>DOORS OPEN — LABOR DAY WEEKEND · THE VEGA, ATLANTA</p>
        <Countdown still={still} home={home} />
        <p className={s.countNote}>
          You made it to the Vega. Check your weapon, choose your ration, and
          take a seat. Road&rsquo;s open. Light&rsquo;s on. Come back
          breathing.
        </p>

        {/* the surface site never went away — routes back up top */}
        {home && (
          <div className={s.countLinks}>
            <Link href="/booking">BOOK THE CART</Link>
            <Link href="/menu">SURFACE MENU</Link>
            <a
              href="https://instagram.com/twinfinscoffee"
              target="_blank"
              rel="noopener noreferrer"
            >
              @TWINFINSCOFFEE
            </a>
          </div>
        )}
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
