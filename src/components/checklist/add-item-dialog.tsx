"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import { toast } from "sonner";

const PHASE_OPTIONS = [
  { value: "mar-apr" as const, label: "March - April" },
  { value: "may" as const, label: "May" },
  { value: "jun" as const, label: "June" },
  { value: "jul" as const, label: "July" },
];

const CATEGORY_SUGGESTIONS = [
  "Administration",
  "Apartment Search",
  "Insurance",
  "Move",
  "Setup",
  "Social",
  "Finance",
  "Health",
];

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddItemDialog({ open, onClose }: AddItemDialogProps) {
  const addCustomItem = useChecklistStore((s) => s.addCustomItem);

  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState<"mar-apr" | "may" | "jun" | "jul">("mar-apr");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [hardDeadline, setHardDeadline] = useState("");
  const [url, setUrl] = useState("");

  const reset = useCallback(() => {
    setTitle("");
    setPhase("mar-apr");
    setCategory("");
    setDescription("");
    setEstimatedDays("");
    setHardDeadline("");
    setUrl("");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !category.trim()) return;

      addCustomItem({
        title: title.trim(),
        phase,
        category: category.trim(),
        description: description.trim() || undefined,
        estimatedDays: estimatedDays ? Number(estimatedDays) : undefined,
        hardDeadline: hardDeadline || undefined,
        url: url.trim() || undefined,
      });

      toast.success("Task added", { description: title.trim() });
      reset();
      onClose();
    },
    [title, phase, category, description, estimatedDays, hardDeadline, url, addCustomItem, onClose, reset]
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Add checklist item">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <div className="flex items-start justify-center pt-[10vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border-default bg-bg-secondary shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-accent-primary" />
                  <h2 className="text-sm font-semibold text-text-primary">
                    Add Task
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                    autoFocus
                    required
                  />
                </div>

                {/* Phase + Category row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Phase *
                    </label>
                    <select
                      value={phase}
                      onChange={(e) => setPhase(e.target.value as typeof phase)}
                      className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none"
                    >
                      {PHASE_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Administration"
                      list="category-suggestions"
                      className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                      required
                    />
                    <datalist id="category-suggestions">
                      {CATEGORY_SUGGESTIONS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details, links, notes..."
                    rows={2}
                    className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none resize-none"
                  />
                </div>

                {/* Estimated Days + Hard Deadline row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Estimated Days
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(e.target.value)}
                      placeholder="e.g. 7"
                      className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Hard Deadline
                    </label>
                    <input
                      type="date"
                      value={hardDeadline}
                      onChange={(e) => setHardDeadline(e.target.value)}
                      className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-border-default px-4 py-2 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() || !category.trim()}
                    className="rounded-lg bg-accent-primary px-4 py-2 text-xs font-semibold text-white hover:bg-accent-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
