import type { MetadataRoute } from "next";

/* The client reports under /reports are unlisted and password-gated by
   middleware.ts. Crawlers never get past the 401, but saying so here keeps
   the path out of any tool that reads robots.txt before it tries a fetch. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/reports/",
    },
  };
}
