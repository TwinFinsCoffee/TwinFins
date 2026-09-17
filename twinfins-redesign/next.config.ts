import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [74, 75, 78, 80, 82, 88],
  },
  /* The F1 Miami Champions Club proposal is a single self-contained page in
     public/f1miami/ (built outside the app, like the reports). Next doesn't
     serve a directory's index.html on its own, so map the clean URL to it.
     Its asset paths are absolute (/f1miami/assets/...) so they resolve with
     or without a trailing slash. Public, no password. */
  async rewrites() {
    return [
      { source: "/f1miami", destination: "/f1miami/index.html" },
      { source: "/f1miami/", destination: "/f1miami/index.html" },
    ];
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
      /* Dragon Con 2026 is over (vendor floors closed Sep 7). The vault page
         and its components are still in the tree for next year — this one
         redirect is the whole off-switch, so bringing it back is deleting
         these six lines.

         Deliberately NOT permanent: a 308 is cached hard by browsers, and
         anyone who scanned a con QR code would keep landing on the home page
         even after the route comes back. Temporary keeps that reversible,
         and still sends stray scans somewhere useful instead of a 404. */
      {
        source: "/dragon-con",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
