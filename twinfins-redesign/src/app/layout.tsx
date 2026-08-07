import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";

import Grain from "@/components/Grain";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BRAND } from "@/lib/content";

/* Fraunces carries the chunky vintage-serif feel of the painted Twin Fins
   wordmark; its SOFT and WONK axes keep the display type hand-made rather
   than stiff, which is what the brand's own lettering does. */
const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
});

const body = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

/* Reserved for the one moment on /story that needs to read as handwriting
   rather than typesetting — the founder's own quote, styled as a note
   tucked into a scrapbook rather than a pull-quote. */
const hand = Caveat({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://twinfinscoffee.com"),
  title: {
    default: "Twin Fins Coffee — Paradise in every sip",
    template: "%s · Twin Fins Coffee",
  },
  description:
    "Twin Fins Coffee is a mobile coffee cart and surf-inspired coffee bar. Book us for weddings, brand activations, markets, and private events.",
  openGraph: {
    title: "Twin Fins Coffee — Paradise in every sip",
    description:
      "A mobile coffee cart with saltwater in its veins. Weddings, brand activations, markets, private events.",
    type: "website",
    siteName: BRAND.name,
  },
  icons: {
    icon: [{ url: "/brand/tf-monogram.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/tf-monogram.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2a3947",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${hand.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollProgress />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Grain />
      </body>
    </html>
  );
}
