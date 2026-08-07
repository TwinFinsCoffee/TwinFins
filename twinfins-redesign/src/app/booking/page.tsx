import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Terms from "@/components/Terms";
import Contact from "@/components/Contact";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "Event Booking",
  description:
    "Book the Twin Fins Coffee cart for weddings, brand activations, markets, and private events. Custom quotes, custom menus, paradise in every sip.",
};

export default function BookingPage() {
  return (
    <>
      <PageHero
        crumb="Event Booking"
        title="Bring the cart to your people."
        lede="Weddings, brand launches, office mornings, backyard parties — tell us the date and the headcount and we'll build you a custom quote."
        image="/images/cart-pergola.jpg"
        imageAlt="The full Twin Fins setup under a pergola, flanked by a painted surfboard sign"
        focal="50% 55%"
        waveColor="var(--navy-deep)"
      />
      <Services />
      <Marquee
        items={["Custom quotes", "Custom menus", "Branded cups", "Full-service crew"]}
        variant="sand"
        duration={50}
      />
      {/* Formerly its own /gallery page — folded in here so the proof of
          work sits right before the booking terms and the form, where
          someone deciding whether to book will actually see it. */}
      <Gallery heading="Every pop-up, every pour." eyebrow="See us in action" />
      <Terms />
      <Contact
        eyebrow="Get your custom quote today"
        heading="Let’s get this party started."
      />
    </>
  );
}
