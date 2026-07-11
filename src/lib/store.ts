"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProgressState, ViewType } from "./types";
import { COURSE_PREREQUISITES } from "./types";

interface AppState {
  // Navigation
  currentView: ViewType;
  selectedLessonId: string | null;
  selectedModuleId: string | null;
  selectedQuizType: "lesson" | "module" | "final" | null;
  selectedQuizId: string | null;
  selectedCourseId: string; // which course the user is viewing

  // UI State
  theme: "light" | "dark";
  language: "en" | "fr" | "ar";
  fontScale: "small" | "medium" | "large";
  focusMode: boolean;
  sidebarOpen: boolean;
  reducedMotion: boolean;
  highContrast: boolean;

  // Progress
  progress: ProgressState;

  // Student info
  studentName: string;

  // Actions
  setView: (view: ViewType) => void;
  setSelectedLesson: (lessonId: string) => void;
  setSelectedModule: (moduleId: string) => void;
  setSelectedCourse: (courseId: string) => void;
  startQuiz: (type: "lesson" | "module" | "final", id: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "en" | "fr" | "ar") => void;
  setFontScale: (scale: "small" | "medium" | "large") => void;
  toggleFocusMode: () => void;
  toggleSidebar: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  setStudentName: (name: string) => void;

  // Progress actions
  completeLesson: (lessonId: string, duration?: number) => void;
  updateLessonProgress: (lessonId: string, progress: number) => void;
  recordQuizScore: (quizId: string, score: number, total: number) => void;
  recordExamScore: (score: number, total: number) => void;
  addBookmark: (lessonId: string) => void;
  removeBookmark: (lessonId: string) => void;
  addNote: (lessonId: string, highlight: string, note: string) => void;
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
  updateStreak: () => void;
  addTimeSpent: (seconds: number) => void;
  updateVoiceProgress: (lessonId: string, progress: number) => void;
  awardCertificate: (certificateNumber: string) => void;
  resetProgress: () => void;

  // Course prerequisites / completion / daily goals
  markCourseComplete: (courseId: string) => void;
  checkPrerequisite: (courseId: string) => boolean;
  setDailyGoal: (goal: number) => void;
}

const initialProgress: ProgressState = {
  completedLessons: [],
  lessonProgress: {},
  quizScores: {},
  bookmarks: [],
  notes: {},
  xp: 0,
  achievements: [],
  streak: 0,
  lastActivity: new Date().toDateString(),
  timeSpent: 0,
  voiceProgress: {},
  certificateEarned: false,
  completedCourses: [],
  activityDays: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: "landing",
      selectedCourseId: "dangerous-goods-regulations",
      selectedLessonId: null,
      selectedModuleId: null,
      selectedQuizType: null,
      selectedQuizId: null,

      theme: "light",
      language: "en",
      fontScale: "medium",
      focusMode: false,
      reducedMotion: false,
      highContrast: false,
      sidebarOpen: false,

      progress: initialProgress,
      studentName: "",

      setView: (view) => set({ currentView: view }),
      setSelectedLesson: (lessonId) => set({ selectedLessonId: lessonId, currentView: "lesson" }),
      setSelectedModule: (moduleId) => set({ selectedModuleId: moduleId }),
      setSelectedCourse: (courseId) => set({ selectedCourseId: courseId, selectedLessonId: null, selectedModuleId: null }),
      startQuiz: (type, id) =>
        set({ selectedQuizType: type, selectedQuizId: id, currentView: "quiz" }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setFontScale: (fontScale) => set({ fontScale }),
      toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
      setStudentName: (studentName) => set({ studentName }),

      completeLesson: (lessonId, duration = 0) =>
        set((state) => {
          const completed = state.progress.completedLessons.includes(lessonId)
            ? state.progress.completedLessons
            : [...state.progress.completedLessons, lessonId];
          const newAchievements = [...state.progress.achievements];
          if (completed.length >= 1 && !newAchievements.includes("first-lesson"))
            newAchievements.push("first-lesson");
          if (completed.length >= 5 && !newAchievements.includes("five-lessons"))
            newAchievements.push("five-lessons");
          if (completed.length >= 10 && !newAchievements.includes("ten-lessons"))
            newAchievements.push("ten-lessons");
          if (completed.length >= 20 && !newAchievements.includes("scholar"))
            newAchievements.push("scholar");
          const todayISO = new Date().toISOString().slice(0, 10);
          const activityDays = state.progress.activityDays?.includes(todayISO)
            ? state.progress.activityDays
            : [...(state.progress.activityDays || []), todayISO];
          return {
            progress: {
              ...state.progress,
              completedLessons: completed,
              lessonProgress: { ...state.progress.lessonProgress, [lessonId]: 100 },
              xp: state.progress.xp + (state.progress.completedLessons.includes(lessonId) ? 0 : 50),
              achievements: newAchievements,
              timeSpent: state.progress.timeSpent + duration,
              lastActivity: new Date().toDateString(),
              activityDays,
            },
          };
        }),

      updateLessonProgress: (lessonId, progress) =>
        set((state) => ({
          progress: {
            ...state.progress,
            lessonProgress: {
              ...state.progress.lessonProgress,
              [lessonId]: Math.max(state.progress.lessonProgress[lessonId] || 0, progress),
            },
          },
        })),

      recordQuizScore: (quizId, score, total) =>
        set((state) => {
          const existing = state.progress.quizScores[quizId] || [];
          const newScores = [...existing, { score, total, date: new Date().toISOString() }];
          const passed = score / total >= 0.7;
          const newAchievements = [...state.progress.achievements];
          if (passed && !newAchievements.includes("first-quiz-pass")) newAchievements.push("first-quiz-pass");
          return {
            progress: {
              ...state.progress,
              quizScores: { ...state.progress.quizScores, [quizId]: newScores },
              xp: state.progress.xp + (passed ? 100 : 20),
              achievements: newAchievements,
              lastActivity: new Date().toDateString(),
            },
          };
        }),

      recordExamScore: (score, total) =>
        set((state) => {
          const passed = score / total >= 0.7;
          const newAchievements = [...state.progress.achievements];
          if (passed && !newAchievements.includes("exam-passed")) newAchievements.push("exam-passed");
          const certNumber = passed
            ? `DGR-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            : undefined;
          // Auto-mark the current course as completed when the exam is passed
          const completedCourses = [...(state.progress.completedCourses || [])];
          if (passed && !completedCourses.includes(state.selectedCourseId)) {
            completedCourses.push(state.selectedCourseId);
          }
          return {
            progress: {
              ...state.progress,
              examScore: { score, total, date: new Date().toISOString() },
              xp: state.progress.xp + (passed ? 500 : 50),
              achievements: newAchievements,
              certificateEarned: passed,
              certificateNumber: passed ? certNumber : state.progress.certificateNumber,
              lastActivity: new Date().toDateString(),
              completedCourses,
            },
          };
        }),

      addBookmark: (lessonId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            bookmarks: state.progress.bookmarks.includes(lessonId)
              ? state.progress.bookmarks
              : [...state.progress.bookmarks, lessonId],
          },
        })),

      removeBookmark: (lessonId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            bookmarks: state.progress.bookmarks.filter((id) => id !== lessonId),
          },
        })),

      addNote: (lessonId, highlight, note) =>
        set((state) => ({
          progress: {
            ...state.progress,
            notes: {
              ...state.progress.notes,
              [lessonId]: [
                ...(state.progress.notes[lessonId] || []),
                { highlight, note, date: new Date().toISOString() },
              ],
            },
          },
        })),

      addXp: (amount) =>
        set((state) => ({ progress: { ...state.progress, xp: state.progress.xp + amount } })),

      addAchievement: (achievement) =>
        set((state) => ({
          progress: {
            ...state.progress,
            achievements: state.progress.achievements.includes(achievement)
              ? state.progress.achievements
              : [...state.progress.achievements, achievement],
          },
        })),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          let newStreak = state.progress.streak;
          if (state.progress.lastActivity === today) {
            // already counted today
          } else if (state.progress.lastActivity === yesterday) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          return {
            progress: { ...state.progress, streak: newStreak, lastActivity: today },
          };
        }),

      addTimeSpent: (seconds) =>
        set((state) => ({
          progress: { ...state.progress, timeSpent: state.progress.timeSpent + seconds },
        })),

      updateVoiceProgress: (lessonId, progress) =>
        set((state) => ({
          progress: {
            ...state.progress,
            voiceProgress: {
              ...state.progress.voiceProgress,
              [lessonId]: Math.max(state.progress.voiceProgress[lessonId] || 0, progress),
            },
          },
        })),

      awardCertificate: (certificateNumber) =>
        set((state) => ({
          progress: {
            ...state.progress,
            certificateEarned: true,
            certificateNumber,
            achievements: state.progress.achievements.includes("certified")
              ? state.progress.achievements
              : [...state.progress.achievements, "certified"],
          },
        })),

      markCourseComplete: (courseId) =>
        set((state) => {
          if (state.progress.completedCourses?.includes(courseId)) return state;
          return {
            progress: {
              ...state.progress,
              completedCourses: [...(state.progress.completedCourses || []), courseId],
              xp: state.progress.xp + 1000,
            },
          };
        }),

      checkPrerequisite: (courseId) => {
        const prereqs = COURSE_PREREQUISITES[courseId] || [];
        if (prereqs.length === 0) return true;
        const completed = useAppStore.getState().progress.completedCourses || [];
        return prereqs.every((p) => completed.includes(p));
      },

      setDailyGoal: (goal) =>
        set((state) => ({ progress: { ...state.progress, dailyGoal: goal } })),

      resetProgress: () => set({ progress: initialProgress }),
    }),
    {
      name: "dgr-elearning-storage",
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        fontScale: state.fontScale,
        progress: state.progress,
        studentName: state.studentName,
      }),
    }
  )
);
