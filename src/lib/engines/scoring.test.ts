import { describe, it, expect } from "vitest";
import {
  calculateWeightedScore,
  rankNeighborhoods,
  scoreColor,
  scoreTextClass,
  formatScore,
} from "./scoring";
import type { ScoreDimension, PriorityWeights } from "@/lib/types";
import type { NeighborhoodData } from "@/lib/data/neighborhoods";

const allDimensions: ScoreDimension[] = [
  "commute", "gym", "social", "lake", "airport", "food", "quiet", "transit",
  "cost", "safety", "flightNoise", "parking",
];

function makeScores(value: number): Record<ScoreDimension, number> {
  return Object.fromEntries(allDimensions.map((d) => [d, value])) as Record<ScoreDimension, number>;
}

function makeWeights(value: number): PriorityWeights {
  return Object.fromEntries(allDimensions.map((d) => [d, value])) as PriorityWeights;
}

function makeNeighborhood(id: string, scores: Record<ScoreDimension, number>): NeighborhoodData {
  return {
    id,
    slug: id,
    name: id,
    kreis: 1,
    lat: 47.37,
    lng: 8.54,
    description: "",
    vibe: "",
    scores,
    notes: {} as Record<ScoreDimension, string>,
    rentStudioMin: 1000,
    rentStudioMax: 1500,
    rentOneBrMin: 1500,
    rentOneBrMax: 2000,
    rentTwoBrMin: 2000,
    rentTwoBrMax: 2800,
    pros: [],
    cons: [],
  };
}

describe("calculateWeightedScore", () => {
  it("returns perfect 10 when all scores are 10", () => {
    const result = calculateWeightedScore(makeScores(10), makeWeights(1));
    expect(result.total).toBe(10);
  });

  it("returns 0 when all scores are 0", () => {
    const result = calculateWeightedScore(makeScores(0), makeWeights(1));
    expect(result.total).toBe(0);
  });

  it("returns 0 when all weights are 0", () => {
    const result = calculateWeightedScore(makeScores(8), makeWeights(0));
    expect(result.total).toBe(0);
  });

  it("correctly weights dimensions", () => {
    const scores = makeScores(0);
    scores.commute = 10;
    scores.gym = 0;

    const weights = makeWeights(0);
    weights.commute = 1;
    weights.gym = 1;

    const result = calculateWeightedScore(scores, weights);
    expect(result.total).toBe(5);
  });

  it("higher weight means more influence", () => {
    const scores = makeScores(5);
    scores.commute = 10;

    const lowWeight = makeWeights(5);
    lowWeight.commute = 1;

    const highWeight = makeWeights(5);
    highWeight.commute = 10;

    const lowResult = calculateWeightedScore(scores, lowWeight);
    const highResult = calculateWeightedScore(scores, highWeight);

    expect(highResult.total).toBeGreaterThan(lowResult.total);
  });

  it("tracks per-dimension contributions", () => {
    const scores = makeScores(5);
    scores.commute = 8;

    const weights = makeWeights(1);
    weights.commute = 2;

    const result = calculateWeightedScore(scores, weights);
    expect(result.contributions.commute).toBe(16); // 8 * 2
    expect(result.contributions.gym).toBe(5); // 5 * 1
  });
});

describe("rankNeighborhoods", () => {
  it("ranks highest score first", () => {
    const n1 = makeNeighborhood("low", makeScores(3));
    const n2 = makeNeighborhood("high", makeScores(9));
    const n3 = makeNeighborhood("mid", makeScores(6));

    const ranked = rankNeighborhoods([n1, n2, n3], makeWeights(1));
    expect(ranked[0].id).toBe("high");
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].id).toBe("mid");
    expect(ranked[1].rank).toBe(2);
    expect(ranked[2].id).toBe("low");
    expect(ranked[2].rank).toBe(3);
  });

  it("returns empty array for empty input", () => {
    const ranked = rankNeighborhoods([], makeWeights(1));
    expect(ranked).toEqual([]);
  });

  it("rounds weightedScore to 2 decimals", () => {
    const scores = makeScores(0);
    scores.commute = 7;
    scores.gym = 3;
    const n = makeNeighborhood("test", scores);

    const weights = makeWeights(0);
    weights.commute = 1;
    weights.gym = 1;

    const ranked = rankNeighborhoods([n], weights);
    // (7+3)/2 = 5.0
    expect(ranked[0].weightedScore).toBe(5);
  });
});

describe("scoreColor", () => {
  it("returns highest tier color for 10", () => {
    expect(scoreColor(10)).toBe("var(--score-10)");
  });

  it("returns lowest tier color for 1", () => {
    expect(scoreColor(1)).toBe("var(--score-1)");
  });

  it("returns mid tier for 7", () => {
    expect(scoreColor(7)).toBe("var(--score-7)");
  });
});

describe("scoreTextClass", () => {
  it("returns emerald for 9+", () => {
    expect(scoreTextClass(9.5)).toBe("text-emerald-400");
  });

  it("returns red for low scores", () => {
    expect(scoreTextClass(2)).toBe("text-red-400");
  });
});

describe("formatScore", () => {
  it("formats integer to 1 decimal", () => {
    expect(formatScore(8)).toBe("8.0");
  });

  it("formats to 1 decimal", () => {
    expect(formatScore(7.56)).toBe("7.6");
  });

  it("formats 10 correctly", () => {
    expect(formatScore(10)).toBe("10.0");
  });
});
