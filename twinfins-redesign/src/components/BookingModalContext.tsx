"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type BookingModalValue = {
  open: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const BookingModalContext = createContext<BookingModalValue | null>(null);

/**
 * One booking modal for the whole site, mounted once at the root. Every
 * "Book us" CTA — nav, footer, hero, story, locations — opens the same
 * instance instead of each owning its own iframe and script tag, so there's
 * exactly one place the calendar can be open from and no risk of two
 * copies of the CalendTree script racing each other.
 */
export function BookingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openBooking, closeBooking }),
    [open, openBooking, closeBooking],
  );

  return (
    <BookingModalContext.Provider value={value}>
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return ctx;
}
