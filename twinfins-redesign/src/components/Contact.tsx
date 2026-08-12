"use client";

import { BRAND } from "@/lib/content";
import { Button } from "./Button";
import { Sunrise } from "./Doodles";
import { useBookingModal } from "./BookingModalContext";
import { Magnetic, Reveal, SplitText } from "./motion-primitives";
import s from "./Contact.module.css";

/**
 * The closing call-to-action, on every page.
 *
 * There is deliberately no form here. Bookings, quotes, and questions all
 * run through the CalendTree scheduler — the single shared modal mounted at
 * the root — so every enquiry lands in one place with the date, headcount,
 * and contact details already attached, instead of arriving as loose email
 * that has to be chased. The email and Instagram links below are direct
 * contact details, not a second intake channel.
 */
const WHAT_YOU_CAN_DO = [
  "Check live availability and hold your date",
  "Tell us the headcount, venue, and vibe",
  "Get a custom quote back — usually same day",
];

export default function Contact({
  heading = "Let’s get this party started.",
  eyebrow = "Get your custom quote",
}: {
  heading?: string;
  eyebrow?: string;
}) {
  const { openBooking } = useBookingModal();

  return (
    <section className={s.section} id="contact">
      <svg
        className={s.wave}
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0h2880v34c-160 36-320-24-480-12s-320 48-480 24-320-36-480-12-320 44-480 20S160 34 0 58Z"
          fill="currentColor"
        />
      </svg>

      <div className={`shell ${s.grid}`}>
        <div className={s.copy}>
          <Reveal as="p" className="eyebrow">
            {eyebrow}
          </Reveal>
          <SplitText as="h2" className={`display ${s.title}`} text={heading} />
          <Reveal as="p" className={s.body} delay={0.08}>
            Tell us the date, the headcount, and the vibe. We&rsquo;ll come back
            with a custom quote — usually the same day.
          </Reveal>

          <Reveal className={s.direct} delay={0.16}>
            <span className={s.directItem}>
              <span className={s.directLabel}>Email</span>
              <a href={`mailto:${BRAND.email}`} className={s.directValue}>
                {BRAND.email}
              </a>
            </span>
            <span className={s.directItem}>
              <span className={s.directLabel}>Instagram</span>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={s.directValue}
              >
                @{BRAND.instagram}
              </a>
            </span>
          </Reveal>
        </div>

        <Reveal className={s.panel} delay={0.1}>
          <Sunrise className={s.panelMark} />
          <p className={s.panelTitle}>Book it in a minute</p>
          <p className={s.panelBody}>
            Everything happens on our booking calendar — pick a date, send the
            details, and we&rsquo;ll take it from there.
          </p>

          <ul className={s.panelList}>
            {WHAT_YOU_CAN_DO.map((line) => (
              <li key={line} className={s.panelItem}>
                <svg
                  className={s.tick}
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 8.5 3.2 3.2L13 5" />
                </svg>
                {line}
              </li>
            ))}
          </ul>

          <Magnetic strength={0.28}>
            <Button type="button" variant="sea" onClick={openBooking}>
              Open the booking calendar
            </Button>
          </Magnetic>

          <p className={s.fine}>
            Prefer email? Reach us any time at {BRAND.email}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
