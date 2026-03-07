import { describe, it, expect, beforeEach } from "vitest";
import { useSleepStore, type SleepEntry } from "../sleep-store";

describe("useSleepStore", () => {
  let initialEntries: SleepEntry[];

  beforeEach(() => {
    const state = useSleepStore.getState();
    initialEntries = [...state.entries];
    if (initialEntries.length === 0) {
      useSleepStore.setState({
        entries: [
          {
            id: "demo-0",
            date: "2026-02-22",
            hours: 7.5,
            quality: 4 as const,
            location: "zurich",
            supplements: ["magnesium-glycinate"],
            interventions: ["yoga-nidra", "morning-light"],
            bedtime: "22:30",
            waketime: "06:00",
            sleepLatency: 15,
            awakenings: 1,
          },
          {
            id: "demo-1",
            date: "2026-02-23",
            hours: 6.5,
            quality: 3 as const,
            location: "zurich",
            supplements: [],
            interventions: ["morning-light"],
            bedtime: "23:15",
            waketime: "06:00",
            sleepLatency: 25,
            awakenings: 2,
          },
          {
            id: "demo-2",
            date: "2026-02-24",
            hours: 8.0,
            quality: 5 as const,
            location: "zurich",
            supplements: ["melatonin", "magnesium-glycinate", "glycine"],
            interventions: ["yoga-nidra", "swimming", "evening-light-block"],
            bedtime: "22:00",
            waketime: "06:00",
            sleepLatency: 8,
            awakenings: 0,
          },
        ],
      });
      initialEntries = [...useSleepStore.getState().entries];
    }
  });

  describe("initial state", () => {
    it("should have demo entries pre-populated", () => {
      const { entries } = useSleepStore.getState();
      expect(entries.length).toBeGreaterThan(0);
    });

    it("should have entries with required fields", () => {
      const { entries } = useSleepStore.getState();
      for (const entry of entries) {
        expect(entry).toHaveProperty("id");
        expect(entry).toHaveProperty("date");
        expect(entry).toHaveProperty("hours");
        expect(entry).toHaveProperty("quality");
        expect(entry).toHaveProperty("location");
        expect(entry).toHaveProperty("supplements");
        expect(typeof entry.hours).toBe("number");
        expect(entry.quality).toBeGreaterThanOrEqual(1);
        expect(entry.quality).toBeLessThanOrEqual(5);
      }
    });
  });

  describe("addEntry", () => {
    it("should add a new sleep entry with a generated id", () => {
      const { addEntry } = useSleepStore.getState();
      const countBefore = useSleepStore.getState().entries.length;

      addEntry({
        date: "2026-03-07",
        hours: 7.0,
        quality: 4 as const,
        location: "zurich",
        supplements: ["magnesium"],
      });

      const { entries } = useSleepStore.getState();
      expect(entries.length).toBe(countBefore + 1);

      const newEntry = entries[entries.length - 1];
      expect(newEntry.id).toMatch(/^sleep-\d+$/);
      expect(newEntry.date).toBe("2026-03-07");
      expect(newEntry.hours).toBe(7.0);
    });
  });

  describe("removeEntry", () => {
    it("should remove an entry by id", () => {
      const targetId = initialEntries[0].id;
      const countBefore = useSleepStore.getState().entries.length;

      const { removeEntry } = useSleepStore.getState();
      removeEntry(targetId);

      const { entries } = useSleepStore.getState();
      expect(entries.length).toBe(countBefore - 1);
      expect(entries.find((e) => e.id === targetId)).toBeUndefined();
    });

    it("should not remove anything when id does not exist", () => {
      const countBefore = useSleepStore.getState().entries.length;

      const { removeEntry } = useSleepStore.getState();
      removeEntry("non-existent-id");

      const { entries } = useSleepStore.getState();
      expect(entries.length).toBe(countBefore);
    });

    it("should keep other entries intact after removal", () => {
      const targetId = initialEntries[0].id;
      const otherIds = initialEntries.slice(1).map((e) => e.id);

      const { removeEntry } = useSleepStore.getState();
      removeEntry(targetId);

      const { entries } = useSleepStore.getState();
      for (const id of otherIds) {
        expect(entries.find((e) => e.id === id)).toBeDefined();
      }
    });
  });

  describe("updateEntry", () => {
    it("should update an entry with partial data", () => {
      const targetId = initialEntries[0].id;

      const { updateEntry } = useSleepStore.getState();
      updateEntry(targetId, { hours: 9.0, quality: 5 as const });

      const { entries } = useSleepStore.getState();
      const updated = entries.find((e) => e.id === targetId);
      expect(updated?.hours).toBe(9.0);
      expect(updated?.quality).toBe(5);
      // Unchanged fields should persist
      expect(updated?.location).toBe(initialEntries[0].location);
      expect(updated?.date).toBe(initialEntries[0].date);
    });

    it("should update notes field", () => {
      const targetId = initialEntries[0].id;

      const { updateEntry } = useSleepStore.getState();
      updateEntry(targetId, { notes: "Woke up refreshed" });

      const { entries } = useSleepStore.getState();
      const updated = entries.find((e) => e.id === targetId);
      expect(updated?.notes).toBe("Woke up refreshed");
    });

    it("should update supplements array", () => {
      const targetId = initialEntries[0].id;

      const { updateEntry } = useSleepStore.getState();
      updateEntry(targetId, { supplements: ["melatonin", "zinc"] });

      const { entries } = useSleepStore.getState();
      const updated = entries.find((e) => e.id === targetId);
      expect(updated?.supplements).toEqual(["melatonin", "zinc"]);
    });

    it("should not modify other entries", () => {
      const targetId = initialEntries[0].id;
      const otherId = initialEntries[1].id;
      const otherBefore = { ...initialEntries[1] };

      const { updateEntry } = useSleepStore.getState();
      updateEntry(targetId, { hours: 10 });

      const { entries } = useSleepStore.getState();
      const other = entries.find((e) => e.id === otherId);
      expect(other).toEqual(otherBefore);
    });

    it("should do nothing when id does not exist", () => {
      const before = [...useSleepStore.getState().entries];

      const { updateEntry } = useSleepStore.getState();
      updateEntry("non-existent-id", { hours: 12 });

      const { entries } = useSleepStore.getState();
      expect(entries).toEqual(before);
    });
  });

  describe("enhanced fields (interventions, timing, latency, awakenings)", () => {
    it("should add entry with all new fields", () => {
      const { addEntry } = useSleepStore.getState();
      addEntry({
        date: "2026-03-07",
        hours: 7.5,
        quality: 4 as const,
        location: "zurich",
        supplements: ["magnesium-glycinate", "l-theanine"],
        interventions: ["yoga-nidra", "morning-light", "swimming"],
        bedtime: "22:30",
        waketime: "06:00",
        sleepLatency: 12,
        awakenings: 1,
        notes: "Great sleep with full protocol",
      });

      const { entries } = useSleepStore.getState();
      const added = entries[entries.length - 1];
      expect(added.interventions).toEqual(["yoga-nidra", "morning-light", "swimming"]);
      expect(added.bedtime).toBe("22:30");
      expect(added.waketime).toBe("06:00");
      expect(added.sleepLatency).toBe(12);
      expect(added.awakenings).toBe(1);
      expect(added.notes).toBe("Great sleep with full protocol");
    });

    it("should update interventions array", () => {
      const targetId = initialEntries[0].id;
      const { updateEntry } = useSleepStore.getState();
      updateEntry(targetId, {
        interventions: ["swimming", "cold-shower", "bedroom-temp"],
      });

      const updated = useSleepStore.getState().entries.find((e) => e.id === targetId);
      expect(updated?.interventions).toEqual(["swimming", "cold-shower", "bedroom-temp"]);
    });

    it("should update bedtime and waketime", () => {
      const targetId = initialEntries[0].id;
      const { updateEntry } = useSleepStore.getState();
      updateEntry(targetId, { bedtime: "21:45", waketime: "05:30" });

      const updated = useSleepStore.getState().entries.find((e) => e.id === targetId);
      expect(updated?.bedtime).toBe("21:45");
      expect(updated?.waketime).toBe("05:30");
    });

    it("should update sleepLatency and awakenings", () => {
      const targetId = initialEntries[0].id;
      const { updateEntry } = useSleepStore.getState();
      updateEntry(targetId, { sleepLatency: 5, awakenings: 0 });

      const updated = useSleepStore.getState().entries.find((e) => e.id === targetId);
      expect(updated?.sleepLatency).toBe(5);
      expect(updated?.awakenings).toBe(0);
    });

    it("demo data should include interventions and timing fields", () => {
      const { entries } = useSleepStore.getState();
      const entriesWithInterventions = entries.filter(
        (e) => e.interventions && e.interventions.length > 0,
      );
      expect(entriesWithInterventions.length).toBeGreaterThan(0);

      const entriesWithTiming = entries.filter((e) => e.bedtime && e.waketime);
      expect(entriesWithTiming.length).toBeGreaterThan(0);

      const entriesWithLatency = entries.filter((e) => e.sleepLatency !== undefined);
      expect(entriesWithLatency.length).toBeGreaterThan(0);
    });

    it("should allow entry with zero awakenings", () => {
      const { addEntry } = useSleepStore.getState();
      addEntry({
        date: "2026-03-08",
        hours: 8.5,
        quality: 5 as const,
        location: "zurich",
        supplements: ["magnesium-glycinate"],
        awakenings: 0,
      });

      const { entries } = useSleepStore.getState();
      const added = entries[entries.length - 1];
      expect(added.awakenings).toBe(0);
    });

    it("should allow entry without optional new fields", () => {
      const { addEntry } = useSleepStore.getState();
      addEntry({
        date: "2026-03-09",
        hours: 6.0,
        quality: 3 as const,
        location: "travel",
        supplements: [],
      });

      const { entries } = useSleepStore.getState();
      const added = entries[entries.length - 1];
      expect(added.interventions).toBeUndefined();
      expect(added.bedtime).toBeUndefined();
      expect(added.waketime).toBeUndefined();
      expect(added.sleepLatency).toBeUndefined();
      expect(added.awakenings).toBeUndefined();
    });
  });
});
