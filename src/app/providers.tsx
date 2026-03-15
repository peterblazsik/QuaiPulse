"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, getTRPCClient } from "@/lib/trpc/client";
import { SyncProvider } from "@/components/sync-provider";
import { OnboardingGate } from "@/components/onboarding-gate";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const [trpcClient] = useState(() => getTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <SyncProvider>
            <OnboardingGate>
              <TooltipProvider delayDuration={300} skipDelayDuration={100}>
              <MotionConfig reducedMotion="user">
                {children}
              </MotionConfig>
            </TooltipProvider>
            </OnboardingGate>
          </SyncProvider>
        </SessionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
