"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  FileEdit,
  BookOpen,
  FolderTree,
  FileText,
  AlertCircle,
  ServerOff,
  RefreshCw,
} from "lucide-react";
import { initializeAuth } from "@/lib/client-auth";
import { allCourses } from "@/lib/courses-registry";
import { toast } from "sonner";

interface CourseLite {
  id: string;
  title: string;
  slug: string;
}

interface ModuleLite {
  id: string;
  courseId: string;
  title: string;
  code: string | null;
  lessonsCount: number;
}

interface LessonLite {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  code: string | null;
  duration: number;
}

// ---------- localStorage helpers ----------
const LESSONS_KEY = "dgr-academy-lessons-data";

function loadLessonsFromStorage(): LessonLite[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LESSONS_KEY);
  if (!data) {
    const initial: LessonLite[] = [];
    allCourses.forEach((c, cIdx) => {
      const courseId = `course-${cIdx + 1}`;
      c.modules.forEach((m) => {
        m.lessons.forEach((l) => {
          initial.push({
            id: `lesson-${courseId}-${l.id}`,
            moduleId: `module-${courseId}-${m.id}`,
            courseId,
            title: l.title,
            code: l.code,
            duration: l.duration,
          });
        });
      });
    });
    localStorage.setItem(LESSONS_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default function ContentEditorPage() {
  const [courses, setCourses] = useState<CourseLite[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [lessons, setLessons] = useState<LessonLite[]>([]);

  useEffect(() => {
    initializeAuth();
    const list: CourseLite[] = allCourses.map((c, idx) => ({
      id: `course-${idx + 1}`,
      title: c.title,
      slug: c.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    }));
    setCourses(list);
    if (list.length > 0) setSelectedCourseId(list[0].id);
    setLessons(loadLessonsFromStorage());
  }, []);

  const modules: ModuleLite[] = useMemo(() => {
    if (!selectedCourseId) return [];
    const cIdx = parseInt(selectedCourseId.replace("course-", ""), 10) - 1;
    const c = allCourses[cIdx];
    if (!c) return [];
    return c.modules.map((m) => ({
      id: `module-${selectedCourseId}-${m.id}`,
      courseId: selectedCourseId,
      title: m.title,
      code: m.code,
      lessonsCount: m.lessons.length,
    }));
  }, [selectedCourseId]);

  const courseLessons = lessons.filter((l) => l.courseId === selectedCourseId);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleReload = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LESSONS_KEY);
    }
    setLessons(loadLessonsFromStorage());
    toast.success("Lessons reloaded from registry");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Content Editor
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse course lessons and structure. Full content editing requires the
          development server.
        </p>
      </div>

      {/* Static hosting notice */}
      <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <ServerOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Course content is managed through code files in this deployment
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              Course management requires a server runtime. In the current static
              deployment, courses are managed through code files in
              <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded mx-1">
                src/lib/
              </code>
              . Use the development server (
              <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded mx-1">
                bun run dev
              </code>
              ) for full CMS functionality including content block editing,
              quiz creation, and key terms management.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Course selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">
                Select Course
              </Label>
              <Select
                value={selectedCourseId}
                onValueChange={(v) => setSelectedCourseId(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleReload} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload from registry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course overview */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-sky-600" />
              </span>
              {selectedCourse.title}
            </CardTitle>
            <CardDescription>
              {modules.length} modules · {courseLessons.length} lessons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {modules.map((m) => {
              const moduleLessons = courseLessons.filter(
                (l) => l.moduleId === m.id,
              );
              return (
                <div
                  key={m.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                      <FolderTree className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {m.code && (
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {m.code}
                          </Badge>
                        )}
                        <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                          {m.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {moduleLessons.length} lessons
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {moduleLessons.length === 0 ? (
                      <div className="p-3 text-sm text-slate-400 italic">
                        No lessons in this module
                      </div>
                    ) : (
                      moduleLessons.map((l) => (
                        <div
                          key={l.id}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {l.code && (
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs"
                                >
                                  {l.code}
                                </Badge>
                              )}
                              <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {l.title}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500">
                            {l.duration} min
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Notice */}
      <Card>
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0">
            <FileEdit className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              About this read-only view
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              The full content editor (with rich content blocks, quizzes, key
              terms, and review questions) requires the development server with
              API routes and Prisma. On Cloudflare Pages static hosting, lesson
              content is defined in TypeScript files in{" "}
              <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">
                src/lib/course-data.ts
              </code>{" "}
              and{" "}
              <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">
                src/lib/first-aid-course-data.ts
              </code>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
