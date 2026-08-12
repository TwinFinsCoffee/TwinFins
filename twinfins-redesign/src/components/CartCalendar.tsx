"use client";

import { useEffect, useState } from "react";

import { BRAND } from "@/lib/content";
import type { CartEvent } from "@/lib/calendar";
import { Reveal, SplitText } from "./motion-primitives";
import { ButtonLink } from "./Button";
import s from "./CartCalendar.module.css";

/** All formatting happens in the cart's home timezone, not the visitor's —
 *  "8am at AmericasMart" means Atlanta time no matter where you read it. */
const TZ = "America/New_York";

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...options });

const monthYearFmt = fmt({ month: "long", year: "numeric" });
const weekdayFmt = fmt({ weekday: "short" });
const dayFmt = fmt({ day: "numeric" });
const monthFmt = fmt({ month: "short" });
const timeFmt = fmt({ hour: "numeric", minute: "2-digit" });
const dayKeyFmt = fmt({ year: "numeric", month: "2-digit", day: "2-digit" });

function timeRange(ev: CartEvent): string {
  if (ev.allDay) return "All day";
  const start = timeFmt.format(new Date(ev.start));
  if (!ev.end) return start;
  const end = timeFmt.format(new Date(ev.end));
  return `${start} – ${end}`;
}

function mapsHref(location: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(location)}`;
}

/** "123 Main St, Atlanta, GA 30303, USA" → venue reads first, noise last. */
function shortLocation(location: string): string {
  return location.replace(/,\s*(USA|United States)$/i, "");
}

/**
 * Where the cart will be — the live schedule, synced from Natalia's own
 * Google Calendar. Styled as a sibling of the Story timeline: same navy
 * water, same trail of nodes, the cards now pointing forward instead of
 * back.
 */
export default function CartCalendar({
  events,
  subscribeHref,
}: {
  events: CartEvent[];
  subscribeHref: string | null;
}) {
  // "Today" depends on when you're looking, so it's applied after mount —
  // the server HTML (cached up to 30 minutes) never disagrees with the
  // hydrated tree.
  const [todayKey, setTodayKey] = useState<string | null>(null);
  useEffect(() => {
    setTodayKey(dayKeyFmt.format(new Date()));
  }, []);

  // Group into months so the list reads as a tide chart, not a dump.
  const months: { label: string; items: CartEvent[] }[] = [];
  for (const ev of events) {
    const label = monthYearFmt.format(new Date(ev.start));
    const bucket = months[months.length - 1];
    if (bucket && bucket.label === label) bucket.items.push(ev);
    else months.push({ label, items: [ev] });
  }

  return (
    <section className={`section on-dark ${s.section}`} id="calendar">
      <div className="shell">
        <header className={s.head}>
          <Reveal as="p" className="eyebrow eyebrow-light">
            The tide chart
          </Reveal>
          <SplitText
            as="h2"
            className={`display ${s.title}`}
            text="Where the cart washes up next."
          />
          <Reveal as="p" className={s.lede} delay={0.08}>
            Straight from our calendar — every market, pop-up, and residency
            day, updated the moment we book it. Catch a swell below or bring
            the cart to your own break.
          </Reveal>
        </header>

        {events.length === 0 ? (
          <Reveal className={s.empty}>
            <p className={s.emptyTitle}>Calendar coming soon.</p>
            <p className={s.emptyBody}>
              We&rsquo;re charting the next set of stops now. New dates land
              here and on Instagram the moment they&rsquo;re locked in —
              follow along so you never miss a pour.
            </p>
            <ButtonLink href={BRAND.instagramUrl} variant="light">
              Follow @{BRAND.instagram}
            </ButtonLink>
          </Reveal>
        ) : (
          <div className={s.rail}>
            {months.map((month, mi) => (
              <div className={s.month} key={month.label}>
                <Reveal as="div" className={s.monthMark} delay={0.04 * mi}>
                  <span className={s.monthChip}>{month.label}</span>
                </Reveal>

                <ol className={s.list}>
                  {month.items.map((ev, i) => {
                    const start = new Date(ev.start);
                    const isToday =
                      todayKey !== null &&
                      dayKeyFmt.format(start) === todayKey;
                    const isNext = mi === 0 && i === 0 && !isToday;
                    return (
                      <Reveal
                        as="li"
                        className={s.item}
                        key={ev.id}
                        delay={Math.min(i * 0.05, 0.25)}
                      >
                        <span className={s.node} aria-hidden="true" />
                        <article className={s.card}>
                          <div className={s.date} aria-hidden="true">
                            <span className={s.dateDow}>
                              {weekdayFmt.format(start)}
                            </span>
                            <span className={`display ${s.dateNum}`}>
                              {dayFmt.format(start)}
                            </span>
                            <span className={s.dateMon}>
                              {monthFmt.format(start)}
                            </span>
                          </div>

                          <div className={s.body}>
                            <div className={s.cardHead}>
                              <span className={s.time}>{timeRange(ev)}</span>
                              {isToday && (
                                <span className={s.badge}>Today</span>
                              )}
                              {isNext && (
                                <span className={`${s.badge} ${s.badgeNext}`}>
                                  Next stop
                                </span>
                              )}
                            </div>
                            <h3 className={s.cardTitle}>{ev.title}</h3>
                            {ev.location && (
                              <a
                                className={s.place}
                                href={mapsHref(ev.location)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <svg
                                  className={s.pin}
                                  viewBox="0 0 16 16"
                                  aria-hidden="true"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M8 1a5 5 0 0 0-5 5c0 3.6 4.2 8.2 4.6 8.6a.55.55 0 0 0 .8 0C8.8 14.2 13 9.6 13 6a5 5 0 0 0-5-5Zm0 6.8A1.8 1.8 0 1 1 8 4.2a1.8 1.8 0 0 1 0 3.6Z"
                                  />
                                </svg>
                                {shortLocation(ev.location)}
                              </a>
                            )}
                            {ev.description && (
                              <p className={s.desc}>{ev.description}</p>
                            )}
                          </div>
                        </article>
                      </Reveal>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        )}

        <Reveal className={s.foot} delay={0.1}>
          <p className={s.footNote}>
            Schedule updates automatically. Dates and locations drop on
            Instagram first.
          </p>
          <div className={s.footCtas}>
            {subscribeHref && (
              <ButtonLink href={subscribeHref} variant="light">
                Add to Google Calendar
              </ButtonLink>
            )}
            <ButtonLink href={BRAND.instagramUrl} variant="light">
              Follow @{BRAND.instagram}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
