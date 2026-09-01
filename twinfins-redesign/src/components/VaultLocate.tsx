import Image from "next/image";

import v from "./Vault.module.css";
import s from "./VaultLocate.module.css";

/* Every step below is transcribed from the crew's own walkthrough of the
   three AmericasMart buildings — real directions first, wasteland garnish
   second. If a step changes on-site, this is the one file to fix. */

const OPS = [
  {
    op: "OP-03",
    building: "BUILDING 3",
    where: "STREET LEVEL — MAIN LOBBY",
    tag: "LIVE FRIDAY, SEP 4",
    steps: [
      "Start at the corner of Ted Turner Dr & John Portman Blvd — both towers are in view from that corner.",
      "Enter Building 3 at street level and have your con badge out; credentials are checked at the door.",
      "You're already there: the cart is set up in the street-level lobby, directly in front of the spot where Mick's Café usually runs.",
    ],
    nav: "No stairs, no escalators. Door to espresso in under a minute.",
    maps: "https://maps.google.com/?q=AmericasMart+Building+3,+John+Portman+Blvd+NW,+Atlanta,+GA",
  },
  {
    op: "OP-02",
    building: "BUILDING 2",
    where: "FLOOR 3 — VENDOR FLOORS",
    tag: "ALL WEEKEND",
    steps: [
      "Enter Building 2 (same corner — Ted Turner Dr & John Portman Blvd) and ride the escalators up to Floor 2.",
      "Badge scan is at the top of those escalators, on Floor 2.",
      "Take the very next escalator one more floor up.",
      "Step off on Floor 3 — it drops you straight at the cart, with a full floor of local vendors around it worth a lap.",
    ],
    nav: "Two escalator rides total: scan in on 2, coffee on 3.",
    maps: "https://maps.google.com/?q=AmericasMart+Building+2,+Ted+Turner+Dr+NW,+Atlanta,+GA",
  },
  {
    op: "OP-01",
    building: "BUILDING 1",
    where: "FLOOR 2 — THE ORIGINAL POST",
    tag: "THE STANDING RESIDENCY",
    steps: [
      "Enter Building 1 at 240 Peachtree St NW — it's the tower across the street from the other two.",
      "Head up one level to Floor 2.",
      "The cart is at its usual year-round corner, pouring the full standard menu.",
    ],
    nav: "This is the post the cart holds every week — Mon–Fri, 8am–2pm.",
    maps: "https://maps.google.com/?q=AmericasMart+Building+1,+240+Peachtree+St+NW,+Atlanta,+GA+30303",
  },
] as const;

export default function VaultLocate() {
  return (
    <section
      className={`shell ${s.locate}`}
      id="find-the-carts"
      aria-labelledby="locate-title"
    >
      {/* The section's nameplate: a riveted sign panel, with the crew's
          vault girl waving over the top edge of it. */}
      <div className={s.bannerWrap}>
        <span className={s.wave} aria-hidden="true">
          <Image
            src="/images/dragoncon/vault-girl-wave.png"
            alt=""
            width={720}
            height={720}
            sizes="(max-width: 40rem) 34vw, 11rem"
          />
        </span>
        <div className={s.banner}>
          <p className={v.stamp}>DRAGON CON · SEP 4–7 · AMERICASMART</p>
          <h2 className={s.title} id="locate-title">
            Where to find us
          </h2>
          <p className={s.kicker}>
            Three carts. Three buildings. One block of downtown.
          </p>
        </div>
      </div>
      <p className={s.lede}>
        Every cart is inside AmericasMart, the three-tower campus at{" "}
        <strong>Ted Turner Dr &amp; John Portman Blvd</strong>, a short walk
        from the host hotels. Stand on that corner and Buildings 2 and 3 are
        both in view; Building 1 is just across the block on Peachtree. Con
        credentials are checked at every door — badge up before you get in
        line.
      </p>

      <div className={s.grid}>
        {OPS.map((op) => (
          <article className={`${v.terminal} ${s.card}`} key={op.op}>
            <header className={v.termHead}>
              <span />
              <span />
              <p>
                {op.op} — {op.building}
              </p>
            </header>
            <div className={`${v.termBody} ${s.cardBody}`}>
              <p className={s.where}>{op.where}</p>
              <p className={s.tag}>{op.tag}</p>
              <ol className={s.steps}>
                {op.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className={s.nav}>{op.nav}</p>
              <a
                className={s.maps}
                href={op.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                OPEN IN MAPS ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className={s.foot}>
        Turned around? Ask anyone in a Twin Fins apron — or follow the smell
        of espresso. The cut-fish sign hangs where the coffee is.
      </p>
    </section>
  );
}
