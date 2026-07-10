"use client";

import { useAppStore } from "@/lib/store";
import { courseData } from "@/lib/course-data";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  Flame,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Radar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

export function AnalyticsView() {
  const { progress, language } = useAppStore();
  const lang = language || "en";

  const totalLessons = courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  // Module progress data
  const moduleProgressData = {
    labels: courseData.modules.map((m) => m.code),
    datasets: [
      {
        label: "Completed",
        data: courseData.modules.map(
          (m) => m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length
        ),
        backgroundColor: "rgba(14, 165, 233, 0.6)",
        borderColor: "rgb(14, 165, 233)",
        borderWidth: 1,
      },
      {
        label: "Total",
        data: courseData.modules.map((m) => m.lessons.length),
        backgroundColor: "rgba(148, 163, 184, 0.3)",
        borderColor: "rgb(148, 163, 184)",
        borderWidth: 1,
      },
    ],
  };

  // Quiz performance
  const quizEntries = Object.entries(progress.quizScores);
  const quizPerformanceData = {
    labels: quizEntries.length > 0
      ? quizEntries.slice(-10).map(([id], i) => `Q${i + 1}`)
      : ["No quizzes yet"],
    datasets: [
      {
        label: "Quiz Scores (%)",
        data: quizEntries.length > 0
          ? quizEntries.slice(-10).map(([_, scores]) => {
              const last = scores[scores.length - 1];
              return Math.round((last.score / last.total) * 100);
            })
          : [0],
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Topic mastery (radar)
  const topicLabels = ["Awareness", "Terminology", "Classification", "Loading", "NOTOC", "Emergencies", "Reporting", "Weapons"];
  const topicMasteryData = {
    labels: topicLabels,
    datasets: [
      {
        label: "Mastery",
        data: topicLabels.map((topic) => {
          // Calculate mastery based on quiz scores for lessons related to that topic
          const relatedQuizzes = quizEntries.filter(([id]) => {
            const lesson = courseData.modules
              .flatMap((m) => m.lessons)
              .find((l) => l.id === id);
            if (!lesson) return false;
            return lesson.title.toLowerCase().includes(topic.toLowerCase()) ||
                   lesson.code.includes(topic.substring(0, 3));
          });
          if (relatedQuizzes.length === 0) return 0;
          const avg = relatedQuizzes.reduce((acc, [_, scores]) => {
            const last = scores[scores.length - 1];
            return acc + (last.score / last.total) * 100;
          }, 0) / relatedQuizzes.length;
          return Math.round(avg);
        }),
        backgroundColor: "rgba(14, 165, 233, 0.2)",
        borderColor: "rgb(14, 165, 233)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(14, 165, 233)",
      },
    ],
  };

  // Completion doughnut
  const completionData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [progress.completedLessons.length, totalLessons - progress.completedLessons.length],
        backgroundColor: ["rgba(34, 197, 94, 0.7)", "rgba(148, 163, 184, 0.3)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(148, 163, 184)"],
        borderWidth: 2,
      },
    ],
  };

  const allQuizScores = Object.values(progress.quizScores).flat();
  const avgScore = allQuizScores.length > 0
    ? Math.round(allQuizScores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / allQuizScores.length)
    : 0;

  const timeHours = Math.floor(progress.timeSpent / 3600);
  const timeMinutes = Math.floor((progress.timeSpent % 3600) / 60);

  // Weak/strong areas
  const weakAreas = topicLabels
    .map((topic, i) => ({ topic, score: topicMasteryData.datasets[0].data[i] }))
    .filter((t) => t.score > 0 && t.score < 70)
    .sort((a, b) => a.score - b.score);
  const strongAreas = topicLabels
    .map((topic, i) => ({ topic, score: topicMasteryData.datasets[0].data[i] }))
    .filter((t) => t.score >= 70)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          {t(lang, "analyticsTitle")}
        </h1>
        <p className="text-muted-foreground">
          Track your learning progress and identify areas for improvement
        </p>
      </motion.div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Completion</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round((progress.completedLessons.length / totalLessons) * 100)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Avg Quiz Score</span>
            </div>
            <div className="text-2xl font-bold">{avgScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Time Learning</span>
            </div>
            <div className="text-2xl font-bold">
              {timeHours > 0 ? `${timeHours}h ` : ""}{timeMinutes}m
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Day Streak</span>
            </div>
            <div className="text-2xl font-bold">{progress.streak}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Module progress bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Module Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={moduleProgressData}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
              }}
            />
          </CardContent>
        </Card>

        {/* Completion doughnut */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-green-500" />
              Overall Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut
              data={completionData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `${ctx.label}: ${ctx.raw} lessons`,
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Quiz performance line chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-purple-500" />
              {t(lang, "quizPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={quizPerformanceData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } },
              }}
            />
          </CardContent>
        </Card>

        {/* Topic mastery radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              {t(lang, "topicMastery")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Radar
              data={topicMasteryData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 20 },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Weak and strong areas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-red-500" />
              {t(lang, "weakAreas")}
            </CardTitle>
            <CardDescription>Topics that need more attention</CardDescription>
          </CardHeader>
          <CardContent>
            {weakAreas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Take more quizzes to identify areas for improvement.
              </p>
            ) : (
              <div className="space-y-3">
                {weakAreas.map((area) => (
                  <div key={area.topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{area.topic}</span>
                      <span className="font-semibold text-red-600">{area.score}%</span>
                    </div>
                    <Progress value={area.score} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              {t(lang, "strongAreas")}
            </CardTitle>
            <CardDescription>Topics you've mastered</CardDescription>
          </CardHeader>
          <CardContent>
            {strongAreas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Score 70%+ on topic quizzes to see your strong areas here.
              </p>
            ) : (
              <div className="space-y-3">
                {strongAreas.map((area) => (
                  <div key={area.topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{area.topic}</span>
                      <span className="font-semibold text-green-600">{area.score}%</span>
                    </div>
                    <Progress value={area.score} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progress.achievements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No achievements yet. Complete lessons and quizzes to earn badges!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {progress.achievements.map((ach) => (
                <Badge key={ach} variant="secondary" className="capitalize">
                  {ach.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
