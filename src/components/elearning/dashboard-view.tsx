"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse, useAllCourses } from "@/lib/use-course";
import { slugify } from "@/lib/courses-registry";
import { COURSE_PREREQUISITES } from "@/lib/types";
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
  Lock,
  AlertCircle,
  Calendar,
  Target as TargetIcon,
  Edit3,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { setView, setSelectedLesson, setSelectedCourse, selectedCourseId, progress, studentName, language, startQuiz, setDailyGoal, checkPrerequisite } = useAppStore();
  const courseData = useCurrentCourse();
  const allCourses = useAllCourses();
  const lang = language || "en";

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [goalInput, setGoalInput] = useState(String(progress.dailyGoal || 2));

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

  // ---- Days since last activity ----
  const daysSinceActivity = useMemo(() => {
    if (!progress.lastActivity) return 0;
    const last = new Date(progress.lastActivity);
    if (isNaN(last.getTime())) return 0;
    const now = new Date();
    // Normalize both to midnight
    const lastMid = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();
    const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return Math.floor((nowMid - lastMid) / (1000 * 60 * 60 * 24));
  }, [progress.lastActivity]);

  const showReminder = daysSinceActivity > 3;

  // ---- Streak calendar (last 30 days) ----
  const streakCalendar = useMemo(() => {
    const days: { date: Date; iso: string; active: boolean }[] = [];
    const activitySet = new Set(progress.activityDays || []);
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      days.push({ date: d, iso, active: activitySet.has(iso) });
    }
    return days;
  }, [progress.activityDays]);

  const activeDaysInLast30 = streakCalendar.filter((d) => d.active).length;
  const todayGoal = progress.dailyGoal || 0;
  // Count today's completed lessons: not perfectly tracked per day; approximate via activityDays including today + already-completed count delta
  const studiedToday = (progress.activityDays || []).includes(new Date().toISOString().slice(0, 10));

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
                  const prereqs = COURSE_PREREQUISITES[courseId] || [];
                  const missingPrereqs = prereqs.filter((p) => !(progress.completedCourses || []).includes(p));
                  const isLocked = missingPrereqs.length > 0;
                  return (
                    <DropdownMenuItem
                      key={courseId}
                      onClick={() => !isLocked && setSelectedCourse(courseId)}
                      disabled={isLocked}
                      className={cn(
                        "flex flex-col items-start gap-1 py-2",
                        isActive && !isLocked && "bg-accent",
                        isLocked && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-amber-500 shrink-0" />
                        ) : (
                          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                        )}
                        <span className="font-medium text-sm truncate flex-1">{cd.title}</span>
                        {isActive && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                        {isLocked && (
                          <Badge variant="outline" className="text-[10px] gap-0.5 px-1 py-0">
                            <Lock className="h-2.5 w-2.5" />
                            Locked
                          </Badge>
                        )}
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

      {/* Daily reminder + streak calendar + daily goal */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {/* Reminder banner */}
        {showReminder ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                  You haven&apos;t studied in {daysSinceActivity} day{daysSinceActivity === 1 ? "" : "s"}. Keep your streak going!
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Consistency is the key to mastery. Pick up where you left off below.
                </div>
              </div>
              {nextLesson && (
                <Button size="sm" variant="outline" onClick={() => setSelectedLesson(nextLesson.id)} className="shrink-0 gap-1.5">
                  <Play className="h-3.5 w-3.5" />
                  Resume
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <Flame className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  {progress.streak > 0
                    ? `${progress.streak}-day streak — keep it up!`
                    : "Welcome back — ready to start a new streak?"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {studiedToday
                    ? "Great work studying today. Come back tomorrow to extend your streak."
                    : "Complete a lesson today to maintain your streak."}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily goal widget */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TargetIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Daily Goal</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setGoalInput(String(progress.dailyGoal || 2)); setGoalDialogOpen(true); }}>
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {todayGoal > 0 ? (
              <>
                <div className="text-2xl font-bold">{todayGoal} <span className="text-sm font-normal text-muted-foreground">lessons/day</span></div>
                <Progress value={studiedToday ? 100 : 0} className="h-2 mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {studiedToday ? "Goal met for today ✓" : "0 lessons today"}
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">No daily goal set</div>
                <Button size="sm" variant="outline" className="mt-2 w-full gap-1.5" onClick={() => { setGoalInput("2"); setGoalDialogOpen(true); }}>
                  <TargetIcon className="h-3.5 w-3.5" />
                  Set a goal
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Streak calendar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            Last 30 Days
          </CardTitle>
          <CardDescription>
            {activeDaysInLast30} active day{activeDaysInLast30 === 1 ? "" : "s"} in the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {streakCalendar.map((d, i) => (
              <div
                key={i}
                title={`${d.iso}${d.active ? " — Active" : ""}`}
                className={cn(
                  "w-6 h-6 rounded-md transition-all hover:scale-110",
                  d.active
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm"
                    : "bg-muted",
                  i === streakCalendar.length - 1 && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
            <span>30 days ago</span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-emerald-500" />
              = studied
            </span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

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

      {/* Daily goal dialog */}
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Daily Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="goal-input">Lessons per day</Label>
            <Input
              id="goal-input"
              type="number"
              min={1}
              max={20}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll celebrate when you reach your goal each day. Recommended: 1-3 lessons for steady progress.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const n = Math.max(1, Math.min(20, parseInt(goalInput) || 2));
              setDailyGoal(n);
              setGoalDialogOpen(false);
            }}>Save Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
