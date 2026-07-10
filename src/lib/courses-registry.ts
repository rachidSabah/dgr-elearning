import type { CourseData } from "./types";
import { courseData } from "./course-data";
import { firstAidCourseData } from "./first-aid-course-data";

// Registry of all available courses in the academy
// New courses can be added here without changing the platform code
export const allCourses: CourseData[] = [
  courseData,
  firstAidCourseData,
];

// Get a course by its ID (derived from title slug)
export function getCourseById(courseId: string): CourseData | null {
  const course = allCourses.find((c) => slugify(c.title) === courseId);
  return course || null;
}

// Get the default/first course
export function getDefaultCourse(): CourseData {
  return allCourses[0];
}

// Generate a slug from a course title
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Get course IDs
export const courseIds = allCourses.map((c) => slugify(c.title));
