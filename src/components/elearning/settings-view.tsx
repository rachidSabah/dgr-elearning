"use client";

import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Globe,
  Type,
  Focus,
  User,
  AlertTriangle,
  RotateCcw,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    fontScale,
    setFontScale,
    focusMode,
    toggleFocusMode,
    studentName,
    setStudentName,
    resetProgress,
    progress,
  } = useAppStore();

  const lang = language || "en";
  const totalLessons = 22; // Total lessons in course

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-slate-500" />
          </div>
          <h1 className="text-3xl font-bold">{t(lang, "settingsTitle")}</h1>
        </div>
        <p className="text-muted-foreground">
          Customize your learning experience
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Your name will appear on your certificate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="name">{t(lang, "yourName")}</Label>
              <Input
                id="name"
                placeholder={t(lang, "enterYourName")}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              {t(lang, "appearance")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <div>
                  <div className="font-medium text-sm">
                    {theme === "dark" ? t(lang, "darkMode") : t(lang, "lightMode")}
                  </div>
                  <div className="text-xs text-muted-foreground">Toggle dark/light theme</div>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>

            {/* Font scale */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">{t(lang, "fontSize")}</div>
                  <div className="text-xs text-muted-foreground">Adjust text size for readability</div>
                </div>
              </div>
              <Select value={fontScale} onValueChange={(v: any) => setFontScale(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{t(lang, "small")}</SelectItem>
                  <SelectItem value="medium">{t(lang, "medium")}</SelectItem>
                  <SelectItem value="large">{t(lang, "large")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Focus mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Focus className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">{t(lang, "focusMode")}</div>
                  <div className="text-xs text-muted-foreground">Dim non-essential elements</div>
                </div>
              </div>
              <Switch checked={focusMode} onCheckedChange={toggleFocusMode} />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              {t(lang, "language")}
            </CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: "en" as const, label: t(lang, "english"), flag: "🇬🇧" },
                { code: "fr" as const, label: t(lang, "french"), flag: "🇫🇷" },
                { code: "ar" as const, label: t(lang, "arabic"), flag: "🇸🇦" },
              ].map((langOption) => (
                <button
                  key={langOption.code}
                  onClick={() => setLanguage(langOption.code)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-4 rounded-lg border-2 transition-all",
                    language === langOption.code
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/50"
                  )}
                >
                  <span className="text-3xl">{langOption.flag}</span>
                  <span className="text-sm font-medium">{langOption.label}</span>
                  {language === langOption.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
            {language === "ar" && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Arabic mode enables RTL (Right-to-Left) text direction
              </p>
            )}
          </CardContent>
        </Card>

        {/* Progress summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{progress.completedLessons.length}/{totalLessons}</div>
                <div className="text-xs text-muted-foreground">Lessons</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{Object.keys(progress.quizScores).length}</div>
                <div className="text-xs text-muted-foreground">Quizzes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{progress.xp}</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{progress.achievements.length}</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/10">
                  <RotateCcw className="h-4 w-4" />
                  {t(lang, "resetProgress")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(lang, "confirmReset")} This will permanently delete all your lesson completions,
                    quiz scores, achievements, XP, and certificate. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetProgress}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About This Platform</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">DGR eLearning Platform</strong> is an interactive
              training system based on the Cabin Crew Training Manual Section 11 - Dangerous Goods (Edition 2024).
            </p>
            <p>
              All educational content is sourced from the original training manual and complies with
              ICAO Technical Instructions for the Safe Transport of Dangerous Goods by Air and IATA
              Dangerous Goods Regulations.
            </p>
            <p className="text-xs italic mt-3">
              For training purposes only. Always refer to the latest official publications for operational use.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
