import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katie Visits | QuaiPulse",
  description: "Visit planner for Katie with calendar, transport costs, and schedule optimization.",
};

export default function KatieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
