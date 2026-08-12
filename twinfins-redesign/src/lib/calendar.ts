/**
 * The cart's public schedule, read straight out of Google Calendar.
 *
 * Setup (one time, no API key, no OAuth):
 *   1. In Google Calendar, make (or pick) a calendar for the cart's stops.
 *   2. Settings → "Access permissions" → check "Make available to public"
 *      (seeing all event details).
 *   3. Settings → "Integrate calendar" → copy the "Public address in iCal
 *      format" — it looks like
 *      https://calendar.google.com/calendar/ical/<id>/public/basic.ics
 *   4. Put it in the environment as TWINFINS_CALENDAR_ICS (locally in
 *      .env.local, and in the Vercel project settings for production).
 *
 * From then on anything she adds, moves, or deletes in Google Calendar shows
 * up here on its own: the fetch below is cached for 30 minutes
 * (`revalidate: 1800`), so the site re-reads the feed at most twice an hour
 * and never at the visitor's expense.
 *
 * The parser is deliberately small but honest about the feed Google actually
 * serves: folded lines, TZID-qualified times, all-day dates, cancelled
 * events, EXDATE, RECURRENCE-ID overrides, and RRULEs (daily / weekly /
 * monthly / yearly with INTERVAL, BYDAY, BYMONTHDAY, COUNT, UNTIL). Anything
 * more exotic degrades to showing the first occurrence rather than crashing.
 */

const DEFAULT_TZ = "America/New_York";
const WINDOW_DAYS = 120; // how far ahead the section looks
const MAX_EVENTS = 24; // plenty for a section, never a wall of cards
const DAY_MS = 86_400_000;

export type CartEvent = {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  /** ISO instant. For all-day events: midnight in the cart's timezone. */
  start: string;
  end: string | null;
  allDay: boolean;
};

export type CartCalendarData = {
  events: CartEvent[];
  /** Deep link to add the public calendar to the visitor's own Google Calendar. */
  subscribeHref: string | null;
};

/* ------------------------------------------------------------------ fetch */

export async function getCartCalendar(): Promise<CartCalendarData> {
  const icsUrl = process.env.TWINFINS_CALENDAR_ICS;

  // No feed configured yet — the section renders its "coming soon" state.
  if (!icsUrl) return { events: [], subscribeHref: null };

  try {
    const res = await fetch(icsUrl, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`calendar feed responded ${res.status}`);
    const ics = await res.text();
    return { events: parseIcs(ics), subscribeHref: subscribeLink(icsUrl) };
  } catch (err) {
    // A broken feed should never take the page down — the section just shows
    // its coming-soon state until the next revalidation succeeds.
    console.error("[calendar] failed to load ICS feed:", err);
    return { events: [], subscribeHref: subscribeLink(icsUrl) };
  }
}

/** Google ICS URLs embed the calendar id — turn it into an "add to my
 *  Google Calendar" link. Non-Google feeds just don't get the button. */
function subscribeLink(icsUrl: string): string | null {
  const m = icsUrl.match(/calendar\/ical\/([^/]+)\//);
  if (!m) return null;
  return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(
    decodeURIComponent(m[1]),
  )}`;
}

/* -------------------------------------------------------------- ICS parse */

type Prop = { name: string; params: Record<string, string>; value: string };

/** A calendar date-time held as wall-clock components plus a timezone, so
 *  recurrence math happens in wall time and DST can't drift the hours. */
type Wall = {
  y: number;
  mo: number; // 1-12
  d: number;
  h: number;
  mi: number;
  tz: string;
  dateOnly: boolean;
};

function unfoldLines(ics: string): string[] {
  const raw = ics.split(/\r?\n/);
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else if (line.length) {
      out.push(line);
    }
  }
  return out;
}

function parseProp(line: string): Prop | null {
  // NAME;PARAM=a;PARAM2="b:c":value — find the first ':' outside quotes.
  let inQuotes = false;
  let sep = -1;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ":" && !inQuotes) {
      sep = i;
      break;
    }
  }
  if (sep === -1) return null;
  const head = line.slice(0, sep).split(";");
  const params: Record<string, string> = {};
  for (const p of head.slice(1)) {
    const eq = p.indexOf("=");
    if (eq > 0)
      params[p.slice(0, eq).toUpperCase()] = p
        .slice(eq + 1)
        .replace(/^"|"$/g, "");
  }
  return { name: head[0].toUpperCase(), params, value: line.slice(sep + 1) };
}

function unescapeText(v: string): string {
  return v
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function parseWall(value: string, params: Record<string, string>): Wall | null {
  const dateOnly = params.VALUE === "DATE" || /^\d{8}$/.test(value);
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  return {
    y: +m[1],
    mo: +m[2],
    d: +m[3],
    h: m[4] ? +m[4] : 0,
    mi: m[5] ? +m[5] : 0,
    tz: m[7] ? "UTC" : params.TZID || DEFAULT_TZ,
    dateOnly,
  };
}

/** Offset (ms to add to a UTC guess) for rendering an instant in `tz`. */
function tzOffset(utcMs: number, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts: Record<string, number> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") parts[p.type] = +p.value;
  }
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour % 24,
    parts.minute,
    parts.second,
  );
  return asUtc - utcMs;
}

/** Wall components in an IANA zone → UTC instant (two-pass, DST-safe). */
function wallToUtc(w: Wall): number {
  const naive = Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, 0);
  if (w.tz === "UTC") return naive;
  let guess = naive - tzOffset(naive, w.tz);
  guess = naive - tzOffset(guess, w.tz);
  return guess;
}

/** Day-index of the wall date, timezone-free — for recurrence arithmetic. */
function wallDayIndex(w: Wall): number {
  return Math.floor(Date.UTC(w.y, w.mo - 1, w.d) / DAY_MS);
}

function wallWeekday(w: Wall): number {
  return new Date(Date.UTC(w.y, w.mo - 1, w.d)).getUTCDay(); // 0 = Sunday
}

function shiftWallDays(w: Wall, days: number): Wall {
  const dt = new Date(Date.UTC(w.y, w.mo - 1, w.d + days));
  return {
    ...w,
    y: dt.getUTCFullYear(),
    mo: dt.getUTCMonth() + 1,
    d: dt.getUTCDate(),
  };
}

/* --------------------------------------------------------------- RRULE */

const BYDAY_CODES: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

type Rule = {
  freq: string;
  interval: number;
  count: number | null;
  untilMs: number | null;
  byday: { ord: number; day: number }[]; // ord 0 = every, else nth (+/-)
  bymonthday: number[];
};

function parseRrule(value: string): Rule | null {
  const parts: Record<string, string> = {};
  for (const kv of value.split(";")) {
    const eq = kv.indexOf("=");
    if (eq > 0) parts[kv.slice(0, eq).toUpperCase()] = kv.slice(eq + 1);
  }
  if (!parts.FREQ) return null;
  const byday = (parts.BYDAY || "")
    .split(",")
    .filter(Boolean)
    .map((tok) => {
      const m = tok.match(/^([+-]?\d)?([A-Z]{2})$/);
      if (!m || !(m[2] in BYDAY_CODES)) return null;
      return { ord: m[1] ? +m[1] : 0, day: BYDAY_CODES[m[2]] };
    })
    .filter((x): x is { ord: number; day: number } => x !== null);
  let untilMs: number | null = null;
  if (parts.UNTIL) {
    const w = parseWall(parts.UNTIL, {});
    if (w) untilMs = w.dateOnly ? wallToUtc({ ...w, h: 23, mi: 59 }) : wallToUtc(w);
  }
  return {
    freq: parts.FREQ.toUpperCase(),
    interval: Math.max(1, parseInt(parts.INTERVAL || "1", 10) || 1),
    count: parts.COUNT ? parseInt(parts.COUNT, 10) : null,
    untilMs,
    byday,
    bymonthday: (parts.BYMONTHDAY || "")
      .split(",")
      .filter(Boolean)
      .map(Number)
      .filter((n) => !Number.isNaN(n)),
  };
}

/** Does the candidate wall date fall on the rule's pattern, measured from
 *  the series start? Pure wall-date math; times are re-applied afterward. */
function ruleMatches(rule: Rule, start: Wall, cand: Wall): boolean {
  const dayDiff = wallDayIndex(cand) - wallDayIndex(start);
  if (dayDiff < 0) return false;

  switch (rule.freq) {
    case "DAILY":
      return dayDiff % rule.interval === 0;

    case "WEEKLY": {
      const days = rule.byday.length
        ? rule.byday.map((b) => b.day)
        : [wallWeekday(start)];
      if (!days.includes(wallWeekday(cand))) return false;
      // Week boundaries at WKST=MO (Google's default).
      const weekOf = (w: Wall) =>
        Math.floor((wallDayIndex(w) - ((wallWeekday(w) + 6) % 7)) / 7);
      return (weekOf(cand) - weekOf(start)) % rule.interval === 0;
    }

    case "MONTHLY": {
      const monthDiff = (cand.y - start.y) * 12 + (cand.mo - start.mo);
      if (monthDiff % rule.interval !== 0) return false;
      if (rule.bymonthday.length) return rule.bymonthday.includes(cand.d);
      if (rule.byday.length) {
        return rule.byday.some(({ ord, day }) => {
          if (wallWeekday(cand) !== day) return false;
          if (ord === 0) return true;
          if (ord > 0) return Math.ceil(cand.d / 7) === ord;
          // Negative ordinal: nth-from-end of the month.
          const daysInMonth = new Date(Date.UTC(cand.y, cand.mo, 0)).getUTCDate();
          return Math.ceil((daysInMonth - cand.d + 1) / 7) === -ord;
        });
      }
      return cand.d === start.d;
    }

    case "YEARLY":
      return (
        cand.mo === start.mo &&
        cand.d === start.d &&
        (cand.y - start.y) % rule.interval === 0
      );

    default:
      return false;
  }
}

/* ------------------------------------------------------------ VEVENT walk */

type RawEvent = {
  uid: string;
  summary: string;
  location: string;
  description: string;
  status: string;
  start: Wall | null;
  end: Wall | null;
  rrule: Rule | null;
  exdates: number[]; // UTC ms of excluded occurrence starts
  recurrenceId: Wall | null;
};

function parseIcs(ics: string): CartEvent[] {
  const lines = unfoldLines(ics);
  const raws: RawEvent[] = [];
  let cur: RawEvent | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      cur = {
        uid: "",
        summary: "",
        location: "",
        description: "",
        status: "",
        start: null,
        end: null,
        rrule: null,
        exdates: [],
        recurrenceId: null,
      };
      continue;
    }
    if (line === "END:VEVENT") {
      if (cur?.start) raws.push(cur);
      cur = null;
      continue;
    }
    if (!cur) continue;
    const prop = parseProp(line);
    if (!prop) continue;
    switch (prop.name) {
      case "UID":
        cur.uid = prop.value;
        break;
      case "SUMMARY":
        cur.summary = unescapeText(prop.value);
        break;
      case "LOCATION":
        cur.location = unescapeText(prop.value);
        break;
      case "DESCRIPTION":
        cur.description = unescapeText(prop.value);
        break;
      case "STATUS":
        cur.status = prop.value.toUpperCase();
        break;
      case "DTSTART":
        cur.start = parseWall(prop.value, prop.params);
        break;
      case "DTEND":
        cur.end = parseWall(prop.value, prop.params);
        break;
      case "RRULE":
        cur.rrule = parseRrule(prop.value);
        break;
      case "RECURRENCE-ID":
        cur.recurrenceId = parseWall(prop.value, prop.params);
        break;
      case "EXDATE":
        for (const v of prop.value.split(",")) {
          const w = parseWall(v.trim(), prop.params);
          if (w) cur.exdates.push(wallToUtc(w));
        }
        break;
    }
  }

  // Window: from the start of today (cart time) forward.
  const now = Date.now();
  const windowStart = now - tzWallMsIntoDay(now, DEFAULT_TZ);
  const windowEnd = now + WINDOW_DAYS * DAY_MS;

  // Occurrences replaced by a RECURRENCE-ID override are skipped in the
  // series expansion; the override event stands on its own.
  const overridden = new Set<string>();
  for (const r of raws) {
    if (r.recurrenceId) overridden.add(`${r.uid}|${wallToUtc(r.recurrenceId)}`);
  }

  const out: CartEvent[] = [];
  for (const r of raws) {
    if (r.status === "CANCELLED") continue;
    const durationMs =
      r.end && r.start ? wallToUtc(r.end) - wallToUtc(r.start) : null;

    const pushOccurrence = (startWall: Wall) => {
      const startMs = wallToUtc(startWall);
      if (startMs < windowStart || startMs > windowEnd) return;
      if (r.exdates.some((ex) => Math.abs(ex - startMs) < 1000)) return;
      if (!r.recurrenceId && overridden.has(`${r.uid}|${startMs}`)) return;
      out.push({
        id: `${r.uid || r.summary}-${startMs}`,
        title: r.summary || "Pop-up",
        location: r.location || null,
        description: cleanDescription(r.description),
        start: new Date(startMs).toISOString(),
        end:
          durationMs !== null
            ? new Date(startMs + durationMs).toISOString()
            : null,
        allDay: startWall.dateOnly,
      });
    };

    if (!r.rrule || r.recurrenceId) {
      pushOccurrence(r.start!);
      continue;
    }

    // Expand the series day-by-day in wall time. COUNT forces us to walk
    // from the very first occurrence; the walk is capped well past the
    // display window so a runaway rule can't spin.
    const start = r.start!;
    const maxDays =
      Math.floor((windowEnd - wallToUtc(start)) / DAY_MS) + 2;
    let produced = 0;
    for (let i = 0; i < Math.min(maxDays, 1500); i++) {
      const cand = shiftWallDays(start, i);
      if (!ruleMatches(r.rrule, start, cand)) continue;
      produced += 1;
      if (r.rrule.count !== null && produced > r.rrule.count) break;
      const candMs = wallToUtc(cand);
      if (r.rrule.untilMs !== null && candMs > r.rrule.untilMs) break;
      pushOccurrence(cand);
    }
  }

  out.sort((a, b) => a.start.localeCompare(b.start));
  return out.slice(0, MAX_EVENTS);
}

/** Milliseconds elapsed since midnight in `tz` at the given instant. */
function tzWallMsIntoDay(utcMs: number, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts: Record<string, number> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") parts[p.type] = +p.value;
  }
  return ((parts.hour % 24) * 3600 + parts.minute * 60 + parts.second) * 1000;
}

/** Google descriptions can carry HTML and link soup — keep the first
 *  couple of plain-text lines, which is all a schedule card wants. */
function cleanDescription(desc: string): string | null {
  const text = desc
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
  if (!text) return null;
  const firstLines = text.split("\n").filter(Boolean).slice(0, 2).join(" — ");
  return firstLines.length > 180 ? `${firstLines.slice(0, 177)}…` : firstLines;
}
