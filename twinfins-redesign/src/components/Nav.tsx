"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";

import { NAV, BRAND } from "@/lib/content";
import { InstagramMark, Monogram } from "./BrandMarks";
import { ButtonLink } from "./Button";
import { Magnetic } from "./motion-primitives";
import s from "./Nav.module.css";

const LENS_MAP =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27300%27%20height%3D%2780%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27gx%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%270%27%3E%3Cstop%20offset%3D%270%27%20stop-color%3D%27%23000%27/%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%23f00%27/%3E%3C/linearGradient%3E%3ClinearGradient%20id%3D%27gy%27%20x1%3D%270%27%20x2%3D%270%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%27%20stop-color%3D%27%23000%27/%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%230f0%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%27300%27%20height%3D%2780%27%20fill%3D%27%23000%27/%3E%3Crect%20width%3D%27300%27%20height%3D%2780%27%20rx%3D%2740%27%20fill%3D%27url%28%23gx%29%27/%3E%3Crect%20width%3D%27300%27%20height%3D%2780%27%20rx%3D%2740%27%20fill%3D%27url%28%23gy%29%27%20style%3D%27mix-blend-mode%3Ascreen%27/%3E%3Crect%20x%3D%2724%27%20y%3D%2720%27%20width%3D%27252%27%20height%3D%2740%27%20rx%3D%2720%27%20fill%3D%27%237f7f00%27%20style%3D%27filter%3Ablur%2824px%29%27/%3E%3C/svg%3E";

export default function Nav() {
  const pathname = usePathname();
  const barRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  /* The glass transmits, so legibility depends on what's underneath it.
     Rather than hand-annotating every dark section (and chasing every new
     one), sample the page directly: find the first element under the bar's
     midline that actually paints a background colour, and read its
     luminance. Dark surface → cream text and smoked glass; light surface →
     navy text and cream glass. */
  const toneClock = useRef(0);
  const senseTone = () => {
    /* elementsFromPoint + getComputedStyle force layout — run per scroll
       FRAME and the whole page pays for it. A tone flip isn't a per-frame
       decision; every ~150ms is indistinguishable to the eye. */
    const now = performance.now();
    if (now - toneClock.current < 150) return;
    toneClock.current = now;
    const bar = barRef.current;
    if (!bar) return;
    const r = bar.getBoundingClientRect();
    const hits = document.elementsFromPoint(
      window.innerWidth / 2,
      r.top + r.height / 2,
    );
    for (const hit of hits) {
      if (hit.closest("header") || hit.tagName === "HTML") continue;
      let node: Element | null = hit;
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        /* Chromium serializes as rgb()/rgba(); Safari reports color-mix()
           backgrounds as color(srgb r g b / a) with 0–1 channels. Parse
           both, or Safari sections silently never flip the tone. */
        let rgb: [number, number, number] | null = null;
        let alpha = 1;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        const c = bg.match(
          /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/,
        );
        if (m) {
          rgb = [+m[1], +m[2], +m[3]];
          alpha = m[4] === undefined ? 1 : parseFloat(m[4]);
        } else if (c) {
          rgb = [+c[1] * 255, +c[2] * 255, +c[3] * 255];
          alpha = c[4] === undefined ? 1 : parseFloat(c[4]);
        }
        if (rgb && alpha > 0.5) {
          const lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
          setDark(lum < 112);
          return;
        }
        node = node.parentElement;
      }
      /* No painted background in that chain — try the next element under
         the point rather than giving up (overlays, media, wrappers). */
    }
    setDark(false);
  };

  /* Every page opens on a dark photographic hero, so the bar starts in its
     light-on-dark state and flips once you've scrolled past it. Without this
     the navy links sat on a dark photo and were unreadable. */
  useMotionValueEvent(scrollY, "change", (y) => {
    setStuck(y > 64);
    senseTone();
  });
  const overHero = !stuck;

  /* On a mid-page reload the browser restores scroll position but no scroll
     event fires, so without this the bar renders its transparent over-hero
     state on top of whatever light section you reloaded into. */
  useEffect(() => {
    setStuck(window.scrollY > 64);
    senseTone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Displacement map for the pill's edge refraction. The map is an
          inline SVG: red encodes X-shift, green encodes Y-shift, and a
          blurred neutral-grey core zeroes the middle so only the rim bends.
          Chromium applies it via backdrop-filter: url(); engines that don't
          support filter references fall back to the plain blur stack. */}
      <svg className={s.lensDefs} aria-hidden="true" focusable="false">
        <filter id="tf-lens">
          <feImage
            href={LENS_MAP}
            preserveAspectRatio="none"
            result="map"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="-96"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <header className={s.wrap}>
        <nav
          ref={barRef}
          className={s.bar}
          data-stuck={stuck}
          data-over-hero={overHero}
          data-tone={dark ? "dark" : "light"}
          aria-label="Primary"
        >
          <Link href="/" className={s.brand}>
            <Monogram className={s.mark} title={`${BRAND.name} home`} />
            <span className={s.brandName}>
              <b>Twin Fins</b>
              <small>{BRAND.tagline}</small>
            </span>
          </Link>

          <ul className={s.links}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={s.link}
                  data-active={pathname === item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={s.actions}>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={s.socialLink}
              aria-label={`${BRAND.name} on Instagram — @${BRAND.instagram}`}
            >
              <InstagramMark className={s.socialIcon} />
            </a>

            <Magnetic strength={0.18}>
              <ButtonLink
                href="/booking"
                variant={overHero ? "cream" : "sea"}
                className={s.cta}
              >
                Book us
              </ButtonLink>
            </Magnetic>

            <button
              type="button"
              className={s.burger}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={s.burgerLines}>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className={s.sheet}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <Monogram className={s.sheetMark} />

            <motion.ul
              className={s.sheetNav}
              initial="hidden"
              animate="shown"
              transition={{ staggerChildren: 0.055, delayChildren: 0.15 }}
            >
              {NAV.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { y: 28, opacity: 0 },
                    shown: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <Link
                    href={item.href}
                    className={s.sheetLink}
                    data-active={pathname === item.href}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <div className={s.sheetFoot}>
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={s.sheetSocial}
              >
                <InstagramMark className={s.sheetSocialIcon} />
                Instagram @{BRAND.instagram}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
