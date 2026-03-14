"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { OnboardingInterview } from "@/components/layout/onboarding-interview";

/**
 * Wraps the app content. Shows the onboarding interview for users
 * who haven't completed their profile setup yet.
 *
 * If tRPC is unavailable (401 / error), falls through to children
 * so the user isn't locked out.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const profile = trpc.profile.get.useQuery(undefined, {
    enabled: status === "authenticated",
    retry: false, // Don't retry on 401
  });
  const upsert = trpc.profile.upsert.useMutation();
  const utils = trpc.useUtils();
  const autoCompleted = useRef(false);

  // Auto-complete onboarding for existing users who have localStorage data
  useEffect(() => {
    if (
      status !== "authenticated" ||
      profile.isLoading ||
      profile.isError ||
      profile.data?.onboardingComplete ||
      autoCompleted.current
    )
      return;

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
          onError: () => {
            // If upsert fails, just let them through
            autoCompleted.current = false;
          },
        }
      );
    }
  }, [status, profile.isLoading, profile.isError, profile.data, session, upsert, utils]);

  // Not authenticated — show children (login page handles auth)
  if (status !== "authenticated") return <>{children}</>;

  // tRPC errored (likely 401) — show children with a re-sign-in hint
  if (profile.isError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-sm">Session expired or invalid. Please sign in again.</p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Sign Out & Re-sign In
        </button>
      </div>
    );
  }

  // Profile query loading
  if (profile.isLoading) {
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
