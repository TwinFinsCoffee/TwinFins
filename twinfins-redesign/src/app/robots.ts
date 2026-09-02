import type { MetadataRoute } from "next";

/* The client reports under /reports are unlisted and password-gated by
   middleware.ts. Crawlers never get past the gate anyway, but saying so here
   keeps the paths out of anything that reads robots.txt before it fetches.
   /reports/unlock is the exception: it is the page a shared link resolves to,
   so link-preview bots have to be able to read its OpenGraph card. There is
   nothing on it but a password box, and its card image lives at /og/ rather
   than under /reports/ — anything inside /reports is behind the gate, so an
   image there would 307 at every crawler and no preview would ever render. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/reports/unlock"],
      disallow: "/reports/",
    },
  };
}
