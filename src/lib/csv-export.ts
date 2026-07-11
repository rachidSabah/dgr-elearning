"use client";

// ============================================================
// CSV Export Utilities
// Generates CSV strings from platform data and triggers browser
// download. Works on static hosting — no server roundtrip needed.
// ============================================================

import type { CourseData, ProgressState } from "./types";
import { getAllUsersSafe } from "./client-auth";
import { getAllCoursesFromStore, slugify } from "./course-store";

// ---------- CSV escaping ----------

/**
 * Escape a single CSV cell.
 * Wraps the value in double quotes and doubles any internal quotes.
 * Handles commas, quotes, and newlines per RFC 4180.
 */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str = typeof value === "string" ? value : String(value);
  // Normalize newlines to \n inside quoted cells
  str = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(",")).join("\r\n");
}

function triggerDownload(csv: string, filename: string) {
  if (typeof window === "undefined") return;
  // Prepend BOM so Excel reads UTF-8 correctly
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

// ---------- Public API ----------

/**
 * Export all platform users with their role, status, and last login.
 */
export function exportUsersToCSV(): void {
  const users = getAllUsersSafe();
  const rows: (string | number)[][] = [
    ["ID", "Name", "Email", "Role", "Department", "Status", "Last Login", "Created At", "Enrolled Courses"],
  ];
  for (const u of users) {
    rows.push([
      u.id,
      u.name,
      u.email,
      u.role,
      u.department || "",
      u.isActive ? "Active" : "Suspended",
      formatDate(u.lastLogin),
      formatDate(u.createdAt),
      (u.enrolledCourses || []).join("; "),
    ]);
  }
  const csv = buildCsv(rows);
  triggerDownload(csv, `dgr-academy-users-${Date.now()}.csv`);
}

/**
 * Export student progress per course.
 * Reads the shared progress state from localStorage (dgr-elearning-storage).
 */
export function exportProgressToCSV(): void {
  const courses = getAllCoursesFromStore();
  const users = getAllUsersSafe();
  const students = users.filter((u) => u.role === "STUDENT");

  // Each student's progress is stored separately under a per-user key
  // so we collect all of them. We also include the current (anonymous)
  // progress from the Zustand store for users not logged in.
  const rows: (string | number)[][] = [
    ["Student ID", "Student Name", "Email", "Course ID", "Course Title", "Lessons Completed", "Total Lessons", "Completion %", "XP", "Streak", "Avg Quiz Score %", "Certificate Earned"],
  ];

  const readProgress = (studentId: string): ProgressState | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`dgr-academy-progress-${studentId}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.state?.progress as ProgressState | undefined;
    } catch {
      return null;
    }
  };

  for (const student of students) {
    const progress = readProgress(student.id);
    if (!progress) {
      // Still list the student with zero progress
      for (const c of courses) {
        const courseId = slugify(c.title);
        const total = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        rows.push([student.id, student.name, student.email, courseId, c.title, 0, total, 0, 0, 0, 0, "No"]);
      }
      continue;
    }

    for (const c of courses) {
      const courseId = slugify(c.title);
      const allLessons = c.modules.flatMap((m) => m.lessons);
      const total = allLessons.length;
      const completed = allLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      const allScores = Object.values(progress.quizScores || {}).flat();
      const avg =
        allScores.length > 0
          ? Math.round((allScores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / allScores.length))
          : 0;
      rows.push([
        student.id,
        student.name,
        student.email,
        courseId,
        c.title,
        completed,
        total,
        pct,
        progress.xp || 0,
        progress.streak || 0,
        avg,
        progress.certificateEarned ? "Yes" : "No",
      ]);
    }
  }

  const csv = buildCsv(rows);
  triggerDownload(csv, `dgr-academy-progress-${Date.now()}.csv`);
}

// Course recurrency: DGR = 2 years, First Aid = 1 year
function getCourseValidityYears(courseId: string, courseTitle: string): number {
  const title = courseTitle.toLowerCase();
  if (title.includes("first aid") || courseId.includes("first-aid")) return 1;
  return 2; // DGR and all other courses default to 2 years
}

export interface ComplianceRow {
  studentId: string;
  studentName: string;
  email: string;
  courseId: string;
  courseTitle: string;
  completionDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: "Valid" | "Expiring Soon" | "Expired" | "Not Started";
}

export function computeComplianceRows(): ComplianceRow[] {
  const courses = getAllCoursesFromStore();
  const users = getAllUsersSafe();
  const students = users.filter((u) => u.role === "STUDENT");

  const rows: ComplianceRow[] = [];
  const now = new Date();
  const DAY = 24 * 60 * 60 * 1000;

  const readExamDate = (studentId: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`dgr-academy-progress-${studentId}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const progress = parsed?.state?.progress as ProgressState | undefined;
      if (progress?.examScore?.date && progress.certificateEarned) {
        return progress.examScore.date;
      }
      return null;
    } catch {
      return null;
    }
  };

  for (const student of students) {
    for (const c of courses) {
      const courseId = slugify(c.title);
      const years = getCourseValidityYears(courseId, c.title);
      const completionISO = readExamDate(student.id);
      if (!completionISO) {
        rows.push({
          studentId: student.id,
          studentName: student.name,
          email: student.email,
          courseId,
          courseTitle: c.title,
          completionDate: "",
          expiryDate: "",
          daysRemaining: 0,
          status: "Not Started",
        });
        continue;
      }
      const completionDate = new Date(completionISO);
      const expiryDate = new Date(completionDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + years);
      const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / DAY);
      let status: ComplianceRow["status"] = "Valid";
      if (daysRemaining < 0) status = "Expired";
      else if (daysRemaining < 30) status = "Expiring Soon";
      rows.push({
        studentId: student.id,
        studentName: student.name,
        email: student.email,
        courseId,
        courseTitle: c.title,
        completionDate: formatDate(completionISO),
        expiryDate: expiryDate.toISOString().slice(0, 10),
        daysRemaining,
        status,
      });
    }
  }

  return rows;
}

/**
 * Export compliance / recurrency status for every student across every course.
 */
export function exportComplianceToCSV(): void {
  const rows = computeComplianceRows();
  const csvRows: (string | number)[][] = [
    ["Student ID", "Student Name", "Email", "Course ID", "Course Title", "Completion Date", "Expiry Date", "Days Remaining", "Status"],
  ];
  for (const r of rows) {
    csvRows.push([
      r.studentId,
      r.studentName,
      r.email,
      r.courseId,
      r.courseTitle,
      r.completionDate,
      r.expiryDate,
      r.daysRemaining,
      r.status,
    ]);
  }
  const csv = buildCsv(csvRows);
  triggerDownload(csv, `dgr-academy-compliance-${Date.now()}.csv`);
}

/**
 * Export an arbitrary list of rows (used by the instructor dashboard).
 */
export function exportRowsToCSV(rows: (string | number)[][], filename: string): void {
  const csv = buildCsv(rows);
  triggerDownload(csv, filename);
}

/** Re-exported for components that need course list + slug helper. */
export function getCoursesForExport(): CourseData[] {
  return getAllCoursesFromStore();
}
export { slugify };
