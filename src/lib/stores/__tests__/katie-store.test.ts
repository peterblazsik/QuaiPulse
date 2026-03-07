import { describe, it, expect, beforeEach } from "vitest";
import { useKatieStore } from "../katie-store";
import { PLANNED_VISITS } from "@/lib/data/katie-visits";

describe("useKatieStore", () => {
  beforeEach(() => {
    // Reset Zustand store to initial state before each test
    useKatieStore.setState({ visits: PLANNED_VISITS });
  });

  describe("initial state", () => {
    it("should have visits pre-seeded with PLANNED_VISITS", () => {
      const { visits } = useKatieStore.getState();
      expect(visits).toEqual(PLANNED_VISITS);
    });

    it("should have the correct number of pre-seeded visits", () => {
      const { visits } = useKatieStore.getState();
      expect(visits.length).toBe(PLANNED_VISITS.length);
      expect(visits.length).toBeGreaterThan(0);
    });

    it("should contain visits with required fields", () => {
      const { visits } = useKatieStore.getState();
      for (const visit of visits) {
        expect(visit).toHaveProperty("id");
        expect(visit).toHaveProperty("startDate");
        expect(visit).toHaveProperty("endDate");
        expect(visit).toHaveProperty("transportMode");
        expect(visit).toHaveProperty("isConfirmed");
        expect(["flight", "train"]).toContain(visit.transportMode);
      }
    });
  });

  describe("addVisit", () => {
    it("should add a new visit with a generated id", () => {
      const { addVisit } = useKatieStore.getState();
      const initialCount = useKatieStore.getState().visits.length;

      addVisit({
        startDate: "2027-01-15",
        endDate: "2027-01-17",
        transportMode: "train",
        isConfirmed: true,
      });

      const { visits } = useKatieStore.getState();
      expect(visits.length).toBe(initialCount + 1);

      const newVisit = visits[visits.length - 1];
      expect(newVisit.startDate).toBe("2027-01-15");
      expect(newVisit.endDate).toBe("2027-01-17");
      expect(newVisit.transportMode).toBe("train");
      expect(newVisit.isConfirmed).toBe(true);
    });

    it("should generate an id starting with 'kv-'", () => {
      const { addVisit } = useKatieStore.getState();

      addVisit({
        startDate: "2027-02-01",
        endDate: "2027-02-03",
        transportMode: "flight",
        isConfirmed: false,
      });

      const { visits } = useKatieStore.getState();
      const newVisit = visits[visits.length - 1];
      expect(newVisit.id).toMatch(/^kv-\d+$/);
    });

    it("should preserve existing visits when adding", () => {
      const { addVisit } = useKatieStore.getState();
      const existingIds = useKatieStore.getState().visits.map((v) => v.id);

      addVisit({
        startDate: "2027-03-10",
        endDate: "2027-03-12",
        transportMode: "flight",
        isConfirmed: false,
      });

      const { visits } = useKatieStore.getState();
      for (const id of existingIds) {
        expect(visits.find((v) => v.id === id)).toBeDefined();
      }
    });

    it("should include optional fields like notes and isSpecial", () => {
      const { addVisit } = useKatieStore.getState();

      addVisit({
        startDate: "2027-04-01",
        endDate: "2027-04-05",
        transportMode: "flight",
        isConfirmed: false,
        isSpecial: true,
        specialLabel: "Easter break",
        notes: "Easter visit",
      });

      const { visits } = useKatieStore.getState();
      const newVisit = visits[visits.length - 1];
      expect(newVisit.isSpecial).toBe(true);
      expect(newVisit.specialLabel).toBe("Easter break");
      expect(newVisit.notes).toBe("Easter visit");
    });
  });

  describe("removeVisit", () => {
    it("should remove a visit by id", () => {
      const { removeVisit } = useKatieStore.getState();
      const targetId = PLANNED_VISITS[0].id;
      const initialCount = useKatieStore.getState().visits.length;

      removeVisit(targetId);

      const { visits } = useKatieStore.getState();
      expect(visits.length).toBe(initialCount - 1);
      expect(visits.find((v) => v.id === targetId)).toBeUndefined();
    });

    it("should not remove anything when id does not exist", () => {
      const { removeVisit } = useKatieStore.getState();
      const initialCount = useKatieStore.getState().visits.length;

      removeVisit("non-existent-id");

      const { visits } = useKatieStore.getState();
      expect(visits.length).toBe(initialCount);
    });

    it("should keep other visits intact after removal", () => {
      const { removeVisit } = useKatieStore.getState();
      const targetId = PLANNED_VISITS[0].id;
      const otherIds = PLANNED_VISITS.slice(1).map((v) => v.id);

      removeVisit(targetId);

      const { visits } = useKatieStore.getState();
      for (const id of otherIds) {
        expect(visits.find((v) => v.id === id)).toBeDefined();
      }
    });
  });

  describe("updateVisit", () => {
    it("should update a visit with partial data", () => {
      const { updateVisit } = useKatieStore.getState();
      const targetId = PLANNED_VISITS[0].id;

      updateVisit(targetId, { isConfirmed: true });

      const { visits } = useKatieStore.getState();
      const updated = visits.find((v) => v.id === targetId);
      expect(updated?.isConfirmed).toBe(true);
      // Other fields should remain unchanged
      expect(updated?.startDate).toBe(PLANNED_VISITS[0].startDate);
      expect(updated?.endDate).toBe(PLANNED_VISITS[0].endDate);
    });

    it("should update multiple fields at once", () => {
      const { updateVisit } = useKatieStore.getState();
      const targetId = PLANNED_VISITS[0].id;

      updateVisit(targetId, {
        transportMode: "train",
        notes: "Changed to train",
        isConfirmed: true,
      });

      const { visits } = useKatieStore.getState();
      const updated = visits.find((v) => v.id === targetId);
      expect(updated?.transportMode).toBe("train");
      expect(updated?.notes).toBe("Changed to train");
      expect(updated?.isConfirmed).toBe(true);
    });

    it("should not modify other visits", () => {
      const { updateVisit } = useKatieStore.getState();
      const targetId = PLANNED_VISITS[0].id;
      const otherId = PLANNED_VISITS[1].id;
      const otherBefore = { ...PLANNED_VISITS[1] };

      updateVisit(targetId, { isConfirmed: true });

      const { visits } = useKatieStore.getState();
      const other = visits.find((v) => v.id === otherId);
      expect(other).toEqual(otherBefore);
    });

    it("should do nothing when id does not exist", () => {
      const { updateVisit } = useKatieStore.getState();
      const before = [...useKatieStore.getState().visits];

      updateVisit("non-existent-id", { isConfirmed: true });

      const { visits } = useKatieStore.getState();
      expect(visits).toEqual(before);
    });
  });
});
