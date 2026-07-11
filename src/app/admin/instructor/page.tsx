"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Users,
  Search,
  Download,
  AlertTriangle,
  TrendingUp,
  Award,
  Clock,
  GraduationCap,
  Loader2,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  initializeAuth,
  getAllUsersSafe,
  type AuthUser,
} from "@/lib/client-auth";
import { getAllCoursesFromStore, slugify } from "@/lib/course-store";
import { exportRowsToCSV } from "@/lib/csv-export";
import type { CourseData } from "@/lib/types";

type SortKey = "name" | "completion" | "score" | "lastActivity";

interface StudentProgress {
  student: AuthUser;
  coursesEnrolled: number;
  avgCompletion: number;
  avgScore: number;
  lastActivity: string;
  isStruggling: boolean;
}

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

export default function InstructorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [search, setSearch] = useState("");
  const [filterCourseId, setFilterCourseId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("completion");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showStrugglingOnly, setShowStrugglingOnly] = useState(false);

  useEffect(() => {
    initializeAuth();
    const allUsers = getAllUsersSafe().filter((u) => u.role === "STUDENT");
    const allCourses = getAllCoursesFromStore();
    setCourses(allCourses);

    const rows: StudentProgress[] = allUsers.map((student) => {
      const p = readStudentProgress(student.id);
      const enrolledCourses = (student.enrolledCourses || []).length || allCourses.length;
      let totalCompletion = 0;
      let totalScore = 0;
      let scoreCount = 0;
      let courseCount = 0;

      for (const c of allCourses) {
        const cid = slugify(c.title);
        // Apply course filter (only count this course if filter is set)
        if (filterCourseId !== "all" && cid !== filterCourseId) continue;

        const allLessons = c.modules.flatMap((m) => m.lessons);
        if (allLessons.length === 0) continue;
        const completed = allLessons.filter((l) => p?.completedLessons?.includes(l.id)).length;
        totalCompletion += (completed / allLessons.length) * 100;
        courseCount++;

        // Quiz scores for this course
        if (p?.quizScores) {
          for (const [quizId, scores] of Object.entries(p.quizScores)) {
            if (quizId.includes(cid) || quizId.startsWith("lesson-")) {
              const arr = scores as { score: number; total: number }[];
              if (arr.length > 0) {
                const last = arr[arr.length - 1];
                totalScore += (last.score / last.total) * 100;
                scoreCount++;
              }
            }
          }
        }
      }

      const avgCompletion = courseCount > 0 ? Math.round(totalCompletion / courseCount) : 0;
      const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
      const lastActivity = p?.lastActivity || "";
      const isStruggling = avgCompletion < 50 || (scoreCount > 0 && avgScore < 70);

      return {
        student,
        coursesEnrolled: enrolledCourses,
        avgCompletion,
        avgScore,
        lastActivity,
        isStruggling,
      };
    });

    setStudents(rows);
    setLoading(false);
  }, [filterCourseId]);

  const filtered = useMemo(() => {
    let list = students;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.student.name.toLowerCase().includes(q) ||
          s.student.email.toLowerCase().includes(q) ||
          (s.student.department || "").toLowerCase().includes(q)
      );
    }
    if (showStrugglingOnly) {
      list = list.filter((s) => s.isStruggling);
    }
    // Sort
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = a.student.name.localeCompare(b.student.name);
          break;
        case "completion":
          cmp = a.avgCompletion - b.avgCompletion;
          break;
        case "score":
          cmp = a.avgScore - b.avgScore;
          break;
        case "lastActivity":
          cmp = new Date(a.lastActivity || 0).getTime() - new Date(b.lastActivity || 0).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [students, search, showStrugglingOnly, sortBy, sortDir]);

  const stats = useMemo(() => {
    const total = students.length;
    const struggling = students.filter((s) => s.isStruggling).length;
    const avgCompletion = total > 0 ? Math.round(students.reduce((a, s) => a + s.avgCompletion, 0) / total) : 0;
    const avgScore = total > 0 ? Math.round(students.reduce((a, s) => a + s.avgScore, 0) / total) : 0;
    return { total, struggling, avgCompletion, avgScore };
  }, [students]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const handleExport = () => {
    const rows: (string | number)[][] = [
      ["Name", "Email", "Department", "Courses Enrolled", "Avg Completion %", "Avg Quiz Score %", "Last Activity", "Status"],
    ];
    for (const s of filtered) {
      rows.push([
        s.student.name,
        s.student.email,
        s.student.department || "",
        s.coursesEnrolled,
        s.avgCompletion,
        s.avgScore,
        s.lastActivity,
        s.isStruggling ? "Struggling" : "On Track",
      ]);
    }
    exportRowsToCSV(rows, `instructor-dashboard-${Date.now()}.csv`);
    toast.success("Dashboard exported");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor student progress, identify those who need extra help, and export reports.
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-1.5">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-sky-500" />
              <span className="text-xs text-slate-500">Total Students</span>
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-500">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold">{stats.avgCompletion}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-slate-500">Avg Quiz Score</span>
            </div>
            <div className="text-2xl font-bold">{stats.avgScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-slate-500">Need Attention</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.struggling}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCourseId} onValueChange={setFilterCourseId}>
              <SelectTrigger className="md:w-64">
                <Filter className="h-3.5 w-3.5 mr-1" />
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.title} value={slugify(c.title)}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showStrugglingOnly ? "default" : "outline"}
              onClick={() => setShowStrugglingOnly(!showStrugglingOnly)}
              className="gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {showStrugglingOnly ? "Showing: Struggling" : "Show Struggling Only"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            Students ({filtered.length})
          </CardTitle>
          <CardDescription>
            Click column headers to sort. Struggling students have &lt;50% completion or &lt;70% quiz score.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                      Student
                      {sortBy === "name" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </button>
                  </TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>
                    <button onClick={() => toggleSort("completion")} className="flex items-center gap-1 hover:text-foreground">
                      Completion
                      {sortBy === "completion" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => toggleSort("score")} className="flex items-center gap-1 hover:text-foreground">
                      Avg Score
                      {sortBy === "score" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => toggleSort("lastActivity")} className="flex items-center gap-1 hover:text-foreground">
                      Last Active
                      {sortBy === "lastActivity" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-400 py-12">
                      <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      No students match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => (
                    <TableRow key={s.student.id} className={s.isStruggling ? "bg-red-500/5" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                              {s.student.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{s.student.name}</div>
                            <div className="text-xs text-slate-500 truncate">{s.student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{s.student.department || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {s.coursesEnrolled}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${s.avgCompletion < 50 ? "text-red-600" : s.avgCompletion < 80 ? "text-yellow-600" : "text-green-600"}`}>
                            {s.avgCompletion}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${s.avgScore > 0 && s.avgScore < 70 ? "text-red-600" : s.avgScore >= 80 ? "text-green-600" : ""}`}>
                          {s.avgScore > 0 ? `${s.avgScore}%` : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {s.lastActivity ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(s.lastActivity).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="italic">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {s.isStruggling ? (
                          <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30 gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Struggling
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30 gap-1">
                            <TrendingUp className="h-3 w-3" />
                            On Track
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
