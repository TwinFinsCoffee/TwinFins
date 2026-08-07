import type { Metadata } from "next";

import StoryHeader from "@/components/StoryHeader";
import StoryPrologue from "@/components/StoryPrologue";
import StoryTimeline from "@/components/StoryTimeline";
import StoryCraft from "@/components/StoryCraft";
import StoryPraise from "@/components/StoryPraise";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";
import { BRAND, FOUNDER } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How Twin Fins Coffee went from a stalled film season to Atlanta's beach-themed mobile coffee cart — founder Natalia Tureta, the 2024 launch, the gear, and the give-back.",
  openGraph: {
    title: "Our Story · Twin Fins Coffee",
    description:
      "A production assistant, a strike, a beach trip, and 32 people who chipped in. The full story behind the Twin Fins cart.",
    images: ["/images/cart-logo.jpg"],
  },
};

/** Structured data so the founder story is machine-readable too. */
const schema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Our Story · Twin Fins Coffee",
  mainEntity: {
    "@type": "Organization",
    name: BRAND.name,
    foundingDate: "2024",
    email: BRAND.email,
    url: "https://twinfinscoffee.com",
    sameAs: [BRAND.instagramUrl],
    description:
      "A beach-themed mobile coffee cart serving film sets, weddings, markets, and private events around Atlanta, Georgia.",
    founder: { "@type": "Person", name: FOUNDER.name, jobTitle: FOUNDER.role },
  },
};

export default function StoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <StoryHeader />

      <StoryPrologue />
      <StoryTimeline />

      <Marquee
        items={[
          "Est. 2024",
          "Built by 32 backers",
          "Valor Coffee · Freethrow",
          "La Marzocco Linea Mini",
          "A cut back to the ocean",
        ]}
        duration={52}
        variant="sand"
      />

      <StoryCraft />
      <StoryPraise />

      <Contact
        eyebrow="Be the next chapter"
        heading="Let’s put the cart in your morning."
      />
    </>
  );
}
