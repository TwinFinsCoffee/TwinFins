import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Ethos from "@/components/Ethos";
import ServedAt from "@/components/ServedAt";
import PourBand from "@/components/PourBand";
import Services from "@/components/Services";
import Story from "@/components/Story";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import { TICKER } from "@/lib/content";

export default function HomePage() {
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
