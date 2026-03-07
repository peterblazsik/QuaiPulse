import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions | QuaiPulse",
  description: "Manage and triage subscriptions for the move from NL to Switzerland.",
};

export default function SubscriptionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
