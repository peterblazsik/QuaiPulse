import { describe, it, expect } from "vitest";
import {
  SUPPLEMENTS,
  SUPPLEMENT_STACKS,
  INTERVENTIONS,
  EVENING_ROUTINE,
  LOCATIONS,
  QUALITY_LABELS,
  type Supplement,
  type SupplementStack,
  type SleepIntervention,
  type RoutineStep,
  type InterventionCategory,
} from "../sleep-defaults";

describe("sleep-defaults data integrity", () => {
  describe("SUPPLEMENTS", () => {
    it("should have 18 supplements", () => {
      expect(SUPPLEMENTS.length).toBe(18);
    });

    it("should have unique IDs", () => {
      const ids = SUPPLEMENTS.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have unique names", () => {
      const names = SUPPLEMENTS.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    });

    it("should have valid tiers (1, 2, or 3)", () => {
      for (const s of SUPPLEMENTS) {
        expect([1, 2, 3]).toContain(s.tier);
      }
    });

    it("should have tier 1 supplements (strong evidence)", () => {
      const tier1 = SUPPLEMENTS.filter((s) => s.tier === 1);
      expect(tier1.length).toBeGreaterThanOrEqual(4);
    });

    it("should have tier 2 supplements (moderate evidence)", () => {
      const tier2 = SUPPLEMENTS.filter((s) => s.tier === 2);
      expect(tier2.length).toBeGreaterThanOrEqual(4);
    });

    it("should have tier 3 supplements (emerging evidence)", () => {
      const tier3 = SUPPLEMENTS.filter((s) => s.tier === 3);
      expect(tier3.length).toBeGreaterThanOrEqual(2);
    });

    it("should have valid categories", () => {
      const validCategories = ["mineral", "amino", "herb", "hormone", "lipid", "other"];
      for (const s of SUPPLEMENTS) {
        expect(validCategories).toContain(s.category);
      }
    });

    it("should have all required fields populated", () => {
      for (const s of SUPPLEMENTS) {
        expect(s.id).toBeTruthy();
        expect(s.name).toBeTruthy();
        expect(s.color).toMatch(/^#[0-9a-f]{6}$/i);
        expect(s.doseLow).toBeTruthy();
        expect(s.doseHigh).toBeTruthy();
        expect(s.form).toBeTruthy();
        expect(s.timing).toBeTruthy();
        expect(s.mechanism).toBeTruthy();
        expect(s.evidence).toBeTruthy();
        expect(typeof s.cycleRequired).toBe("boolean");
        expect(Array.isArray(s.interactions)).toBe(true);
      }
    });

    it("should have valid interaction references (all reference existing supplement IDs)", () => {
      const allIds = new Set(SUPPLEMENTS.map((s) => s.id));
      for (const s of SUPPLEMENTS) {
        for (const interactionId of s.interactions) {
          expect(allIds.has(interactionId)).toBe(true);
        }
      }
    });

    it("should require cycle pattern when cycleRequired is true", () => {
      for (const s of SUPPLEMENTS) {
        if (s.cycleRequired) {
          expect(s.cyclePattern).toBeTruthy();
        }
      }
    });

    it("should include key supplements by ID", () => {
      const ids = new Set(SUPPLEMENTS.map((s) => s.id));
      expect(ids.has("magnesium-glycinate")).toBe(true);
      expect(ids.has("melatonin")).toBe(true);
      expect(ids.has("glycine")).toBe(true);
      expect(ids.has("l-theanine")).toBe(true);
      expect(ids.has("apigenin")).toBe(true);
    });
  });

  describe("SUPPLEMENT_STACKS", () => {
    it("should have 4 stacking protocols", () => {
      expect(SUPPLEMENT_STACKS.length).toBe(4);
    });

    it("should have unique IDs", () => {
      const ids = SUPPLEMENT_STACKS.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have valid levels", () => {
      const validLevels = ["beginner", "intermediate", "advanced", "recovery"];
      for (const stack of SUPPLEMENT_STACKS) {
        expect(validLevels).toContain(stack.level);
      }
    });

    it("should cover all 4 levels", () => {
      const levels = new Set(SUPPLEMENT_STACKS.map((s) => s.level));
      expect(levels.size).toBe(4);
    });

    it("should have non-negative monthly costs in CHF", () => {
      for (const stack of SUPPLEMENT_STACKS) {
        expect(stack.monthlyCostCHF).toBeGreaterThanOrEqual(0);
      }
      // Non-recovery stacks should have positive costs
      const nonRecovery = SUPPLEMENT_STACKS.filter((s) => s.level !== "recovery");
      for (const stack of nonRecovery) {
        expect(stack.monthlyCostCHF).toBeGreaterThan(0);
      }
    });

    it("should reference only existing supplement IDs", () => {
      const allIds = new Set(SUPPLEMENTS.map((s) => s.id));
      for (const stack of SUPPLEMENT_STACKS) {
        for (const item of stack.supplements) {
          expect(allIds.has(item.supplementId)).toBe(true);
        }
      }
    });

    it("should have dose and timing for each stack supplement", () => {
      for (const stack of SUPPLEMENT_STACKS) {
        for (const item of stack.supplements) {
          expect(item.dose).toBeTruthy();
          expect(item.timing).toBeTruthy();
        }
      }
    });

    it("should have increasing complexity (more supplements in advanced stacks)", () => {
      const beginner = SUPPLEMENT_STACKS.find((s) => s.level === "beginner");
      const advanced = SUPPLEMENT_STACKS.find((s) => s.level === "advanced");
      expect(beginner!.supplements.length).toBeLessThan(advanced!.supplements.length);
    });
  });

  describe("INTERVENTIONS", () => {
    it("should have 15 interventions", () => {
      expect(INTERVENTIONS.length).toBe(15);
    });

    it("should have unique IDs", () => {
      const ids = INTERVENTIONS.map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have valid categories", () => {
      const validCategories: InterventionCategory[] = [
        "exercise", "breathing", "meditation", "environment", "nutrition", "technology", "cbt-i",
      ];
      for (const intervention of INTERVENTIONS) {
        expect(validCategories).toContain(intervention.category);
      }
    });

    it("should cover at least 5 different categories", () => {
      const categories = new Set(INTERVENTIONS.map((i) => i.category));
      expect(categories.size).toBeGreaterThanOrEqual(5);
    });

    it("should have valid evidence levels", () => {
      for (const intervention of INTERVENTIONS) {
        expect(["high", "moderate", "low"]).toContain(intervention.evidenceLevel);
      }
    });

    it("should have all required fields populated", () => {
      for (const intervention of INTERVENTIONS) {
        expect(intervention.id).toBeTruthy();
        expect(intervention.name).toBeTruthy();
        expect(intervention.timing).toBeTruthy();
        expect(intervention.duration).toBeTruthy();
        expect(intervention.description).toBeTruthy();
        expect(intervention.protocol).toBeTruthy();
        expect(intervention.keyStudy).toBeTruthy();
      }
    });

    it("should include key interventions", () => {
      const ids = new Set(INTERVENTIONS.map((i) => i.id));
      expect(ids.has("yoga-nidra")).toBe(true);
      expect(ids.has("morning-light")).toBe(true);
      expect(ids.has("sleep-restriction")).toBe(true);
      expect(ids.has("swimming")).toBe(true);
    });
  });

  describe("EVENING_ROUTINE", () => {
    it("should have 10 steps", () => {
      expect(EVENING_ROUTINE.length).toBe(10);
    });

    it("should be sorted by minutesBefore descending (earliest to latest)", () => {
      for (let i = 0; i < EVENING_ROUTINE.length - 1; i++) {
        expect(EVENING_ROUTINE[i].minutesBefore).toBeGreaterThanOrEqual(
          EVENING_ROUTINE[i + 1].minutesBefore,
        );
      }
    });

    it("should start at T-180 (3 hours before bed)", () => {
      expect(EVENING_ROUTINE[0].minutesBefore).toBe(180);
    });

    it("should end at T-0 (bedtime)", () => {
      expect(EVENING_ROUTINE[EVENING_ROUTINE.length - 1].minutesBefore).toBe(0);
    });

    it("should have activity descriptions for all steps", () => {
      for (const step of EVENING_ROUTINE) {
        expect(step.activity).toBeTruthy();
      }
    });

    it("should reference only existing intervention IDs", () => {
      const interventionIds = new Set(INTERVENTIONS.map((i) => i.id));
      for (const step of EVENING_ROUTINE) {
        if (step.interventionId) {
          expect(interventionIds.has(step.interventionId)).toBe(true);
        }
      }
    });

    it("should reference only existing supplement IDs", () => {
      const supplementIds = new Set(SUPPLEMENTS.map((s) => s.id));
      for (const step of EVENING_ROUTINE) {
        if (step.supplementIds) {
          for (const id of step.supplementIds) {
            expect(supplementIds.has(id)).toBe(true);
          }
        }
      }
    });
  });

  describe("LOCATIONS", () => {
    it("should have 4 locations", () => {
      expect(LOCATIONS.length).toBe(4);
    });

    it("should include zurich and vienna", () => {
      const values = LOCATIONS.map((l) => l.value);
      expect(values).toContain("zurich");
      expect(values).toContain("vienna");
    });
  });

  describe("QUALITY_LABELS", () => {
    it("should have labels for all 5 quality levels", () => {
      for (const q of [1, 2, 3, 4, 5] as const) {
        expect(QUALITY_LABELS[q]).toBeDefined();
        expect(QUALITY_LABELS[q].label).toBeTruthy();
        expect(QUALITY_LABELS[q].color).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });
  });
});
