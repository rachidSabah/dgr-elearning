// Type definitions for the DGR eLearning platform

export type ViewType =
  | "landing"
  | "dashboard"
  | "lesson"
  | "quiz"
  | "flashcards"
  | "scenarios"
  | "exam"
  | "certificate"
  | "analytics"
  | "glossary"
  | "settings"
  | "aitutor"
  | "leaderboard"
  | "compliance";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: 2 | 3 | 4 }
  | { type: "callout"; variant: "info" | "warning" | "danger" | "tip" | "note"; title?: string; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "definition"; term: string; definition: string }
  | { type: "image"; src: string; caption?: string; alt?: string }
  | { type: "video"; src: string; caption?: string }
  | { type: "keyTerms"; terms: { term: string; definition: string }[] }
  | { type: "svg"; src: string; caption?: string }
  | { type: "interactive"; component: string; props?: Record<string, any> }
  | { type: "knowledgeCheck"; question: string; options: string[]; correctAnswer: number; explanation: string }
  | { type: "clickToReveal"; title: string; content: string; variant?: "info" | "warning" | "tip" | "danger" }
  | { type: "matching"; title: string; left: string[]; right: string[] }
  | { type: "sequence"; title: string; steps: string[]; correctOrder: number[] };

export interface QuizQuestion {
  id: string;
  type: "mcq" | "truefalse" | "multiple";
  question: string;
  options: string[];
  correctAnswer: number | number[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface Scenario {
  id: string;
  title: string;
  situation: string;
  background: string;
  choices: {
    text: string;
    correct: boolean;
    feedback: string;
  }[];
  correctExplanation: string;
  reference: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  code: string; // e.g., "11.4.1"
  title: string;
  duration: number; // minutes
  objectives: string[];
  content: ContentBlock[];
  keyTerms?: { term: string; definition: string }[];
  summary: string[];
  reviewQuestions: string[];
}

export interface Module {
  id: string;
  code: string; // e.g., "11.4"
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface CourseData {
  title: string;
  subtitle: string;
  description: string;
  edition: string;
  duration: number; // total minutes
  difficulty: string;
  instructor: string;
  objectives: string[];
  modules: Module[];
  quizzes: { [lessonId: string]: QuizQuestion[] };
  moduleQuizzes: { [moduleId: string]: QuizQuestion[] };
  finalExam: QuizQuestion[];
  flashcards: Flashcard[];
  scenarios: Scenario[];
  glossary: { term: string; definition: string }[];
  faq: { question: string; answer: string }[];
  testimonials: { name: string; role: string; text: string; rating: number }[];
}

export interface ProgressState {
  completedLessons: string[];
  lessonProgress: { [lessonId: string]: number }; // 0-100
  quizScores: { [quizId: string]: { score: number; total: number; date: string }[] };
  examScore?: { score: number; total: number; date: string };
  bookmarks: string[];
  notes: { [lessonId: string]: { highlight: string; note: string; date: string }[] };
  xp: number;
  achievements: string[];
  streak: number;
  lastActivity: string;
  timeSpent: number; // seconds
  voiceProgress: { [lessonId: string]: number }; // 0-100
  certificateEarned: boolean;
  certificateNumber?: string;
  completedCourses: string[]; // course IDs that have been fully completed
  dailyGoal?: number; // lessons per day
  activityDays: string[]; // ISO date strings of days with study activity
}

// Map of course ID -> array of prerequisite course IDs.
// A course is unlocked when all prerequisites appear in ProgressState.completedCourses.
export const COURSE_PREREQUISITES: Record<string, string[]> = {
  "cabin-crew-first-aid-training": ["dangerous-goods-regulations"],
};
