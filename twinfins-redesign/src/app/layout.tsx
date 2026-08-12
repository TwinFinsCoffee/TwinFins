import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import Grain from "@/components/Grain";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import Transmission from "@/components/Transmission";
import { BookingModalProvider } from "@/components/BookingModalContext";
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
   tucked into a scrapbook rather than a pull-quote.
   Self-hosted rather than pulled from next/font/google: Next 16.3's bundled
   Google Fonts metadata points at a Caveat asset Google has since retired
   (a stale build-time 404 that took the whole build down), and this is a
   single variable-weight file anyway, so there's nothing to keep in sync. */
const hand = localFont({
  src: "./fonts/caveat-variable.woff2",
  weight: "500 700",
  display: "swap",
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
        <BookingModalProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <ScrollProgress />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <Grain />
          <BookingModal />
          <Transmission />
        </BookingModalProvider>
      </body>
    </html>
  );
}
