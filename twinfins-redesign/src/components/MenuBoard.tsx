"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import {
  BRAND,
  MENU,
  MENU_FLAVORS,
  MENU_MILKS,
  MENU_PDF,
} from "@/lib/content";
import { ButtonLink } from "./Button";
import { Coconut, Wave } from "./Doodles";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./MenuBoard.module.css";

/**
 * The real board, transcribed from Twin Fins' own menu PDF — same drinks,
 * same prices, same add-on pricing — with the PDF itself offered alongside
 * it, the way the original site did.
 */
export default function MenuBoard() {
  const [active, setActive] = useState<(typeof MENU)[number]["id"]>(MENU[0].id);
  const section = MENU.find((m) => m.id === active) ?? MENU[0];

  return (
    <section className={s.section} id="menu">
      <div className="shell">
        <div className={s.head}>
          <Reveal as="p" className="eyebrow">
            What we pour
          </Reveal>
          <SplitText
            as="h2"
            className={`display ${s.title}`}
            text="The board changes. The standard doesn’t."
          />
          <Reveal as="p" className="lede" delay={0.08}>
            Espresso, matcha and chai, plus a rotating pair of specialty drinks.
            Every event can get a custom menu built on top of this.
          </Reveal>
          <Reveal delay={0.12}>
            <ButtonLink href={MENU_PDF} variant="outline" download>
              <Wave className={s.btnIcon} />
              Download the menu (PDF)
            </ButtonLink>
          </Reveal>
        </div>

        <div className={s.tabs} role="tablist" aria-label="Menu sections">
          {MENU.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={active === m.id}
              data-active={active === m.id}
              className={s.tab}
              onClick={() => setActive(m.id)}
            >
              {active === m.id && (
                <motion.span
                  layoutId="menu-pill"
                  className={s.pill}
                  transition={{ type: "spring", stiffness: 340, damping: 32 }}
                />
              )}
              <span className={s.tabLabel}>{m.title}</span>
            </button>
          ))}
        </div>

        <div className={s.board}>
          <AnimatePresence mode="wait">
            <motion.ul
              key={section.id}
              className={s.list}
              initial="hidden"
              animate="shown"
              exit="out"
              variants={{
                hidden: {},
                shown: { transition: { staggerChildren: 0.05 } },
                out: { opacity: 0, transition: { duration: 0.18 } },
              }}
            >
              {section.items.map((item) => (
                <motion.li
                  key={item.name}
                  className={s.row}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    shown: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <span className={s.rowMain}>
                    <span className={s.rowName}>{item.name}</span>
                    {/* Leader rule runs to the price so the eye tracks across. */}
                    <span className={s.leader} aria-hidden="true" />
                    <span className={s.rowPrice}>{item.price}</span>
                  </span>
                  {"note" in item && item.note ? (
                    <span className={s.rowNote}>{item.note}</span>
                  ) : null}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <div className={s.addons}>
            <Reveal className={s.addon}>
              <h3 className={s.addonTitle}>
                Flavors <em>{MENU_FLAVORS.surcharge}</em>
              </h3>
              <ul className={s.chips}>
                {MENU_FLAVORS.items.map((f) => (
                  <li className={s.chip} key={f}>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className={s.addon} delay={0.06}>
              <h3 className={s.addonTitle}>Milks</h3>
              <ul className={s.chips}>
                {MENU_MILKS.included.map((m) => (
                  <li className={s.chip} key={m}>
                    {m}
                  </li>
                ))}
                {MENU_MILKS.alt.map((m) => (
                  <li className={`${s.chip} ${s.chipAlt}`} key={m}>
                    {m}
                    <span>{MENU_MILKS.altSurcharge}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className={s.custom} delay={0.1}>
              <Coconut className={s.customIcon} />
              <h3 className={s.customTitle}>Want it custom?</h3>
              <p className={s.customBody}>
                We build bespoke drink menus and branded cups for activations
                and weddings — signature drinks named after you, your product,
                or your dog.
              </p>
              <ButtonLink
                href={`mailto:${BRAND.email}?subject=${encodeURIComponent("Custom menu enquiry")}`}
                variant="sea"
              >
                Build a menu
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
