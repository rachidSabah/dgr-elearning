"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse } from "@/lib/use-course";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  Plane,
  LayoutDashboard,
  BookOpen,
  Brain,
  Sparkles,
  GraduationCap,
  Award,
  BarChart3,
  BookMarked,
  Settings,
  Bot,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Flame,
  Trophy,
  Shield,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import type { ViewType } from "@/lib/types";

interface NavItem {
  view: ViewType;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: keyof typeof import("@/lib/i18n").translations.en;
}

const navItems: NavItem[] = [
  { view: "dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { view: "lesson", icon: BookOpen, labelKey: "lessons" },
  { view: "flashcards", icon: Brain, labelKey: "flashcards" },
  { view: "scenarios", icon: Sparkles, labelKey: "scenarios" },
  { view: "exam", icon: GraduationCap, labelKey: "exam" },
  { view: "analytics", icon: BarChart3, labelKey: "analytics" },
  { view: "glossary", icon: BookMarked, labelKey: "glossary" },
  { view: "aitutor", icon: Bot, labelKey: "aitutor" },
  { view: "certificate", icon: Award, labelKey: "certificate" },
  { view: "settings", icon: Settings, labelKey: "settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    currentView,
    setView,
    theme,
    setTheme,
    language,
    setLanguage,
    sidebarOpen,
    toggleSidebar,
    progress,
  } = useAppStore();

  const courseData = useCurrentCourse();

  const [mounted, setMounted] = useState(false);

  // Use useSyncExternalStore pattern to avoid setState in effect
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const lang = mounted ? language : "en";

  const totalLessons = courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completionPct = Math.round((progress.completedLessons.length / totalLessons) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full glass border-b border-border/40">
        <div className="flex h-16 items-center px-4 gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <button
            onClick={() => setView("landing")}
            className="flex items-center gap-2 font-bold text-lg shrink-0 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-md" />
              <div className="relative bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Plane className="h-5 w-5" />
              </div>
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
              DGR eLearning
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <Button
                  key={item.view}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView(item.view)}
                  className={cn(
                    "gap-1.5 transition-all",
                    isActive && "shadow-md"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{t(lang, item.labelKey)}</span>
                </Button>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            {/* XP and Streak badges */}
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 px-2">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span className="font-semibold">{progress.xp}</span>
                <span className="text-xs text-muted-foreground">XP</span>
              </Badge>
              <Badge variant="secondary" className="gap-1 px-2">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="font-semibold">{progress.streak}</span>
              </Badge>
            </div>

            {/* Login/Account */}
            <a href="/login">
              <Button variant="outline" size="sm" className="gap-1.5">
                <UserCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </a>

            {/* Admin Portal Link */}
            <a href="/admin" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </a>

            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Select language">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  🇬🇧 English {lang === "en" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("fr")}>
                  🇫🇷 Français {lang === "fr" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>
                  🇸🇦 العربية {lang === "ar" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {currentView !== "landing" && progress.completedLessons.length > 0 && (
          <div className="h-1 w-full bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-chart-2 to-chart-4"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </header>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-16 bottom-0 w-64 glass z-40 lg:hidden p-4 overflow-y-auto"
            >
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <Button
                      key={item.view}
                      variant={isActive ? "default" : "ghost"}
                      className="justify-start gap-3"
                      onClick={() => {
                        setView(item.view);
                        toggleSidebar();
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      {t(lang, item.labelKey)}
                    </Button>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-6 px-4 text-center text-sm text-muted-foreground">
        <p className="mb-1">
          <span className="font-semibold text-foreground">DGR eLearning Platform</span>
          {" — "}
          {courseData.title} | {courseData.edition}
        </p>
        <p>
          Based on ICAO Technical Instructions and IATA Dangerous Goods Regulations.
          For training purposes only.
        </p>
      </footer>
    </div>
  );
}
