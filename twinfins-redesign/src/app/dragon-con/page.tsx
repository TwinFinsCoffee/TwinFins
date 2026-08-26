import type { Metadata } from "next";

import Vault from "@/components/Vault";

export const metadata: Metadata = {
  title: "Dragon Con 2026 — Please Stand By",
  description:
    "Twin Fins Coffee is going underground for Dragon Con 2026. Custom drinks, a full theme, and two centuries of road behind the counter. Transmission decrypts on the con floor.",
  openGraph: {
    title: "Dragon Con 2026 · Twin Fins Coffee",
    description:
      "Something is brewing beneath the Vega. Please stand by.",
  },
  robots: { index: true, follow: true },
};

export default function DragonConPage() {
  return <Vault />;
}
