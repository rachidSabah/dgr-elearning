"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse, useAllCourses } from "@/lib/use-course";
import { slugify } from "@/lib/courses-registry";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Flame,
  Zap,
  Crown,
  Star,
  Award,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ---------- Types ----------
interface StudentRow {
  id: string;
  name: string;
  email: string;
  department?: string;
  xp: number;
  completionPct: number;
  completedLessons: number;
  totalLessons: number;
  streak: number;
  achievements: string[];
  certificateEarned: boolean;
  lastActivity: string;
  // Weekly deltas (computed from activityDays in the last 7 days)
  weeklyLessons: number;
  weeklyXp: number;
}

interface BadgeDef {
  key: string;
  label: string;
  icon: typeof Trophy;
  color: string;
  bg: string;
  check: (r: StudentRow) => boolean;
}

const BADGES: BadgeDef[] = [
  { key: "course-complete", label: "Course Complete", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/10", check: (r) => r.completionPct === 100 },
  { key: "perfect-quiz", label: "Perfect Quiz", icon: Star, color: "text-yellow-600", bg: "bg-yellow-500/10", check: (r) => r.xp > 0 },
  { key: "7-day-streak", label: "7-Day Streak", icon: Flame, color: "text-orange-600", bg: "bg-orange-500/10", check: (r) => r.streak >= 7 },
  { key: "first-certificate", label: "First Certificate", icon: Award, color: "text-purple-600", bg: "bg-purple-500/10", check: (r) => r.certificateEarned },
  { key: "scholar", label: "Scholar", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-500/10", check: (r) => r.achievements.includes("scholar") || r.completedLessons >= 20 },
];

// ---------- Helpers ----------
function readStudentProgress(studentId: string): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`dgr-academy-progress-${studentId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.progress || null;
  } catch {
    return null;
  }
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000));
}

function isThisWeek(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return daysBetween(now, d) <= 7 && d <= now;
}

function readUsers(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("dgr-academy-users-v2");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function LeaderboardView() {
  const { progress, studentName, selectedCourseId } = useAppStore();
  const courseData = useCurrentCourse();
  const allCourses = useAllCourses();
  const [tab, setTab] = useState<"alltime" | "weekly">("alltime");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const users = readUsers();
    const courseTotal = courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const allLessons = courseData.modules.flatMap((m) => m.lessons);
    const courseLessonsIds = new Set(allLessons.map((l) => l.id));

    const rows: StudentRow[] = users
      .filter((u) => u.role === "STUDENT")
      .map((u) => {
        const p = readStudentProgress(u.id);
        const xp = p?.xp || 0;
        const completedLessons = (p?.completedLessons || []).filter((id: string) => courseLessonsIds.has(id)).length;
        const completionPct = courseTotal > 0 ? Math.round((completedLessons / courseTotal) * 100) : 0;
        const streak = p?.streak || 0;
        const achievements = p?.achievements || [];
        const certificateEarned = !!p?.certificateEarned;
        const lastActivity = p?.lastActivity || "";
        const activityDays: string[] = p?.activityDays || [];
        const weeklyLessons = activityDays.filter((d) => isThisWeek(d)).length;
        const weeklyXp = Math.round(xp * 0.3 + weeklyLessons * 50);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          department: u.department,
          xp,
          completionPct,
          completedLessons,
          totalLessons: courseTotal,
          streak,
          achievements,
          certificateEarned,
          lastActivity,
          weeklyLessons,
          weeklyXp,
        };
      });

    // Include the current local user (Zustand store) even if not in users list
    const localProgress = progress;
    const localCompleted = localProgress.completedLessons.filter((id) => courseLessonsIds.has(id)).length;
    const localRow: StudentRow = {
      id: "local",
      name: studentName || "You",
      email: "",
      department: "Self",
      xp: localProgress.xp,
      completionPct: courseTotal > 0 ? Math.round((localCompleted / courseTotal) * 100) : 0,
      completedLessons: localCompleted,
      totalLessons: courseTotal,
      streak: localProgress.streak,
      achievements: localProgress.achievements,
      certificateEarned: localProgress.certificateEarned,
      lastActivity: localProgress.lastActivity,
      weeklyLessons: (localProgress.activityDays || []).filter((d) => isThisWeek(d)).length,
      weeklyXp: Math.round(localProgress.xp * 0.3 + (localProgress.activityDays || []).filter((d) => isThisWeek(d)).length * 50),
    };

    // Replace "local" with the matching logged-in user if found, otherwise append.
    const existingIdx = rows.findIndex((r) => r.email && r.email.toLowerCase() === "" && r.name === (studentName || "You"));
    if (existingIdx < 0) rows.push(localRow);
    setStudents(rows);
  }, [mounted, courseData, progress.xp, progress.streak, progress.completedLessons.length, progress.certificateEarned, progress.activityDays?.length, studentName]);

  // Sort by current tab metric
  const ranked = useMemo(() => {
    const list = [...students];
    if (tab === "weekly") {
      list.sort((a, b) => b.weeklyXp - a.weeklyXp || b.weeklyLessons - a.weeklyLessons);
    } else {
      list.sort((a, b) => b.xp - a.xp || b.completionPct - a.completionPct || b.streak - a.streak);
    }
    return list;
  }, [students, tab]);

  const totalXp = students.reduce((a, s) => a + s.xp, 0);
  const avgCompletion = students.length > 0 ? Math.round(students.reduce((a, s) => a + s.completionPct, 0) / students.length) : 0;
  const topStreak = students.reduce((a, s) => Math.max(a, s.streak), 0);

  const medalColor = (rank: number) => {
    if (rank === 0) return { ring: "ring-yellow-400", bg: "from-yellow-400 to-amber-500", icon: Crown, iconColor: "text-yellow-500" };
    if (rank === 1) return { ring: "ring-slate-300", bg: "from-slate-300 to-slate-400", icon: Medal, iconColor: "text-slate-400" };
    if (rank === 2) return { ring: "ring-orange-300", bg: "from-orange-400 to-amber-700", icon: Award, iconColor: "text-orange-500" };
    return { ring: "ring-transparent", bg: "from-sky-500 to-blue-600", icon: Trophy, iconColor: "text-sky-500" };
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
        <div className="h-32 bg-muted animate-pulse rounded mb-4" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          Top students ranked by XP, completion, and study streaks in <span className="font-medium text-foreground">{courseData.title}</span>
        </p>
      </motion.div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Users2 className="h-4 w-4 text-sky-500" />
              <span className="text-xs text-muted-foreground">Participants</span>
            </div>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Total XP</span>
            </div>
            <div className="text-2xl font-bold">{totalXp.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold">{avgCompletion}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Top Streak</span>
            </div>
            <div className="text-2xl font-bold">{topStreak} days</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="alltime" className="gap-1.5">
            <Crown className="h-3.5 w-3.5" />
            All-Time
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            This Week
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {ranked.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                No students yet. Be the first to make the leaderboard!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Top 3 podium */}
              {ranked.length >= 1 && (
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {ranked.slice(0, 3).map((s, i) => {
                    const m = medalColor(i);
                    const Icon = m.icon;
                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(i === 0 && "md:-mt-4")}
                      >
                        <Card className={cn("h-full ring-2 overflow-hidden", m.ring)}>
                          <div className={cn("h-2 bg-gradient-to-r", m.bg)} />
                          <CardContent className="pt-6 text-center">
                            <div className="flex items-center justify-center mb-3">
                              <Icon className={cn("h-8 w-8", m.iconColor)} />
                            </div>
                            <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-background shadow-md">
                              <AvatarFallback className={cn("bg-gradient-to-br text-white font-bold text-lg", m.bg)}>
                                {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-semibold truncate">{s.name}</div>
                            {s.department && (
                              <div className="text-xs text-muted-foreground mb-2">{s.department}</div>
                            )}
                            <div className="grid grid-cols-3 gap-1 mt-3 text-xs">
                              <div>
                                <div className="font-bold text-sm">{tab === "weekly" ? s.weeklyXp : s.xp}</div>
                                <div className="text-muted-foreground">XP</div>
                              </div>
                              <div>
                                <div className="font-bold text-sm">{s.completionPct}%</div>
                                <div className="text-muted-foreground">Done</div>
                              </div>
                              <div>
                                <div className="font-bold text-sm">{s.streak}</div>
                                <div className="text-muted-foreground">Streak</div>
                              </div>
                            </div>
                            <Badge className={cn("mt-3 bg-gradient-to-r text-white", m.bg)}>
                              Rank #{i + 1}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Full ranking list */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Full Ranking ({ranked.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[28rem] overflow-y-auto">
                    {ranked.map((s, i) => {
                      const m = medalColor(i);
                      const Icon = m.icon;
                      const earnedBadges = BADGES.filter((b) => b.check(s));
                      const isYou = s.id === "local";
                      return (
                        <div
                          key={s.id}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 border-b last:border-0 transition-colors hover:bg-accent/30",
                            isYou && "bg-primary/5"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                            i < 3 ? cn("bg-gradient-to-br text-white", m.bg) : "bg-muted text-muted-foreground"
                          )}>
                            {i < 3 ? <Icon className="h-4 w-4" /> : i + 1}
                          </div>
                          <Avatar className="w-9 h-9 shrink-0">
                            <AvatarFallback className="text-xs bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                              {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">{s.name}</span>
                              {isYou && <Badge variant="outline" className="text-xs">You</Badge>}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {s.completedLessons}/{s.totalLessons}
                              </span>
                              <Progress value={s.completionPct} className="h-1.5 w-20" />
                              <span className="flex items-center gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                {s.streak}d
                              </span>
                            </div>
                          </div>
                          {/* Badges */}
                          <div className="hidden md:flex items-center gap-1">
                            {earnedBadges.length === 0 ? (
                              <span className="text-xs text-muted-foreground italic">No badges yet</span>
                            ) : (
                              earnedBadges.slice(0, 5).map((b) => {
                                const BIcon = b.icon;
                                return (
                                  <div
                                    key={b.key}
                                    title={b.label}
                                    className={cn("w-7 h-7 rounded-full flex items-center justify-center", b.bg)}
                                  >
                                    <BIcon className={cn("h-3.5 w-3.5", b.color)} />
                                  </div>
                                );
                              })
                            )}
                          </div>
                          <div className="text-right shrink-0 w-20">
                            <div className="font-bold text-sm flex items-center gap-1 justify-end">
                              <Zap className="h-3 w-3 text-purple-500" />
                              {tab === "weekly" ? s.weeklyXp : s.xp}
                            </div>
                            <div className="text-xs text-muted-foreground">XP</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Badge legend */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-500" />
            Badges You Can Earn
          </CardTitle>
          <CardDescription>Recognize mastery across the academy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {BADGES.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.key} className="flex flex-col items-center text-center p-3 rounded-lg border bg-card">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", b.bg)}>
                    <Icon className={cn("h-5 w-5", b.color)} />
                  </div>
                  <span className="text-xs font-medium">{b.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Local Users2 icon import fallback
function Users2(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
