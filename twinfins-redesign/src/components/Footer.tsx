"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { BRAND, NAV, SERVED_AT } from "@/lib/content";
import { InstagramMark, Wordmark } from "./BrandMarks";
import s from "./Footer.module.css";
import { ButtonLink } from "./Button";

/**
 * Oxford-comma joiner for the trademark line below — built off SERVED_AT
 * itself so the disclaimer can't drift out of sync with the logo row it's
 * covering. Add a venue there and it's named here automatically.
 */
function listWithAnd(items: readonly string[]) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // The lockup settles and surfaces as the footer comes into frame.
  const wordScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const wordFade = useTransform(scrollYProgress, [0, 0.8], [0.35, 1]);

  return (
    <footer className={s.footer} ref={ref}>
      <div className={`shell ${s.top}`}>
        <div className={s.pitch}>
          <p className={s.pitchTitle}>
            We can&rsquo;t wait to sea you. 🌊
          </p>
          <p className={s.pitchBody}>
            Follow along to see where the cart pops up next, or drop us a line
            and we&rsquo;ll bring paradise to you.
          </p>
          <div className={s.pitchActions}>
            <ButtonLink href="/booking" variant="sea">
              Book the cart
            </ButtonLink>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={s.socialLink}
              aria-label={`${BRAND.name} on Instagram — @${BRAND.instagram}`}
            >
              <InstagramMark className={s.socialIcon} />
            </a>
          </div>
        </div>

        <nav className={s.col} aria-label="Footer">
          <p className={s.colTitle}>Explore</p>
          <ul className={s.colList}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={s.colLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.col}>
          <p className={s.colTitle}>Say hello</p>
          <ul className={s.colList}>
            <li>
              <a href={`mailto:${BRAND.email}`} className={s.colLink}>
                {BRAND.email}
              </a>
            </li>
            <li>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={s.colLink}
              >
                Instagram @{BRAND.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={s.wordmarkWrap}>
        <motion.div
          style={still ? undefined : { scale: wordScale, opacity: wordFade }}
          className={s.wordmarkInner}
        >
          <Wordmark className={s.wordmark} title={BRAND.name} />
        </motion.div>
        <p className={s.signoff}>
          Est. {BRAND.est} · {BRAND.promise}
        </p>
        <p className={s.positioning}>{BRAND.positioning}</p>
        <p className={s.owner}>
          {BRAND.city} · Owned by{" "}
          <a href={BRAND.ownerInstagramUrl} target="_blank" rel="noreferrer">
            @{BRAND.ownerInstagram}
          </a>
        </p>
      </div>

      {/* Trademark notice for the "Served At" logo strip. Nominative fair
          use — naming a venue to say "we worked here" doesn't require their
          permission, but it does require making clear there's no
          affiliation, sponsorship, or endorsement. Built off SERVED_AT
          itself so every logo in that band is named here by construction. */}
      <div className={`shell ${s.trademarks}`}>
        <p>
          {listWithAnd(SERVED_AT.map((v) => v.name))} are trademarks of their
          respective owners. Their names and marks appear on this site solely
          to identify venues, events, and appearances where {BRAND.name} has
          provided coffee service, and their inclusion does not imply any
          sponsorship, endorsement, partnership, or other affiliation between{" "}
          {BRAND.name} and those organizations. All product names, logos, and
          brands referenced anywhere on this site remain the property of
          their respective owners, and use of those names, logos, and brands
          is for identification purposes only.
        </p>
      </div>

      <div className={`shell ${s.bottom}`}>
        <p>
          © {new Date().getFullYear()} {BRAND.name} — All rights reserved.
        </p>
        <ul className={s.legal}>
          <li>
            <Link href="/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </li>
        </ul>
        <button
          type="button"
          className={s.toTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
