"use client";

// ============================================================
// Ratings & Reviews store (localStorage based)
// Storage key: dgr-academy-ratings
// ============================================================

export interface Rating {
  id: string;
  courseId: string;
  studentName: string;
  rating: number; // 1-5
  review?: string;
  timestamp: string; // ISO
}

const KEY = "dgr-academy-ratings";

function readAll(): Rating[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(ratings: Rating[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(ratings));
  // Notify listeners
  window.dispatchEvent(new CustomEvent("dgr-ratings-updated"));
}

export function addRating(courseId: string, rating: number, review?: string, studentName?: string): Rating {
  const all = readAll();
  const entry: Rating = {
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    courseId,
    studentName: studentName || "Anonymous",
    rating: Math.max(1, Math.min(5, Math.round(rating))),
    review: review?.trim() ? review.trim() : undefined,
    timestamp: new Date().toISOString(),
  };
  all.push(entry);
  writeAll(all);
  return entry;
}

export function getRatings(courseId: string): Rating[] {
  return readAll()
    .filter((r) => r.courseId === courseId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getAverageRating(courseId: string): { average: number; count: number } {
  const list = getRatings(courseId);
  if (list.length === 0) return { average: 0, count: 0 };
  const sum = list.reduce((a, r) => a + r.rating, 0);
  return { average: Math.round((sum / list.length) * 10) / 10, count: list.length };
}

export function deleteRating(id: string) {
  const all = readAll().filter((r) => r.id !== id);
  writeAll(all);
}

// Hook helper for components that want to re-render on updates
export function subscribeToRatings(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("dgr-ratings-updated", handler);
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) handler();
  });
  return () => {
    window.removeEventListener("dgr-ratings-updated", handler);
  };
}
