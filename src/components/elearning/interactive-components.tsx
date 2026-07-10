"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb, Info, AlertTriangle, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// === 1. ACCORDION / CLICK-TO-REVEAL ===
export function ClickToReveal({
  title,
  children,
  variant = "info",
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  variant?: "info" | "warning" | "tip" | "danger";
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const variantStyles = {
    info: { bg: "bg-blue-500/5", border: "border-blue-500/30", icon: Info, iconColor: "text-blue-500" },
    warning: { bg: "bg-yellow-500/5", border: "border-yellow-500/30", icon: AlertTriangle, iconColor: "text-yellow-500" },
    tip: { bg: "bg-green-500/5", border: "border-green-500/30", icon: Lightbulb, iconColor: "text-green-500" },
    danger: { bg: "bg-red-500/5", border: "border-red-500/30", icon: AlertTriangle, iconColor: "text-red-500" },
  };
  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div className={cn("rounded-lg border overflow-hidden", style.bg, style.border)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3 flex items-center gap-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-expanded={open}
      >
        <Icon className={cn("h-5 w-5 shrink-0", style.iconColor)} />
        <span className="flex-1 font-medium text-sm">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// === 2. INTERACTIVE HOTSPOTS ===
export interface Hotspot {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string;
  content: ReactNode;
  color?: string;
}

export function InteractiveHotspots({
  imageSrc,
  alt,
  hotspots,
  className,
}: {
  imageSrc: string;
  alt: string;
  hotspots: Hotspot[];
  className?: string;
}) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <div className={cn("relative rounded-xl overflow-hidden border bg-muted/30", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt={alt} className="w-full h-auto" />

      {hotspots.map((spot, idx) => (
        <button
          key={idx}
          onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
          className="absolute group"
          style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
          aria-label={spot.label}
        >
          <motion.div
            className={cn(
              "w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
              activeHotspot === idx ? "scale-125" : ""
            )}
            style={{ backgroundColor: spot.color || "#dc2626" }}
            animate={activeHotspot === idx ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.2 }}
          >
            <span className="text-white text-xs font-bold">{idx + 1}</span>
          </motion.div>
          {activeHotspot !== idx && (
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-7 text-[10px] bg-black/80 text-white px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {spot.label}
            </span>
          )}
        </button>
      ))}

      {/* Active hotspot content */}
      <AnimatePresence>
        {activeHotspot !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-black/85 backdrop-blur-sm text-white"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                Hotspot {activeHotspot + 1}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={() => setActiveHotspot(null)}
              >
                ×
              </Button>
            </div>
            <div className="font-semibold mb-1">{hotspots[activeHotspot].label}</div>
            <div className="text-sm text-white/90">{hotspots[activeHotspot].content}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <Eye className="h-3 w-3" />
        Click hotspots
      </div>
    </div>
  );
}

// === 3. BEFORE/AFTER COMPARISON ===
export function BeforeAfterComparison({
  beforeLabel,
  afterLabel,
  beforeContent,
  afterContent,
}: {
  beforeLabel: string;
  afterLabel: string;
  beforeContent: ReactNode;
  afterContent: ReactNode;
}) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Button
            variant={!showAfter ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAfter(false)}
          >
            {beforeLabel}
          </Button>
          <Button
            variant={showAfter ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAfter(true)}
          >
            {afterLabel}
          </Button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={showAfter ? "after" : "before"}
            initial={{ opacity: 0, x: showAfter ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: showAfter ? -20 : 20 }}
            transition={{ duration: 0.3 }}
          >
            {showAfter ? afterContent : beforeContent}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// === 4. KNOWLEDGE CHECK (inline mini-quiz) ===
export function KnowledgeCheck({
  question,
  options,
  correctAnswer,
  explanation,
  questionId,
}: {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  questionId: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
  };

  const isCorrect = selected === correctAnswer;

  return (
    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 my-4">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="bg-primary/10">
          <Lightbulb className="h-3 w-3 mr-1" />
          Knowledge Check
        </Badge>
      </div>
      <p className="font-medium text-sm mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isThisCorrect = idx === correctAnswer;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className={cn(
                "w-full text-left p-2.5 rounded-lg border-2 text-sm transition-all",
                !showResult && "hover:bg-accent hover:border-primary/30",
                !showResult && isSelected && "border-primary bg-primary/10",
                showResult && isThisCorrect && "border-green-500 bg-green-500/10",
                showResult && isSelected && !isThisCorrect && "border-red-500 bg-red-500/10",
                showResult && !isSelected && !isThisCorrect && "opacity-50"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
                  !showResult && isSelected && "border-primary bg-primary text-primary-foreground",
                  showResult && isThisCorrect && "border-green-500 bg-green-500 text-white",
                  showResult && isSelected && !isThisCorrect && "border-red-500 bg-red-500 text-white",
                  !showResult && !isSelected && "border-muted-foreground/30"
                )}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={cn(
              "mt-3 p-3 rounded-lg text-sm",
              isCorrect ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
            )}
          >
            <div className="font-semibold mb-1">
              {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
            </div>
            <div className="text-muted-foreground">{explanation}</div>
            {!isCorrect && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSelected(null);
                  setShowResult(false);
                }}
              >
                Try Again
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// === 5. DRAG AND DROP MATCHING ===
export function DragDropMatching({
  title,
  pairs: { left, right },
  onMatch,
}: {
  title: string;
  pairs: { left: string[]; right: string[] };
  onMatch?: (correct: boolean) => void;
}) {
  // Shuffle the right column
  const [shuffledRight] = useState(() => [...right].sort(() => Math.random() - 0.5));
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleDragStart = (item: string) => setDraggedItem(item);
  const handleDrop = (target: string) => {
    if (draggedItem) {
      setMatches({ ...matches, [draggedItem]: target });
      setDraggedItem(null);
    }
  };
  const handleCheck = () => {
    setShowResults(true);
    const correctCount = left.filter((l) => matches[l] === right[left.indexOf(l)]).length;
    onMatch?.(correctCount === left.length);
  };
  const handleReset = () => {
    setMatches({});
    setShowResults(false);
  };

  return (
    <Card className="my-4">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4">Drag items from the left to match with the right</p>

        <div className="grid grid-cols-2 gap-4">
          {/* Left column - draggable */}
          <div className="space-y-2">
            {left.map((item) => {
              const matched = matches[item];
              const isCorrect = showResults && matched === right[left.indexOf(item)];
              const isWrong = showResults && matched && matched !== right[left.indexOf(item)];
              return (
                <div
                  key={item}
                  draggable={!matched}
                  onDragStart={() => handleDragStart(item)}
                  className={cn(
                    "p-2.5 rounded-lg border-2 text-sm cursor-grab active:cursor-grabbing transition-all",
                    !matched && "hover:border-primary/50 hover:bg-accent",
                    matched && "opacity-50 cursor-not-allowed",
                    isCorrect && "border-green-500 bg-green-500/10",
                    isWrong && "border-red-500 bg-red-500/10"
                  )}
                >
                  {item}
                </div>
              );
            })}
          </div>

          {/* Right column - drop targets */}
          <div className="space-y-2">
            {shuffledRight.map((item) => {
              const matchedBy = Object.entries(matches).find(([_, v]) => v === item)?.[0];
              const isCorrect = showResults && matchedBy && left.indexOf(matchedBy) === right.indexOf(item);
              const isWrong = showResults && matchedBy && left.indexOf(matchedBy) !== right.indexOf(item);
              return (
                <div
                  key={item}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(item)}
                  className={cn(
                    "p-2.5 rounded-lg border-2 border-dashed text-sm min-h-[44px] flex items-center justify-between transition-all",
                    !matchedBy && "border-muted-foreground/30",
                    matchedBy && "border-solid border-primary",
                    isCorrect && "border-green-500 bg-green-500/10",
                    isWrong && "border-red-500 bg-red-500/10"
                  )}
                >
                  <span>{item}</span>
                  {matchedBy && (
                    <Badge variant="secondary" className="text-xs">
                      ← {matchedBy.substring(0, 15)}{matchedBy.length > 15 ? "..." : ""}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
          <Button size="sm" onClick={handleCheck} disabled={Object.keys(matches).length !== left.length}>
            Check Answers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// === 6. SEQUENCE ORDERING ===
export function SequenceOrdering({
  title,
  steps,
  correctOrder,
}: {
  title: string;
  steps: string[];
  correctOrder: number[]; // indices in correct order
}) {
  const [currentOrder, setCurrentOrder] = useState<number[]>(() =>
    [...steps.map((_, i) => i)].sort(() => Math.random() - 0.5)
  );
  const [showResult, setShowResult] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const moveStep = (from: number, to: number) => {
    const newOrder = [...currentOrder];
    const [removed] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, removed);
    setCurrentOrder(newOrder);
  };

  const isCorrect = currentOrder.every((step, i) => step === correctOrder[i]);

  return (
    <Card className="my-4">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4">Drag to arrange in the correct order</p>

        <div className="space-y-2">
          {currentOrder.map((stepIdx, displayIdx) => {
            const isCorrectPos = showResult && stepIdx === correctOrder[displayIdx];
            const isWrongPos = showResult && stepIdx !== correctOrder[displayIdx];
            return (
              <div
                key={stepIdx}
                draggable
                onDragStart={() => setDraggedIdx(displayIdx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedIdx !== null && draggedIdx !== displayIdx) {
                    moveStep(draggedIdx, displayIdx);
                  }
                  setDraggedIdx(null);
                }}
                className={cn(
                  "p-3 rounded-lg border-2 flex items-center gap-3 cursor-grab active:cursor-grabbing transition-all bg-card",
                  !showResult && "hover:border-primary/50",
                  isCorrectPos && "border-green-500 bg-green-500/10",
                  isWrongPos && "border-red-500 bg-red-500/10"
                )}
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {displayIdx + 1}
                </span>
                <span className="text-sm flex-1">{steps[stepIdx]}</span>
                <div className="flex flex-col gap-0.5">
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => displayIdx > 0 && moveStep(displayIdx, displayIdx - 1)}
                  >
                    ▲
                  </button>
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => displayIdx < currentOrder.length - 1 && moveStep(displayIdx, displayIdx + 1)}
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4 justify-end">
          <Button
            size="sm"
            onClick={() => setShowResult(true)}
            disabled={showResult}
          >
            Check Order
          </Button>
          {showResult && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentOrder([...steps.map((_, i) => i)].sort(() => Math.random() - 0.5));
                setShowResult(false);
              }}
            >
              Shuffle & Retry
            </Button>
          )}
        </div>

        {showResult && (
          <div className={cn(
            "mt-3 p-3 rounded-lg text-sm",
            isCorrect ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
          )}>
            {isCorrect
              ? "✓ Perfect! You arranged the steps in the correct order."
              : "Some steps are in the wrong order. Try again or review the lesson."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// === 7. INTERACTIVE TIMELINE ===
export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function InteractiveTimeline({ events }: { events: TimelineEvent[] }) {
  const [activeEvent, setActiveEvent] = useState(0);

  return (
    <div className="my-4">
      <div className="relative pb-8">
        {/* Timeline line */}
        <div className="absolute left-0 right-0 top-8 h-1 bg-muted rounded-full" />
        <div
          className="absolute left-0 top-8 h-1 bg-gradient-to-r from-primary to-chart-4 rounded-full transition-all duration-500"
          style={{ width: `${((activeEvent + 1) / events.length) * 100}%` }}
        />

        {/* Event markers */}
        <div className="relative flex justify-between">
          {events.map((event, idx) => {
            const Icon = event.icon;
            const isActive = idx === activeEvent;
            return (
              <button
                key={idx}
                onClick={() => setActiveEvent(idx)}
                className="flex flex-col items-center gap-2 group"
              >
                <motion.div
                  className={cn(
                    "w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all",
                    isActive
                      ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg"
                      : "bg-card border-muted group-hover:border-primary/50"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {Icon ? <Icon className="h-6 w-6" /> : <span className="font-bold">{idx + 1}</span>}
                </motion.div>
                <span className={cn(
                  "text-xs font-medium text-center max-w-[80px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {event.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active event content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEvent}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-xl border p-4 bg-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{events[activeEvent].year}</Badge>
            <h3 className="font-semibold">{events[activeEvent].title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{events[activeEvent].description}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// === 8. FLASHCARD INLINE ===
export function InlineFlashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="my-4 h-32 cursor-pointer perspective-1000"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 bg-card p-4"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Badge variant="outline" className="mb-2">Term</Badge>
          <div className="font-semibold text-center">{front}</div>
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 bg-gradient-to-br from-primary/10 to-chart-4/10 p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Badge className="mb-2">Definition</Badge>
          <div className="text-sm text-center">{back}</div>
        </div>
      </motion.div>
    </div>
  );
}
