"use client";

// ============================================================
// Study Groups store (localStorage based)
// Storage key: dgr-academy-groups
// ============================================================

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  studentIds: string[];
  courseIds: string[];
  createdAt: string;
}

const KEY = "dgr-academy-groups";

function readAll(): StudyGroup[] {
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

function writeAll(groups: StudyGroup[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(groups));
  window.dispatchEvent(new CustomEvent("dgr-groups-updated"));
}

export function getGroups(): StudyGroup[] {
  return readAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getGroup(id: string): StudyGroup | null {
  return readAll().find((g) => g.id === id) || null;
}

export function createGroup(name: string, description = "", studentIds: string[] = [], courseIds: string[] = []): StudyGroup {
  const all = readAll();
  const group: StudyGroup = {
    id: `grp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    description: description.trim(),
    studentIds,
    courseIds,
    createdAt: new Date().toISOString(),
  };
  all.push(group);
  writeAll(all);
  return group;
}

export function deleteGroup(id: string): void {
  writeAll(readAll().filter((g) => g.id !== id));
}

export function updateGroup(id: string, updates: Partial<StudyGroup>): StudyGroup | null {
  const all = readAll();
  const idx = all.findIndex((g) => g.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...updates, id: all[idx].id, createdAt: all[idx].createdAt };
  writeAll(all);
  return all[idx];
}

export function addStudentToGroup(groupId: string, studentId: string): void {
  const all = readAll();
  const idx = all.findIndex((g) => g.id === groupId);
  if (idx < 0) return;
  if (!all[idx].studentIds.includes(studentId)) {
    all[idx].studentIds.push(studentId);
    writeAll(all);
  }
}

export function removeStudentFromGroup(groupId: string, studentId: string): void {
  const all = readAll();
  const idx = all.findIndex((g) => g.id === groupId);
  if (idx < 0) return;
  all[idx].studentIds = all[idx].studentIds.filter((id) => id !== studentId);
  writeAll(all);
}

export function addCourseToGroup(groupId: string, courseId: string): void {
  const all = readAll();
  const idx = all.findIndex((g) => g.id === groupId);
  if (idx < 0) return;
  if (!all[idx].courseIds.includes(courseId)) {
    all[idx].courseIds.push(courseId);
    writeAll(all);
  }
}

export function removeCourseFromGroup(groupId: string, courseId: string): void {
  const all = readAll();
  const idx = all.findIndex((g) => g.id === groupId);
  if (idx < 0) return;
  all[idx].courseIds = all[idx].courseIds.filter((id) => id !== courseId);
  writeAll(all);
}

export function getGroupStudents(groupId: string): string[] {
  const g = getGroup(groupId);
  return g ? g.studentIds : [];
}

export function subscribeToGroups(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("dgr-groups-updated", handler);
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) handler();
  });
  return () => {
    window.removeEventListener("dgr-groups-updated", handler);
  };
}
