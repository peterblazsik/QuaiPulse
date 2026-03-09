"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORY_CONFIG, type SubscriptionData, type SubCategory } from "@/lib/data/subscriptions";

export function AddSubscriptionForm({
  onAdd,
  onClose,
}: {
  onAdd: (sub: SubscriptionData) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SubCategory>("other");
  const [costEUR, setCostEUR] = useState("");
  const [costCHF, setCostCHF] = useState("");
  const [essential, setEssential] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const eurVal = parseFloat(costEUR) || 0;
    const chfVal = parseFloat(costCHF) || eurVal;
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      monthlyCostEUR: eurVal,
      monthlyCostCHF: chfVal,
      billingCycle: "monthly",
      essential,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-border-default bg-bg-primary p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Add Subscription</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hetzner VPS"
              className="w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SubCategory)}
                className="w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
              >
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={essential}
                  onChange={(e) => setEssential(e.target.checked)}
                  className="rounded border-border-default"
                />
                Essential
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">
                Monthly cost (EUR)
              </label>
              <input
                type="number"
                value={costEUR}
                onChange={(e) => setCostEUR(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs text-text-primary font-data placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">
                Monthly cost (CHF)
              </label>
              <input
                type="number"
                value={costCHF}
                onChange={(e) => setCostCHF(e.target.value)}
                placeholder="Same as EUR"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs text-text-primary font-data placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this subscription"
              className="w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-4 py-2 rounded-lg border border-border-default bg-bg-secondary text-text-muted hover:text-text-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="text-xs px-4 py-2 rounded-lg bg-accent-primary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Subscription
          </button>
        </div>
      </form>
    </div>
  );
}
