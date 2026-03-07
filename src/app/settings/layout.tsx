import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | QuaiPulse",
  description: "Application settings, theme preferences, and data management.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
