"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Languages,
  BookOpen,
  Brain,
  Flame,
  RotateCcw,
  ChevronRight,
  Star,
  Check,
  Volume2,
} from "lucide-react";
import { PHRASES, CATEGORY_CONFIG, type PhraseCategory, type PhraseData } from "@/lib/data/phrases";
import { useLanguageStore } from "@/lib/stores/language-store";
import { getMasteryLevel } from "@/lib/engines/spaced-repetition";

export default function LanguagePage() {
  const { cardStates, review, initCard, getCardState, getDueCards, reviewStreak } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState<PhraseCategory | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  function speakPhrase(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-CH";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  // Daily random phrase (seeded by date so it stays consistent per day)
  const dailyPhrase = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash + today.charCodeAt(i)) | 0;
    }
    const index = Math.abs(hash) % PHRASES.length;
    return PHRASES[index];
  }, []);

  // Initialize card states for all phrases on mount
  useEffect(() => {
    for (const phrase of PHRASES) {
      initCard(phrase.id);
    }
  }, [initCard]);

  // Stats
  const masteredCount = useMemo(() => {
    return PHRASES.filter((p) => getMasteryLevel(getCardState(p.id)) === "mastered").length;
  }, [cardStates, getCardState]);

  const dueCount = useMemo(() => {
    return getDueCards().length;
  }, [cardStates, getDueCards]);

  // Category stats
  const categoryStats = useMemo(() => {
    const stats: Record<PhraseCategory, { total: number; mastered: number }> = {} as Record<PhraseCategory, { total: number; mastered: number }>;
    for (const cat of Object.keys(CATEGORY_CONFIG) as PhraseCategory[]) {
      const catPhrases = PHRASES.filter((p) => p.category === cat);
      const catMastered = catPhrases.filter((p) => getMasteryLevel(getCardState(p.id)) === "mastered").length;
      stats[cat] = { total: catPhrases.length, mastered: catMastered };
    }
    return stats;
  }, [cardStates, getCardState]);

  // Active category phrases
  const activePhrases = useMemo(() => {
    if (!activeCategory) return [];
    return PHRASES.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const currentPhrase = activePhrases[cardIndex] ?? null;

  function handleRate(quality: number) {
    if (!currentPhrase) return;
    review(currentPhrase.id, quality);
    setFlipped(false);
    if (cardIndex < activePhrases.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      // Loop back or exit
      setActiveCategory(null);
      setCardIndex(0);
    }
  }

  function handleNextCard() {
    setFlipped(false);
    if (cardIndex < activePhrases.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  }

  function enterCategory(cat: PhraseCategory) {
    setActiveCategory(cat);
    setCardIndex(0);
    setFlipped(false);
  }

  function exitStudy() {
    setActiveCategory(null);
    setCardIndex(0);
    setFlipped(false);
  }

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div className="ambient-glow glow-gold" />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Language Prep
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          {PHRASES.length} Swiss German phrases with spaced repetition. Grüezi!
        </p>
      </div>

      {/* Daily Prompt Hero */}
      <div className="rounded-xl border border-border-default bg-bg-secondary p-5">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            Phrase of the Day
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-display text-xl font-bold text-text-primary">
            &ldquo;{dailyPhrase.swiss}&rdquo;
          </p>
          <button
            onClick={() => speakPhrase(dailyPhrase.swiss)}
            className="shrink-0 rounded-full p-1.5 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
            title="Listen to pronunciation"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          {dailyPhrase.english}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="font-data text-xs text-accent-primary">
            /{dailyPhrase.pronunciation}/
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-bg-tertiary text-text-muted">
            {dailyPhrase.standardGerman}
          </span>
        </div>
        {dailyPhrase.culturalNote && (
          <p className="text-[10px] text-text-tertiary mt-2 italic leading-snug">
            {dailyPhrase.culturalNote}
          </p>
        )}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          icon={<BookOpen className="h-4 w-4" />}
          label="Total Phrases"
          value={PHRASES.length}
          color="#3b82f6"
        />
        <KpiCard
          icon={<Check className="h-4 w-4" />}
          label="Mastered"
          value={masteredCount}
          color="#22c55e"
        />
        <KpiCard
          icon={<Brain className="h-4 w-4" />}
          label="Due for Review"
          value={dueCount}
          color="#f59e0b"
        />
        <KpiCard
          icon={<Flame className="h-4 w-4" />}
          label="Streak"
          value={`${reviewStreak}d`}
          color="#ef4444"
        />
      </div>

      {/* Flashcard Mode or Category Grid */}
      {activeCategory && currentPhrase ? (
        <div className="space-y-4">
          {/* Study header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={exitStudy}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Back to categories
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted">
                {CATEGORY_CONFIG[activeCategory].emoji}{" "}
                {CATEGORY_CONFIG[activeCategory].label}
              </span>
              <span className="font-data text-xs text-text-secondary">
                {cardIndex + 1}/{activePhrases.length}
              </span>
            </div>
          </div>

          {/* Flashcard */}
          <div
            onClick={() => setFlipped(!flipped)}
            className="rounded-xl border border-border-default bg-bg-secondary p-6 min-h-[220px] flex flex-col justify-center items-center cursor-pointer hover:border-accent-primary/30 transition-colors select-none"
          >
            {!flipped ? (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <p className="font-display text-2xl font-bold text-text-primary">
                    {currentPhrase.swiss}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); speakPhrase(currentPhrase.swiss); }}
                    className="shrink-0 rounded-full p-1.5 text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
                    title="Listen"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: currentPhrase.difficulty }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_CONFIG[currentPhrase.category].color }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-text-muted">
                  Tap to reveal
                </p>
              </div>
            ) : (
              <div className="text-center space-y-3 w-full">
                <p className="font-display text-lg font-bold text-text-primary">
                  {currentPhrase.english}
                </p>
                <p className="font-data text-sm text-accent-primary">
                  /{currentPhrase.pronunciation}/
                </p>
                <p className="text-xs text-text-secondary">
                  {currentPhrase.standardGerman}
                </p>
                {currentPhrase.culturalNote && (
                  <p className="text-[10px] text-text-tertiary italic leading-snug mt-2 max-w-md mx-auto">
                    {currentPhrase.culturalNote}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Rating buttons (only show when flipped) */}
          {flipped && (
            <div className="grid grid-cols-4 gap-2">
              <RateButton label="Again" quality={1} color="#ef4444" onClick={() => handleRate(1)} />
              <RateButton label="Hard" quality={3} color="#f59e0b" onClick={() => handleRate(3)} />
              <RateButton label="Good" quality={4} color="#3b82f6" onClick={() => handleRate(4)} />
              <RateButton label="Easy" quality={5} color="#22c55e" onClick={() => handleRate(5)} />
            </div>
          )}

          {/* Skip / Next (when not flipped) */}
          {!flipped && (
            <div className="flex justify-end">
              <button
                onClick={handleNextCard}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Skip
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Category Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(CATEGORY_CONFIG) as PhraseCategory[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const stats = categoryStats[cat];
            const pct = stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0;

            return (
              <button
                key={cat}
                onClick={() => enterCategory(cat)}
                className="rounded-lg border border-border-default bg-bg-secondary p-4 text-left hover:border-accent-primary/30 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{config.emoji}</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {config.label}
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-text-muted group-hover:text-text-primary transition-colors" />
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-bg-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
                <p className="font-data text-[10px] text-text-muted mt-1.5">
                  {stats.mastered}/{stats.total} mastered
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-secondary p-3">
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="font-data text-xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

function RateButton({
  label,
  quality,
  color,
  onClick,
}: {
  label: string;
  quality: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-lg border border-border-default bg-bg-secondary p-3 text-center hover:bg-bg-tertiary transition-colors"
      style={{
        borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
      }}
    >
      <span className="font-data text-xs font-semibold" style={{ color }}>
        {label}
      </span>
    </button>
  );
}
