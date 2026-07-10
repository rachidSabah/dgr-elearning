"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { LandingView } from "@/components/elearning/landing-view";
import { DashboardView } from "@/components/elearning/dashboard-view";
import { LessonView } from "@/components/elearning/lesson-view";
import { QuizView } from "@/components/elearning/quiz-view";
import { FlashcardsView } from "@/components/elearning/flashcards-view";
import { ScenariosView } from "@/components/elearning/scenarios-view";
import { ExamView } from "@/components/elearning/exam-view";
import { CertificateView } from "@/components/elearning/certificate-view";
import { AnalyticsView } from "@/components/elearning/analytics-view";
import { GlossaryView } from "@/components/elearning/glossary-view";
import { SettingsView } from "@/components/elearning/settings-view";
import { AITutorView } from "@/components/elearning/aitutor-view";
import { AppShell } from "@/components/elearning/app-shell";

export default function Home() {
  const currentView = useAppStore((s) => s.currentView);
  const theme = useAppStore((s) => s.theme);
  const language = useAppStore((s) => s.language);
  const fontScale = useAppStore((s) => s.fontScale);
  const focusMode = useAppStore((s) => s.focusMode);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const highContrast = useAppStore((s) => s.highContrast);

  // Apply theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Apply language direction
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }
  }, [language]);

  // Apply font scale
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("font-scale-small", "font-scale-medium", "font-scale-large");
      document.documentElement.classList.add(`font-scale-${fontScale}`);
    }
  }, [fontScale]);

  // Apply reduced motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("reduce-motion", reducedMotion);
    }
  }, [reducedMotion]);

  // Apply high contrast
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("high-contrast", highContrast);
    }
  }, [highContrast]);

  // Apply focus mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.toggle("focus-mode", focusMode);
    }
  }, [focusMode]);

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingView />;
      case "dashboard":
        return <DashboardView />;
      case "lesson":
        return <LessonView />;
      case "quiz":
        return <QuizView />;
      case "flashcards":
        return <FlashcardsView />;
      case "scenarios":
        return <ScenariosView />;
      case "exam":
        return <ExamView />;
      case "certificate":
        return <CertificateView />;
      case "analytics":
        return <AnalyticsView />;
      case "glossary":
        return <GlossaryView />;
      case "settings":
        return <SettingsView />;
      case "aitutor":
        return <AITutorView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col">{renderView()}</div>
    </AppShell>
  );
}
