"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { courseData } from "@/lib/course-data";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function FlashcardsView() {
  const { language, addXp } = useAppStore();
  const lang = language || "en";

  const [deck, setDeck] = useState(() => [...courseData.flashcards]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [unknownIds, setUnknownIds] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const cats = new Set(courseData.flashcards.map((c) => c.category));
    return Array.from(cats);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDeck = useMemo(() => {
    if (!selectedCategory) return courseData.flashcards;
    return courseData.flashcards.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  const currentCard = filteredDeck[currentIdx];
  const progressPct = filteredDeck.length > 0 ? ((currentIdx + 1) / filteredDeck.length) * 100 : 0;

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      if (currentIdx < filteredDeck.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        // Loop back
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
    if (currentCard) {
      const newKnown = new Set(knownIds);
      newKnown.add(currentCard.id);
      setKnownIds(newKnown);
      addXp(5);
    }
    handleNext();
  };

  const handleUnknown = () => {
    if (currentCard) {
      const newUnknown = new Set(unknownIds);
      newUnknown.add(currentCard.id);
      setUnknownIds(newUnknown);
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
    setCurrentIdx(0);
    setFlipped(false);
  };

  if (!currentCard) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">No flashcards available</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
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

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Button
          size="sm"
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => handleCategoryChange(null)}
        >
          <Layers className="h-3 w-3 mr-1" />
          All ({courseData.flashcards.length})
        </Button>
        {categories.map((cat) => {
          const count = courseData.flashcards.filter((c) => c.category === cat).length;
          return (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat} ({count})
            </Button>
          );
        })}
      </div>

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
            onClick={() => {
              setFlipped(false);
              setCurrentIdx(0);
              setKnownIds(new Set());
              setUnknownIds(new Set());
            }}
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
    </div>
  );
}
