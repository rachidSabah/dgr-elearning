"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Search,
  BookOpen,
  BookMarked,
  Brain,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse, useAllCourses } from "@/lib/use-course";
import { slugify } from "@/lib/course-store";
import { cn } from "@/lib/utils";
import type { CourseData } from "@/lib/types";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
type ResultType = "lesson" | "glossary" | "flashcard";

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  courseId: string;
  courseTitle: string;
  // navigation payload
  lessonId?: string;
  // ranking
  score: number;
}

// ------------------------------------------------------------
// Search logic
// ------------------------------------------------------------
function buildIndex(courses: CourseData[]): SearchResult[] {
  const out: SearchResult[] = [];
  for (const course of courses) {
    const courseId = slugify(course.title);
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        out.push({
          id: `lesson:${courseId}:${lesson.id}`,
          type: "lesson",
          title: lesson.title,
          subtitle: `${mod.code} ${mod.title} · ${lesson.code}`,
          courseId,
          courseTitle: course.title,
          lessonId: lesson.id,
          score: 0,
        });
      }
    }
    for (const term of course.glossary || []) {
      out.push({
        id: `glossary:${courseId}:${term.term}`,
        type: "glossary",
        title: term.term,
        subtitle: term.definition,
        courseId,
        courseTitle: course.title,
        score: 0,
      });
    }
    for (const card of course.flashcards || []) {
      out.push({
        id: `flashcard:${courseId}:${card.id}`,
        type: "flashcard",
        title: card.front,
        subtitle: card.back,
        courseId,
        courseTitle: course.title,
        score: 0,
      });
    }
  }
  return out;
}

function rankResult(result: SearchResult, q: string): number {
  const query = q.toLowerCase();
  const title = result.title.toLowerCase();
  const subtitle = result.subtitle.toLowerCase();
  let score = 0;
  if (title === query) score += 100;
  else if (title.startsWith(query)) score += 60;
  else if (title.includes(query)) score += 40;
  if (subtitle.includes(query)) score += 10;
  // Boost lessons slightly over glossary/flashcards when scores tie
  if (result.type === "lesson") score += 2;
  return score;
}

function search(index: SearchResult[], query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const matches: SearchResult[] = [];
  for (const r of index) {
    const score = rankResult(r, q);
    if (score > 0) {
      matches.push({ ...r, score });
    }
  }
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 30);
}

// ------------------------------------------------------------
// Grouped results (preserves ranking within each group)
// ------------------------------------------------------------
interface GroupedResults {
  lessons: SearchResult[];
  glossary: SearchResult[];
  flashcards: SearchResult[];
}

function groupResults(results: SearchResult[]): GroupedResults {
  const groups: GroupedResults = { lessons: [], glossary: [], flashcards: [] };
  for (const r of results) {
    if (r.type === "lesson") groups.lessons.push(r);
    else if (r.type === "glossary") groups.glossary.push(r);
    else if (r.type === "flashcard") groups.flashcards.push(r);
  }
  return groups;
}

// ------------------------------------------------------------
// Icons per result type
// ------------------------------------------------------------
const typeIcon: Record<ResultType, React.ComponentType<{ className?: string }>> = {
  lesson: BookOpen,
  glossary: BookMarked,
  flashcard: Brain,
};

const typeLabel: Record<ResultType, string> = {
  lesson: "Lessons",
  glossary: "Glossary",
  flashcard: "Flashcards",
};

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement | null>(null);

  const currentCourse = useCurrentCourse();
  const allCourses = useAllCourses();
  const setSelectedLesson = useAppStore((s) => s.setSelectedLesson);
  const setSelectedCourse = useAppStore((s) => s.setSelectedCourse);
  const setView = useAppStore((s) => s.setView);

  // Build the search index across all courses (memoised)
  const index = useMemo(() => buildIndex(allCourses), [allCourses]);

  // Filtered results
  const results = useMemo(() => search(index, query), [index, query]);
  const grouped = useMemo(() => groupResults(results), [results]);

  // Flatten results in display order for keyboard nav
  const flatResults = useMemo(
    () => [...grouped.lessons, ...grouped.glossary, ...grouped.flashcards],
    [grouped]
  );

  // Reset active index when the result set changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Listen for "open-search" custom event (dispatched by KeyboardShortcuts)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-search", handler);
    return () => window.removeEventListener("open-search", handler);
  }, []);

  // Global "/" shortcut to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      e.preventDefault();
      setOpen(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Auto-focus the search input when the dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Defer focus until after the dialog animates open
      const t = window.setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => setQuery(""), 200);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Scroll the active result into view during keyboard navigation
  useEffect(() => {
    if (!open || flatResults.length === 0) return;
    const container = resultsContainerRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>(
      `[data-result-index="${activeIndex}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open, flatResults.length]);

  // Navigate to a result
  const navigateTo = useCallback(
    (result: SearchResult) => {
      // Switch course first if the result is from a different course
      if (result.courseId && result.courseId !== slugify(currentCourse.title)) {
        setSelectedCourse(result.courseId);
      }
      if (result.type === "lesson" && result.lessonId) {
        setSelectedLesson(result.lessonId);
      } else if (result.type === "glossary") {
        setView("glossary");
      } else if (result.type === "flashcard") {
        setView("flashcards");
      }
      setOpen(false);
    },
    [currentCourse.title, setSelectedCourse, setSelectedLesson, setView]
  );

  // Keyboard navigation inside the dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (flatResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = flatResults[activeIndex];
      if (r) navigateTo(r);
    }
  };

  const hasResults = flatResults.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Global Search</DialogTitle>
          <DialogDescription>
            Search across all courses, lessons, glossary terms, and flashcards.
          </DialogDescription>
        </DialogHeader>

        {/* Search input row */}
        <div className="relative border-b">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search lessons, glossary, flashcards…  (press / to open, esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-14 rounded-none border-0 pl-11 pr-11 text-base shadow-none focus-visible:ring-0"
            aria-label="Global search"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div
          ref={resultsContainerRef}
          className="max-h-[60vh] overflow-y-auto p-2"
        >
          {!query.trim() ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              Start typing to search across all courses.
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                <Badge variant="secondary" className="gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" />
                  navigate
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <CornerDownLeft className="h-3 w-3" />
                  select
                </Badge>
                <Badge variant="secondary">esc to close</Badge>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-4">
              {(["lesson", "glossary", "flashcard"] as ResultType[]).map(
                (type) => {
                  const group =
                    type === "lesson"
                      ? grouped.lessons
                      : type === "glossary"
                      ? grouped.glossary
                      : grouped.flashcards;
                  if (group.length === 0) return null;
                  const Icon = typeIcon[type];
                  return (
                    <div key={type}>
                      <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        {typeLabel[type]}
                        <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                          {group.length}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {group.map((r) => {
                          const flatIdx = flatResults.indexOf(r);
                          const active = flatIdx === activeIndex;
                          const ItemIcon = typeIcon[r.type];
                          return (
                            <button
                              key={r.id}
                              type="button"
                              data-result-index={flatIdx}
                              onMouseMove={() => setActiveIndex(flatIdx)}
                              onClick={() => navigateTo(r)}
                              className={cn(
                                "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                                active
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-accent/50"
                              )}
                            >
                              <ItemIcon
                                className={cn(
                                  "mt-0.5 h-4 w-4 shrink-0",
                                  active ? "text-primary" : "text-muted-foreground"
                                )}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">
                                  {r.title}
                                </div>
                                <div className="truncate text-xs text-muted-foreground">
                                  {r.subtitle}
                                </div>
                              </div>
                              <span className="shrink-0 rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                {r.courseTitle}
                              </span>
                              {active && (
                                <CornerDownLeft className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>
            Searching{" "}
            <strong className="text-foreground">
              {allCourses.length}
            </strong>{" "}
            course{allCourses.length === 1 ? "" : "s"}
          </span>
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              open
            </span>
            <span>esc to close</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
