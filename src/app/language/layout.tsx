import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Language Prep | QuaiPulse",
  description: "Swiss German phrase trainer with spaced repetition for daily life in Zurich.",
};

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
