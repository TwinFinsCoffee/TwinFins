import Link from "next/link";

/**
 * The Twin Fins button.
 *
 * Every one carries a `.btn-liquid` layer that rises on hover — coffee for
 * primary actions, seawater for secondary — and drains back out on leave.
 * The layer has to be a real element (a pseudo-element can't sit under the
 * label and above the background at the same time), which is the only
 * reason this component exists rather than a bare className.
 *
 * Its three children are the *inside* of that liquid — a slow churn, light
 * shafts raking through it, and bubbles rising — because the body's own
 * pseudo-elements are already spent on the two surface crests.
 *
 * Variants map to fill colours in globals.css:
 *   solid   navy pill      → fills with seawater
 *   outline light ground   → fills with coffee
 *   cream   on photography → fills with coffee
 *   light   dark ground    → fills with seawater
 *   sea     teal pill      → fills with coffee
 */

type Variant = "solid" | "outline" | "cream" | "light" | "sea";

const VARIANT_CLASS: Record<Variant, string> = {
  solid: "",
  outline: "btn-outline",
  cream: "btn-cream",
  light: "btn-light",
  sea: "btn-sea",
};

function Inner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="btn-liquid" aria-hidden="true">
        <span className="btn-liquid-swirl" />
        <span className="btn-liquid-caustics" />
        <span className="btn-liquid-bubbles" />
      </span>
      <span className="btn-label">{children}</span>
    </>
  );
}

function classes(variant: Variant, className?: string) {
  return ["btn", VARIANT_CLASS[variant], className].filter(Boolean).join(" ");
}

export function Button({
  variant = "solid",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={classes(variant, className)} {...props}>
      <Inner>{children}</Inner>
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "solid",
  className,
  children,
  external,
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  variant?: Variant;
  external?: boolean;
}) {
  const isExternal =
    external ?? (href.startsWith("http") || href.startsWith("mailto:"));

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes(variant, className)}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noreferrer" }
          : {})}
        {...props}
      >
        <Inner>{children}</Inner>
      </a>
    );
  }

  return (
    <Link href={href} className={classes(variant, className)} {...props}>
      <Inner>{children}</Inner>
    </Link>
  );
}
