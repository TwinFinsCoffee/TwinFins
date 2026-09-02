import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REPORTS_COOKIE, unlockToken, safeEqual } from "@/lib/reports-auth";

/* ---------------------------------------------------------------------------
   Password gate for /reports/*

   The retainer reports are unlisted client pages: a real URL on the real
   domain, not linked from anywhere and not indexable.

   This used to be HTTP Basic auth. It was correct on the wire — the 401 and
   the WWW-Authenticate header were both right — but Safari rendered the bare
   401 body instead of opening its credential dialog, so the client just saw
   the words "Authentication required" and no way in. A native browser prompt
   is also a poor thing to send a client on a phone. So: a real unlock page,
   a signed cookie, and no dependence on browser chrome.

   Vercel → Settings → Environment Variables:

     REPORTS_PASSWORD   required, on Production AND Preview. Unset = the
                        reports 404, deliberately: a missing password must
                        never fail open.

   Middleware runs for everything under /reports, so the HTML and its video
   and image assets are all behind the same cookie.
   ------------------------------------------------------------------------- */

export const config = {
  matcher: "/reports/:path*",
};

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The unlock page has to be reachable without a cookie, or there is no way
  // to ever get one.
  if (pathname === "/reports/unlock") return NextResponse.next();

  const password = process.env.REPORTS_PASSWORD;

  // No password configured: behave as though the route doesn't exist. Failing
  // closed matters more than a helpful error — an unconfigured deploy must
  // not publish a client's numbers.
  if (!password) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "x-robots-tag": "noindex, nofollow" },
    });
  }

  const cookie = request.cookies.get(REPORTS_COOKIE)?.value;
  if (cookie && safeEqual(cookie, await unlockToken(password))) {
    const response = NextResponse.next();
    // The page carries its own robots meta; the header covers the video and
    // image assets too.
    response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
    response.headers.set("cache-control", "private, no-store");
    return response;
  }

  const unlock = new URL("/reports/unlock", request.url);
  unlock.searchParams.set("next", pathname + search);
  const response = NextResponse.redirect(unlock);
  response.headers.set("x-robots-tag", "noindex, nofollow");
  response.headers.set("cache-control", "no-store");
  return response;
}
