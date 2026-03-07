import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flight Scanner | QuaiPulse",
  description: "ZRH-VIE flight intelligence for Katie visits. Price patterns, booking windows, and airline comparison.",
};

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
