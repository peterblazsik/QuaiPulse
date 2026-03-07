import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sleep Protocol | QuaiPulse",
  description: "Evidence-based sleep optimization protocol with supplements, stacks, and interventions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
