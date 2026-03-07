import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sleep Intelligence | QuaiPulse",
  description: "Track sleep quality, hours, and supplement correlations across locations.",
};

export default function SleepLayout({ children }: { children: React.ReactNode }) {
  return children;
}
