"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse } from "@/lib/use-course";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  Shuffle,
  Layers,
  Sparkles,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/lib/types";

// ============================================================
// SM-2 Spaced Repetition
// Storage key: dgr-academy-flashcard-schedule
// ============================================================

interface SM2State {
  // easiness factor (>= 1.3)
  ef: number;
  // interval in days
  interval: number;
  // repetition count (consecutive correct)
  reps: number;
  // next due date (ISO date string YYYY-MM-DD)
  due: string;
  // last reviewed timestamp ISO
  lastReviewed: string | null;
}

type ScheduleMap = Record<string, SM2State>;

const SCHEDULE_KEY = "dgr-academy-flashcard-schedule";
const REVIEWED_TODAY_KEY = "dgr-academy-flashcard-reviewed-today";

function loadSchedule(): ScheduleMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ScheduleMap;
  } catch {
    return {};
  }
}

function saveSchedule(map: ScheduleMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent("dgr-flashcard-schedule-updated"));
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultState(): SM2State {
  return { ef: 2.5, interval: 0, reps: 0, due: todayISO(), lastReviewed: null };
}

/**
 * SM-2 algorithm implementation.
 * quality: 0 = didn't know, 5 = knew it
 */
function sm2Update(state: SM2State, quality: number): SM2State {
  const q = Math.max(0, Math.min(5, quality));
  let { ef, interval, reps } = state;

  if (q < 3) {
    reps = 0;
    interval = 1; // see again tomorrow
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 3;
    else interval = Math.round(interval * ef);
  }

  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    ef,
    interval,
    reps,
    due: dueDate.toISOString().slice(0, 10),
    lastReviewed: new Date().toISOString(),
  };
}

function getReviewedTodaySet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(`${REVIEWED_TODAY_KEY}-${todayISO()}`);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function markReviewedToday(cardId: string) {
  if (typeof window === "undefined") return;
  const set = getReviewedTodaySet();
  set.add(cardId);
  localStorage.setItem(`${REVIEWED_TODAY_KEY}-${todayISO()}`, JSON.stringify(Array.from(set)));
  window.dispatchEvent(new CustomEvent("dgr-flashcard-reviewed-updated"));
}

function clearReviewedToday() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${REVIEWED_TODAY_KEY}-${todayISO()}`);
  window.dispatchEvent(new CustomEvent("dgr-flashcard-reviewed-updated"));
}

// ============================================================
// Component
// ============================================================

type Mode = "all" | "smart";

export function FlashcardsView() {
  const { language, addXp } = useAppStore();
  const courseData = useCurrentCourse();
  const lang = language || "en";

  const [mode, setMode] = useState<Mode>("all");
  const [deck, setDeck] = useState<Flashcard[]>(() => [...courseData.flashcards]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [unknownIds, setUnknownIds] = useState<Set<string>>(new Set());
  const [schedule, setSchedule] = useState<ScheduleMap>({});
  const [reviewedToday, setReviewedToday] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const cats = new Set(courseData.flashcards.map((c) => c.category));
    return Array.from(cats);
  }, [courseData]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load schedule from localStorage on mount
  useEffect(() => {
    setSchedule(loadSchedule());
    setReviewedToday(getReviewedTodaySet());

    const handler = () => {
      setSchedule(loadSchedule());
      setReviewedToday(getReviewedTodaySet());
    };
    window.addEventListener("dgr-flashcard-schedule-updated", handler);
    window.addEventListener("dgr-flashcard-reviewed-updated", handler);
    return () => {
      window.removeEventListener("dgr-flashcard-schedule-updated", handler);
      window.removeEventListener("dgr-flashcard-reviewed-updated", handler);
    };
  }, []);

  // Compute due cards for Smart Review
  const dueCards = useMemo(() => {
    const today = todayISO();
    return courseData.flashcards.filter((c) => {
      const st = schedule[c.id] || defaultState();
      return st.due <= today;
    });
  }, [courseData, schedule]);

  // Filtered deck based on mode + category
  const filteredDeck = useMemo(() => {
    let list: Flashcard[];
    if (mode === "smart") {
      list = dueCards;
    } else {
      list = courseData.flashcards;
    }
    if (selectedCategory) {
      list = list.filter((c) => c.category === selectedCategory);
    }
    return list;
  }, [mode, dueCards, courseData, selectedCategory]);

  // Reset position when deck changes
  useEffect(() => {
    setCurrentIdx(0);
    setFlipped(false);
    setKnownIds(new Set());
    setUnknownIds(new Set());
  }, [mode, selectedCategory]);

  const currentCard = filteredDeck[currentIdx];
  const progressPct = filteredDeck.length > 0 ? ((currentIdx + 1) / filteredDeck.length) * 100 : 0;

  const dueTodayCount = dueCards.length;
  const reviewedCount = reviewedToday.size;

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      if (currentIdx < filteredDeck.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setCurrentIdx(0);
      }
    }, 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      if (currentIdx > 0) {
        setCurrentIdx(currentIdx - 1);
      } else {
        setCurrentIdx(filteredDeck.length - 1);
      }
    }, 150);
  };

  const handleKnown = () => {
    if (!currentCard) return;
    const newKnown = new Set(knownIds);
    newKnown.add(currentCard.id);
    setKnownIds(newKnown);
    addXp(5);

    // SM-2 update: quality 5 (perfect)
    if (mode === "smart") {
      const current = schedule[currentCard.id] || defaultState();
      const updated = sm2Update(current, 5);
      const newSchedule = { ...schedule, [currentCard.id]: updated };
      setSchedule(newSchedule);
      saveSchedule(newSchedule);
      markReviewedToday(currentCard.id);
    }
    handleNext();
  };

  const handleUnknown = () => {
    if (!currentCard) return;
    const newUnknown = new Set(unknownIds);
    newUnknown.add(currentCard.id);
    setUnknownIds(newUnknown);

    // SM-2 update: quality 0 (didn't know) — due tomorrow
    if (mode === "smart") {
      const current = schedule[currentCard.id] || defaultState();
      const updated = sm2Update(current, 0);
      const newSchedule = { ...schedule, [currentCard.id]: updated };
      setSchedule(newSchedule);
      saveSchedule(newSchedule);
      markReviewedToday(currentCard.id);
    }
    handleNext();
  };

  const handleShuffle = () => {
    const shuffled = [...filteredDeck].sort(() => Math.random() - 0.5);
    setCurrentIdx(0);
    setFlipped(false);
    setDeck(shuffled);
  };

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
  };

  const handleReset = () => {
    setFlipped(false);
    setCurrentIdx(0);
    setKnownIds(new Set());
    setUnknownIds(new Set());
    if (mode === "smart") {
      // Reset all schedules
      const cleared: ScheduleMap = {};
      saveSchedule(cleared);
      setSchedule(cleared);
      clearReviewedToday();
      setReviewedToday(new Set());
    }
  };

  if (courseData.flashcards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">No flashcards available</h2>
      </div>
    );
  }

  // Smart Review empty state
  if (mode === "smart" && filteredDeck.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <FlashcardsHeader
          lang={lang}
          mode={mode}
          setMode={setMode}
          dueTodayCount={dueTodayCount}
          reviewedCount={reviewedCount}
          totalCards={courseData.flashcards.length}
        />

        <div className="text-center mb-4">
          <Badge variant="outline" className="gap-1.5">
            <CalendarClock className="h-3.5 w-3.5 text-green-500" />
            Reviewed: {reviewedCount} / {reviewedCount + dueTodayCount} due today
          </Badge>
        </div>

        <Card className="text-center py-12">
          <CardContent className="pt-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
            >
              <Check className="h-10 w-10 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You have no cards due for review right now. Come back tomorrow or switch to "All Cards" mode
              to study ahead.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => setMode("all")} className="gap-2">
                <Layers className="h-4 w-4" />
                Study All Cards
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCard) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <FlashcardsHeader
        lang={lang}
        mode={mode}
        setMode={setMode}
        dueTodayCount={dueTodayCount}
        reviewedCount={reviewedCount}
        totalCards={courseData.flashcards.length}
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Button
          size="sm"
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => handleCategoryChange(null)}
        >
          <Layers className="h-3 w-3 mr-1" />
          All ({mode === "smart" ? dueCards.length : courseData.flashcards.length})
        </Button>
        {categories.map((cat) => {
          const allCount = courseData.flashcards.filter((c) => c.category === cat).length;
          const dueCount = dueCards.filter((c) => c.category === cat).length;
          const count = mode === "smart" ? dueCount : allCount;
          return (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => handleCategoryChange(cat)}
              disabled={mode === "smart" && dueCount === 0}
            >
              {cat} ({count})
            </Button>
          );
        })}
      </div>

      {/* Smart Review progress */}
      {mode === "smart" && (
        <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <CalendarClock className="h-4 w-4 text-primary" />
              Smart Review Progress
            </span>
            <span className="text-muted-foreground">
              Reviewed: {reviewedCount} / {reviewedCount + dueTodayCount} due today
            </span>
          </div>
          <Progress
            value={reviewedCount + dueTodayCount > 0 ? (reviewedCount / (reviewedCount + dueTodayCount)) * 100 : 0}
            className="h-1.5"
          />
        </div>
      )}

      {/* Progress and stats */}
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary">
          {currentIdx + 1} / {filteredDeck.length}
        </Badge>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-green-600">
            <Check className="h-3 w-3" />
            {knownIds.size}
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <X className="h-3 w-3" />
            {unknownIds.size}
          </span>
        </div>
      </div>
      <Progress value={progressPct} className="h-1 mb-6" />

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="mb-6"
        >
          <div
            className="relative h-72 md:h-80 cursor-pointer perspective-1000"
            onClick={() => setFlipped(!flipped)}
          >
            <motion.div
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl border-2 bg-card"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Badge variant="outline" className="mb-4">
                  {currentCard.category}
                </Badge>
                <div className="text-xl md:text-2xl font-bold text-center mb-4">
                  {currentCard.front}
                </div>
                <div className="text-xs text-muted-foreground mt-auto">
                  {t(lang, "flashcardHint")}
                </div>
              </div>
              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl border-2 bg-gradient-to-br from-primary/10 to-chart-4/10"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <Badge className="mb-4">Answer</Badge>
                <div className="text-base md:text-lg text-center">
                  {currentCard.back}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="icon" onClick={handlePrev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffle}
            className="gap-1"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Known/Unknown buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button
          variant="outline"
          onClick={handleUnknown}
          className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/10"
        >
          <X className="h-4 w-4" />
          {t(lang, "didntKnow")}
        </Button>
        <Button
          variant="outline"
          onClick={handleKnown}
          className="gap-2 border-green-500/30 text-green-600 hover:bg-green-500/10"
        >
          <Check className="h-4 w-4" />
          {t(lang, "knewIt")}
        </Button>
      </div>

      {/* Smart review explainer */}
      {mode === "smart" && (
        <div className="mt-6 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
          <Sparkles className="inline h-3.5 w-3.5 mr-1 text-primary" />
          <strong>Smart Review</strong> uses the SM-2 spaced repetition algorithm. Cards you mark as
          "Didn't Know" will appear again tomorrow. Cards you "Knew It" get scheduled further out based
          on how well you know them.
        </div>
      )}
    </div>
  );
}

// ============================================================
// Header sub-component
// ============================================================
function FlashcardsHeader({
  lang,
  mode,
  setMode,
  dueTodayCount,
  reviewedCount,
  totalCards,
}: {
  lang: "en" | "fr" | "ar";
  mode: Mode;
  setMode: (m: Mode) => void;
  dueTodayCount: number;
  reviewedCount: number;
  totalCards: number;
}) {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold">{t(lang, "flashcardsTitle")}</h1>
        </div>
        <p className="text-muted-foreground">
          Master key terms, codes, and definitions
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
        <div className="inline-flex rounded-lg border bg-card p-1">
          <button
            onClick={() => setMode("all")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5",
              mode === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            All Cards ({totalCards})
          </button>
          <button
            onClick={() => setMode("smart")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5",
              mode === "smart" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Smart Review
          </button>
        </div>
        {mode === "smart" && (
          <Badge variant="outline" className="gap-1.5">
            <CalendarClock className="h-3.5 w-3.5 text-orange-500" />
            Due today: {dueTodayCount} cards
          </Badge>
        )}
      </div>
    </>
  );
}
