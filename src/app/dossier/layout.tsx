import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dossier Tracker | QuaiPulse",
  description: "Track all documents needed for your Swiss relocation: rental dossier, permits, insurance, and registration.",
};

export default function DossierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
