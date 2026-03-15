"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  Sparkles,
  RotateCcw,
  Compass,
} from "lucide-react";
import {
  GUIDE_CHAPTERS,
  GUIDE_STORAGE_KEY,
  DEFAULT_GUIDE_PROGRESS,
  type GuideProgress,
} from "@/lib/data/guide-chapters";

function useGuideProgress() {
  const [progress, setProgress] = useState<GuideProgress>(DEFAULT_GUIDE_PROGRESS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(GUIDE_STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch { /* */ }
  }, []);

  const save = (update: Partial<GuideProgress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...update, lastVisited: new Date().toISOString() };
      localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleStep = (chapterId: string, stepIndex: number) => {
    const key = `${chapterId}:${stepIndex}`;
    const completed = progress.completedSteps.includes(key)
      ? progress.completedSteps.filter((s) => s !== key)
      : [...progress.completedSteps, key];
    save({ completedSteps: completed });
  };

  const reset = () => {
    save({ ...DEFAULT_GUIDE_PROGRESS });
  };

  return { progress, save, toggleStep, reset };
}

export default function GuidePage() {
  const { progress, toggleStep, reset } = useGuideProgress();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(
    GUIDE_CHAPTERS[0]?.id ?? null
  );
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const totalSteps = useMemo(
    () => GUIDE_CHAPTERS.reduce((sum, ch) => sum + ch.steps.length, 0),
    []
  );

  const completedCount = progress.completedSteps.length;
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6 relative max-w-4xl mx-auto">
      {/* Ambient glow */}
      <div className="ambient-glow glow-blue" />

      {/* Hero */}
      <div className="rounded-xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/5 to-transparent p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-accent-primary/10 p-3">
              <Compass className="h-8 w-8 text-accent-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-text-primary">
                Your Relocation Journey
              </h1>
              <p className="text-sm text-text-secondary mt-1 max-w-lg">
                QuaiPulse is organized around the real questions of relocating to Zurich.
                Follow these 6 chapters from "Where should I live?" to "Life in Zurich" —
                or jump to any section that matters right now.
              </p>
            </div>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary transition-colors shrink-0"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Journey Progress
            </span>
            <span className="font-data text-xs text-text-secondary">
              {completedCount}/{totalSteps} steps ({progressPct}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Chapter dots */}
        <div className="flex items-center gap-3 mt-4">
          {GUIDE_CHAPTERS.map((ch) => {
            const chCompleted = ch.steps.every((_, i) =>
              progress.completedSteps.includes(`${ch.id}:${i}`)
            );
            const chPartial = ch.steps.some((_, i) =>
              progress.completedSteps.includes(`${ch.id}:${i}`)
            );
            return (
              <button
                key={ch.id}
                onClick={() => setExpandedChapter(ch.id)}
                className="flex items-center gap-1.5 group"
              >
                <div
                  className={`h-3 w-3 rounded-full border-2 transition-colors ${
                    chCompleted
                      ? "bg-success border-success"
                      : chPartial
                        ? "bg-accent-primary/30 border-accent-primary"
                        : expandedChapter === ch.id
                          ? "border-accent-primary bg-accent-primary/10"
                          : "border-border-default bg-bg-tertiary"
                  }`}
                />
                <span className="text-[10px] text-text-muted group-hover:text-text-secondary transition-colors hidden md:inline">
                  {ch.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Story intro */}
      <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-primary font-semibold">
              How QuaiPulse Tells Your Story
            </p>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Moving to a new country involves hundreds of decisions in a specific order. QuaiPulse
              organizes them into 6 chapters that mirror your actual journey: first you figure out
              <strong> where</strong> to live, then <strong>whether you can afford</strong> it, then you
              <strong> find an apartment</strong>, then <strong>prepare the paperwork</strong>, and finally
              plan your <strong>daily life</strong>. The AI assistant ties it all together.
              Each module feeds data into the next — your neighborhood scores inform apartment filters,
              your budget informs rent limits, your checklist tracks everything.
            </p>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-3">
        {GUIDE_CHAPTERS.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          const chapterStepsCompleted = chapter.steps.filter((_, i) =>
            progress.completedSteps.includes(`${chapter.id}:${i}`)
          ).length;
          const allDone = chapterStepsCompleted === chapter.steps.length;

          return (
            <div
              key={chapter.id}
              className={`rounded-xl border overflow-hidden transition-colors ${
                isExpanded
                  ? "border-accent-primary/30 bg-bg-secondary"
                  : allDone
                    ? "border-success/20 bg-bg-secondary"
                    : "border-border-default bg-bg-secondary"
              }`}
            >
              {/* Chapter header */}
              <button
                onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-bg-tertiary/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${allDone ? "bg-success/10" : "bg-bg-tertiary"}`}>
                    {allDone ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <chapter.icon className={`h-5 w-5 ${chapter.color}`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-data text-[10px] font-bold text-text-muted">
                        CHAPTER {chapter.number}
                      </span>
                      <span className="text-sm font-semibold text-text-primary">
                        {chapter.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {chapter.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-data text-text-muted">
                    {chapterStepsCompleted}/{chapter.steps.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  )}
                </div>
              </button>

              {/* Chapter content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {/* Chapter question */}
                    <div className="px-4 pb-3">
                      <div className="rounded-lg bg-accent-primary/5 border border-accent-primary/15 p-3">
                        <p className="text-xs text-accent-primary italic">
                          "{chapter.question}"
                        </p>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="px-4 pb-4 space-y-2">
                      {chapter.steps.map((step, stepIdx) => {
                        const stepKey = `${chapter.id}:${stepIdx}`;
                        const isDone = progress.completedSteps.includes(stepKey);
                        const isStepExpanded = expandedStep === stepKey;
                        const StepIcon = step.icon;

                        return (
                          <div
                            key={stepIdx}
                            className={`rounded-lg border transition-colors ${
                              isDone
                                ? "border-success/20 bg-success/5"
                                : isStepExpanded
                                  ? "border-accent-primary/20 bg-bg-primary/50"
                                  : "border-border-subtle bg-bg-primary/30"
                            }`}
                          >
                            {/* Step header */}
                            <div className="flex items-start gap-3 p-3">
                              <button
                                onClick={() => toggleStep(chapter.id, stepIdx)}
                                className="mt-0.5 shrink-0"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="h-4 w-4 text-success" />
                                ) : (
                                  <Circle className="h-4 w-4 text-text-muted hover:text-accent-primary transition-colors" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <button
                                  onClick={() =>
                                    setExpandedStep(isStepExpanded ? null : stepKey)
                                  }
                                  className="w-full text-left"
                                >
                                  <div className="flex items-center gap-2">
                                    <StepIcon className={`h-3.5 w-3.5 ${chapter.color} shrink-0`} />
                                    <p className={`text-xs font-semibold ${isDone ? "text-text-muted line-through" : "text-text-primary"}`}>
                                      {step.title}
                                    </p>
                                  </div>
                                  <p className="text-[10px] text-text-muted mt-0.5">
                                    {step.description}
                                  </p>
                                </button>

                                {/* Expanded step detail */}
                                <AnimatePresence>
                                  {isStepExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-3 space-y-2.5">
                                        {/* Detail text */}
                                        <p className="text-[10px] text-text-secondary leading-relaxed">
                                          {step.detail}
                                        </p>

                                        {/* Action box */}
                                        <div className="rounded-lg bg-accent-primary/5 border border-accent-primary/15 p-2.5">
                                          <p className="text-[10px] font-semibold text-accent-primary uppercase tracking-wider mb-0.5">
                                            What to do
                                          </p>
                                          <p className="text-[10px] text-text-secondary">
                                            {step.action}
                                          </p>
                                        </div>

                                        {/* Outcome box */}
                                        <div className="rounded-lg bg-success/5 border border-success/15 p-2.5">
                                          <p className="text-[10px] font-semibold text-success uppercase tracking-wider mb-0.5">
                                            What you get
                                          </p>
                                          <p className="text-[10px] text-text-secondary">
                                            {step.outcome}
                                          </p>
                                        </div>

                                        {/* Leads to */}
                                        {step.leadsTo && (
                                          <div className="flex items-start gap-1.5">
                                            <ArrowRight className="h-3 w-3 text-text-muted shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-text-muted italic">
                                              {step.leadsTo}
                                            </p>
                                          </div>
                                        )}

                                        {/* Go to page button */}
                                        <Link
                                          href={step.href}
                                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-accent-primary hover:text-accent-primary/80 transition-colors mt-1"
                                        >
                                          Open {step.title}
                                          <ChevronRight className="h-3 w-3" />
                                        </Link>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Flow diagram */}
      <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-text-muted" />
          How Modules Connect
        </h2>
        <div className="space-y-2">
          {[
            {
              from: "Neighborhood Priorities",
              to: "Apartment Filters",
              desc: "Your top-ranked Kreise auto-filter apartment search",
            },
            {
              from: "Budget (rent slider)",
              to: "Apartment price range",
              desc: "Your target rent sets the min/max price filter",
            },
            {
              from: "Subscription decisions",
              to: "Budget expenses",
              desc: "Keep/cut/replace totals feed into monthly expense calculation",
            },
            {
              from: "Budget (all stores)",
              to: "AI Chat context",
              desc: "Pulse reads your live budget, priorities, and progress for personalized answers",
            },
            {
              from: "Checklist progress",
              to: "Dashboard readiness ring",
              desc: "Completed tasks drive the Move Readiness percentage on your dashboard",
            },
            {
              from: "Sleep entries",
              to: "Sleep analytics + protocol",
              desc: "Nightly logs power supplement effectiveness stats and tonight's recommendation",
            },
          ].map((flow, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[10px] py-1.5 border-b border-border-subtle last:border-0"
            >
              <span className="font-data font-bold text-accent-primary whitespace-nowrap">
                {flow.from}
              </span>
              <ArrowRight className="h-3 w-3 text-text-muted shrink-0" />
              <span className="font-data font-bold text-text-primary whitespace-nowrap">
                {flow.to}
              </span>
              <span className="text-text-muted ml-2 hidden md:inline">
                — {flow.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          Keyboard Navigation
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { keys: "Cmd + K", desc: "Open command palette (search anything)" },
            { keys: "G then D", desc: "Go to Dashboard" },
            { keys: "G then N", desc: "Go to Neighborhoods" },
            { keys: "G then B", desc: "Go to Budget" },
            { keys: "G then A", desc: "Go to Apartments" },
            { keys: "G then C", desc: "Go to Checklist" },
            { keys: "J / K", desc: "Navigate neighborhoods list" },
            { keys: "Enter", desc: "Expand focused neighborhood" },
            { keys: "G then I", desc: "Go to AI Chat" },
          ].map((s) => (
            <div
              key={s.keys}
              className="flex items-center gap-2 text-[10px]"
            >
              <kbd className="px-1.5 py-0.5 rounded border border-border-default bg-bg-primary font-data text-text-secondary">
                {s.keys}
              </kbd>
              <span className="text-text-muted">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
