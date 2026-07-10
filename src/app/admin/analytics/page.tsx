"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import {
  Users,
  TrendingUp,
  Target,
  Award,
  Activity,
  AlertCircle,
  Loader2,
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  GraduationCap,
  CheckCircle2,
  Clock,
  CircleDashed,
  Trophy,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

// ---------- Types ----------
interface RecentActivity {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
}

interface CourseCompletion {
  courseId: string;
  title: string;
  slug: string;
  isPublished: boolean;
  enrolled: number;
  completed: number;
  completionRate: number;
}

interface AnalyticsData {
  totalUsers: number;
  usersByRole: Record<string, number>;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalCertificates: number;
  totalQuizAttempts: number;
  averageScore: number;
  recentActivity: RecentActivity[];
  courseCompletion: CourseCompletion[];
}

type DateRange = "7d" | "30d" | "90d" | "all";

// ---------- Constants ----------
const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

const CHART_PALETTE = {
  sky: "rgba(14, 165, 233, 0.75)",
  skyBorder: "rgb(14, 165, 233)",
  blue: "rgba(37, 99, 235, 0.75)",
  blueBorder: "rgb(37, 99, 235)",
  violet: "rgba(139, 92, 246, 0.75)",
  violetBorder: "rgb(139, 92, 246)",
  emerald: "rgba(16, 185, 129, 0.75)",
  emeraldBorder: "rgb(16, 185, 129)",
  amber: "rgba(245, 158, 11, 0.75)",
  amberBorder: "rgb(245, 158, 11)",
  rose: "rgba(244, 63, 94, 0.75)",
  roseBorder: "rgb(244, 63, 94)",
  slate: "rgba(100, 116, 139, 0.4)",
  slateBorder: "rgb(100, 116, 139)",
};

// ---------- Helpers ----------
function getLastNDays(n: number): { labels: string[]; dates: Date[] } {
  const labels: string[] = [];
  const dates: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    dates.push(d);
    labels.push(
      d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    );
  }
  return { labels, dates };
}

function shortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------- Page ----------
export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((res) => {
        if (!mounted) return;
        if (res.error) {
          setError(res.error);
        } else if (res.data) {
          setData(res.data);
        } else {
          setError("Unexpected response from analytics API");
        }
      })
      .catch((e) => {
        if (mounted) setError(String(e));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // ---------- Derived metrics ----------
  const totalStudents = data?.usersByRole.STUDENT || 0;

  // Active learners: distinct users from recentActivity within last 7 days (best available proxy)
  const activeLearners = useMemo(() => {
    if (!data) return 0;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const userIds = new Set<string>();
    for (const log of data.recentActivity) {
      if (new Date(log.createdAt).getTime() >= sevenDaysAgo && log.user?.id) {
        userIds.add(log.user.id);
      }
    }
    return userIds.size;
  }, [data]);

  const completionRate =
    data && data.totalEnrollments > 0
      ? Math.round((data.completedEnrollments / data.totalEnrollments) * 1000) / 10
      : 0;

  const avgExamScore = data?.averageScore || 0;

  // ---------- Chart data ----------
  const enrollmentsByCourseData = useMemo(() => {
    if (!data) return null;
    const courses = data.courseCompletion.filter((c) => c.enrolled > 0);
    return {
      labels: courses.map((c) => c.title.length > 24 ? c.title.slice(0, 24) + "…" : c.title),
      datasets: [
        {
          label: "Enrollments",
          data: courses.map((c) => c.enrolled),
          backgroundColor: courses.map((_, i) =>
            i % 4 === 0
              ? CHART_PALETTE.sky
              : i % 4 === 1
              ? CHART_PALETTE.blue
              : i % 4 === 2
              ? CHART_PALETTE.violet
              : CHART_PALETTE.emerald
          ),
          borderColor: CHART_PALETTE.skyBorder,
          borderWidth: 1.5,
          borderRadius: 6,
        },
      ],
    };
  }, [data]);

  // Daily active users trend: derived from audit logs over the selected window
  const dauTrendData = useMemo(() => {
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 30;
    const { labels, dates } = getLastNDays(days);
    const counts = dates.map((day) => {
      const dayStart = day.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const userIds = new Set<string>();
      for (const log of data?.recentActivity || []) {
        const t = new Date(log.createdAt).getTime();
        if (t >= dayStart && t < dayEnd && log.user?.id) {
          userIds.add(log.user.id);
        }
      }
      return userIds.size;
    });
    return {
      labels,
      datasets: [
        {
          label: "Active Users",
          data: counts,
          borderColor: CHART_PALETTE.violetBorder,
          backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
            const chart = ctx.chart;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return "rgba(139, 92, 246, 0.15)";
            const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, "rgba(139, 92, 246, 0.35)");
            gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: CHART_PALETTE.violetBorder,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [data, dateRange]);

  // Completion status doughnut
  const completionStatusData = useMemo(() => {
    if (!data) return null;
    const completed = data.completedEnrollments;
    const inProgress = data.activeEnrollments;
    const notStarted = Math.max(0, data.totalEnrollments - completed - inProgress);
    return {
      labels: ["Completed", "In Progress", "Not Started"],
      datasets: [
        {
          data: [completed, inProgress, notStarted],
          backgroundColor: [CHART_PALETTE.emerald, CHART_PALETTE.sky, CHART_PALETTE.slate],
          borderColor: [CHART_PALETTE.emeraldBorder, CHART_PALETTE.skyBorder, CHART_PALETTE.slateBorder],
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };
  }, [data]);

  // Top 5 courses by enrollment (horizontal bar)
  const topCoursesData = useMemo(() => {
    if (!data) return null;
    const top = [...data.courseCompletion].sort((a, b) => b.enrolled - a.enrolled).slice(0, 5);
    return {
      labels: top.map((c) => c.title.length > 22 ? c.title.slice(0, 22) + "…" : c.title),
      datasets: [
        {
          label: "Enrolled",
          data: top.map((c) => c.enrolled),
          backgroundColor: [
            CHART_PALETTE.sky,
            CHART_PALETTE.blue,
            CHART_PALETTE.violet,
            CHART_PALETTE.emerald,
            CHART_PALETTE.amber,
          ],
          borderColor: [
            CHART_PALETTE.skyBorder,
            CHART_PALETTE.blueBorder,
            CHART_PALETTE.violetBorder,
            CHART_PALETTE.emeraldBorder,
            CHART_PALETTE.amberBorder,
          ],
          borderWidth: 1.5,
          borderRadius: 6,
        },
      ],
    };
  }, [data]);

  // ---------- Chart options ----------
  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "rgb(71, 85, 105)",
          font: { size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle" as const,
        },
      },
      tooltip: {
        backgroundColor: "rgb(15, 23, 42)",
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
      },
    },
  };

  const verticalBarOptions = {
    ...baseChartOptions,
    plugins: { ...baseChartOptions.plugins, legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 10 }, maxRotation: 45, minRotation: 0 },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.15)" },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 11 }, precision: 0 },
      },
    },
  };

  const horizontalBarOptions = {
    ...baseChartOptions,
    indexAxis: "y" as const,
    plugins: { ...baseChartOptions.plugins, legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.15)" },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 11 }, precision: 0 },
      },
      y: {
        grid: { display: false },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 11 } },
      },
    },
  };

  const lineOptions = {
    ...baseChartOptions,
    plugins: { ...baseChartOptions.plugins, legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "rgb(100, 116, 139)",
          font: { size: 10 },
          maxTicksLimit: 8,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.15)" },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 11 }, precision: 0 },
      },
    },
  };

  // ---------- Render ----------
  if (loading) return <AnalyticsSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Failed to load analytics</h2>
        <p className="text-slate-500 mt-1 max-w-md text-sm">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <Loader2 className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      gradient: "from-sky-500 to-blue-600",
      hint: `${data.totalUsers} total users`,
    },
    {
      label: "Active Learners",
      value: activeLearners,
      icon: Activity,
      gradient: "from-violet-500 to-purple-600",
      hint: "Logged in last 7 days",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: Target,
      gradient: "from-emerald-500 to-teal-600",
      hint: `${data.completedEnrollments} of ${data.totalEnrollments}`,
    },
    {
      label: "Avg Exam Score",
      value: `${avgExamScore}%`,
      icon: Award,
      gradient: "from-amber-500 to-orange-600",
      hint: `${data.totalQuizAttempts} attempts`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ---------- Header ---------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-sky-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-medium uppercase tracking-wider text-sky-300">
                Reports & Insights
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Analytics &amp; Reports</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Track learner engagement, course performance, and identify opportunities for improvement.
            </p>
          </div>

          {/* Date Range Selector */}
          <div className="flex flex-wrap gap-2 items-center">
            <Calendar className="h-4 w-4 text-slate-400 mr-1 hidden sm:block" />
            <div className="inline-flex rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-1">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    dateRange === range.value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-5">
          <Button
            size="sm"
            className="bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
            variant="outline"
            onClick={() => {/* visual only */}}
          >
            <FileText className="h-4 w-4 mr-2" /> Export PDF
          </Button>
          <Button
            size="sm"
            className="bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
            variant="outline"
            onClick={() => {/* visual only */}}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
          </Button>
          <Button
            size="sm"
            className="bg-white text-slate-900 hover:bg-slate-100"
            onClick={() => {/* visual only */}}
          >
            <Download className="h-4 w-4 mr-2" /> Download Report
          </Button>
        </div>
      </div>

      {/* ---------- Stats Grid ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className={`relative overflow-hidden border-0 text-white bg-gradient-to-br ${stat.gradient} shadow-lg`}
            >
              <CardContent className="pt-6 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-white/70 text-xs mt-1">{stat.hint}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ---------- Charts Row 1 ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-sky-600" />
              </span>
              Enrollments by Course
            </CardTitle>
            <CardDescription>Total enrollments per course offering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {!enrollmentsByCourseData ||
              enrollmentsByCourseData.datasets[0].data.length === 0 ? (
                <EmptyState
                  icon={<GraduationCap className="h-8 w-8 text-slate-400" />}
                  title="No enrollments yet"
                  description="Enrollments will appear here once students register for courses."
                />
              ) : (
                <Bar data={enrollmentsByCourseData} options={verticalBarOptions} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-violet-600" />
              </span>
              Daily Active Users
            </CardTitle>
            <CardDescription>
              Unique active users per day — {DATE_RANGES.find((r) => r.value === dateRange)?.label.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {!data.recentActivity.length ? (
                <EmptyState
                  icon={<Activity className="h-8 w-8 text-slate-400" />}
                  title="No activity recorded"
                  description="Active user trends will populate as users engage with the platform."
                />
              ) : (
                <Line data={dauTrendData} options={lineOptions} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Charts Row 2 ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </span>
              Course Completion Status
            </CardTitle>
            <CardDescription>Enrollments grouped by completion state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              {data.totalEnrollments === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="h-8 w-8 text-slate-400" />}
                  title="No enrollments yet"
                  description="Completion status will display once enrollments exist."
                />
              ) : (
                <div className="w-full max-w-xs">
                  <Doughnut
                    data={completionStatusData!}
                    options={{
                      ...baseChartOptions,
                      cutout: "65%",
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-amber-600" />
              </span>
              Top 5 Courses by Enrollment
            </CardTitle>
            <CardDescription>Most popular course offerings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {!topCoursesData || topCoursesData.datasets[0].data.length === 0 ? (
                <EmptyState
                  icon={<Trophy className="h-8 w-8 text-slate-400" />}
                  title="No course data"
                  description="Top courses will be ranked here once enrollments exist."
                />
              ) : (
                <Bar data={topCoursesData} options={horizontalBarOptions} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Tables Row ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performing students */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="h-4 w-4 text-amber-600" />
              </span>
              Top Performing Students
              <Badge variant="secondary" className="ml-auto text-xs">
                By avg score
              </Badge>
            </CardTitle>
            <CardDescription>Highest achieving learners across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Award className="h-8 w-8 text-slate-400" />}
              title="Per-student analytics coming soon"
              description="Detailed per-student performance breakdowns require an extended analytics endpoint. Connect additional data sources to enable leaderboard insights."
            />
          </CardContent>
        </Card>

        {/* Weak topics */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
              </span>
              Weak Topics
              <Badge variant="secondary" className="ml-auto text-xs">
                Lowest scoring
              </Badge>
            </CardTitle>
            <CardDescription>Lessons with the lowest average quiz scores</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<AlertTriangle className="h-8 w-8 text-slate-400" />}
              title="Lesson-level analytics coming soon"
              description="Quiz-attempt breakdowns by lesson require an extended analytics endpoint. Add per-lesson quiz aggregation to surface weak topics here."
            />
          </CardContent>
        </Card>
      </div>

      {/* ---------- Completion Status Legend Cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm border-l-4 border-l-emerald-500">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{data.completedEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-sky-500">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">In Progress</p>
                <p className="text-2xl font-bold text-slate-900">{data.activeEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-slate-400">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <CircleDashed className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Not Started</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.max(0, data.totalEnrollments - data.completedEnrollments - data.activeEnrollments)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Recent Activity Summary ---------- */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-sky-600" />
            </span>
            Recent Activity Summary
          </CardTitle>
          <CardDescription>Most recent {data.recentActivity.length} platform events</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <EmptyState
              icon={<TrendingUp className="h-8 w-8 text-slate-400" />}
              title="No recent activity"
              description="Platform events will appear here as users interact with the system."
            />
          ) : (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-500">User</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-500">Action</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-500">Entity</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-500">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentActivity.slice(0, 8).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                            {(log.user?.name || log.user?.email || "A")
                              .split(" ")
                              .map((s) => s[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              {log.user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{log.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {log.action.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")}
                        </span>
                      </TableCell>
                      <TableCell>
                        {log.entity ? (
                          <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                            {log.entity}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500">{shortDate(log.createdAt)}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Sub-components ----------
function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4 min-h-[200px]">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</p>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-44 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
