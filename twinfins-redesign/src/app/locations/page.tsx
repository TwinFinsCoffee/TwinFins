import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import Locations from "@/components/Locations";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Find the Twin Fins Coffee cart — weekday mornings at AmericasMart Building 1 in downtown Atlanta, plus markets, pop-ups, and private events around the city.",
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        crumb="Locations"
        title="Come find the cart."
        lede="Weekday mornings we pour at AmericasMart in downtown Atlanta. The rest of the week you'll catch us at markets, pop-ups, and private events around the city."
        image="/images/cart-street.jpg"
        imageAlt="The Twin Fins cart on a shaded street with a longboard and fringed umbrella"
        focal="50% 45%"
      />
      <Locations />
      <Marquee
        items={[
          "AmericasMart · Building 1 · Floor 2",
          "Mon–Fri · 8am–2pm",
          "Markets & pop-ups",
          "Atlanta, GA",
        ]}
        duration={48}
      />
      <Contact
        eyebrow="Want the cart closer to home?"
        heading="Bring Twin Fins to you."
      />
    </>
  );
}
