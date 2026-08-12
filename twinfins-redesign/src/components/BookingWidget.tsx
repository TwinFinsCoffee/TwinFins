"use client";

import { Reveal, SplitText } from "./motion-primitives";
import { Button } from "./Button";
import { useBookingModal } from "./BookingModalContext";
import s from "./BookingWidget.module.css";

/**
 * The /booking page's own pitch for the calendar — the actual modal it
 * opens is the single shared instance in BookingModal.tsx, mounted once at
 * the root so every "Book us" CTA site-wide (this one included) opens the
 * same booking flow.
 */
export default function BookingWidget() {
  const { openBooking } = useBookingModal();

  return (
    <section className={s.section} aria-labelledby="booking-widget-title">
      <div className={`shell ${s.head}`}>
        <Reveal as="p" className="eyebrow">
          Pick a date
        </Reveal>
        <SplitText
          as="h2"
          className={`display ${s.title}`}
          text="Grab a slot on the calendar."
        />
        <Reveal as="p" className="lede" delay={0.08}>
          Live availability — book straight in, no back-and-forth required.
        </Reveal>
        <span id="booking-widget-title" className="sr-only">
          Book Twin Fins Coffee
        </span>

        <Reveal delay={0.14}>
          <Button type="button" variant="sea" onClick={openBooking}>
            Open the booking calendar
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
