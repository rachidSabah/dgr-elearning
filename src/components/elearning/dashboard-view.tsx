"use client";

import { useAppStore } from "@/lib/store";
import { useCurrentCourse, useAllCourses } from "@/lib/use-course";
import { slugify } from "@/lib/courses-registry";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Target,
  Trophy,
  Flame,
  TrendingUp,
  Award,
  Play,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Medal,
  Brain,
  GraduationCap,
  Library,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const achievementInfo: Record<string, { icon: typeof Star; label: string; color: string }> = {
  "first-lesson": { icon: Star, label: "First Lesson", color: "text-blue-500" },
  "five-lessons": { icon: Star, label: "5 Lessons", color: "text-cyan-500" },
  "ten-lessons": { icon: Star, label: "10 Lessons", color: "text-purple-500" },
  "scholar": { icon: GraduationCap, label: "Scholar", color: "text-indigo-500" },
  "first-quiz-pass": { icon: CheckCircle2, label: "Quiz Master", color: "text-green-500" },
  "exam-passed": { icon: Award, label: "Exam Passed", color: "text-yellow-500" },
  "certified": { icon: Medal, label: "Certified", color: "text-orange-500" },
};

export function DashboardView() {
  const { setView, setSelectedLesson, setSelectedCourse, selectedCourseId, progress, studentName, language, startQuiz } = useAppStore();
  const courseData = useCurrentCourse();
  const allCourses = useAllCourses();
  const lang = language || "en";

  const totalLessons = courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completionPct = Math.round((progress.completedLessons.length / totalLessons) * 100);

  // Calculate average quiz score
  const allQuizScores = Object.values(progress.quizScores).flat();
  const avgScore =
    allQuizScores.length > 0
      ? Math.round(
          (allQuizScores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) /
            allQuizScores.length)
        )
      : 0;

  const timeSpentHours = Math.floor(progress.timeSpent / 3600);
  const timeSpentMinutes = Math.floor((progress.timeSpent % 3600) / 60);

  // Find next lesson to continue
  const findNextLesson = () => {
    for (const mod of courseData.modules) {
      for (const lesson of mod.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          return lesson;
        }
      }
    }
    return null;
  };
  const nextLesson = findNextLesson();

  const stats = [
    {
      label: t(lang, "lessonsCompleted"),
      value: `${progress.completedLessons.length}/${totalLessons}`,
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: t(lang, "averageScore"),
      value: `${avgScore}%`,
      icon: Target,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: t(lang, "xpPoints"),
      value: progress.xp,
      icon: Zap,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: t(lang, "learningStreak"),
      value: progress.streak,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t(lang, "welcomeBack")}, {studentName || "Learner"}! 👋
            </h1>
            <p className="text-muted-foreground">
              {progress.completedLessons.length > 0
                ? `${t(lang, "yourProgress")}: ${completionPct}% ${t(lang, "complete")}`
                : "Start your training journey today"}
            </p>
          </div>

          {/* Course selector dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Library className="h-4 w-4" />
              <span>Course:</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 max-w-[260px] justify-between">
                  <span className="truncate">{courseData.title}</span>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {allCourses.map((cd) => {
                  const courseId = slugify(cd.title);
                  const isActive = courseId === selectedCourseId;
                  const courseTotalLessons = cd.modules.reduce(
                    (acc, m) => acc + m.lessons.length,
                    0
                  );
                  const courseCompleted = cd.modules
                    .flatMap((m) => m.lessons)
                    .filter((l) => progress.completedLessons.includes(l.id)).length;
                  return (
                    <DropdownMenuItem
                      key={courseId}
                      onClick={() => setSelectedCourse(courseId)}
                      className={cn(
                        "flex flex-col items-start gap-1 py-2 cursor-pointer",
                        isActive && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium text-sm truncate flex-1">{cd.title}</span>
                        {isActive && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                      </div>
                      <span className="text-xs text-muted-foreground pl-6">
                        {cd.difficulty} • {courseCompleted}/{courseTotalLessons} lessons
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Continue learning section */}
      {nextLesson && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-chart-4/10 to-chart-2/10 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">
                    <Play className="h-3 w-3 mr-1" />
                    {t(lang, "continueWhereYouLeftOff")}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-1">{nextLesson.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {nextLesson.code} • {nextLesson.duration} {t(lang, "minutes")}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {nextLesson.duration} {t(lang, "minutes")}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {nextLesson.objectives.length} objectives
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => setSelectedLesson(nextLesson.id)}
                >
                  {t(lang, "continue")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Course progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t(lang, "yourProgress")}
              </CardTitle>
              <CardDescription>Module-by-module completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseData.modules.map((mod) => {
                const completedInModule = mod.lessons.filter((l) =>
                  progress.completedLessons.includes(l.id)
                ).length;
                const modulePct = Math.round(
                  (completedInModule / mod.lessons.length) * 100
                );
                return (
                  <div key={mod.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: mod.color }}
                        />
                        <span className="text-sm font-medium">
                          {mod.code} - {mod.title}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {completedInModule}/{mod.lessons.length}
                      </span>
                    </div>
                    <Progress value={modulePct} className="h-2" />
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm font-bold">{completionPct}%</span>
                </div>
                <Progress value={completionPct} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                {t(lang, "achievements")}
              </CardTitle>
              <CardDescription>{progress.achievements.length} earned</CardDescription>
            </CardHeader>
            <CardContent>
              {progress.achievements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  Complete lessons and quizzes to earn achievements!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {progress.achievements.map((ach) => {
                    const info = achievementInfo[ach];
                    if (!info) return null;
                    const Icon = info.icon;
                    return (
                      <div
                        key={ach}
                        className="flex flex-col items-center text-center p-3 rounded-lg bg-accent/30"
                      >
                        <Icon className={`h-8 w-8 ${info.color} mb-1`} />
                        <span className="text-xs font-medium">{info.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        <Card
          className="card-hover cursor-pointer"
          onClick={() => setView("flashcards")}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold">{t(lang, "flashcards")}</h3>
              <p className="text-sm text-muted-foreground">{courseData.flashcards.length} cards</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="card-hover cursor-pointer"
          onClick={() => setView("scenarios")}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold">{t(lang, "scenarios")}</h3>
              <p className="text-sm text-muted-foreground">{courseData.scenarios.length} simulations</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="card-hover cursor-pointer"
          onClick={() => setView("aitutor")}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">{t(lang, "aitutor")}</h3>
              <p className="text-sm text-muted-foreground">Ask anything</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Final Exam / Certificate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <Badge className="mb-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
                  <Award className="h-3 w-3 mr-1" />
                  {progress.certificateEarned ? "Certified" : "Get Certified"}
                </Badge>
                <h2 className="text-2xl font-bold mb-1">{t(lang, "finalExamTitle")}</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {courseData.finalExam.length} {t(lang, "questions")} • {t(lang, "passMark")}: 70%
                </p>
                {progress.examScore && (
                  <div className="text-sm">
                    Last score:{" "}
                    <span className={progress.certificateEarned ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {Math.round((progress.examScore.score / progress.examScore.total) * 100)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => setView("exam")}
                >
                  <GraduationCap className="h-5 w-5" />
                  {progress.examScore ? t(lang, "retakeExam") : t(lang, "startFinalExam")}
                </Button>
                {progress.certificateEarned && (
                  <Button
                    variant="outline"
                    onClick={() => setView("certificate")}
                    className="gap-2"
                  >
                    <Award className="h-4 w-4" />
                    {t(lang, "viewCertificate")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Time spent */}
      {(timeSpentHours > 0 || timeSpentMinutes > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <Clock className="inline h-4 w-4 mr-1" />
          Total learning time: {timeSpentHours > 0 && `${timeSpentHours}h `}{timeSpentMinutes}m
        </motion.div>
      )}
    </div>
  );
}
