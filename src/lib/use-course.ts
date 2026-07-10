"use client";

import { useAppStore } from "./store";
import { allCourses, slugify, getDefaultCourse } from "./courses-registry";
import type { CourseData } from "./types";

// Hook to get the currently selected course
export function useCurrentCourse(): CourseData {
  const selectedCourseId = useAppStore((s) => s.selectedCourseId);
  const course = allCourses.find((c) => slugify(c.title) === selectedCourseId);
  return course || getDefaultCourse();
}

// Hook to get all available courses
export function useAllCourses() {
  return allCourses;
}
