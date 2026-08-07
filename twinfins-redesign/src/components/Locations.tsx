import Image from "next/image";

import { BRAND } from "@/lib/content";
import { Reveal, SplitText } from "./motion-primitives";
import { ButtonLink } from "./Button";
import s from "./Locations.module.css";

const DETAILS = [
  { label: "Address", value: "240 Peachtree St NW, Atlanta, GA" },
  { label: "Where inside", value: "Building 1 · Floor 2" },
  { label: "Hours", value: "Mon–Fri · 8am–2pm" },
  { label: "Payment", value: "Tap or chip — cards welcome" },
] as const;

const DIRECTIONS_URL =
  "https://maps.google.com/?q=AmericasMart+Building+1,+240+Peachtree+St+NW,+Atlanta,+GA+30303";

/**
 * The cart's standing residency. One real address gets the full treatment —
 * what AmericasMart is, where to find the cart inside it, and the flyer from
 * the crew's own Instagram presented as the taped-up poster it already is.
 */
export default function Locations() {
  return (
    <>
      <section className={`section ${s.residency}`}>
        <div className={`shell ${s.grid}`}>
          <div className={s.copy}>
            <Reveal as="p" className="eyebrow">
              Standing residency
            </Reveal>
            <SplitText
              as="h2"
              className={`display ${s.title}`}
              text="AmericasMart, every weekday morning."
            />

            <Reveal as="p" className={s.body} delay={0.06}>
              AmericasMart is downtown Atlanta&rsquo;s giant wholesale trade
              center — a three-building campus where buyers, designers, and
              showroom crews from all over the country come to stock their
              stores. It runs on early calls and long floors, which is to say:
              it runs on coffee.
            </Reveal>

            <Reveal as="p" className={s.body} delay={0.1}>
              You&rsquo;ll find the cart parked on the second floor of
              Building 1, pouring espresso, cold brew, and matcha for the
              morning rush. Come for market week, stay for the Salty Waves
              Latte.
            </Reveal>

            <Reveal delay={0.14}>
              <dl className={s.details}>
                {DETAILS.map((item) => (
                  <div className={s.detail} key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className={s.ctas} delay={0.18}>
              <ButtonLink href={DIRECTIONS_URL} variant="solid">
                Get directions
              </ButtonLink>
              <ButtonLink href="/menu" variant="outline">
                See the menu
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal className={s.posterCol} delay={0.1}>
            <figure className={s.poster}>
              <span className={s.tape} aria-hidden="true" />
              <Image
                src="/images/americasmart-flyer.jpg"
                alt="A collage from the AmericasMart residency — syrup bottles, the Rocket espresso machine, a Twin Fins iced latte, and a note reading Americas Mart, Building 1 Floor 2, open Monday to Friday 8am to 2pm"
                width={1400}
                height={1751}
                sizes="(max-width: 62rem) 92vw, 40vw"
                quality={70}
              />
              <figcaption className={s.posterCaption}>
                From the cart&rsquo;s corner of Building 1 — via{" "}
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{BRAND.instagram}
                </a>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className={`section on-dark ${s.elsewhere}`}>
        <div className="shell">
          <div className={s.elseHead}>
            <Reveal as="p" className="eyebrow eyebrow-light">
              Beyond the Mart
            </Reveal>
            <SplitText
              as="h2"
              className={`display ${s.elseTitle}`}
              text="The rest of the week, the cart roams."
            />
          </div>

          <div className={s.elseGrid}>
            <Reveal className={s.elseCard}>
              <h3 className={s.elseCardTitle}>Markets &amp; pop-ups</h3>
              <p className={s.elseCardBody}>
                Farmers markets, film sets, and one-off pop-ups around
                Atlanta. Dates and locations drop on Instagram first —
                that&rsquo;s where to catch the next one.
              </p>
              <ButtonLink href={BRAND.instagramUrl} variant="light">
                Follow @{BRAND.instagram}
              </ButtonLink>
            </Reveal>

            <Reveal className={s.elseCard} delay={0.08}>
              <h3 className={s.elseCardTitle}>Your event</h3>
              <p className={s.elseCardBody}>
                Weddings, brand launches, office mornings — the whole setup
                rolls to wherever you need a great cup. Tell us the date and
                the headcount and we&rsquo;ll quote it.
              </p>
              <ButtonLink href="/booking" variant="light">
                Book the cart
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
