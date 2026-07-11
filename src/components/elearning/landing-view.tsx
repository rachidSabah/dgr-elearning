"use client";

import { useAppStore } from "@/lib/store";
import { useCurrentCourse, useAllCourses } from "@/lib/use-course";
import { slugify } from "@/lib/courses-registry";
import { COURSE_PREREQUISITES } from "@/lib/types";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Plane,
  Clock,
  BarChart3,
  User,
  Target,
  ArrowRight,
  Star,
  ChevronDown,
  BookOpen,
  Award,
  Zap,
  Globe2,
  Headphones,
  Play,
  Sparkles,
  CheckCircle2,
  Brain,
  Bot,
  GraduationCap,
  Library,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function LandingView() {
  const { setView, setSelectedLesson, setSelectedCourse, progress, language } = useAppStore();
  const courseData = useCurrentCourse();
  const allCourses = useAllCourses();
  const lang = language || "en";

  const totalLessons = courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalQuizzes = Object.keys(courseData.quizzes).length + Object.keys(courseData.moduleQuizzes).length + 1;
  const completionPct = Math.round((progress.completedLessons.length / totalLessons) * 100);

  const stats = [
    { label: t(lang, "totalModules"), value: courseData.modules.length, icon: BookOpen },
    { label: t(lang, "totalLessons"), value: totalLessons, icon: BookOpen },
    { label: t(lang, "quizQuestions"), value: courseData.finalExam.length + 30, icon: Target },
    { label: t(lang, "flashcardCount"), value: courseData.flashcards.length, icon: Zap },
  ];

  const findNextLesson = () => {
    for (const mod of courseData.modules) {
      for (const lesson of mod.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          return lesson;
        }
      }
    }
    return courseData.modules[0].lessons[0];
  };

  const nextLesson = findNextLesson();

  // Compute progress for each course based on its lessons
  const getCourseProgress = (cd: typeof courseData) => {
    const total = cd.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
    const completed = cd.modules
      .flatMap((m) => m.lessons)
      .filter((l) => progress.completedLessons.includes(l.id)).length;
    return {
      total,
      completed,
      pct: Math.round((completed / total) * 100),
      hasStarted: completed > 0,
      firstLessonId: cd.modules[0]?.lessons[0]?.id,
    };
  };

  const handleSelectCourse = (cd: typeof courseData) => {
    const courseId = slugify(cd.title);
    const courseProgress = getCourseProgress(cd);
    setSelectedCourse(courseId);
    // Navigate to dashboard so the user can dive into the chosen course
    setView("dashboard");
    // If the course has been started, jump to the next incomplete lesson
    if (courseProgress.firstLessonId && !courseProgress.hasStarted) {
      setSelectedLesson(courseProgress.firstLessonId);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 animated-gradient opacity-90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        {/* Aircraft silhouette overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <embed src="/images/svg/hero-aircraft.svg" type="image/svg+xml" className="w-full max-w-4xl" />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-md">
                <Plane className="h-3 w-3 mr-1" />
                {t(lang, "heroBadge")}
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {courseData.title}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/90 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {courseData.subtitle}
            </motion.p>

            <motion.p
              className="text-base md:text-lg text-white/80 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {courseData.description}
            </motion.p>

            {/* Course meta */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-10 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(courseData.duration / 60)} {t(lang, "hours")}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>{courseData.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{courseData.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>{courseData.edition}</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {progress.completedLessons.length > 0 ? (
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2 text-lg px-8"
                  onClick={() => {
                    setSelectedLesson(nextLesson.id);
                  }}
                >
                  <Play className="h-5 w-5" />
                  {t(lang, "continueLearning")}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2 text-lg px-8"
                  onClick={() => {
                    setSelectedLesson(courseData.modules[0].lessons[0].id);
                  }}
                >
                  {t(lang, "heroCta")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 gap-2 text-lg px-8"
                onClick={() => setView("dashboard")}
              >
                {t(lang, "heroSecondary")}
              </Button>
            </motion.div>

            {/* Progress indicator if returning */}
            {progress.completedLessons.length > 0 && (
              <motion.div
                className="mt-10 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="glass rounded-xl p-4 text-white">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t(lang, "yourProgress")}</span>
                    <span className="font-semibold">{completionPct}%</span>
                  </div>
                  <Progress value={completionPct} className="h-2" />
                  <p className="text-xs mt-2 text-white/80">
                    {progress.completedLessons.length} / {totalLessons} {t(lang, "totalLessons")}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Wave separator */}
        <div className="relative">
          <svg className="w-full" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path d="M0 40L48 42.7C96 45 192 51 288 50.7C384 50 480 43 576 42.7C672 43 768 49 864 53.3C960 57 1056 59 1152 56C1248 53 1344 45 1392 41.3L1440 38V80H0V40Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="card-hover text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Course Library - choose between all available courses */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              <Library className="h-3 w-3 mr-1" />
              {allCourses.length} courses available
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Course Library</h2>
            <p className="text-muted-foreground">
              Choose from our catalog of aviation training programs. Your progress is saved per course.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((cd, i) => {
              const courseId = slugify(cd.title);
              const courseProgress = getCourseProgress(cd);
              const isCurrentCourse = cd.title === courseData.title;
              const prereqs = COURSE_PREREQUISITES[courseId] || [];
              const completedCourses = progress.completedCourses || [];
              const missingPrereqs = prereqs.filter((p) => !completedCourses.includes(p));
              const isLocked = missingPrereqs.length > 0;
              const prereqTitles = missingPrereqs.map((pid) => {
                const match = allCourses.find((c) => slugify(c.title) === pid);
                return match ? match.title : pid;
              });
              return (
                <motion.div
                  key={courseId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className={cn(
                      "card-hover h-full cursor-pointer overflow-hidden flex flex-col",
                      isCurrentCourse && "ring-2 ring-primary",
                      isLocked && "opacity-80"
                    )}
                    onClick={() => !isLocked && handleSelectCourse(cd)}
                  >
                    <div className={cn("h-2", isLocked ? "bg-muted" : "bg-gradient-to-r from-primary to-chart-4")} />
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center text-white",
                          isLocked ? "bg-muted-foreground/30" : "bg-gradient-to-br from-primary to-chart-4"
                        )}>
                          {isLocked ? <Lock className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
                        </div>
                        {isLocked ? (
                          <Badge variant="outline" className="gap-1 text-amber-700 border-amber-400 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300">
                            <Lock className="h-3 w-3" />
                            Locked
                          </Badge>
                        ) : isCurrentCourse ? (
                          <Badge>Current</Badge>
                        ) : courseProgress.hasStarted ? (
                          <Badge variant="secondary">In Progress</Badge>
                        ) : (
                          <Badge variant="outline">New</Badge>
                        )}
                      </div>
                      <CardTitle className="mt-3 flex items-center gap-2">
                        {cd.title}
                        {isLocked && <Lock className="h-4 w-4 text-amber-500 shrink-0" />}
                      </CardTitle>
                      <CardDescription>{cd.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {cd.description}
                      </p>

                      {isLocked && (
                        <div className="mb-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200">
                          <strong>Prerequisite required:</strong> Complete {prereqTitles.join(", ")} first.
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3.5 w-3.5" />
                          {cd.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {Math.floor(cd.duration / 60)}h {cd.duration % 60}m
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {cd.modules.length} modules
                        </span>
                      </div>

                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {courseProgress.completed}/{courseProgress.total} lessons
                          </span>
                          <span className="font-semibold">{courseProgress.pct}%</span>
                        </div>
                        <Progress value={courseProgress.pct} className="h-1.5" />
                        <Button
                          className="w-full gap-2 mt-2"
                          variant={isLocked ? "outline" : isCurrentCourse ? "outline" : "default"}
                          disabled={isLocked}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLocked) handleSelectCourse(cd);
                          }}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="h-4 w-4" />
                              Locked
                            </>
                          ) : courseProgress.hasStarted ? (
                            <>
                              <Play className="h-4 w-4" />
                              Continue
                            </>
                          ) : (
                            <>
                              {t(lang, "heroCta")}
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Objectives */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              <Target className="h-3 w-3 mr-1" />
              {t(lang, "courseOverview")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t(lang, "learningObjectives")}</h2>
            <p className="text-muted-foreground">
              Master the safe transport of dangerous goods by air through comprehensive training
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-3">
            {courseData.objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{obj}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              <BookOpen className="h-3 w-3 mr-1" />
              {courseData.modules.length} {t(lang, "totalModules")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t(lang, "courseModules")}</h2>
            <p className="text-muted-foreground">
              Each module contains interactive lessons, quizzes, and practical scenarios
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.modules.map((mod, i) => {
              const moduleLessons = mod.lessons.length;
              const completedInModule = mod.lessons.filter((l) =>
                progress.completedLessons.includes(l.id)
              ).length;
              const modulePct = Math.round((completedInModule / moduleLessons) * 100);

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className="card-hover h-full cursor-pointer overflow-hidden"
                    onClick={() => {
                      const firstUncompleted = mod.lessons.find(
                        (l) => !progress.completedLessons.includes(l.id)
                      ) || mod.lessons[0];
                      setSelectedLesson(firstUncompleted.id);
                    }}
                  >
                    <div
                      className="h-2"
                      style={{ background: `linear-gradient(90deg, ${mod.color}, ${mod.color}80)` }}
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: mod.color }}
                        >
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <Badge variant="outline">{mod.code}</Badge>
                      </div>
                      <CardTitle className="mt-3">{mod.title}</CardTitle>
                      <CardDescription>{mod.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{moduleLessons} {t(lang, "totalLessons")}</span>
                          <span>{completedInModule}/{moduleLessons}</span>
                        </div>
                        <Progress value={modulePct} className="h-1.5" />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mod.lessons.slice(0, 3).map((lesson) => (
                            <Badge
                              key={lesson.id}
                              variant={progress.completedLessons.includes(lesson.id) ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {lesson.code}
                            </Badge>
                          ))}
                          {mod.lessons.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{mod.lessons.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Interactive Learning Experience</h2>
            <p className="text-muted-foreground">Multiple ways to master the content</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Headphones, title: "Voice Narration", desc: "AI-powered narration for every lesson with speed and voice control" },
              { icon: Globe2, title: "Multi-Language", desc: "Learn in English, French, or Arabic with full RTL support" },
              { icon: Sparkles, title: "Scenario Simulations", desc: "Real-world incident scenarios with instant feedback" },
              { icon: Brain, title: "Smart Flashcards", desc: "Master key terms and codes with spaced repetition" },
              { icon: Bot, title: "AI Tutor", desc: "Ask questions and get answers trained on course content" },
              { icon: Award, title: "Certificate", desc: "Earn a verifiable certificate upon passing the final exam" },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="card-hover h-full">
                    <CardContent className="pt-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center text-white mb-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t(lang, "testimonials")}</h2>
            <p className="text-muted-foreground">Trusted by aviation professionals worldwide</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {courseData.testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t(lang, "faq")}</h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {courseData.faq.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 animated-gradient opacity-90" />
          <div className="relative p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Master Dangerous Goods Regulations?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of aviation professionals who have completed this comprehensive training program.
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 gap-2"
              onClick={() => {
                if (progress.completedLessons.length > 0) {
                  setSelectedLesson(nextLesson.id);
                } else {
                  setSelectedLesson(courseData.modules[0].lessons[0].id);
                }
              }}
            >
              {progress.completedLessons.length > 0 ? t(lang, "continueLearning") : t(lang, "heroCta")}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
