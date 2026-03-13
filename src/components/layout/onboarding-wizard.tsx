"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Rocket, Calendar, Wallet, Target, Sparkles } from "lucide-react";
import { useBudgetStore } from "@/lib/stores/budget-store";
import { usePriorityStore } from "@/lib/stores/priority-store";
import { formatCHF } from "@/lib/utils";
import type { ScoreDimension } from "@/lib/types";

const STORAGE_KEY = "quaipulse-onboarding-complete";

const PRIORITY_DIMENSIONS: { key: ScoreDimension; label: string; description: string }[] = [
  { key: "commute", label: "Commute", description: "Time to Mythenquai office" },
  { key: "gym", label: "Gym Access", description: "Knee-safe gym proximity" },
  { key: "social", label: "Social Scene", description: "Nightlife, dining, meetups" },
  { key: "lake", label: "Lake Access", description: "Walking distance to water" },
  { key: "transit", label: "Transit", description: "Public transport connections" },
  { key: "quiet", label: "Quiet Living", description: "Low noise, residential feel" },
  { key: "food", label: "Food & Dining", description: "Restaurant variety" },
  { key: "cost", label: "Cost", description: "Rent affordability" },
];

export function OnboardingWizard() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  // Budget store
  const grossMonthlySalary = useBudgetStore((s) => s.grossMonthlySalary);
  const setGrossMonthlySalary = useBudgetStore((s) => s.setGrossMonthlySalary);
  const rent = useBudgetStore((s) => s.values.rent);
  const setValue = useBudgetStore((s) => s.setValue);

  // Priority store
  const weights = usePriorityStore((s) => s.weights);
  const setWeight = usePriorityStore((s) => s.setWeight);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (!completed) {
        setShow(true);
      }
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-accent-primary/15 flex items-center justify-center">
        <Rocket className="h-8 w-8 text-accent-primary" />
      </div>
      <h2 className="font-display text-xl font-bold text-text-primary">
        Welcome to QuaiPulse
      </h2>
      <p className="text-sm text-text-secondary max-w-sm mx-auto">
        Your personal Zurich life navigator. Data-dense, keyboard-first,
        Bloomberg-grade intelligence for your relocation.
      </p>
      <div className="flex flex-col gap-2 text-xs text-text-muted max-w-xs mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent-primary" />
          Neighborhood scoring engine
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success" />
          Swiss budget simulator
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-warning" />
          Move checklist with dependencies
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-400" />
          Apartment pipeline tracker
        </div>
      </div>
    </div>,

    // Step 1: Move date
    <div key="date" className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-success/15 flex items-center justify-center">
        <Calendar className="h-8 w-8 text-success" />
      </div>
      <h2 className="font-display text-xl font-bold text-text-primary">
        Your Move Date
      </h2>
      <p className="text-sm text-text-secondary">
        Starting at Zurich Insurance on <span className="font-bold text-text-primary">July 1, 2026</span>.
      </p>
      <div className="rounded-xl bg-bg-primary/50 border border-border-subtle p-4 max-w-xs mx-auto">
        <p className="font-data text-3xl font-bold text-accent-primary">
          {Math.ceil((new Date("2026-07-01").getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
        </p>
        <p className="text-xs text-text-muted mt-1">days until move</p>
      </div>
      <p className="text-[10px] text-text-muted">
        Quai Zurich Campus, Mythenquai (Kreis 2)
      </p>
    </div>,

    // Step 2: Budget basics
    <div key="budget" className="space-y-4">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-warning/15 flex items-center justify-center">
          <Wallet className="h-8 w-8 text-warning" />
        </div>
        <h2 className="font-display text-xl font-bold text-text-primary mt-3">
          Budget Basics
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Set your gross salary and target rent.
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <div>
          <label className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Gross Monthly Salary
            </span>
            <span className="font-data text-sm font-bold text-text-primary">
              {formatCHF(grossMonthlySalary)}
            </span>
          </label>
          <input
            type="range"
            min={8000}
            max={25000}
            step={500}
            value={grossMonthlySalary}
            onChange={(e) => setGrossMonthlySalary(Number(e.target.value))}
            className="w-full accent-accent-primary"
          />
          <p className="text-[10px] text-text-muted mt-0.5">
            Annual: {formatCHF(grossMonthlySalary * 13)} (13th salary)
          </p>
        </div>

        <div>
          <label className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Target Rent
            </span>
            <span className="font-data text-sm font-bold text-text-primary">
              {formatCHF(rent)}
            </span>
          </label>
          <input
            type="range"
            min={1500}
            max={3500}
            step={50}
            value={rent}
            onChange={(e) => setValue("rent", Number(e.target.value))}
            className="w-full accent-accent-primary"
          />
          <p className="text-[10px] text-text-muted mt-0.5">
            {Math.round((rent / grossMonthlySalary) * 100)}% of gross — {rent <= 2400 ? "comfortable" : rent <= 2800 ? "manageable" : "stretching it"}
          </p>
        </div>
      </div>
    </div>,

    // Step 3: Priority weights
    <div key="priorities" className="space-y-4">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/15 flex items-center justify-center">
          <Target className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="font-display text-xl font-bold text-text-primary mt-3">
          Your Priorities
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Adjust the top 4 dimensions that matter most.
        </p>
      </div>

      <div className="space-y-2 max-w-sm mx-auto">
        {PRIORITY_DIMENSIONS.map((dim) => (
          <div key={dim.key} className="flex items-center gap-3">
            <div className="w-24 shrink-0">
              <p className="text-xs font-medium text-text-secondary">{dim.label}</p>
              <p className="text-[10px] text-text-muted">{dim.description}</p>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={weights[dim.key]}
              onChange={(e) => setWeight(dim.key, Number(e.target.value))}
              className="flex-1 accent-accent-primary"
            />
            <span className="font-data text-xs font-bold text-text-primary w-5 text-right">
              {weights[dim.key]}
            </span>
          </div>
        ))}
      </div>
    </div>,

    // Step 4: Ready
    <div key="ready" className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-accent-primary/15 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-accent-primary" />
      </div>
      <h2 className="font-display text-xl font-bold text-text-primary">
        You're All Set
      </h2>
      <p className="text-sm text-text-secondary max-w-sm mx-auto">
        QuaiPulse is configured. Your dashboard, budget simulator, and
        checklist are ready. Use <kbd className="rounded bg-bg-tertiary px-1.5 py-0.5 text-[10px] font-mono">Cmd+K</kbd> to
        navigate anywhere.
      </p>
      <button
        onClick={handleComplete}
        className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-primary/90 transition-colors"
      >
        Explore Dashboard
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>,
  ];

  const totalSteps = steps.length;
  const isFirst = step === 0;
  const isLast = step === totalSteps - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Onboarding">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Panel */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl border border-border-default bg-bg-secondary shadow-2xl overflow-hidden"
          >
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 pt-5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step
                      ? "w-6 bg-accent-primary"
                      : i < step
                        ? "w-1.5 bg-accent-primary/50"
                        : "w-1.5 bg-bg-tertiary"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-6 min-h-[380px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="w-full"
                >
                  {steps[step]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            {!isLast && (
              <div className="flex items-center justify-between border-t border-border-subtle px-6 py-3">
                <button
                  onClick={handleSkip}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Skip setup
                </button>

                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-1 rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-tertiary transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="flex items-center gap-1 rounded-lg bg-accent-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-primary/90 transition-colors"
                  >
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
