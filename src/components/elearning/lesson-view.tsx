"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse } from "@/lib/use-course";
import { getEnhancedContent } from "@/lib/lesson-enhancements";
import { getFirstAidEnhancedContent } from "@/lib/first-aid-enhancements";
import { getCRMEnhancedContent } from "@/lib/crm-enhancements";
import { getCRMContentExpansion } from "@/lib/crm-content-expansion";
import { getDGRContentExpansion } from "@/lib/dgr-content-expansion";
import { getDGSlideshareImages } from "@/lib/dg-slideshare-images";
import { getDGRInfohasExpansion } from "@/lib/dgr-infohas-expansion";
import { getDGRInfohasImages } from "@/lib/dgr-infohas-images";
import { getFirstAidContentExpansion } from "@/lib/first-aid-content-expansion";
import { getMegaExpansion } from "@/lib/mega-content-expansion";
import { getCRMManualExpansion } from "@/lib/crm-manual-expansion";
import { getCRMManualImages } from "@/lib/crm-manual-images";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  FastForward,
  Rewind,
  BookOpen,
  Target,
  ListChecks,
  StickyNote,
  Search,
  X,
  Info,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  NotebookPen,
  ZoomIn,
  Plane,
  Printer,
  GraduationCap,
  ClipboardList,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ContentBlock, CourseData, Lesson } from "@/lib/types";
import { ProfessionalNarrator } from "./professional-narrator";
import {
  ClickToReveal,
  KnowledgeCheck,
  DragDropMatching,
  SequenceOrdering,
  InlineFlashcard,
  InteractiveTimeline,
} from "./interactive-components";
import { HazardClassExplorer } from "./hazard-class-explorer";
import { CabinLayoutExplorer } from "./cabin-layout-explorer";
import {
  AnimatedDoorArming,
  AnimatedEvacuationFlow,
  AnimatedFireFighting,
} from "./animated-procedures";
import { LessonDiscussion } from "./lesson-discussion";
import { generateStudyGuide } from "@/lib/study-guide";

const calloutStyles = {
  info: { icon: Info, className: "border-blue-500/30 bg-blue-500/5 text-blue-900 dark:text-blue-100", iconClass: "text-blue-500" },
  warning: { icon: AlertTriangle, className: "border-yellow-500/30 bg-yellow-500/5 text-yellow-900 dark:text-yellow-100", iconClass: "text-yellow-500" },
  danger: { icon: AlertCircle, className: "border-red-500/30 bg-red-500/5 text-red-900 dark:text-red-100", iconClass: "text-red-500" },
  tip: { icon: Lightbulb, className: "border-green-500/30 bg-green-500/5 text-green-900 dark:text-green-100", iconClass: "text-green-500" },
  note: { icon: NotebookPen, className: "border-purple-500/30 bg-purple-500/5 text-purple-900 dark:text-purple-100", iconClass: "text-purple-500" },
};

function findLesson(
  courseData: CourseData,
  lessonId: string | null
): { lesson: Lesson | null; moduleIndex: number; lessonIndex: number } {
  if (!lessonId) return { lesson: null, moduleIndex: 0, lessonIndex: 0 };
  for (let mi = 0; mi < courseData.modules.length; mi++) {
    for (let li = 0; li < courseData.modules[mi].lessons.length; li++) {
      if (courseData.modules[mi].lessons[li].id === lessonId) {
        return { lesson: courseData.modules[mi].lessons[li], moduleIndex: mi, lessonIndex: li };
      }
    }
  }
  return { lesson: null, moduleIndex: 0, lessonIndex: 0 };
}

function getAllLessons(courseData: CourseData) {
  const all: { lesson: Lesson; moduleIndex: number; lessonIndex: number }[] = [];
  courseData.modules.forEach((m, mi) => {
    m.lessons.forEach((l, li) => {
      all.push({ lesson: l, moduleIndex: mi, lessonIndex: li });
    });
  });
  return all;
}

export function LessonView() {
  const {
    selectedLessonId,
    setSelectedLesson,
    completeLesson,
    progress,
    addBookmark,
    removeBookmark,
    addNote,
    updateLessonProgress,
    updateVoiceProgress,
    startQuiz,
    language,
    updateStreak,
    addTimeSpent,
  } = useAppStore();

  const courseData = useCurrentCourse();

  const lang = language || "en";
  const { lesson, moduleIndex, lessonIndex } = findLesson(courseData, selectedLessonId);
  const allLessons = useMemo(() => getAllLessons(courseData), [courseData]);
  const currentGlobalIndex = allLessons.findIndex((l) => l.lesson.id === selectedLessonId);

  const [readingProgress, setReadingProgress] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageZoom, setImageZoom] = useState<string | null>(null);

  // Voice narration state
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [narrationRate, setNarrationRate] = useState(1);
  const [currentParagraphIdx, setCurrentParagraphIdx] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-select first lesson if none selected (prevents crash on "Lessons" tab click)
  useEffect(() => {
    if (!selectedLessonId && courseData.modules.length > 0 && courseData.modules[0].lessons.length > 0) {
      setSelectedLesson(courseData.modules[0].lessons[0].id);
    }
  }, [selectedLessonId, setSelectedLesson]);

  // Update streak on lesson view
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
        setReadingProgress(pct);
        if (lesson) {
          updateLessonProgress(lesson.id, pct);
          addTimeSpent(1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lesson, updateLessonProgress, addTimeSpent]);

  // Cleanup narration on lesson change
  useEffect(() => {
    // Inline cleanup to avoid referencing stopNarration before it's defined
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
    setIsPaused(false);
    setCurrentParagraphIdx(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLessonId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">No lesson selected</h2>
        <p className="text-muted-foreground mb-6">Choose a lesson from the course modules to start learning</p>
        <Button onClick={() => setSelectedLesson(courseData.modules[0].lessons[0].id)}>
          Start First Lesson
        </Button>
      </div>
    );
  }

  const isCompleted = progress.completedLessons.includes(lesson.id);
  const isBookmarked = progress.bookmarks.includes(lesson.id);
  const courseModule = courseData.modules[moduleIndex];

  // Get all text blocks for narration
  const textBlocks = lesson.content.filter(
    (b): b is Extract<ContentBlock, { type: "paragraph" }> => b.type === "paragraph"
  );

  const startNarration = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Voice narration is not supported in your browser");
      return;
    }
    window.speechSynthesis.cancel();

    let startIdx = 0;
    if (isPaused && currentParagraphIdx >= 0) {
      startIdx = currentParagraphIdx;
      setIsPaused(false);
    } else {
      setCurrentParagraphIdx(0);
    }

    const speakNext = (idx: number) => {
      if (idx >= textBlocks.length) {
        setIsNarrating(false);
        setCurrentParagraphIdx(-1);
        if (lesson) updateVoiceProgress(lesson.id, 100);
        return;
      }
      setCurrentParagraphIdx(idx);
      const utterance = new SpeechSynthesisUtterance(textBlocks[idx].text);
      utterance.rate = narrationRate;
      utterance.lang = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-SA" : "en-US";

      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((v) => v.lang.startsWith(lang === "fr" ? "fr" : lang === "ar" ? "ar" : "en"));
      if (matchingVoice) utterance.voice = matchingVoice;

      utterance.onend = () => speakNext(idx + 1);
      utterance.onerror = () => {
        setIsNarrating(false);
        setCurrentParagraphIdx(-1);
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      if (lesson) {
        updateVoiceProgress(lesson.id, Math.round(((idx + 1) / textBlocks.length) * 100));
      }
    };

    setIsNarrating(true);
    speakNext(startIdx);
  };

  const pauseNarration = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPaused(true);
    setIsNarrating(false);
  };

  const stopNarration = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
    setIsPaused(false);
    setCurrentParagraphIdx(-1);
  };

  const handleComplete = () => {
    completeLesson(lesson.id, lesson.duration * 60);
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(lesson.id);
    } else {
      addBookmark(lesson.id);
    }
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      addNote(lesson.id, highlightText || "Manual note", noteText);
      setNoteText("");
      setHighlightText("");
      setShowNotes(false);
    }
  };

  // Navigation
  const prevLesson = currentGlobalIndex > 0 ? allLessons[currentGlobalIndex - 1] : null;
  const nextLesson = currentGlobalIndex < allLessons.length - 1 ? allLessons[currentGlobalIndex + 1] : null;

  const lessonNotes = progress.notes[lesson.id] || [];

  // Merge enhanced interactive content with base lesson content
  // Check DGR, First Aid, and CRM enhancements + all content expansions + mega expansion + SlideShare images + CRM manual + DGR INFOHAS
  const mega = getMegaExpansion(lesson.id);
  const slideShareImgs = getDGSlideshareImages(lesson.id);
  const crmManualExp = getCRMManualExpansion(lesson.id);
  const crmManualImgs = getCRMManualImages(lesson.id);
  const dgrInfohasExp = getDGRInfohasExpansion(lesson.id);
  const dgrInfohasImgs = getDGRInfohasImages(lesson.id);
  const enhancements = lesson.id.startsWith("fa-")
    ? [...getFirstAidEnhancedContent(lesson.id), ...getFirstAidContentExpansion(lesson.id), ...mega]
    : lesson.id.startsWith("crm-")
    ? [...getCRMEnhancedContent(lesson.id), ...getCRMContentExpansion(lesson.id), ...crmManualExp, ...crmManualImgs, ...mega]
    : [...getEnhancedContent(lesson.id), ...getDGRContentExpansion(lesson.id), ...dgrInfohasExp, ...slideShareImgs, ...dgrInfohasImgs, ...mega];
  const enhancedContent = [...lesson.content, ...enhancements];

  // Filter content for search
  const filteredContent = searchQuery
    ? enhancedContent.filter((block) => {
        if ("text" in block) return block.text.toLowerCase().includes(searchQuery.toLowerCase());
        return false;
      })
    : enhancedContent;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl print-area">
      {/* Lesson header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="font-medium" style={{ color: courseModule.color }}>
            {courseModule.code} {courseModule.title}
          </span>
          <ChevronRight className="h-3 w-3" />
          <span>{lesson.code}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lesson.duration} {t(lang, "minutes")}
              </span>
              {isCompleted && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {t(lang, "completed")}
                </Badge>
              )}
              {progress.voiceProgress[lesson.id] > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Volume2 className="h-3 w-3" />
                  {progress.voiceProgress[lesson.id]}% listened
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={() => window.print()} title="Print lesson" aria-label="Print lesson">
              <Printer className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              {isBookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowNotes(!showNotes)}>
              <StickyNote className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Professional Voice Narration */}
      <div className="mb-6 no-print">
        <ProfessionalNarrator
          text={textBlocks.map((b) => b.text).join(" ")}
          lessonId={lesson.id}
          lang={lang}
          onProgress={(p) => updateVoiceProgress(lesson.id, p)}
          className="shadow-sm"
        />
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t(lang, "search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading progress bar */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-2 glass mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground shrink-0">{t(lang, "lessonProgress")}</span>
          <Progress value={readingProgress} className="h-1.5 flex-1" />
          <span className="text-xs font-medium shrink-0">{readingProgress}%</span>
        </div>
      </div>

      {/* Lesson content */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="min-w-0">
          <Tabs defaultValue="content">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="summary">{t(lang, "summary")}</TabsTrigger>
              <TabsTrigger value="review">{t(lang, "reviewQuestions")}</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {/* Pre-Briefing Section */}
              <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-700 dark:text-amber-400">Pre-Briefing</h3>
                      <p className="text-xs text-muted-foreground">Instructor introduction & lesson overview</p>
                    </div>
                  </div>
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Welcome to {lesson.title}</p>
                    <p className="text-muted-foreground">
                      This lesson covers section <strong>{lesson.code}</strong> of the Dangerous Goods Regulations.
                      Duration: approximately {lesson.duration} minutes.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs gap-1">
                        <Clock className="h-3 w-3" />{lesson.duration} min
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        <Target className="h-3 w-3" />{lesson.objectives.length} objectives
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1">
                        <ClipboardList className="h-3 w-3" />{lesson.reviewQuestions.length} review questions
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Objectives */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Learning Objectives</h3>
                  </div>
                  <ul className="space-y-2">
                    {lesson.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Content blocks */}
              {filteredContent.map((block, idx) => (
                <ContentBlockRenderer
                  key={idx}
                  block={block}
                  isSpeaking={block.type === "paragraph" && textBlocks.indexOf(block as any) === currentParagraphIdx}
                  onImageClick={(src) => setImageZoom(src)}
                />
              ))}

              {/* Key terms */}
              {lesson.keyTerms && lesson.keyTerms.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {t(lang, "keyTerms")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lesson.keyTerms.map((kt, i) => (
                      <div key={i} className="border-l-2 border-primary pl-3">
                        <div className="font-semibold text-sm">{kt.term}</div>
                        <div className="text-sm text-muted-foreground">{kt.definition}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Debriefing Section */}
              <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700 dark:text-green-400">Debriefing</h3>
                      <p className="text-xs text-muted-foreground">Key takeaways & competency check</p>
                    </div>
                  </div>
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Lesson Complete - Key Takeaways:</p>
                    <ul className="space-y-1">
                      {lesson.summary.slice(0, 3).map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-xs">
                        <strong>Competency Validation:</strong> Complete the quiz to verify your understanding of this lesson.
                        Score 70% or higher to demonstrate competency.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" />
                    {t(lang, "summary")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {lesson.summary.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {t(lang, "reviewQuestions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lesson.reviewQuestions.map((q, i) => (
                    <div key={i} className="p-3 rounded-lg bg-accent/30">
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <span className="text-sm">{q}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t">
            <Button
              variant={isCompleted ? "outline" : "default"}
              onClick={handleComplete}
              className="gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              {isCompleted ? t(lang, "completed") : t(lang, "markComplete")}
            </Button>
            {courseData.quizzes[lesson.id] && (
              <Button
                variant="secondary"
                onClick={() => startQuiz("lesson", lesson.id)}
                className="gap-2"
              >
                <Target className="h-5 w-5" />
                {t(lang, "takeQuiz")}
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 gap-3">
            <Button
              variant="ghost"
              disabled={!prevLesson}
              onClick={() => prevLesson && setSelectedLesson(prevLesson.lesson.id)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t(lang, "previousLesson")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateStudyGuide(useAppStore.getState().selectedCourseId)}
              className="gap-1.5"
              title="Open a printable study guide for this course"
            >
              <Printer className="h-4 w-4" />
              Study Guide
            </Button>
            <Button
              variant="ghost"
              disabled={!nextLesson}
              onClick={() => nextLesson && setSelectedLesson(nextLesson.lesson.id)}
              className="gap-1"
            >
              {t(lang, "nextLesson")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Discussion Forum */}
          <div className="mt-8">
            <LessonDiscussion lessonId={lesson.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <Card className="sticky top-32">
            <CardHeader>
              <CardTitle className="text-sm">Lesson Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-3">
                <div className="space-y-1">
                  {allLessons.map((l, i) => (
                    <button
                      key={l.lesson.id}
                      onClick={() => setSelectedLesson(l.lesson.id)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg text-xs transition-colors",
                        l.lesson.id === lesson.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {progress.completedLessons.includes(l.lesson.id) ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                        ) : (
                          <span className="w-3 h-3 rounded-full border border-muted-foreground/30 shrink-0" />
                        )}
                        <span className="truncate">
                          <span className="text-muted-foreground">{l.lesson.code}</span>
                          {" - "}
                          {l.lesson.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notes dialog */}
      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lesson Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Add a new note</label>
              <Textarea
                placeholder="Write your note here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
              />
              <Button size="sm" className="mt-2" onClick={handleSaveNote}>
                Save Note
              </Button>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Your notes for this lesson</h4>
              {lessonNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet. Start taking notes to track your learning.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {lessonNotes.map((note, i) => (
                    <div key={i} className="p-2 rounded bg-accent/30 text-sm">
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(note.date).toLocaleDateString()}
                      </div>
                      <div>{note.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image zoom dialog */}
      <Dialog open={!!imageZoom} onOpenChange={() => setImageZoom(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image View</DialogTitle>
          </DialogHeader>
          {imageZoom && (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageZoom}
                alt="Zoomed view"
                className="w-full h-auto rounded-lg"
              />
              <div className="flex gap-2 justify-end">
                <a href={imageZoom} download className="inline-flex">
                  <Button variant="outline" size="sm">Download</Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContentBlockRenderer({
  block,
  isSpeaking,
  onImageClick,
}: {
  block: ContentBlock;
  isSpeaking?: boolean;
  onImageClick?: (src: string) => void;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className={cn("text-base leading-relaxed", isSpeaking && "speaking")}>
          {block.text}
        </p>
      );

    case "heading": {
      const level = block.level || 3;
      const className =
        level === 2
          ? "text-2xl font-bold mt-6 mb-3"
          : level === 3
          ? "text-xl font-semibold mt-5 mb-2"
          : "text-lg font-semibold mt-4 mb-2";
      return <h3 className={className}>{block.text}</h3>;
    }

    case "callout": {
      const style = calloutStyles[block.variant];
      const Icon = style.icon;
      return (
        <div className={cn("rounded-lg border p-4 my-4", style.className)}>
          <div className="flex items-start gap-3">
            <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", style.iconClass)} />
            <div className="flex-1">
              {block.title && <div className="font-semibold mb-1">{block.title}</div>}
              <div className="text-sm">{block.text}</div>
            </div>
          </div>
        </div>
      );
    }

    case "list":
      return block.ordered ? (
        <ol className="list-decimal list-inside space-y-1.5 my-3">
          {block.items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-1.5 my-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        <Card className="my-4 overflow-hidden">
          {block.caption && (
            <div className="px-4 py-2 bg-muted/30 text-sm font-medium border-b">
              {block.caption}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} className="text-left p-3 font-semibold border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-accent/30 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="p-3 border-b border-border/50">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      );

    case "definition":
      return (
        <div className="border-l-4 border-primary pl-4 my-3">
          <div className="font-semibold">{block.term}</div>
          <div className="text-sm text-muted-foreground">{block.definition}</div>
        </div>
      );

    case "image":
      return (
        <figure className="my-4">
          <div
            className="relative rounded-lg overflow-hidden cursor-pointer group bg-muted/30"
            onClick={() => onImageClick?.(block.src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.src}
              alt={block.alt || block.caption || "Course image"}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          {block.caption && (
            <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "video":
      return <VideoBlock src={block.src} caption={block.caption} />;

    case "keyTerms":
      return (
        <Card className="my-4">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Key Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {block.terms.map((kt, i) => (
              <div key={i} className="border-l-2 border-primary/50 pl-3 py-1">
                <div className="font-semibold text-sm">{kt.term}</div>
                <div className="text-sm text-muted-foreground">{kt.definition}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      );

    case "svg":
      return (
        <figure className="my-4">
          <div className="rounded-xl overflow-hidden border bg-card p-4">
            <div className="flex items-center justify-center">
              <embed src={block.src} type="image/svg+xml" className="w-full max-w-3xl" />
            </div>
          </div>
          {block.caption && (
            <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "interactive":
      return <InteractiveComponentRenderer component={block.component} />;

    case "knowledgeCheck":
      return (
        <KnowledgeCheck
          question={block.question}
          options={block.options}
          correctAnswer={block.correctAnswer}
          explanation={block.explanation}
          questionId={`kc-${block.question.substring(0, 20)}`}
        />
      );

    case "clickToReveal":
      return (
        <ClickToReveal
          title={block.title}
          variant={block.variant || "info"}
        >
          {block.content}
        </ClickToReveal>
      );

    case "matching":
      return (
        <DragDropMatching
          title={block.title}
          pairs={{ left: block.left, right: block.right }}
        />
      );

    case "sequence":
      return (
        <SequenceOrdering
          title={block.title}
          steps={block.steps}
          correctOrder={block.correctOrder}
        />
      );

    default:
      return null;
  }
}

// ---------- Video Block Renderer ----------
function VideoBlock({ src, caption }: { src: string; caption?: string }) {
  const youtubeMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const isMP4 = /\.mp4(\?.*)?$/i.test(src);
  const isWebM = /\.webm(\?.*)?$/i.test(src);
  const isDirectVideo = isMP4 || isWebM;

  let embed: React.ReactNode = null;
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    embed = (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={caption || "YouTube video"}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  } else if (vimeoMatch) {
    const id = vimeoMatch[1];
    embed = (
      <iframe
        src={`https://player.vimeo.com/video/${id}`}
        title={caption || "Vimeo video"}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  } else if (isDirectVideo) {
    embed = (
      <video
        src={src}
        controls
        className="w-full h-full"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    );
  } else {
    embed = (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-sm font-medium">Unsupported video URL</p>
        <p className="text-xs mt-1 break-all">{src}</p>
        <p className="text-xs mt-2">Supports YouTube, Vimeo, MP4 and WebM.</p>
      </div>
    );
  }

  return (
    <figure className="my-4">
      <div className="rounded-xl overflow-hidden border bg-card aspect-video">
        {embed}
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Renderer for special interactive components
function InteractiveComponentRenderer({ component }: { component: string }) {
  switch (component) {
    case "hazardExplorer":
      return <HazardClassExplorer />;
    case "cabinExplorer":
      return <CabinLayoutExplorer />;
    case "animatedDoorArming":
      return <AnimatedDoorArming />;
    case "animatedEvacuation":
      return <AnimatedEvacuationFlow />;
    case "animatedFireFighting":
      return <AnimatedFireFighting />;
    default:
      return null;
  }
}
