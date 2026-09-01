import { useSyncExternalStore } from "react";

/* A one-bit store shared between the home-page Takeover and the Nav: when
   the takeover settles on the vault, the nav bar needs to wear the vault
   skin even though the pathname is "/" rather than "/dragon-con". Kept as
   a module store (not context) so the Nav — which lives above the page in
   the layout — can hear about it without re-plumbing the tree. */

let vaultOn = false;
const listeners = new Set<() => void>();

export function setVaultMode(on: boolean) {
  if (vaultOn === on) return;
  vaultOn = on;
  listeners.forEach((fn) => fn());
}

export function useVaultMode() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => vaultOn,
    /* server snapshot: the surface site, always — the flip is client-only */
    () => false,
  );
}
