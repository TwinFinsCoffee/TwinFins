import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [74, 75, 78, 80, 82, 88],
  },
  // /gallery was folded into /booking so the site has one fewer top-level
  // page. Anyone with the old URL bookmarked or indexed lands on the new
  // section instead of a 404.
  async redirects() {
    return [
      {
        source: "/gallery",
        destination: "/booking#gallery",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
