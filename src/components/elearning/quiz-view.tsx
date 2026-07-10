"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { courseData } from "@/lib/course-data";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  Target,
  Award,
  ArrowLeft,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/types";

export function QuizView() {
  const {
    selectedQuizType,
    selectedQuizId,
    setView,
    setSelectedLesson,
    recordQuizScore,
    language,
  } = useAppStore();

  const lang = language || "en";

  // Get questions based on quiz type
  const questions = useMemo<QuizQuestion[]>(() => {
    if (!selectedQuizId) return [];
    if (selectedQuizType === "lesson") return courseData.quizzes[selectedQuizId] || [];
    if (selectedQuizType === "module") return courseData.moduleQuizzes[selectedQuizId] || [];
    if (selectedQuizType === "final") return courseData.finalExam;
    return [];
  }, [selectedQuizId, selectedQuizType]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now());

  if (!selectedQuizId || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">No quiz selected</h2>
        <p className="text-muted-foreground mb-6">Choose a lesson to take its quiz</p>
        <Button onClick={() => setView("dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const progressPct = ((currentIdx + 1) / questions.length) * 100;

  const handleAnswer = (answer: number | number[]) => {
    setAnswers({ ...answers, [currentIdx]: answer });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score
      let correct = 0;
      questions.forEach((q, i) => {
        const userAnswer = answers[i];
        if (q.type === "multiple") {
          const correctArr = q.correctAnswer as number[];
          const userArr = userAnswer as number[];
          if (
            userArr &&
            correctArr.length === userArr.length &&
            correctArr.every((v) => userArr.includes(v))
          ) {
            correct++;
          }
        } else {
          if (userAnswer === q.correctAnswer) correct++;
        }
      });

      recordQuizScore(selectedQuizId, correct, questions.length);
      setShowResults(true);
    } else {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(false);
    }
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setAnswers({});
    setShowResults(false);
    setShowExplanation(false);
  };

  // Results view
  if (showResults) {
    let correct = 0;
    questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (q.type === "multiple") {
        const correctArr = q.correctAnswer as number[];
        const userArr = userAnswer as number[];
        if (
          userArr &&
          correctArr.length === userArr.length &&
          correctArr.every((v) => userArr.includes(v))
        ) {
          correct++;
        }
      } else {
        if (userAnswer === q.correctAnswer) correct++;
      }
    });

    const scorePct = Math.round((correct / questions.length) * 100);
    const passed = scorePct >= 70;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="overflow-hidden">
            <div className={cn(
              "p-8 text-center text-white",
              passed ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-orange-500 to-red-500"
            )}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4"
              >
                {passed ? <Trophy className="h-10 w-10" /> : <RotateCcw className="h-10 w-10" />}
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">
                {passed ? "Well Done!" : "Keep Practicing!"}
              </h2>
              <p className="text-white/90 mb-4">
                {passed
                  ? "You passed the quiz with flying colors!"
                  : "You need 70% to pass. Review the material and try again."}
              </p>
              <div className="text-5xl font-bold mb-2">{scorePct}%</div>
              <p className="text-white/80">
                {correct} out of {questions.length} correct
              </p>
            </div>

            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{correct}</div>
                  <div className="text-xs text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{questions.length - correct}</div>
                  <div className="text-xs text-muted-foreground">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.floor(timeTaken / 60)}m {timeTaken % 60}s</div>
                  <div className="text-xs text-muted-foreground">Time</div>
                </div>
              </div>

              {/* Review answers */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Answer Review
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {questions.map((q, qi) => {
                    const userAnswer = answers[qi];
                    const isCorrect = q.type === "multiple"
                      ? Array.isArray(userAnswer) &&
                        (q.correctAnswer as number[]).length === (userAnswer as number[]).length &&
                        (q.correctAnswer as number[]).every((v) => (userAnswer as number[]).includes(v))
                      : userAnswer === q.correctAnswer;
                    return (
                      <div
                        key={qi}
                        className={cn(
                          "p-3 rounded-lg border",
                          isCorrect ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 text-sm">
                            <div className="font-medium mb-1">{qi + 1}. {q.question}</div>
                            {!isCorrect && (
                              <div className="text-xs text-muted-foreground">
                                <div>Your answer: {Array.isArray(userAnswer) ? (userAnswer as number[]).map(i => q.options[i]).join(", ") : q.options[userAnswer as number] || "Not answered"}</div>
                                <div className="text-green-600 dark:text-green-400">
                                  Correct: {Array.isArray(q.correctAnswer) ? (q.correctAnswer as number[]).map(i => q.options[i]).join(", ") : q.options[q.correctAnswer as number]}
                                </div>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1 italic">{q.explanation}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" onClick={handleRetake} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  {t(lang, "retakeQuiz")}
                </Button>
                <Button onClick={() => setView("dashboard")} className="gap-2">
                  {t(lang, "backToLessons")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Quiz question view
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("dashboard")}
          className="mb-4 gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-2">
          <div>
            <Badge variant="secondary" className="mb-2">
              {selectedQuizType === "final" ? "Final Exam" : selectedQuizType === "module" ? "Module Quiz" : "Lesson Quiz"}
            </Badge>
            <h1 className="text-2xl font-bold">
              {t(lang, "question")} {currentIdx + 1} {t(lang, "of")} {questions.length}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {Math.round((Date.now() - startTime) / 1000)}s
          </div>
        </div>

        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                <Badge variant="outline" className="shrink-0 capitalize">
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {currentQuestion.type === "multiple" ? (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, oi) => {
                    const userAnswer = (answers[currentIdx] as number[]) || [];
                    const isSelected = userAnswer.includes(oi);
                    const isCorrect = (currentQuestion.correctAnswer as number[]).includes(oi);
                    return (
                      <div
                        key={oi}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                          !showExplanation && "hover:bg-accent/50",
                          showExplanation && isCorrect && "border-green-500/50 bg-green-500/10",
                          showExplanation && isSelected && !isCorrect && "border-red-500/50 bg-red-500/10",
                          !showExplanation && isSelected && "border-primary bg-primary/10"
                        )}
                        onClick={() => {
                          if (showExplanation) return;
                          const current = (answers[currentIdx] as number[]) || [];
                          const newAns = isSelected
                            ? current.filter((i) => i !== oi)
                            : [...current, oi];
                          setAnswers({ ...answers, [currentIdx]: newAns });
                        }}
                      >
                        <Checkbox checked={isSelected} />
                        <span className="text-sm">{option}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <RadioGroup
                  value={String(answers[currentIdx] ?? "")}
                  onValueChange={(v) => handleAnswer(Number(v))}
                  className="space-y-2"
                >
                  {currentQuestion.options.map((option, oi) => {
                    const isSelected = answers[currentIdx] === oi;
                    const isCorrect = currentQuestion.correctAnswer === oi;
                    return (
                      <div
                        key={oi}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-all",
                          showExplanation && isCorrect && "border-green-500/50 bg-green-500/10",
                          showExplanation && isSelected && !isCorrect && "border-red-500/50 bg-red-500/10",
                          !showExplanation && isSelected && "border-primary bg-primary/10",
                          !showExplanation && !isSelected && "hover:bg-accent/50"
                        )}
                      >
                        <RadioGroupItem value={String(oi)} id={`opt-${oi}`} />
                        <Label htmlFor={`opt-${oi}`} className="text-sm cursor-pointer flex-1">
                          {option}
                        </Label>
                        {showExplanation && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {showExplanation && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              )}

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <div className={cn(
                      "p-4 rounded-lg border",
                      answers[currentIdx] === currentQuestion.correctAnswer ||
                      (currentQuestion.type === "multiple" &&
                        Array.isArray(answers[currentIdx]) &&
                        Array.isArray(currentQuestion.correctAnswer) &&
                        (currentQuestion.correctAnswer as number[]).length === (answers[currentIdx] as number[]).length &&
                        (currentQuestion.correctAnswer as number[]).every((v) => (answers[currentIdx] as number[]).includes(v)))
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-red-500/30 bg-red-500/5"
                    )}>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm mb-1">{t(lang, "explanation")}</div>
                          <div className="text-sm text-muted-foreground">{currentQuestion.explanation}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleNext}
                  disabled={!showExplanation && currentQuestion.type !== "multiple" && answers[currentIdx] === undefined}
                  className="gap-2"
                >
                  {isLastQuestion ? t(lang, "submitQuiz") : t(lang, "nextQuestion")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
