import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Map | QuaiPulse",
  description: "Social infrastructure map for gyms, meetups, chess clubs, and community venues in Zurich.",
};

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
