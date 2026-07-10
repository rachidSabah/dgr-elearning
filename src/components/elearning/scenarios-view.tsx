"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { courseData } from "@/lib/course-data";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ScenariosView() {
  const { language, addXp, addAchievement } = useAppStore();
  const lang = language || "en";

  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());

  const scenario = courseData.scenarios[currentScenarioIdx];

  const handleSelectChoice = (idx: number) => {
    if (showResult) return;
    setSelectedChoice(idx);
  };

  const handleSubmit = () => {
    if (selectedChoice === null) return;
    setShowResult(true);
    if (scenario.choices[selectedChoice].correct) {
      addXp(50);
      const newCompleted = new Set(completedScenarios);
      newCompleted.add(scenario.id);
      setCompletedScenarios(newCompleted);
      if (newCompleted.size === courseData.scenarios.length) {
        addAchievement("scenario-master");
      }
    }
  };

  const handleNext = () => {
    if (currentScenarioIdx < courseData.scenarios.length - 1) {
      setCurrentScenarioIdx(currentScenarioIdx + 1);
      setSelectedChoice(null);
      setShowResult(false);
    } else {
      setCurrentScenarioIdx(0);
      setSelectedChoice(null);
      setShowResult(false);
    }
  };

  const handleRetry = () => {
    setSelectedChoice(null);
    setShowResult(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold">{t(lang, "scenariosTitle")}</h1>
        </div>
        <p className="text-muted-foreground">
          Practice with realistic dangerous goods incident scenarios
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary">
          Scenario {currentScenarioIdx + 1} of {courseData.scenarios.length}
        </Badge>
        <Badge variant="outline">
          {completedScenarios.size} / {courseData.scenarios.length} completed
        </Badge>
      </div>

      {/* Scenario card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                {scenario.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Situation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{t(lang, "situation")}</Badge>
                </div>
                <p className="text-sm leading-relaxed">{scenario.situation}</p>
              </div>

              {/* Background */}
              <div className="p-4 rounded-lg bg-accent/30 border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wide">{t(lang, "background")}</span>
                </div>
                <p className="text-sm text-muted-foreground">{scenario.background}</p>
              </div>

              {/* Choices */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{t(lang, "choices")}</Badge>
                </div>
                <div className="space-y-2">
                  {scenario.choices.map((choice, ci) => {
                    const isSelected = selectedChoice === ci;
                    const isCorrect = choice.correct;
                    return (
                      <div
                        key={ci}
                        onClick={() => handleSelectChoice(ci)}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all",
                          !showResult && "hover:bg-accent/50",
                          !showResult && isSelected && "border-primary bg-primary/5",
                          !showResult && !isSelected && "border-border",
                          showResult && isCorrect && "border-green-500/50 bg-green-500/10",
                          showResult && isSelected && !isCorrect && "border-red-500/50 bg-red-500/10",
                          showResult && !isSelected && !isCorrect && "opacity-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                            !showResult && isSelected && "bg-primary text-primary-foreground",
                            !showResult && !isSelected && "border-2 border-muted-foreground/30",
                            showResult && isCorrect && "bg-green-500 text-white",
                            showResult && isSelected && !isCorrect && "bg-red-500 text-white"
                          )}>
                            {String.fromCharCode(65 + ci)}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">{choice.text}</div>
                            {showResult && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-2 text-xs italic"
                              >
                                {choice.feedback}
                              </motion.div>
                            )}
                          </div>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedChoice === null}
                  className="w-full gap-2"
                >
                  Submit Answer
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="space-y-4">
                  {/* Correct explanation */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-chart-4/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {t(lang, "correctExplanation")}
                      </span>
                    </div>
                    <p className="text-sm">{scenario.correctExplanation}</p>
                    <div className="mt-3 pt-3 border-t border-primary/10">
                      <span className="text-xs text-muted-foreground">
                        <strong>{t(lang, "reference")}:</strong> {scenario.reference}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRetry} className="gap-2 flex-1">
                      <RotateCcw className="h-4 w-4" />
                      Retry
                    </Button>
                    <Button onClick={handleNext} className="gap-2 flex-1">
                      {t(lang, "tryAnother")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
