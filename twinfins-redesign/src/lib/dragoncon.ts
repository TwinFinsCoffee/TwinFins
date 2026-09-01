/* Shared Dragon Con 2026 timing. Everything keys off these two moments so
   the takeover, the teaser, and the countdown can never disagree.
   Dragon Con runs Labor Day weekend; 2026 puts opening day at Sep 4. */

/** Doors-open moment the countdown ticks toward. */
export const DOORS_OPEN = new Date("2026-09-04T09:00:00-04:00");

/** When the home-page takeover stands down: the Tuesday morning after the
    con (vendor floors close Monday evening, Sep 7). After this the surface
    site is the home page again and the flicker never plays. */
export const TAKEOVER_END = new Date("2026-09-08T06:00:00-04:00");
