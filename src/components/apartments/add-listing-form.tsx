"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useApartmentStore } from "@/lib/stores/apartment-store";

interface AddListingFormProps {
  onClose: () => void;
}

export function AddListingForm({ onClose }: AddListingFormProps) {
  const addApartment = useApartmentStore((s) => s.add);
  const [form, setForm] = useState({
    title: "",
    address: "",
    kreis: "",
    rent: "",
    rooms: "",
    sqm: "",
    sourceUrl: "",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.title || !form.rent) return;
    const safeUrl =
      form.sourceUrl && /^https?:\/\//i.test(form.sourceUrl)
        ? form.sourceUrl
        : "";
    addApartment({
      title: form.title,
      address: form.address,
      kreis: Number(form.kreis) || 0,
      rent: Number(form.rent) || 0,
      rooms: Number(form.rooms) || 0,
      sqm: Number(form.sqm) || 0,
      sourceUrl: safeUrl,
      status: "new",
      notes: form.notes,
    });
    onClose();
  };

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="rounded-xl border border-accent-primary/30 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Add Apartment Listing
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <FormField
          label="Title *"
          placeholder="e.g., Bright 2.5 room near lake"
          value={form.title}
          onChange={(v) => update("title", v)}
        />
        <FormField
          label="Address"
          placeholder="Strasse, PLZ Zurich"
          value={form.address}
          onChange={(v) => update("address", v)}
        />
        <FormField
          label="Kreis"
          placeholder="2"
          type="number"
          value={form.kreis}
          onChange={(v) => update("kreis", v)}
        />
        <FormField
          label="Rent (CHF) *"
          placeholder="2400"
          type="number"
          value={form.rent}
          onChange={(v) => update("rent", v)}
        />
        <FormField
          label="Rooms"
          placeholder="2.5"
          type="number"
          value={form.rooms}
          onChange={(v) => update("rooms", v)}
        />
        <FormField
          label="Size (m²)"
          placeholder="55"
          type="number"
          value={form.sqm}
          onChange={(v) => update("sqm", v)}
        />
        <div className="md:col-span-2 lg:col-span-3">
          <FormField
            label="Source URL"
            placeholder="https://..."
            value={form.sourceUrl}
            onChange={(v) => update("sourceUrl", v)}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <FormField
            label="Notes"
            placeholder="Personal observations..."
            value={form.notes}
            onChange={(v) => update("notes", v)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!form.title || !form.rent}
          className="flex items-center gap-1 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors"
      />
    </div>
  );
}
