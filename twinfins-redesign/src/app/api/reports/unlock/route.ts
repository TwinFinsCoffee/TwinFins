import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  REPORTS_COOKIE,
  unlockToken,
  safeEqual,
  safeNext,
} from "@/lib/reports-auth";

/* ---------------------------------------------------------------------------
   The unlock form posts here.

   A plain route handler rather than a Server Action, deliberately: this is an
   ordinary HTML form POST, so it works with JavaScript off, behaves the same
   in every browser, and can be tested with curl. The gate is the one thing on
   this site that must not depend on client-side machinery.

   One password, no username. Wrong answer goes back to the form with ?error=1
   and no cookie — and no hint about what was wrong, because there is only one
   thing it could be.
   ------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const given = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? ""));
  const password = process.env.REPORTS_PASSWORD;

  const fail = () => {
    const url = new URL("/reports/unlock", request.url);
    url.searchParams.set("next", next);
    url.searchParams.set("error", "1");
    // 303 so the browser follows with GET and a refresh doesn't re-post.
    return NextResponse.redirect(url, 303);
  };

  if (!password || !safeEqual(given, password)) return fail();

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(REPORTS_COOKIE, await unlockToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/reports",
    maxAge: 60 * 60 * 24 * 30, // a month, then it asks again
  });
  response.headers.set("cache-control", "no-store");
  return response;
}
