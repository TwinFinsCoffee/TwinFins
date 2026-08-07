"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { BRAND } from "@/lib/content";
import { Button } from "./Button";
import { Sunrise } from "./Doodles";
import { Magnetic, Reveal, SplitText } from "./motion-primitives";
import s from "./Contact.module.css";

const EVENT_TYPES = [
  "Wedding",
  "Brand activation",
  "Corporate / office",
  "Market or pop-up",
  "Private party",
  "Dry bar",
  "Something else",
];

export default function Contact({
  heading = "Let’s get this party started.",
  eyebrow = "Get your custom quote",
  withEventFields = true,
}: {
  heading?: string;
  eyebrow?: string;
  withEventFields?: boolean;
}) {
  const [sent, setSent] = useState(false);

  /**
   * No backend here — the redesign hands off to the same inbox the original
   * site used, pre-filling a mailto so nothing is lost in a dead form post.
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const lines = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      get("phone") && `Phone: ${get("phone")}`,
      get("eventType") && `Event type: ${get("eventType")}`,
      get("eventDate") && `Date: ${get("eventDate")}`,
      get("guests") && `Guests: ${get("guests")}`,
      "",
      get("message"),
    ].filter(Boolean);

    const subject = encodeURIComponent(
      `Booking enquiry — ${get("name") || "Twin Fins"}`
    );
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className={s.section} id="contact">
      <svg
        className={s.wave}
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0h2880v34c-160 36-320-24-480-12s-320 48-480 24-320-36-480-12-320 44-480 20S160 34 0 58Z"
          fill="currentColor"
        />
      </svg>

      <div className={`shell ${s.grid}`}>
        <div className={s.copy}>
          <Reveal as="p" className="eyebrow" >
            {eyebrow}
          </Reveal>
          <SplitText as="h2" className={`display ${s.title}`} text={heading} />
          <Reveal as="p" className={s.body} delay={0.08}>
            Tell us the date, the headcount, and the vibe. We&rsquo;ll come back
            with a custom quote — usually the same day.
          </Reveal>

          <Reveal className={s.direct} delay={0.16}>
            <span className={s.directItem}>
              <span className={s.directLabel}>Email</span>
              <a href={`mailto:${BRAND.email}`} className={s.directValue}>
                {BRAND.email}
              </a>
            </span>
            <span className={s.directItem}>
              <span className={s.directLabel}>Instagram</span>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={s.directValue}
              >
                @{BRAND.instagram}
              </a>
            </span>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                className={`${s.form} ${s.sent}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Sunrise className={s.sentMark} />
                <p className={s.sentTitle}>We can&rsquo;t wait to sea you</p>
                <p className={s.body} style={{ textAlign: "center" }}>
                  Your email client should be open with the details filled in.
                  If it didn&rsquo;t open, reach us directly at{" "}
                  <a href={`mailto:${BRAND.email}`} style={{ color: "var(--sea)" }}>
                    {BRAND.email}
                  </a>
                  .
                </p>
                <Button
                  type="button"
                  variant="light"
                  onClick={() => setSent(false)}
                >
                  Send another
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className={s.form}
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <div className={s.row}>
                  <Field name="name" label="Name" required />
                  <Field name="email" label="Email" type="email" required />
                </div>

                {withEventFields && (
                  <>
                    <div className={s.row}>
                      <Field name="phone" label="Phone" type="tel" />
                      <SelectField
                        name="eventType"
                        label="Event type"
                        options={EVENT_TYPES}
                      />
                    </div>
                    <div className={s.row}>
                      <Field name="eventDate" label="Event date" type="date" />
                      <Field name="guests" label="Approx. guests" type="number" />
                    </div>
                  </>
                )}

                <div className={s.field}>
                  <textarea
                    id="message"
                    name="message"
                    className={s.textarea}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="message" className={s.label}>
                    Tell us about it
                  </label>
                </div>

                <div className={s.submitRow}>
                  <Magnetic strength={0.28}>
                    <Button type="submit" variant="sea">
                      Send it
                    </Button>
                  </Magnetic>
                  <p className={s.fine}>
                    We reply from {BRAND.email}. No spam, ever.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  // Date pickers render their own placeholder text, so the label can never
  // sit over them — pin it up front for those types.
  const alwaysFloat = type === "date" || type === "time";

  return (
    <div className={s.field}>
      <input
        id={name}
        name={name}
        type={type}
        className={s.input}
        data-float={alwaysFloat || undefined}
        placeholder=" "
        required={required}
      />
      <label htmlFor={name} className={s.label}>
        {label}
        {required ? " *" : ""}
      </label>
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  const [filled, setFilled] = useState(false);
  return (
    <div className={s.field}>
      <select
        id={name}
        name={name}
        className={s.select}
        data-filled={filled}
        defaultValue=""
        onChange={(e) => setFilled(Boolean(e.target.value))}
      >
        <option value="" />
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <label htmlFor={name} className={s.label}>
        {label}
      </label>
      <svg
        className={s.selectArrow}
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 9 7 7 7-7" />
      </svg>
    </div>
  );
}
