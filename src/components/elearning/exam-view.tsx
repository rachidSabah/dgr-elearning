"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { courseData } from "@/lib/course-data";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Award,
  RotateCcw,
  AlertCircle,
  Trophy,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const EXAM_DURATION = 30 * 60; // 30 minutes in seconds

export function ExamView() {
  const { recordExamScore, setView, language, progress } = useAppStore();
  const lang = language || "en";

  const [examStarted, setExamStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [shuffledQuestions, setShuffledQuestions] = useState(() =>
    [...courseData.finalExam].sort(() => Math.random() - 0.5).map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5).map((opt, i) => {
        // Need to track which option is correct after shuffle
        const originalIdx = q.options.indexOf(opt);
        return { text: opt, originalIdx };
      }),
    }))
  );

  // Timer
  useEffect(() => {
    if (!examStarted || showResults) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStarted, showResults, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setExamStarted(true);
    setTimeLeft(EXAM_DURATION);
    setCurrentIdx(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleSubmit = () => {
    let correct = 0;
    shuffledQuestions.forEach((q, i) => {
      const userOriginalIdx = answers[i] !== undefined ? q.options[answers[i]]?.originalIdx : -1;
      if (userOriginalIdx === q.correctAnswer) correct++;
    });
    recordExamScore(correct, shuffledQuestions.length);
    setShowResults(true);
  };

  // Start screen
  if (!examStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4"
              >
                <GraduationCap className="h-10 w-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">{t(lang, "finalExamTitle")}</h1>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                {t(lang, "examInstructions")}
              </p>

              {progress.examScore && (
                <div className="inline-flex items-center gap-2 p-3 rounded-lg bg-card mb-6">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">
                    Last attempt:{" "}
                    <strong>
                      {Math.round((progress.examScore.score / progress.examScore.total) * 100)}%
                    </strong>
                  </span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                <div className="p-4 rounded-lg bg-card">
                  <div className="text-2xl font-bold">{courseData.finalExam.length}</div>
                  <div className="text-xs text-muted-foreground">{t(lang, "questions")}</div>
                </div>
                <div className="p-4 rounded-lg bg-card">
                  <div className="text-2xl font-bold">30:00</div>
                  <div className="text-xs text-muted-foreground">{t(lang, "timeLimit")}</div>
                </div>
                <div className="p-4 rounded-lg bg-card">
                  <div className="text-2xl font-bold">70%</div>
                  <div className="text-xs text-muted-foreground">{t(lang, "passMark")}</div>
                </div>
              </div>

              <Button size="lg" onClick={handleStart} className="gap-2">
                <GraduationCap className="h-5 w-5" />
                {t(lang, "startExam")}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    let correct = 0;
    shuffledQuestions.forEach((q, i) => {
      const userOriginalIdx = answers[i] !== undefined ? q.options[answers[i]]?.originalIdx : -1;
      if (userOriginalIdx === q.correctAnswer) correct++;
    });
    const scorePct = Math.round((correct / shuffledQuestions.length) * 100);
    const passed = scorePct >= 70;

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="overflow-hidden">
            <div className={cn(
              "p-8 text-center text-white",
              passed
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-orange-500 to-red-500"
            )}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4"
              >
                {passed ? <Award className="h-10 w-10" /> : <RotateCcw className="h-10 w-10" />}
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">
                {passed ? t(lang, "examPassed") : t(lang, "examFailed")}
              </h2>
              <div className="text-6xl font-bold mb-2">{scorePct}%</div>
              <p className="text-white/90">
                {correct} out of {shuffledQuestions.length} correct
              </p>
            </div>

            <CardContent className="pt-6">
              {/* Review answers */}
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                {t(lang, "reviewAnswers")}
              </h3>
              <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
                {shuffledQuestions.map((q, qi) => {
                  const userOriginalIdx = answers[qi] !== undefined ? q.options[answers[qi]]?.originalIdx : -1;
                  const isCorrect = userOriginalIdx === q.correctAnswer;
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
                          <div className="text-xs">
                            <div className="text-muted-foreground">
                              Your answer: {answers[qi] !== undefined ? q.options[answers[qi]].text : "Not answered"}
                            </div>
                            {!isCorrect && (
                              <div className="text-green-600 dark:text-green-400 mt-1">
                                Correct: {q.options.find(o => o.originalIdx === q.correctAnswer)?.text}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 italic">{q.explanation}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" onClick={handleStart} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  {t(lang, "retakeExam")}
                </Button>
                {passed && (
                  <Button onClick={() => setView("certificate")} className="gap-2">
                    <Award className="h-4 w-4" />
                    {t(lang, "viewCertificate")}
                  </Button>
                )}
                <Button variant="outline" onClick={() => setView("dashboard")}>
                  {t(lang, "backToLessons")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Exam in progress
  const currentQuestion = shuffledQuestions[currentIdx];
  const progressPct = ((currentIdx + 1) / shuffledQuestions.length) * 100;
  const isLastQuestion = currentIdx === shuffledQuestions.length - 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header with timer */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            {t(lang, "finalExamTitle")}
          </h1>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold",
            timeLeft < 60 ? "bg-red-500/10 text-red-600" : "bg-muted"
          )}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {t(lang, "question")} {currentIdx + 1} {t(lang, "of")} {shuffledQuestions.length}
          </span>
          <Progress value={progressPct} className="h-2 flex-1" />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={String(answers[currentIdx] ?? "")}
                onValueChange={(v) => setAnswers({ ...answers, [currentIdx]: Number(v) })}
                className="space-y-2"
              >
                {currentQuestion.options.map((option, oi) => (
                  <div
                    key={oi}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50",
                      answers[currentIdx] === oi && "border-primary bg-primary/10"
                    )}
                  >
                    <RadioGroupItem value={String(oi)} id={`exam-opt-${oi}`} />
                    <Label htmlFor={`exam-opt-${oi}`} className="text-sm cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="ghost"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                >
                  Previous
                </Button>
                {isLastQuestion ? (
                  <Button onClick={handleSubmit} className="gap-2">
                    {t(lang, "submitExam")}
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    disabled={answers[currentIdx] === undefined}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Question grid */}
      <Card className="mt-4">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {shuffledQuestions.map((_, qi) => (
              <button
                key={qi}
                onClick={() => setCurrentIdx(qi)}
                className={cn(
                  "w-8 h-8 rounded text-xs font-medium transition-all",
                  qi === currentIdx && "bg-primary text-primary-foreground",
                  qi !== currentIdx && answers[qi] !== undefined && "bg-primary/20 text-primary",
                  qi !== currentIdx && answers[qi] === undefined && "bg-muted hover:bg-muted/70"
                )}
              >
                {qi + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
