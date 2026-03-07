import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulse AI | QuaiPulse",
  description: "Context-aware AI assistant for Zurich relocation questions and planning.",
};

export default function AILayout({ children }: { children: React.ReactNode }) {
  return children;
}
