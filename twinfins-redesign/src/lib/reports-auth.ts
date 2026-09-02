/* ---------------------------------------------------------------------------
   Shared unlock token for the client reports.

   The cookie is an HMAC of a fixed message, keyed by REPORTS_PASSWORD. That
   means there is no second secret to manage: the password IS the key, the
   cookie can't be forged without it, and changing the password invalidates
   every cookie already issued. Nothing about the password is recoverable from
   the cookie itself.

   Runs on the Edge runtime (middleware) and in a route handler, so it uses
   Web Crypto rather than node:crypto.
   ------------------------------------------------------------------------- */

export const REPORTS_COOKIE = "tf_reports";

/** Bump this to force every existing cookie to stop validating. */
const MESSAGE = "twinfins-reports-v1";

export async function unlockToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(MESSAGE),
  );
  // base64url, so it needs no escaping in a Set-Cookie value.
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Length-independent compare, so a near-miss can't be found by timing. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Where a visitor is allowed to land after unlocking. Only same-site paths
 * under /reports — never an absolute URL, or the form becomes an open
 * redirect that a phisher can point anywhere.
 */
export function safeNext(value: string | null | undefined): string {
  if (!value) return "/reports/august-2026.html";
  if (!value.startsWith("/reports/")) return "/reports/august-2026.html";
  if (value.startsWith("//")) return "/reports/august-2026.html";
  if (value.startsWith("/reports/unlock")) return "/reports/august-2026.html";
  return value;
}
