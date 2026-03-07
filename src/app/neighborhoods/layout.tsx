import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neighborhoods | QuaiPulse",
  description: "Ranked Zurich neighborhoods with scoring across commute, rent, lifestyle, safety, and social dimensions.",
};

export default function NeighborhoodsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
