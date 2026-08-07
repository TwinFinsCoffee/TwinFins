/**
 * Line-art marks redrawn from the Twin Fins pattern collateral:
 * palm, wave, sand dollar, surfboard, coconut, sunrise.
 * All inherit `currentColor` so they can sit on any brand surface.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Palm(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M32 22v34" strokeWidth={4} />
      <path d="M32 22c-6-7-14-8-19-4 6-1 11 1 14 5" fill="currentColor" stroke="none" />
      <path d="M32 22c6-7 14-8 19-4-6-1-11 1-14 5" fill="currentColor" stroke="none" />
      <path d="M32 22c-4-8-3-15 2-18-2 5-1 11 1 15" fill="currentColor" stroke="none" />
      <path d="M32 22c4-6 11-9 17-7-6 1-11 4-13 8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Wave(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M4 46c10-2 14-12 18-22S32 8 42 10s16 12 16 22" />
      <path d="M12 46c6-2 9-9 12-17s7-13 14-12" />
      <path d="M21 46c4-2 6-7 8-13" />
      <path d="M42 10c6 4 9 12 9 22" />
      <path d="M4 52h56" />
    </svg>
  );
}

export function SandDollar(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M32 6c14 0 26 11 26 26S46 58 32 58 6 47 6 32 18 6 32 6Z" />
      <ellipse cx="32" cy="19" rx="3.5" ry="7" />
      <ellipse cx="32" cy="45" rx="3.5" ry="7" />
      <ellipse cx="19" cy="32" rx="7" ry="3.5" />
      <ellipse cx="45" cy="32" rx="7" ry="3.5" />
      <circle cx="32" cy="32" r="2" />
    </svg>
  );
}

export function Surfboard(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path
        d="M8 50c14-6 34-26 44-40C40 14 18 34 8 50Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M22 40 34 28" stroke="var(--cream)" strokeWidth={2.6} />
    </svg>
  );
}

export function Coconut(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M16 26h32l-4 28a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4Z" />
      <ellipse cx="32" cy="26" rx="16" ry="5" />
      <path d="M38 24 52 8" />
      <path d="M26 24 22 12" />
      <path d="M14 12h16l-8 6Z" fill="currentColor" stroke="none" />
      <path d="M26 38v10M32 40v8M38 38v10" strokeWidth={1.6} />
    </svg>
  );
}

export function Sunrise(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M18 36a14 14 0 0 1 28 0" fill="currentColor" stroke="none" />
      <path d="M32 6v8M14 14l5 5M50 14l-5 5M4 30h8M52 30h8" />
      <path d="M6 44c5-3 9-3 13 0s9 3 13 0 9-3 13 0 9 3 13 0" />
      <path d="M6 52c5-3 9-3 13 0s9 3 13 0 9-3 13 0 9 3 13 0" />
    </svg>
  );
}

export function Cup(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M17 20h30l-4 34a5 5 0 0 1-5 4H26a5 5 0 0 1-5-4Z" />
      <path d="M14 20h36" strokeWidth={3} />
      <path d="M38 20 41 6" />
      <path d="M20 32h24" strokeWidth={1.6} />
    </svg>
  );
}

export function Star(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" {...props} aria-hidden="true">
      <path d="M32 2c2 16 14 28 30 30-16 2-28 14-30 30-2-16-14-28-30-30C18 30 30 18 32 2Z" />
    </svg>
  );
}

export function Gull(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M14 34c6-8 12-8 18-1 6-7 12-7 18 1" />
    </svg>
  );
}

export function Earth(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <circle cx="32" cy="32" r="22" />
      {/* wobbly landmasses, drawn loose on purpose */}
      <path d="M14 26c5-2 8 1 12-1s3-6 8-6 6 3 4 6-7 2-8 6 3 5 8 4" />
      <path d="M20 44c4-3 9-1 12 2s7 2 9-1" />
      <path d="M44 20c2 2 5 2 7 1" />
    </svg>
  );
}

export function Portafilter(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M18 24h28l-3 10a11 11 0 0 1-22 0Z" />
      <path d="M46 26h8" />
      <path d="M28 44v6M36 44v6" />
      <path d="M26 16c0-3 3-3 3-6M36 16c0-3 3-3 3-6" />
    </svg>
  );
}

export function Beans(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <ellipse cx="24" cy="26" rx="9" ry="12" transform="rotate(-24 24 26)" />
      <path d="M20 16c4 6 0 14-2 19" />
      <ellipse cx="41" cy="40" rx="9" ry="12" transform="rotate(28 41 40)" />
      <path d="M45 30c-4 6 0 14 2 19" />
    </svg>
  );
}

export function MilkCarton(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M24 12h16l6 10v28H18V22Z" />
      <path d="M18 22h28M24 12l6 10v28" />
      <path d="M36 34c2-2 6-2 8 0" />
    </svg>
  );
}

export function Whisk(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M32 8v14" />
      <path d="M22 22h20l-3 22c-1 5-13 5-14 0Z" />
      <path d="M27 22l2 22M37 22l-2 22M32 22v23" />
    </svg>
  );
}

export function TapCard(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="10" y="20" width="34" height="24" rx="4" />
      <path d="M10 28h34" />
      <path d="M48 24c3 3 3 13 0 16M53 20c5 5 5 19 0 24" />
    </svg>
  );
}

export function Turtle(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <ellipse cx="30" cy="32" rx="14" ry="11" />
      <path d="M30 21v22M20 27l20 10M40 27 20 37" />
      <path d="M44 28c4-1 7 1 8 4-3 2-6 2-9 0" />
      <path d="M18 24c-2-3-2-6 0-8 3 1 4 3 4 6M42 42c2 3 2 5 0 7-3-1-4-3-4-5M20 41c-2 2-3 5-2 7 3 0 5-2 5-4" />
    </svg>
  );
}

export const DOODLES = [Palm, Wave, SandDollar, Surfboard, Coconut, Sunrise] as const;
