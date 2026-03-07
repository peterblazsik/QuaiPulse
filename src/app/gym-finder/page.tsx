"use client";

import { useMemo } from "react";
import {
  Dumbbell,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Star,
  Clock,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  GYMS,
  EQUIPMENT_LABELS,
  ALL_EQUIPMENT_TYPES,
  type GymData,
  type GymEquipment,
  type KneeSafety,
  type EquipmentType,
} from "@/lib/data/gyms";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { useGymFilterStore } from "@/lib/stores/gym-filter-store";
import { formatCHF } from "@/lib/utils";

function kneeColor(safety: KneeSafety) {
  switch (safety) {
    case "safe":
      return "#22c55e";
    case "caution":
      return "#f59e0b";
    case "avoid":
      return "#ef4444";
  }
}

function KneeIcon({ safety, size = 12 }: { safety: KneeSafety; size?: number }) {
  const color = kneeColor(safety);
  switch (safety) {
    case "safe":
      return <Check className="shrink-0" style={{ color, width: size, height: size }} />;
    case "caution":
      return <AlertTriangle className="shrink-0" style={{ color, width: size, height: size }} />;
    case "avoid":
      return <X className="shrink-0" style={{ color, width: size, height: size }} />;
  }
}

function KneeScoreBadge({ score }: { score: number }) {
  const color = score >= 8 ? "#22c55e" : score >= 5 ? "#f59e0b" : "#ef4444";
  const Icon = score >= 8 ? ShieldCheck : score >= 5 ? ShieldAlert : ShieldX;
  return (
    <div
      className="flex items-center gap-1 rounded-md px-2 py-0.5"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
    >
      <Icon className="h-3 w-3" style={{ color }} />
      <span className="font-data text-[10px] font-semibold" style={{ color }}>
        {score}/10
      </span>
    </div>
  );
}

function neighborhoodName(id: string) {
  return NEIGHBORHOODS.find((n) => n.id === id)?.name ?? id;
}

export default function GymFinderPage() {
  const {
    selectedEquipment,
    toggleEquipment,
    priceRange,
    kneeSafeOnly,
    setKneeSafeOnly,
    compareIds,
    toggleCompare,
    clearCompare,
  } = useGymFilterStore();

  const filtered = useMemo(() => {
    return GYMS.filter((gym) => {
      if (gym.monthlyPrice < priceRange[0] || gym.monthlyPrice > priceRange[1])
        return false;
      if (kneeSafeOnly && gym.kneeFriendlyScore < 7) return false;
      if (selectedEquipment.length > 0) {
        const gymEquipTypes = gym.equipment.map((e) => e.type);
        if (!selectedEquipment.every((eq) => gymEquipTypes.includes(eq)))
          return false;
      }
      return true;
    });
  }, [priceRange, kneeSafeOnly, selectedEquipment]);

  const compareGyms = useMemo(
    () => GYMS.filter((g) => compareIds.includes(g.id)),
    [compareIds],
  );

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-red" />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Gym Finder
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          {GYMS.length} gyms analyzed for knee-safe training. Bilateral meniscus
          + torn ACL left knee — every machine rated.
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-lg border border-border-default bg-bg-secondary p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Dumbbell className="h-3.5 w-3.5 text-text-muted" />
            Equipment Filter
          </h3>
          <div className="flex items-center gap-3">
            <span className="font-data text-[10px] text-text-muted">
              {formatCHF(priceRange[0])} - {formatCHF(priceRange[1])}/mo
            </span>
            <button
              onClick={() => setKneeSafeOnly(!kneeSafeOnly)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                kneeSafeOnly
                  ? "border-green-500/50 bg-green-500/12 text-green-400"
                  : "border-border-default bg-bg-tertiary text-text-muted hover:text-text-secondary"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Knee-safe only
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_EQUIPMENT_TYPES.map((eq) => {
            const active = selectedEquipment.includes(eq);
            return (
              <button
                key={eq}
                onClick={() => toggleEquipment(eq)}
                className={`text-[10px] px-2.5 py-1 rounded-md border transition-colors ${
                  active
                    ? "border-accent-primary/50 bg-accent-primary/12 text-accent-primary"
                    : "border-border-default bg-bg-tertiary text-text-muted hover:text-text-secondary"
                }`}
              >
                {EQUIPMENT_LABELS[eq]}
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-text-muted">
          {filtered.length} of {GYMS.length} gyms match filters
          {selectedEquipment.length > 0 &&
            ` (requires: ${selectedEquipment.map((e) => EQUIPMENT_LABELS[e]).join(", ")})`}
        </p>
      </div>

      {/* Compare table */}
      {compareGyms.length > 0 && (
        <div className="rounded-lg border border-border-default bg-bg-secondary p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-text-primary">
              Compare ({compareGyms.length}/3)
            </h3>
            <button
              onClick={clearCompare}
              className="text-[10px] text-text-muted hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear compare
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-1.5 pr-3 text-text-muted font-medium">
                    Metric
                  </th>
                  {compareGyms.map((gym) => (
                    <th
                      key={gym.id}
                      className="text-left py-1.5 px-3 text-text-primary font-semibold"
                    >
                      {gym.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                <CompareRow label="Price" gyms={compareGyms} render={(g) => formatCHF(g.monthlyPrice) + "/mo"} />
                <CompareRow label="Rating" gyms={compareGyms} render={(g) => `${g.rating}/10`} />
                <CompareRow
                  label="Knee Score"
                  gyms={compareGyms}
                  render={(g) => (
                    <KneeScoreBadge score={g.kneeFriendlyScore} />
                  )}
                />
                <CompareRow
                  label="Equipment"
                  gyms={compareGyms}
                  render={(g) => `${g.equipment.length} types`}
                />
                <CompareRow label="Hours" gyms={compareGyms} render={(g) => g.openingHours} />
                <CompareRow
                  label="Amenities"
                  gyms={compareGyms}
                  render={(g) => g.amenities.join(", ")}
                />
                <CompareRow
                  label="Trial"
                  gyms={compareGyms}
                  render={(g) =>
                    g.trialAvailable ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-text-muted">No</span>
                    )
                  }
                />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gym grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((gym) => (
          <GymCard
            key={gym.id}
            gym={gym}
            isComparing={compareIds.includes(gym.id)}
            onToggleCompare={() => toggleCompare(gym.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="h-8 w-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">
            No gyms match your filters. Try adjusting equipment or knee-safe requirements.
          </p>
        </div>
      )}
    </div>
  );
}

function CompareRow({
  label,
  gyms,
  render,
}: {
  label: string;
  gyms: GymData[];
  render: (gym: GymData) => React.ReactNode;
}) {
  return (
    <tr>
      <td className="py-1.5 pr-3 text-text-muted font-medium">{label}</td>
      {gyms.map((gym) => (
        <td key={gym.id} className="py-1.5 px-3 text-text-secondary font-data">
          {render(gym)}
        </td>
      ))}
    </tr>
  );
}

function GymCard({
  gym,
  isComparing,
  onToggleCompare,
}: {
  gym: GymData;
  isComparing: boolean;
  onToggleCompare: () => void;
}) {
  return (
    <div
      className={`rounded-lg border bg-bg-secondary p-3 transition-colors ${
        isComparing
          ? "border-accent-primary/50"
          : "border-border-default hover:border-accent-primary/30"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <h4 className="text-xs font-semibold text-text-primary truncate">
              {gym.name}
            </h4>
          </div>
          <p className="text-[10px] text-text-muted mt-0.5 truncate">
            {neighborhoodName(gym.neighborhoodId)} &middot; {gym.address}
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
          <span className="font-data text-[10px] text-amber-400">
            {gym.rating}
          </span>
        </div>
      </div>

      {/* Price + Knee score + Hours */}
      <div className="flex items-center gap-2 mt-2">
        <span className="font-data text-xs font-semibold text-text-primary">
          {formatCHF(gym.monthlyPrice)}
          <span className="text-text-muted font-normal">/mo</span>
        </span>
        <KneeScoreBadge score={gym.kneeFriendlyScore} />
        <div className="flex items-center gap-0.5 ml-auto">
          <Clock className="h-2.5 w-2.5 text-text-muted" />
          <span className="font-data text-[10px] text-text-muted">
            {gym.openingHours}
          </span>
        </div>
      </div>

      {/* Personal note */}
      <p className="text-[10px] text-text-tertiary mt-2 leading-snug italic">
        &ldquo;{gym.personalNote}&rdquo;
      </p>

      {/* Equipment list */}
      <div className="mt-2 space-y-0.5">
        <p className="text-[10px] font-medium text-text-muted mb-1">
          Equipment ({gym.equipment.length})
        </p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          {gym.equipment.map((eq) => (
            <EquipmentItem key={eq.type} equipment={eq} />
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-1 mt-2">
        {gym.amenities.map((amenity) => (
          <span
            key={amenity}
            className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted"
          >
            {amenity}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          {gym.trialAvailable && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/12 text-green-400 font-medium">
              Free trial
            </span>
          )}
          <div className="flex gap-1">
            {gym.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onToggleCompare}
          className={`text-[10px] px-2 py-1 rounded border transition-colors ${
            isComparing
              ? "border-accent-primary/50 bg-accent-primary/12 text-accent-primary"
              : "border-border-default bg-bg-tertiary text-text-muted hover:text-text-secondary"
          }`}
        >
          {isComparing ? "Comparing" : "Compare"}
        </button>
      </div>
    </div>
  );
}

function EquipmentItem({ equipment }: { equipment: GymEquipment }) {
  return (
    <div className="flex items-center gap-1">
      <KneeIcon safety={equipment.kneeSafety} size={10} />
      <span className="text-[10px] text-text-secondary truncate">
        {EQUIPMENT_LABELS[equipment.type]}
      </span>
      {equipment.notes && (
        <span className="text-[10px] text-text-muted truncate">
          ({equipment.notes})
        </span>
      )}
    </div>
  );
}
