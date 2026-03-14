"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import {
  ArrowRight,
  ArrowLeft,
  Rocket,
  Plane,
  Building2,
  Users,
  Wallet,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface FormData {
  displayName: string;
  originCity: string;
  originCountry: string;
  moveDate: string;
  employerName: string;
  officeName: string;
  officeAddress: string;
  jobTitle: string;
  hasChildren: boolean;
  childName: string;
  childAge: number | null;
  childCity: string;
  childCountry: string;
  grossMonthlySalary: number | null;
  has13thSalary: boolean;
  targetRentMin: number | null;
  targetRentMax: number | null;
}

interface OnboardingInterviewProps {
  onComplete: () => void;
}

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const TOTAL_STEPS = 6;

const INPUT_CLASS =
  "bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full text-[14px]";

const LABEL_CLASS =
  "block text-[13px] font-medium text-slate-300 mb-1.5";

const NOTE_CLASS =
  "text-[12px] text-slate-500 mt-4 leading-relaxed";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

/* ─── Component ──────────────────────────────────────────────────────────────── */

export function OnboardingInterview({ onComplete }: OnboardingInterviewProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const upsertProfile = trpc.profile.upsert.useMutation();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormData>({
    displayName: session?.user?.name ?? "",
    originCity: "",
    originCountry: "",
    moveDate: "",
    employerName: "",
    officeName: "",
    officeAddress: "",
    jobTitle: "",
    hasChildren: false,
    childName: "",
    childAge: null,
    childCity: "",
    childCountry: "",
    grossMonthlySalary: null,
    has13thSalary: false,
    targetRentMin: null,
    targetRentMax: null,
  });

  /* ── Helpers ─────────────────────────────────────────────────────────────── */

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function canContinue(): boolean {
    switch (step) {
      case 0:
        return form.displayName.trim().length > 0;
      case 1:
        return (
          form.originCity.trim().length > 0 &&
          form.originCountry.trim().length > 0 &&
          form.moveDate.length > 0
        );
      case 2:
        return form.employerName.trim().length > 0;
      case 3:
        if (form.hasChildren) {
          return (
            form.childName.trim().length > 0 &&
            form.childAge !== null &&
            form.childCity.trim().length > 0 &&
            form.childCountry.trim().length > 0
          );
        }
        return true;
      case 4:
        return form.grossMonthlySalary !== null && form.grossMonthlySalary > 0;
      default:
        return true;
    }
  }

  async function handleLaunch() {
    setIsSubmitting(true);
    try {
      await upsertProfile.mutateAsync({
        displayName: form.displayName,
        originCity: form.originCity,
        originCountry: form.originCountry,
        destinationCity: "Zürich",
        moveDate: form.moveDate || null,
        employerName: form.employerName,
        officeName: form.officeName || undefined,
        officeAddress: form.officeAddress || undefined,
        jobTitle: form.jobTitle || undefined,
        hasChildren: form.hasChildren,
        childName: form.hasChildren ? form.childName : null,
        childAge: form.hasChildren ? form.childAge : null,
        childCity: form.hasChildren ? form.childCity : null,
        childCountry: form.hasChildren ? form.childCountry : null,
        grossMonthlySalary: form.grossMonthlySalary,
        has13thSalary: form.has13thSalary,
        targetRentMin: form.targetRentMin,
        targetRentMax: form.targetRentMax,
        onboardingComplete: true,
      });
      onComplete();
      router.push("/");
    } catch (err) {
      console.error("Onboarding save failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Progress Bar ────────────────────────────────────────────────────────── */

  function ProgressBar() {
    const progress = ((step + 1) / TOTAL_STEPS) * 100;
    return (
      <div className="px-8 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-slate-500 font-medium">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-[12px] text-slate-500 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  /* ── Step Content ────────────────────────────────────────────────────────── */

  function StepContent() {
    switch (step) {
      /* Step 0: Welcome */
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-4">
                <Rocket className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to QuaiPulse
              </h2>
              <p className="text-[15px] text-slate-400 mb-1">
                Your personal Zurich relocation navigator
              </p>
              <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
                Let&apos;s set up your profile so everything is personalized for
                your move.
              </p>
            </div>
            <div className="max-w-sm mx-auto">
              <label className={LABEL_CLASS}>Display name</label>
              <input
                type="text"
                className={INPUT_CLASS}
                placeholder="Your name"
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                autoFocus
              />
            </div>
          </div>
        );

      /* Step 1: The Move */
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4">
                <Plane className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Tell us about your move
              </h2>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <label className={LABEL_CLASS}>Origin city</label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="Amsterdam, London, Berlin..."
                  value={form.originCity}
                  onChange={(e) => update("originCity", e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Origin country</label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="Netherlands, UK, Germany..."
                  value={form.originCountry}
                  onChange={(e) => update("originCountry", e.target.value)}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Move date</label>
                <input
                  type="date"
                  className={`${INPUT_CLASS} [color-scheme:dark]`}
                  value={form.moveDate}
                  onChange={(e) => update("moveDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      /* Step 2: Employment */
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Your employer in Zurich
              </h2>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <label className={LABEL_CLASS}>Company name</label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="e.g. Zurich Insurance"
                  value={form.employerName}
                  onChange={(e) => update("employerName", e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Office name</label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="e.g. Quai Zurich Campus"
                  value={form.officeName}
                  onChange={(e) => update("officeName", e.target.value)}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Office address</label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="e.g. Mythenquai 2, 8002 Zürich"
                  value={form.officeAddress}
                  onChange={(e) => update("officeAddress", e.target.value)}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Job title</label>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  placeholder="e.g. Finance AI & Innovation Lead"
                  value={form.jobTitle}
                  onChange={(e) => update("jobTitle", e.target.value)}
                />
              </div>
              <p className={NOTE_CLASS}>
                <MapPin className="inline h-3.5 w-3.5 mr-1 text-slate-500" />
                We use your office location to calculate commute scores for
                neighborhoods.
              </p>
            </div>
          </div>
        );

      /* Step 3: Family */
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/15 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Family situation
              </h2>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              {/* Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.hasChildren}
                  onClick={() => update("hasChildren", !form.hasChildren)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    form.hasChildren ? "bg-blue-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      form.hasChildren ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-[14px] text-slate-300 group-hover:text-white transition-colors">
                  I have children who will visit
                </span>
              </label>

              {/* Child fields */}
              <AnimatePresence>
                {form.hasChildren && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className={LABEL_CLASS}>Child name</label>
                        <input
                          type="text"
                          className={INPUT_CLASS}
                          placeholder="e.g. Katie"
                          value={form.childName}
                          onChange={(e) => update("childName", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Child age</label>
                        <input
                          type="number"
                          className={INPUT_CLASS}
                          placeholder="e.g. 9"
                          min={0}
                          max={25}
                          value={form.childAge ?? ""}
                          onChange={(e) =>
                            update(
                              "childAge",
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>
                          City where child lives
                        </label>
                        <input
                          type="text"
                          className={INPUT_CLASS}
                          placeholder="e.g. Vienna"
                          value={form.childCity}
                          onChange={(e) => update("childCity", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Country</label>
                        <input
                          type="text"
                          className={INPUT_CLASS}
                          placeholder="e.g. Austria"
                          value={form.childCountry}
                          onChange={(e) =>
                            update("childCountry", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className={NOTE_CLASS}>
                <Calendar className="inline h-3.5 w-3.5 mr-1 text-slate-500" />
                This helps us plan visits, calculate travel costs, and find
                family-friendly neighborhoods.
              </p>
            </div>
          </div>
        );

      /* Step 4: Budget */
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-500/15 flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-teal-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Quick budget setup
              </h2>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <label className={LABEL_CLASS}>
                  Gross monthly salary (CHF)
                </label>
                <input
                  type="number"
                  className={INPUT_CLASS}
                  placeholder="e.g. 15000"
                  min={0}
                  value={form.grossMonthlySalary ?? ""}
                  onChange={(e) =>
                    update(
                      "grossMonthlySalary",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  autoFocus
                />
              </div>

              {/* 13th salary toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.has13thSalary}
                  onClick={() => update("has13thSalary", !form.has13thSalary)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    form.has13thSalary ? "bg-blue-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      form.has13thSalary ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-[14px] text-slate-300 group-hover:text-white transition-colors">
                  13th salary
                </span>
              </label>

              {/* Rent range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>Min rent (CHF)</label>
                  <input
                    type="number"
                    className={INPUT_CLASS}
                    placeholder="e.g. 2000"
                    min={0}
                    value={form.targetRentMin ?? ""}
                    onChange={(e) =>
                      update(
                        "targetRentMin",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Max rent (CHF)</label>
                  <input
                    type="number"
                    className={INPUT_CLASS}
                    placeholder="e.g. 2800"
                    min={0}
                    value={form.targetRentMax ?? ""}
                    onChange={(e) =>
                      update(
                        "targetRentMax",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                  />
                </div>
              </div>

              <p className={NOTE_CLASS}>
                <Briefcase className="inline h-3.5 w-3.5 mr-1 text-slate-500" />
                You can fine-tune everything in the Budget module later.
              </p>
            </div>
          </div>
        );

      /* Step 5: Summary / Ready */
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                You&apos;re all set!
              </h2>
              <p className="text-[13px] text-slate-500">
                Here&apos;s a quick summary of your profile.
              </p>
            </div>

            {/* Summary card */}
            <div className="max-w-sm mx-auto rounded-xl border border-slate-700 bg-slate-800/60 p-5 space-y-3">
              <SummaryRow
                icon={<CheckCircle2 className="h-4 w-4 text-blue-400" />}
                label="Name"
                value={form.displayName}
              />
              <SummaryRow
                icon={<Plane className="h-4 w-4 text-emerald-400" />}
                label="Moving from"
                value={`${form.originCity}, ${form.originCountry}`}
              />
              <SummaryRow
                icon={<MapPin className="h-4 w-4 text-amber-400" />}
                label="Destination"
                value="Zürich, Switzerland"
              />
              <SummaryRow
                icon={<Building2 className="h-4 w-4 text-purple-400" />}
                label="Employer"
                value={form.employerName}
              />
              {form.moveDate && (
                <SummaryRow
                  icon={<Calendar className="h-4 w-4 text-teal-400" />}
                  label="Move date"
                  value={new Date(form.moveDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
              )}
              {form.hasChildren && form.childName && (
                <SummaryRow
                  icon={<Users className="h-4 w-4 text-pink-400" />}
                  label="Child"
                  value={`${form.childName} (${form.childAge}) in ${form.childCity}`}
                />
              )}
            </div>

            {/* Launch button */}
            <div className="text-center">
              <button
                onClick={handleLaunch}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-8 py-3 text-[15px] font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    Launch Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  /* ── Render ──────────────────────────────────────────────────────────────── */

  const isLast = step === TOTAL_STEPS - 1;
  const isFirst = step === 0;

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding Interview"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />

      {/* Centered panel */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40 overflow-hidden"
        >
          {/* Progress bar */}
          <ProgressBar />

          {/* Step content */}
          <div className="px-8 py-6 min-h-[420px] flex items-start justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full"
              >
                <StepContent />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation footer */}
          {!isLast && (
            <div className="flex items-center justify-between border-t border-slate-800 px-8 py-4">
              <div>
                {!isFirst && (
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-[13px] font-medium text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                )}
              </div>
              <button
                onClick={goNext}
                disabled={!canContinue()}
                className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-5 py-2 text-[13px] font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
          {label}
        </p>
        <p className="text-[14px] text-white truncate">{value}</p>
      </div>
    </div>
  );
}
