"use client";

import { useSession } from "next-auth/react";
import { useSyncAll } from "@/lib/hooks/use-sync-all";

/**
 * Invisible component that triggers all sync hooks when user is authenticated.
 * Place inside Providers, after SessionProvider.
 */
export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  return (
    <>
      {status === "authenticated" && <SyncTrigger />}
      {children}
    </>
  );
}

function SyncTrigger() {
  useSyncAll();
  return null;
}
