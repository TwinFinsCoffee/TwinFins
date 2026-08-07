"use client";

import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

import { SERVED_AT } from "@/lib/content";
import { Reveal } from "./motion-primitives";
import s from "./ServedAt.module.css";

/**
 * Service-credit band. Six marks at one white weight on navy — the logos
 * arrive in wildly different colours and lockups, so they're normalised
 * rather than left to argue with each other across the row.
 *
 * Each mark is painted as a CSS mask rather than an <img>: the PNG supplies
 * only the silhouette, and the colour underneath it is ours to animate. That
 * is what lets a single asset sit muted in the row and flood with the owner's
 * brand colour on hover, with no second file and no crossfade.
 *
 * The track scrolls on a CSS animation rather than a scroll-linked one: it
 * runs at a constant rate, costs nothing per frame, and keeps going when the
 * page is still. The list is rendered twice and translated exactly -50%, so
 * the seam lands on an identical frame and the loop is invisible.
 *
 * The pointer steers the speed: parked over the middle the row eases right
 * down so the marks can actually be read, and the closer it gets to either
 * edge the faster the row runs. That's a `playbackRate` write on the CSS
 * animation — a control knob, not a per-frame transform — so the loop
 * itself never leaves the compositor.
 */
export default function ServedAt() {
  const track = useRef<HTMLUListElement>(null);
  const still = useReducedMotion();

  const setRate = (rate: number) => {
    if (typeof CSSAnimation === "undefined") return;
    const anim = track.current
      ?.getAnimations?.()
      .find((a) => a instanceof CSSAnimation);
    if (anim) anim.playbackRate = rate;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (still || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    // 0 at the centre of the band, 1 at either edge.
    const t = Math.min(
      1,
      Math.abs(e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    );
    // Readable crawl over the middle, up to ~4× out at the edges. Squared
    // so the ramp lives in the outer half rather than starting immediately.
    setRate(0.25 + 3.75 * t * t);
  };

  return (
    <section className={s.band} aria-labelledby="served-at">
      <div className={`shell ${s.head}`}>
        <Reveal>
          <p className={s.eyebrow} id="served-at">
            Places we&rsquo;ve served
          </p>
          <p className={s.lede}>
            From a Grand Prix paddock to the Eastside Trail.
          </p>
        </Reveal>
      </div>

      <div
        className={s.viewport}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setRate(1)}
      >
        <ul className={s.track} ref={track}>
          {[0, 1].map((copy) => (
            <li key={copy} className={s.group} aria-hidden={copy === 1}>
              {SERVED_AT.map((place) => (
                <span className={s.item} key={`${copy}-${place.short}`}>
                  <span
                    className={s.mark}
                    role={copy === 0 ? "img" : undefined}
                    aria-label={copy === 0 ? place.name : undefined}
                    style={
                      {
                        "--mark": `url(${place.logo})`,
                        "--brand": place.color,
                      } as CSSProperties
                    }
                  />
                  <span className={s.note}>{place.note}</span>
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
