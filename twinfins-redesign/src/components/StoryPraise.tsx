"use client";

import Image from "next/image";

import { FIND_US, GOOGLE_RATING, PRAISE, PRESS } from "@/lib/content";
import { Star } from "./Doodles";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./StoryPraise.module.css";

/** Receipts: what couples said, and where the cart has turned up in print. */
export default function StoryPraise() {
  return (
    <section className={s.section} aria-labelledby="praise-title">
      <div className={`shell ${s.inner}`}>
        <div className={s.headRow}>
          <div className={s.head}>
            <Reveal as="p" className="eyebrow">
              Word of mouth
            </Reveal>
            <SplitText
              as="h2"
              className={`display ${s.title}`}
              text="The part we don’t get to write."
            />
            <Reveal as="p" className={s.headLede} delay={0.08}>
              Guests leave notes at the cart, couples leave them online. This
              one sat framed on the machine all day.
            </Reveal>

            <Reveal delay={0.12}>
              <a
                className={s.googleBadge}
                href={GOOGLE_RATING.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className={s.googleScore}>{GOOGLE_RATING.score}</span>
                <span className={s.googleStars} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, n) => (
                    <Star key={n} className={s.star} />
                  ))}
                </span>
                <span className={s.googleCount}>
                  from {GOOGLE_RATING.count} Google reviews
                </span>
              </a>
            </Reveal>
            <span id="praise-title" className="sr-only">
              Reviews and press for Twin Fins Coffee
            </span>
          </div>

          <Reveal className={s.signFrame} delay={0.1}>
            <Image
              src="/images/five-star-sign.jpg"
              alt="A framed five-star note on the cart's espresso machine reading: barista was cute, would sip here again"
              width={1600}
              height={2400}
              sizes="(max-width: 52rem) 80vw, 30vw"
            />
          </Reveal>
        </div>

        <div className={s.quotes}>
          {PRAISE.map((item, i) => (
            <Reveal key={item.author} delay={0.06 * i}>
              <figure className={s.quoteCard}>
                <div className={s.stars} aria-label="Five out of five stars">
                  {Array.from({ length: 5 }, (_, n) => (
                    <Star key={n} className={s.star} />
                  ))}
                </div>
                <blockquote>
                  <p>&ldquo;{item.quote}&rdquo;</p>
                </blockquote>
                <figcaption>
                  <span className={s.author}>{item.author}</span>
                  <span className={s.context}>
                    {item.context}
                    {"source" in item && item.source !== item.context && (
                      <span className={s.source}> · via {item.source}</span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className={s.pressLabel} delay={0.04}>
          Where to find us
        </Reveal>

        <ul className={s.haunts}>
          {FIND_US.map((spot, i) => (
            <Reveal as="li" key={spot.label} delay={0.03 * i}>
              <span className={s.hauntLabel}>{spot.label}</span>
              <span className={s.hauntNote}>{spot.note}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal as="p" className={s.pressLabel} delay={0.06}>
          Elsewhere
        </Reveal>

        <ul className={s.press}>
          {PRESS.map((item, i) => (
            <Reveal as="li" key={item.href} delay={0.04 * i}>
              <a
                className={s.pressLink}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={s.outlet}>{item.outlet}</span>
                <span className={s.pressLine}>{item.line}</span>
                <span className={s.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
