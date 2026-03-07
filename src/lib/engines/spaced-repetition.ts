export interface CardState {
  phraseId: string;
  easeFactor: number;
  interval: number; // days
  nextReview: string; // ISO date string
  repetitions: number;
  lastQuality?: number;
}

export function createInitialState(phraseId: string): CardState {
  return {
    phraseId,
    easeFactor: 2.5,
    interval: 0,
    nextReview: new Date().toISOString().split("T")[0],
    repetitions: 0,
  };
}

export function reviewCard(state: CardState, quality: number): CardState {
  // quality: 1-5 (1=blackout, 2=wrong, 3=hard, 4=good, 5=easy)
  const q = Math.max(1, Math.min(5, quality));

  let { easeFactor, interval, repetitions } = state;

  if (q < 3) {
    // Reset on failure
    repetitions = 0;
    interval = 0;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + Math.max(interval, 1));

  return {
    phraseId: state.phraseId,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    nextReview: nextDate.toISOString().split("T")[0],
    repetitions,
    lastQuality: q,
  };
}

export function isDue(state: CardState): boolean {
  const today = new Date().toISOString().split("T")[0];
  return state.nextReview <= today;
}

export function getMasteryLevel(state: CardState): "new" | "learning" | "reviewing" | "mastered" {
  if (state.repetitions === 0) return "new";
  if (state.interval < 7) return "learning";
  if (state.interval < 30) return "reviewing";
  return "mastered";
}
