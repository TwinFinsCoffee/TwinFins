import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ---------------------------------------------------------------------------
   Password gate for /reports/*

   The retainer reports are unlisted client pages: a real URL on the real
   domain, but not linked from anywhere and not indexable. HTTP Basic auth is
   the whole mechanism — the browser's own prompt, no login page to build, no
   session to keep, and nothing to leak if someone shares a screenshot.

   Vercel → Settings → Environment Variables:

     REPORTS_PASSWORD   required. Unset in production = the reports 404, which
                        is deliberate: a missing password must never fail open.
     REPORTS_USER       optional, defaults to "twinfins".

   Add both to Production AND Preview, or preview deploys will 404 the report.
   Middleware runs on every matched request including files under public/, so
   the static HTML and its video/image assets are all behind the same gate.
   ------------------------------------------------------------------------- */

export const config = {
  matcher: "/reports/:path*",
};

/* ASCII only. Header values are ByteStrings, so a smart dash or curly quote
   in here throws at runtime and the 401 turns into a 500 that fails open-ish. */
const REALM = "Twin Fins client reports";

/** Constant-time-ish compare, so a wrong password can't be probed by timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function middleware(request: NextRequest) {
  const password = process.env.REPORTS_PASSWORD;
  const user = process.env.REPORTS_USER ?? "twinfins";

  // No password configured: behave as though the route doesn't exist. Failing
  // closed matters more here than a helpful error — an unconfigured deploy
  // must not publish a client's numbers.
  if (!password) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "x-robots-tag": "noindex, nofollow" },
    });
  }

  const header = request.headers.get("authorization");

  if (header?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    // Only the FIRST colon separates them — passwords may contain colons.
    const sep = decoded.indexOf(":");
    if (sep !== -1) {
      const givenUser = decoded.slice(0, sep);
      const givenPassword = decoded.slice(sep + 1);
      if (safeEqual(givenUser, user) && safeEqual(givenPassword, password)) {
        const response = NextResponse.next();
        // Belt and braces: the page carries its own robots meta, but headers
        // cover the video and image assets too.
        response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
        response.headers.set("cache-control", "private, no-store");
        return response;
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "www-authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}
