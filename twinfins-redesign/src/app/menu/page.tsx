import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import MenuBoard from "@/components/MenuBoard";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Espresso, cold brew, matcha, and seasonal specials from the Twin Fins Coffee cart. Custom menus available for events and activations.",
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        crumb="Menu"
        title="Paradise, by the cup."
        lede="Freshly ground beans, top-tier equipment, and a rotating cast of seasonal specials. Each sip is like a day at the beach."
        image="/images/espresso-pull.jpg"
        imageAlt="A double espresso pulling into a glass on the cart's machine"
        focal="50% 55%"
      />
      <MenuBoard />
      <Marquee
        items={["Espresso", "Cold brew", "Matcha", "Chai", "Seasonal specials"]}
        duration={48}
      />
      <Contact
        eyebrow="Drop us a line"
        heading="Questions? We got you."
        withEventFields={false}
      />
    </>
  );
}
