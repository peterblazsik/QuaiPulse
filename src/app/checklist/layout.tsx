import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Move Checklist | QuaiPulse",
  description: "Comprehensive relocation checklist for moving to Zurich with progress tracking.",
};

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
