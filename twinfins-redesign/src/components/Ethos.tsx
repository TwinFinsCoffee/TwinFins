"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { PHILOSOPHY } from "@/lib/content";
import { Reveal, SplitText } from "./motion-primitives";
import s from "./Ethos.module.css";

/**
 * Three principles, read as an editorial list, with a sticky photograph that
 * swaps to match whichever one you're on. The swap is an opacity crossfade
 * between already-decoded images — no layout work, no filters.
 */
export default function Ethos() {
  const [active, setActive] = useState(0);

  return (
    <section className={s.section} id="ethos">
      <div className="shell">
        <div className={s.head}>
          <Reveal as="p" className="eyebrow">
            Our philosophy
          </Reveal>
          <SplitText
            as="h2"
            className={`display ${s.title}`}
            text="Every sip should taste like a day at the beach."
          />
          <Reveal as="p" className="lede" delay={0.06}>
            Three things we won&rsquo;t compromise on, whether we&rsquo;re
            serving twenty people or two thousand.
          </Reveal>
        </div>

        <div className={s.grid}>
          <div className={s.mediaCol}>
            <Reveal className={s.frame}>
              {PHILOSOPHY.map((item, i) => (
                <div
                  key={item.id}
                  className={s.slide}
                  data-active={active === i}
                  aria-hidden="true"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 62rem) 0px, 42vw"
                    quality={78}
                  />
                </div>
              ))}
              <p className={s.frameCaption}>{PHILOSOPHY[active].caption}</p>
            </Reveal>
          </div>

          <ul className={s.list}>
            {PHILOSOPHY.map((item, i) => (
              <Entry key={item.id} item={item} index={i} onEnter={setActive} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Entry({
  item,
  index,
  onEnter,
}: {
  item: (typeof PHILOSOPHY)[number];
  index: number;
  onEnter: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // A band across the middle of the viewport decides which entry is "current".
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onEnter(index);
  }, [inView, index, onEnter]);

  return (
    <li className={s.entry} ref={ref}>
      <span className={s.num}>{item.kicker}</span>
      <Reveal className={s.body}>
        <h3 className={s.entryTitle}>{item.title}</h3>
        <p className={s.entryText}>{item.body}</p>
        <div className={s.entryMedia}>
          <Image
            src={item.image}
            alt={item.caption}
            fill
            sizes="(max-width: 62rem) 92vw, 0px"
            quality={74}
            loading={index === 0 ? undefined : "lazy"}
          />
        </div>
      </Reveal>
    </li>
  );
}
