"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useBookingModal } from "./BookingModalContext";
import s from "./BookingWidget.module.css";

const CT_BOOKING_URL =
  "https://api.calendtree.com/book/047894d8-1071-7027-5e9e-77b4c52a3e38";

declare global {
  interface Window {
    /** Provided by the iframe-resizer CDN script once it loads. */
    iFrameResize?: (
      options: Record<string, unknown>,
      target: string,
    ) => void;
  }
}

/**
 * The CalendTree scheduler, mounted once at the root and opened from
 * whichever "Book us" CTA was actually clicked — nav, footer, hero, story,
 * locations all share this single instance via BookingModalContext rather
 * than each carrying its own iframe and resize script.
 *
 * The iframe-resizer script only loads once the modal actually opens: no
 * one pays for CalendTree's iframe or the resize poller just for landing on
 * any page. `checkOrigin` is off because CalendTree's domain doesn't match
 * this site's.
 *
 * Two things that look like sane defaults turned out not to be, both found
 * by comparing this embed against loading the same URL top-level (which
 * renders a clean, solid dark card with no help from us):
 *
 * - `?embed=1` collapses CalendTree's page to a blank ~24px frame — verified
 *   live, iframe-resizer reported almost no content height with it appended.
 *   The bare URL is what actually renders the full form.
 * - `bodyBackground: "transparent"` looked like the right move for sitting
 *   inside our own modal, but CalendTree's page already ships a solid dark
 *   background of its own (see the top-level load). Passing that option
 *   makes iframe-resizer reach in and force the child's <body> transparent,
 *   fighting the page's own working styling and letting whatever is behind
 *   the modal — our hero photo, mid-scroll content — bleed through instead.
 *   Omitting it lets CalendTree's own background just work.
 */
export default function BookingModal() {
  const { open, closeBooking } = useBookingModal();
  const [scriptReady, setScriptReady] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  // The iframe is unmounted on close and remounted fresh on every open, so
  // the resize wiring has to reattach each time rather than firing once.
  useEffect(() => {
    if (open && scriptReady) {
      window.iFrameResize?.(
        {
          checkOrigin: false,
          heightCalculationMethod: "lowestElement",
        },
        "#ct-booking",
      );
    }
  }, [open, scriptReady]);

  useEffect(() => {
    if (!open) {
      setIframeReady(false);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBooking();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeBooking]);

  return (
    <>
      {open && (
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className={s.overlay}
            role="dialog"
            aria-modal="true"
            aria-label="Book Twin Fins Coffee"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              type="button"
              className={s.backdrop}
              aria-label="Close booking calendar"
              onClick={closeBooking}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className={s.modal}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                className={s.close}
                aria-label="Close booking calendar"
                onClick={closeBooking}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className={s.frame}>
                {!iframeReady && (
                  <div className={s.skeleton} aria-hidden="true">
                    <span className={s.skeletonPulse} />
                  </div>
                )}
                <iframe
                  id="ct-booking"
                  title="Book Twin Fins Coffee"
                  src={CT_BOOKING_URL}
                  className={s.iframe}
                  data-ready={iframeReady}
                  frameBorder={0}
                  scrolling="no"
                  style={{ border: "none", display: "block" }}
                  onLoad={() => setIframeReady(true)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
