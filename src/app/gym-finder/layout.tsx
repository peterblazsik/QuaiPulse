import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gym Finder | QuaiPulse",
  description: "Find knee-safe gyms in Zurich with equipment details, pricing, and comparison tools.",
};

export default function GymFinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
