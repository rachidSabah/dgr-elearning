"use client";

import type { CourseData } from "./types";
import { courseData as dgrCourse } from "./course-data";
import { firstAidCourseData as faCourse } from "./first-aid-course-data";

// ============================================================
// UNIFIED COURSE STORE
// This is the SINGLE source of truth for courses on the platform.
// Admin edits write here. Student site reads from here.
// Works on static hosting (Cloudflare Pages) using localStorage.
// ============================================================

const COURSES_KEY = "dgr-academy-courses-v1";
const DEFAULT_COURSES: CourseData[] = [dgrCourse, faCourse];

// Get all courses from localStorage, seeded with defaults
export function getAllCoursesFromStore(): CourseData[] {
  if (typeof window === "undefined") return DEFAULT_COURSES;

  const stored = localStorage.getItem(COURSES_KEY);
  if (!stored) {
    // First time: seed with default courses
    localStorage.setItem(COURSES_KEY, JSON.stringify(DEFAULT_COURSES));
    return DEFAULT_COURSES;
  }

  try {
    const courses = JSON.parse(stored) as CourseData[];
    if (!Array.isArray(courses) || courses.length === 0) {
      localStorage.setItem(COURSES_KEY, JSON.stringify(DEFAULT_COURSES));
      return DEFAULT_COURSES;
    }
    return courses;
  } catch {
    return DEFAULT_COURSES;
  }
}

// Save all courses to localStorage
export function saveAllCoursesToStore(courses: CourseData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

// Get a single course by slug
export function getCourseFromStore(courseId: string): CourseData | null {
  const courses = getAllCoursesFromStore();
  return courses.find((c) => slugify(c.title) === courseId) || null;
}

// Create a new course
export function createCourseInStore(course: CourseData): { success: boolean; error?: string } {
  const courses = getAllCoursesFromStore();
  if (courses.find((c) => slugify(c.title) === slugify(course.title))) {
    return { success: false, error: "A course with this title already exists" };
  }
  courses.push(course);
  saveAllCoursesToStore(courses);
  return { success: true };
}

// Update an existing course
export function updateCourseInStore(courseId: string, updates: Partial<CourseData>): { success: boolean; error?: string } {
  const courses = getAllCoursesFromStore();
  const idx = courses.findIndex((c) => slugify(c.title) === courseId);
  if (idx < 0) return { success: false, error: "Course not found" };

  courses[idx] = { ...courses[idx], ...updates };
  saveAllCoursesToStore(courses);
  return { success: true };
}

// Delete a course
export function deleteCourseFromStore(courseId: string): { success: boolean; error?: string } {
  const courses = getAllCoursesFromStore();
  const filtered = courses.filter((c) => slugify(c.title) !== courseId);
  if (filtered.length === courses.length) {
    return { success: false, error: "Course not found" };
  }
  saveAllCoursesToStore(filtered);
  return { success: true };
}

// Reset to defaults (admin "reset" button)
export function resetCoursesToDefaults() {
  if (typeof window === "undefined") return;
  localStorage.setItem(COURSES_KEY, JSON.stringify(DEFAULT_COURSES));
}

// Generate a slug from a title
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Create a blank course template for the admin
export function createBlankCourse(data: {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  color: string;
  icon: string;
}): CourseData {
  return {
    title: data.title,
    subtitle: "New Course",
    description: data.description,
    edition: "Edition 2024",
    duration: data.duration,
    difficulty: data.difficulty,
    instructor: "Aviation Training Authority",
    objectives: [
      `Understand the key concepts of ${data.title}`,
      "Apply safety procedures in accordance with regulations",
      "Demonstrate practical competency in core skills",
    ],
    modules: [
      {
        id: `mod-${Date.now()}`,
        code: "1",
        title: "Introduction",
        description: `Introduction to ${data.title}`,
        icon: data.icon || "BookOpen",
        color: data.color || "#0ea5e9",
        lessons: [
          {
            id: `lesson-${Date.now()}`,
            moduleId: `mod-${Date.now()}`,
            code: "1.1",
            title: "Course Overview",
            duration: 15,
            objectives: ["Understand the course structure and learning objectives"],
            content: [
              { type: "paragraph", text: `Welcome to ${data.title}. This course covers ${data.description}.` },
              { type: "callout", variant: "info", title: "Course Information", text: `Category: ${data.category} | Duration: ${data.duration} minutes | Level: ${data.difficulty}` },
            ],
            summary: ["Course overview and structure", "Learning objectives", "Assessment requirements"],
            reviewQuestions: ["What is this course about?", "What are the learning objectives?"],
          },
        ],
      },
    ],
    quizzes: {},
    moduleQuizzes: {},
    finalExam: [],
    flashcards: [],
    scenarios: [],
    glossary: [],
    faq: [
      { question: `What is ${data.title}?`, answer: data.description },
    ],
    testimonials: [],
  };
}
