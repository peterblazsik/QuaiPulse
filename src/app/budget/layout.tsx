import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Simulator | QuaiPulse",
  description: "Interactive budget simulator for Zurich living costs, savings projections, and what-if scenarios.",
};

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
