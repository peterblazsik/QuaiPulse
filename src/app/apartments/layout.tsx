import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apartments | QuaiPulse",
  description: "Apartment search pipeline with portal links, listing tracker, and status management.",
};

export default function ApartmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
