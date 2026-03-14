"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { OnboardingInterview } from "@/components/layout/onboarding-interview";

/**
 * Wraps the app content. Shows the onboarding interview for users
 * who haven't completed their profile setup yet.
 *
 * For existing users (e.g. Peter) who have localStorage data but no DB profile,
 * auto-marks onboarding as complete so they skip the interview.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const profile = trpc.profile.get.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const upsert = trpc.profile.upsert.useMutation();
  const utils = trpc.useUtils();
  const autoCompleted = useRef(false);

  // Auto-complete onboarding for existing users who have localStorage data
  useEffect(() => {
    if (
      status !== "authenticated" ||
      profile.isLoading ||
      profile.data?.onboardingComplete ||
      autoCompleted.current
    )
      return;

    // Check if this is an existing user with localStorage data
    const hasLocalData =
      typeof window !== "undefined" &&
      (localStorage.getItem("quaipulse-onboarding-complete") === "true" ||
        localStorage.getItem("quaipulse-budget") !== null ||
        localStorage.getItem("quaipulse-checklist") !== null);

    if (hasLocalData) {
      autoCompleted.current = true;
      upsert.mutate(
        {
          displayName: session?.user?.name ?? "",
          onboardingComplete: true,
        },
        {
          onSuccess: () => utils.profile.get.invalidate(),
        }
      );
    }
  }, [status, profile.isLoading, profile.data, session, upsert, utils]);

  // Not authenticated — show children (login page handles auth)
  if (status !== "authenticated") return <>{children}</>;

  // Profile query loading or auto-completing — show loading
  if (profile.isLoading || (autoCompleted.current && !profile.data?.onboardingComplete)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 text-sm">Loading...</div>
      </div>
    );
  }

  // No profile or onboarding not complete — show interview
  if (!profile.data?.onboardingComplete) {
    return (
      <OnboardingInterview
        onComplete={() => {
          utils.profile.get.invalidate();
        }}
      />
    );
  }

  // Profile complete — show the app
  return <>{children}</>;
}
