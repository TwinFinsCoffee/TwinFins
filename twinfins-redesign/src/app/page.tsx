import type { Metadata } from "next";

import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Ethos from "@/components/Ethos";
import ServedAt from "@/components/ServedAt";
import PourBand from "@/components/PourBand";
import Services from "@/components/Services";
import Story from "@/components/Story";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Takeover from "@/components/Takeover";
import Vault from "@/components/Vault";
import { TICKER } from "@/lib/content";

/* Con-week metadata: the people googling us right now are con-goers trying
   to find a cart, so the description IS the directions. Reverts with the
   branch after the con. */
export const metadata: Metadata = {
  title: { absolute: "Twin Fins Coffee — Dragon Con 2026 at AmericasMart" },
  description:
    "Find Twin Fins at Dragon Con 2026, Sep 4–7 at AmericasMart: Building 3 street-level lobby (in front of Mick's Café's usual spot, from Friday), Building 2 Floor 3 (one escalator above the Floor 2 badge scan), and the original cart on Building 1 Floor 2.",
  openGraph: {
    title: "Twin Fins Coffee · Dragon Con 2026",
    description:
      "Three carts, three AmericasMart buildings, one block of downtown Atlanta. War never changes. Coffee does.",
  },
};

/* The surface site, unchanged — this is what loads, and what the takeover
   seizes a couple of seconds later. */
function SurfaceHome() {
  return (
    <>
      <Hero />
      <Marquee items={TICKER} variant="sand" duration={52} />
      <ServedAt />
      <Ethos />
      <PourBand />
      <Services />
      <Story />
      <Marquee
        items={[
          "Weddings",
          "Brand launches",
          "Markets",
          "Office days",
          "Private parties",
        ]}
        variant="navy"
        duration={46}
        reverse
      />
      <Gallery />
      <Contact />
    </>
  );
}

export default function HomePage() {
  /* Children-as-props keeps both trees server-rendered; Takeover only
     decides which one is on screen. After TAKEOVER_END it never fires and
     the surface site is simply the home page again. */
  return <Takeover surface={<SurfaceHome />} vault={<Vault home />} />;
}
