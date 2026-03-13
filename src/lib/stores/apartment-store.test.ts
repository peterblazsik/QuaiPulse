import { describe, it, expect, beforeEach, vi } from "vitest";
import { useApartmentStore } from "./apartment-store";
import type { ApartmentStatus } from "@/lib/types";

let mockTime = 1000;

// Reset store state before each test to isolate tests from each other
beforeEach(() => {
  mockTime = 1000;
  // Ensure each add() call gets a unique Date.now() value
  vi.spyOn(Date, "now").mockImplementation(() => mockTime++);

  // Clear persisted state and reset to initial
  useApartmentStore.setState({
    apartments: [],
  });
});

function makeApartmentInput(
  overrides: Partial<
    Omit<ReturnType<typeof useApartmentStore.getState>["apartments"][0], "id" | "createdAt" | "interactions">
  > = {}
) {
  return {
    title: "Test Apartment",
    address: "Teststrasse 1, 8001 Zurich",
    kreis: 1,
    rent: 2000,
    rooms: 2.5,
    sqm: 55,
    sourceUrl: "https://example.com/apt",
    status: "new" as ApartmentStatus,
    notes: "",
    ...overrides,
  };
}

describe("useApartmentStore", () => {
  describe("initial state", () => {
    it("should start with empty apartments array after reset", () => {
      const { apartments } = useApartmentStore.getState();
      expect(apartments).toEqual([]);
    });
  });

  describe("add", () => {
    it("should add an apartment to the array", () => {
      const input = makeApartmentInput();
      useApartmentStore.getState().add(input);

      const { apartments } = useApartmentStore.getState();
      expect(apartments).toHaveLength(1);
    });

    it("should generate an id starting with apt-", () => {
      useApartmentStore.getState().add(makeApartmentInput());

      const { apartments } = useApartmentStore.getState();
      expect(apartments[0].id).toMatch(/^apt-\d+$/);
    });

    it("should set createdAt to a valid ISO date string", () => {
      useApartmentStore.getState().add(makeApartmentInput());

      const { apartments } = useApartmentStore.getState();
      const date = new Date(apartments[0].createdAt);
      expect(date.toISOString()).toBe(apartments[0].createdAt);
    });

    it("should preserve all provided fields", () => {
      const input = makeApartmentInput({
        title: "Lakeside Studio",
        kreis: 2,
        rent: 2500,
        rooms: 1.5,
        sqm: 38,
        notes: "Nice view",
      });
      useApartmentStore.getState().add(input);

      const apt = useApartmentStore.getState().apartments[0];
      expect(apt.title).toBe("Lakeside Studio");
      expect(apt.kreis).toBe(2);
      expect(apt.rent).toBe(2500);
      expect(apt.rooms).toBe(1.5);
      expect(apt.sqm).toBe(38);
      expect(apt.notes).toBe("Nice view");
    });

    it("should append to existing apartments", () => {
      useApartmentStore.getState().add(makeApartmentInput({ title: "First" }));
      useApartmentStore.getState().add(makeApartmentInput({ title: "Second" }));

      const { apartments } = useApartmentStore.getState();
      expect(apartments).toHaveLength(2);
      expect(apartments[0].title).toBe("First");
      expect(apartments[1].title).toBe("Second");
    });
  });

  describe("remove", () => {
    it("should remove an apartment by id", () => {
      useApartmentStore.getState().add(makeApartmentInput({ title: "ToRemove" }));
      const id = useApartmentStore.getState().apartments[0].id;

      useApartmentStore.getState().remove(id);

      const { apartments } = useApartmentStore.getState();
      expect(apartments).toHaveLength(0);
    });

    it("should not modify array when removing non-existent id", () => {
      useApartmentStore.getState().add(makeApartmentInput({ title: "Keep" }));

      useApartmentStore.getState().remove("non-existent-id");

      const { apartments } = useApartmentStore.getState();
      expect(apartments).toHaveLength(1);
      expect(apartments[0].title).toBe("Keep");
    });

    it("should only remove the targeted apartment", () => {
      useApartmentStore.getState().add(makeApartmentInput({ title: "A" }));
      useApartmentStore.getState().add(makeApartmentInput({ title: "B" }));
      useApartmentStore.getState().add(makeApartmentInput({ title: "C" }));

      const idB = useApartmentStore.getState().apartments[1].id;
      useApartmentStore.getState().remove(idB);

      const { apartments } = useApartmentStore.getState();
      expect(apartments).toHaveLength(2);
      expect(apartments.map((a) => a.title)).toEqual(["A", "C"]);
    });
  });

  describe("updateStatus", () => {
    it("should change the status of an apartment", () => {
      useApartmentStore.getState().add(makeApartmentInput({ status: "new" }));
      const id = useApartmentStore.getState().apartments[0].id;

      useApartmentStore.getState().updateStatus(id, "contacted");

      const apt = useApartmentStore.getState().apartments[0];
      expect(apt.status).toBe("contacted");
    });

    it("should not affect other apartments when updating status", () => {
      useApartmentStore
        .getState()
        .add(makeApartmentInput({ title: "A", status: "new" }));
      useApartmentStore
        .getState()
        .add(makeApartmentInput({ title: "B", status: "new" }));

      const idA = useApartmentStore.getState().apartments[0].id;
      useApartmentStore.getState().updateStatus(idA, "applied");

      const { apartments } = useApartmentStore.getState();
      expect(apartments[0].status).toBe("applied");
      expect(apartments[1].status).toBe("new");
    });

    it("should handle all valid status transitions", () => {
      useApartmentStore.getState().add(makeApartmentInput());
      const id = useApartmentStore.getState().apartments[0].id;

      const statuses: ApartmentStatus[] = [
        "interested",
        "contacted",
        "viewing_scheduled",
        "applied",
        "rejected",
        "accepted",
      ];

      for (const status of statuses) {
        useApartmentStore.getState().updateStatus(id, status);
        expect(useApartmentStore.getState().apartments[0].status).toBe(status);
      }
    });
  });

  describe("updateNotes", () => {
    it("should change the notes of an apartment", () => {
      useApartmentStore.getState().add(makeApartmentInput({ notes: "old" }));
      const id = useApartmentStore.getState().apartments[0].id;

      useApartmentStore.getState().updateNotes(id, "updated notes");

      const apt = useApartmentStore.getState().apartments[0];
      expect(apt.notes).toBe("updated notes");
    });

    it("should not affect other apartments when updating notes", () => {
      useApartmentStore
        .getState()
        .add(makeApartmentInput({ title: "A", notes: "note A" }));
      useApartmentStore
        .getState()
        .add(makeApartmentInput({ title: "B", notes: "note B" }));

      const idA = useApartmentStore.getState().apartments[0].id;
      useApartmentStore.getState().updateNotes(idA, "changed");

      const { apartments } = useApartmentStore.getState();
      expect(apartments[0].notes).toBe("changed");
      expect(apartments[1].notes).toBe("note B");
    });

    it("should allow setting notes to empty string", () => {
      useApartmentStore
        .getState()
        .add(makeApartmentInput({ notes: "has content" }));
      const id = useApartmentStore.getState().apartments[0].id;

      useApartmentStore.getState().updateNotes(id, "");

      expect(useApartmentStore.getState().apartments[0].notes).toBe("");
    });
  });
});
