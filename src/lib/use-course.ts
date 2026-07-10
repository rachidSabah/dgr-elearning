"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "./store";
import { getAllCoursesFromStore, slugify } from "./course-store";
import type { CourseData } from "./types";

// Hook to get the currently selected course
export function useCurrentCourse(): CourseData {
  const selectedCourseId = useAppStore((s) => s.selectedCourseId);
  const [course, setCourse] = useState<CourseData | null>(null);

  useEffect(() => {
    const courses = getAllCoursesFromStore();
    const found = courses.find((c) => slugify(c.title) === selectedCourseId);
    setCourse(found || courses[0]);
  }, [selectedCourseId]);

  // Fallback while loading
  if (!course) {
    const courses = getAllCoursesFromStore();
    return courses[0];
  }

  return course;
}

// Hook to get all available courses (from localStorage = admin-managed)
export function useAllCourses(): CourseData[] {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const refreshTrigger = useAppStore((s) => s.selectedCourseId);

  useEffect(() => {
    setCourses(getAllCoursesFromStore());
  }, [refreshTrigger]);

  // If empty, get synchronously (for initial render)
  if (courses.length === 0) {
    return getAllCoursesFromStore();
  }

  return courses;
}

// Force a refresh of courses across all components
export function useCourseRefresh() {
  const [, setTick] = useState(0);
  const refresh = useCallback(() => {
    setTick((t) => t + 1);
    // Dispatch a custom event so other components can react
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("courses-updated"));
    }
  }, []);

  return refresh;
}
