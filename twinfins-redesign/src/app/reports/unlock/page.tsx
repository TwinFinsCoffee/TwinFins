import type { Metadata } from "next";
import { safeNext } from "@/lib/reports-auth";
import styles from "./unlock.module.css";

/* A shared link to the report redirects here for anyone without the cookie —
   including iMessage, Slack and every other link-preview crawler. So this is
   the page that has to carry the card, not the report itself. The image is a
   static 1200x630 PNG rather than a generated one: the README already records
   a build taken down by a Google Fonts fetch, and a link preview is not worth
   putting the build back in that position. */
export const metadata: Metadata = {
  title: "Twin Fins Coffee — August 2026 Retainer Report",
  description:
    "A private report for Twin Fins Coffee. The month, in receipts — what the retainer covered, what came free with it, and what it moved.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    siteName: "Twin Fins Coffee",
    title: "Twin Fins Coffee — August 2026 Retainer Report",
    description:
      "The month, in receipts. Prepared by ClipPlayMedia — password required.",
    url: "/reports/unlock",
    images: [
      {
        url: "/og/august-2026.png",
        width: 1200,
        height: 630,
        alt: "Twin Fins Coffee — August 2026 retainer report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twin Fins Coffee — August 2026 Retainer Report",
    description:
      "The month, in receipts. Prepared by ClipPlayMedia — password required.",
    images: ["/og/august-2026.png"],
  },
};

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const failed = params.error === "1";

  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <span className="eyebrow">Private</span>
        <h1 className={`display ${styles.title}`}>This one&rsquo;s just for you.</h1>
        <p className={styles.lede}>
          Your retainer report lives behind a password so the link is only ever
          as public as you make it. Enter the password we sent you.
        </p>

        <form method="post" action="/api/reports/unlock" className={styles.form}>
          <input type="hidden" name="next" value={next} />
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            className={styles.input}
            aria-describedby={failed ? "unlock-error" : undefined}
          />
          {failed && (
            <p id="unlock-error" role="alert" className={styles.error}>
              That password didn&rsquo;t match. Check for a stray space and try
              again.
            </p>
          )}
          <button type="submit" className={styles.button}>
            Open the report
          </button>
        </form>

        <p className={styles.help}>
          Lost it? Reply to the email the link came in on and we&rsquo;ll send it
          again.
        </p>
      </div>
    </section>
  );
}
