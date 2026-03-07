import { describe, it, expect } from "vitest";
import { NEIGHBORHOODS } from "./neighborhoods";
import type { ScoreDimension } from "@/lib/types";

const SCORE_DIMENSIONS: ScoreDimension[] = [
  "commute",
  "gym",
  "social",
  "lake",
  "airport",
  "food",
  "quiet",
  "transit",
  "cost",
  "safety",
  "flightNoise",
  "parking",
];

describe("NEIGHBORHOODS data integrity", () => {
  it("should contain at least one neighborhood", () => {
    expect(NEIGHBORHOODS.length).toBeGreaterThan(0);
  });

  describe("score dimensions", () => {
    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have all 12 score dimensions",
      (_name, neighborhood) => {
        for (const dim of SCORE_DIMENSIONS) {
          expect(neighborhood.scores).toHaveProperty(dim);
        }
        expect(Object.keys(neighborhood.scores)).toHaveLength(12);
      }
    );
  });

  describe("score ranges", () => {
    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have all scores between 0 and 10",
      (_name, neighborhood) => {
        for (const dim of SCORE_DIMENSIONS) {
          const score = neighborhood.scores[dim];
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(10);
        }
      }
    );
  });

  describe("rent ranges", () => {
    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have studio rent min < max",
      (_name, neighborhood) => {
        expect(neighborhood.rentStudioMin).toBeLessThan(
          neighborhood.rentStudioMax
        );
      }
    );

    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have 1BR rent min < max",
      (_name, neighborhood) => {
        expect(neighborhood.rentOneBrMin).toBeLessThan(
          neighborhood.rentOneBrMax
        );
      }
    );

    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have 2BR rent min < max",
      (_name, neighborhood) => {
        expect(neighborhood.rentTwoBrMin).toBeLessThan(
          neighborhood.rentTwoBrMax
        );
      }
    );
  });

  describe("unique identifiers", () => {
    it("should have unique ids across all neighborhoods", () => {
      const ids = NEIGHBORHOODS.map((n) => n.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have unique slugs across all neighborhoods", () => {
      const slugs = NEIGHBORHOODS.map((n) => n.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("required fields", () => {
    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have non-empty pros array",
      (_name, neighborhood) => {
        expect(neighborhood.pros.length).toBeGreaterThan(0);
        neighborhood.pros.forEach((pro) => {
          expect(pro.trim().length).toBeGreaterThan(0);
        });
      }
    );

    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have non-empty cons array",
      (_name, neighborhood) => {
        expect(neighborhood.cons.length).toBeGreaterThan(0);
        neighborhood.cons.forEach((con) => {
          expect(con.trim().length).toBeGreaterThan(0);
        });
      }
    );

    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have a valid kreis between 1 and 12",
      (_name, neighborhood) => {
        expect(neighborhood.kreis).toBeGreaterThanOrEqual(1);
        expect(neighborhood.kreis).toBeLessThanOrEqual(12);
      }
    );

    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have a non-empty name",
      (_name, neighborhood) => {
        expect(neighborhood.name.trim().length).toBeGreaterThan(0);
      }
    );

    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have a non-empty description",
      (_name, neighborhood) => {
        expect(neighborhood.description.trim().length).toBeGreaterThan(0);
      }
    );

    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have valid coordinates",
      (_name, neighborhood) => {
        // Zurich is roughly at lat 47.3-47.5, lng 8.4-8.6
        expect(neighborhood.lat).toBeGreaterThan(47);
        expect(neighborhood.lat).toBeLessThan(48);
        expect(neighborhood.lng).toBeGreaterThan(8);
        expect(neighborhood.lng).toBeLessThan(9);
      }
    );
  });

  describe("notes completeness", () => {
    it.each(NEIGHBORHOODS.map((n) => [n.name, n]))(
      "%s should have notes for all 12 dimensions",
      (_name, neighborhood) => {
        for (const dim of SCORE_DIMENSIONS) {
          expect(neighborhood.notes).toHaveProperty(dim);
          expect(neighborhood.notes[dim].trim().length).toBeGreaterThan(0);
        }
      }
    );
  });
});
