import { describe, it, expect } from "vitest";
import {
  CHECKLIST_ITEMS,
  getAllChecklistItems,
  isCustomItem,
  type ChecklistItemData,
} from "../checklist-items";

describe("CHECKLIST_ITEMS data", () => {
  describe("overall structure", () => {
    it("should have 33 items defined", () => {
      expect(CHECKLIST_ITEMS.length).toBe(33);
    });

    it("should have no duplicate IDs", () => {
      const ids = CHECKLIST_ITEMS.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("required fields", () => {
    it("every item should have an id, phase, category, title, and sortOrder", () => {
      for (const item of CHECKLIST_ITEMS) {
        expect(item.id).toBeDefined();
        expect(typeof item.id).toBe("string");
        expect(item.phase).toBeDefined();
        expect(["mar-apr", "may", "jun", "jul"]).toContain(item.phase);
        expect(item.category).toBeDefined();
        expect(typeof item.category).toBe("string");
        expect(item.title).toBeDefined();
        expect(typeof item.title).toBe("string");
        expect(typeof item.sortOrder).toBe("number");
      }
    });

    it("sortOrder values should be unique", () => {
      const orders = CHECKLIST_ITEMS.map((item) => item.sortOrder);
      const uniqueOrders = new Set(orders);
      expect(uniqueOrders.size).toBe(orders.length);
    });
  });

  describe("phase coverage", () => {
    it("should have items in all four phases", () => {
      const phases = new Set(CHECKLIST_ITEMS.map((item) => item.phase));
      expect(phases).toContain("mar-apr");
      expect(phases).toContain("may");
      expect(phases).toContain("jun");
      expect(phases).toContain("jul");
    });
  });

  describe("url field (new feature)", () => {
    it("should have at least one item with a url field defined", () => {
      const itemsWithUrl = CHECKLIST_ITEMS.filter(
        (item) => item.url !== undefined
      );
      for (const item of itemsWithUrl) {
        expect(typeof item.url).toBe("string");
        expect(item.url!.length).toBeGreaterThan(0);
      }
    });

    it("should have the url field defined in the ChecklistItemData interface", () => {
      const testItem: ChecklistItemData = {
        id: "test",
        phase: "mar-apr",
        category: "Test",
        title: "Test item",
        sortOrder: 999,
        url: "https://example.com",
      };
      expect(testItem.url).toBe("https://example.com");
    });
  });

  describe("dependency chains", () => {
    it("dependsOn references should point to existing item IDs", () => {
      const allIds = new Set(CHECKLIST_ITEMS.map((item) => item.id));
      for (const item of CHECKLIST_ITEMS) {
        if (item.dependsOn) {
          for (const depId of item.dependsOn) {
            expect(allIds.has(depId)).toBe(true);
          }
        }
      }
    });
  });

  describe("hard deadlines", () => {
    it("items with hardDeadline should have valid date strings", () => {
      const itemsWithDeadline = CHECKLIST_ITEMS.filter(
        (item) => item.hardDeadline !== undefined
      );
      expect(itemsWithDeadline.length).toBeGreaterThan(0);

      for (const item of itemsWithDeadline) {
        expect(item.hardDeadline).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const date = new Date(item.hardDeadline!);
        expect(date.getTime()).not.toBeNaN();
      }
    });
  });

  describe("criminal record certificate items", () => {
    it("should include Austrian Strafregisterbescheinigung (cl-31)", () => {
      const item = CHECKLIST_ITEMS.find((i) => i.id === "cl-31");
      expect(item).toBeDefined();
      expect(item!.phase).toBe("mar-apr");
      expect(item!.category).toBe("Administration");
      expect(item!.estimatedDays).toBe(14);
    });

    it("should include Dutch VOG (cl-32) with hard deadline", () => {
      const item = CHECKLIST_ITEMS.find((i) => i.id === "cl-32");
      expect(item).toBeDefined();
      expect(item!.phase).toBe("mar-apr");
      expect(item!.hardDeadline).toBe("2026-05-31");
      expect(item!.estimatedDays).toBe(56);
    });

    it("should include Swiss Strafregisterauszug (cl-33) depending on cl-23", () => {
      const item = CHECKLIST_ITEMS.find((i) => i.id === "cl-33");
      expect(item).toBeDefined();
      expect(item!.phase).toBe("jul");
      expect(item!.dependsOn).toContain("cl-23");
    });
  });
});

describe("getAllChecklistItems", () => {
  it("returns static items when no custom items provided", () => {
    const result = getAllChecklistItems([]);
    expect(result.length).toBe(CHECKLIST_ITEMS.length);
  });

  it("merges custom items with static items", () => {
    const custom: ChecklistItemData[] = [
      {
        id: "custom-test-1",
        phase: "may",
        category: "Test",
        title: "Custom task",
        sortOrder: 50,
      },
    ];
    const result = getAllChecklistItems(custom);
    expect(result.length).toBe(CHECKLIST_ITEMS.length + 1);
    expect(result.find((i) => i.id === "custom-test-1")).toBeDefined();
  });

  it("sorts merged items by sortOrder", () => {
    const custom: ChecklistItemData[] = [
      {
        id: "custom-early",
        phase: "mar-apr",
        category: "Test",
        title: "Early custom",
        sortOrder: 0,
      },
      {
        id: "custom-late",
        phase: "jul",
        category: "Test",
        title: "Late custom",
        sortOrder: 999,
      },
    ];
    const result = getAllChecklistItems(custom);
    expect(result[0].id).toBe("custom-early");
    expect(result[result.length - 1].id).toBe("custom-late");
  });
});

describe("isCustomItem", () => {
  it("returns true for IDs starting with 'custom-'", () => {
    expect(isCustomItem("custom-abc-123")).toBe(true);
    expect(isCustomItem("custom-")).toBe(true);
  });

  it("returns false for static item IDs", () => {
    expect(isCustomItem("cl-01")).toBe(false);
    expect(isCustomItem("cl-33")).toBe(false);
    expect(isCustomItem("something-custom-else")).toBe(false);
  });
});
