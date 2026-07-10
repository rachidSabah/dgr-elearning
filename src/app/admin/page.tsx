"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  Activity,
  Plus,
  FileEdit,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  UserCog,
  PenTool,
  BarChart3,
  Settings,
  ScrollText,
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
  details: unknown;
  ipAddress: string | null;
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

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// ---------- Constants ----------
const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ACADEMY_ADMIN: "Academy Admin",
  INSTRUCTOR: "Instructor",
  STUDENT: "Student",
  CONTENT_EDITOR: "Content Editor",
};

const ROLE_ORDER: (keyof typeof ROLE_LABELS)[] = [
  "SUPER_ADMIN",
  "ACADEMY_ADMIN",
  "INSTRUCTOR",
  "STUDENT",
  "CONTENT_EDITOR",
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
  slate: "rgba(100, 116, 139, 0.4)",
  slateBorder: "rgb(100, 116, 139)",
};

// ---------- Helpers ----------
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 0) return "just now";
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function formatLongDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getLast7Days(): { labels: string[]; dates: Date[] } {
  const labels: string[] = [];
  const dates: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    dates.push(d);
    labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
  }
  return { labels, dates };
}

function getActionColor(action: string): string {
  if (action.startsWith("CREATE")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (action.startsWith("UPDATE")) return "bg-sky-100 text-sky-700 border-sky-200";
  if (action.startsWith("DELETE")) return "bg-red-100 text-red-700 border-red-200";
  if (action === "LOGIN") return "bg-violet-100 text-violet-700 border-violet-200";
  if (action === "LOGOUT") return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-amber-100 text-amber-700 border-amber-200";
}

function prettifyAction(action: string): string {
  return action
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ---------- Page ----------
export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({})),
      fetch("/api/admin/analytics").then((r) => r.json()).catch(() => ({})),
    ])
      .then(([userRes, analyticsRes]) => {
        if (!mounted) return;
        if (userRes?.user) setUser(userRes.user);
        if (analyticsRes?.error) {
          setError(analyticsRes.error);
        } else if (analyticsRes?.data) {
          setData(analyticsRes.data);
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

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Failed to load dashboard</h2>
        <p className="text-slate-500 mt-1 max-w-md text-sm">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <Loader2 className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  // ---------- Build chart data ----------
  const roleLabels = ROLE_ORDER.map((r) => ROLE_LABELS[r]);
  const roleValues = ROLE_ORDER.map((r) => data.usersByRole[r] || 0);
  const roleColors = [
    CHART_PALETTE.sky,
    CHART_PALETTE.blue,
    CHART_PALETTE.violet,
    CHART_PALETTE.emerald,
    CHART_PALETTE.amber,
  ];

  const usersByRoleData = {
    labels: roleLabels,
    datasets: [
      {
        label: "Users",
        data: roleValues,
        backgroundColor: roleColors,
        borderColor: roleColors.map((c) => c.replace(/0\.75\)/, "1)")),
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const draftCourses = Math.max(0, data.totalCourses - data.publishedCourses);
  const courseStatusData = {
    labels: ["Published", "Draft"],
    datasets: [
      {
        data: [data.publishedCourses, draftCourses],
        backgroundColor: [CHART_PALETTE.emerald, CHART_PALETTE.slate],
        borderColor: [CHART_PALETTE.emeraldBorder, CHART_PALETTE.slateBorder],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  // Last 7 days activity trend (from recent audit logs)
  const { labels: dayLabels, dates: dayDates } = getLast7Days();
  const activityByDay = dayDates.map((day) => {
    const dayStart = day.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    return data.recentActivity.filter((log) => {
      const t = new Date(log.createdAt).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;
  });

  const activityTrendData = {
    labels: dayLabels,
    datasets: [
      {
        label: "Audit Events",
        data: activityByDay,
        borderColor: CHART_PALETTE.skyBorder,
        backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return "rgba(14, 165, 233, 0.15)";
          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(14, 165, 233, 0.35)");
          gradient.addColorStop(1, "rgba(14, 165, 233, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: CHART_PALETTE.skyBorder,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // ---------- Stat cards ----------
  const stats = [
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: Users,
      gradient: "from-sky-500 to-blue-600",
      iconBg: "bg-white/20",
      hint: `${data.usersByRole.STUDENT || 0} students`,
    },
    {
      label: "Total Courses",
      value: data.totalCourses,
      icon: BookOpen,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-white/20",
      hint: `${data.publishedCourses} published`,
    },
    {
      label: "Total Enrollments",
      value: data.totalEnrollments,
      icon: GraduationCap,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-white/20",
      hint: `${data.activeEnrollments} active`,
    },
    {
      label: "Total Certificates",
      value: data.totalCertificates,
      icon: Award,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-white/20",
      hint: `${data.completedEnrollments} completions`,
    },
  ];

  // ---------- Quick actions ----------
  const quickActions = [
    {
      label: "Create Course",
      description: "Add a new training course",
      icon: Plus,
      href: "/admin/courses",
      gradient: "from-sky-500 to-blue-600",
    },
    {
      label: "Add User",
      description: "Invite team members or students",
      icon: UserCog,
      href: "/admin/users",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Content Editor",
      description: "Author lesson content",
      icon: FileEdit,
      href: "/admin/content-editor",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Media Library",
      description: "Manage images and assets",
      icon: ImageIcon,
      href: "/admin/media-library",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      label: "View Analytics",
      description: "Detailed reports & insights",
      icon: BarChart3,
      href: "/admin/analytics",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      label: "Settings",
      description: "Configure academy settings",
      icon: Settings,
      href: "/admin/settings",
      gradient: "from-slate-600 to-slate-800",
    },
  ];

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

  const barOptions = {
    ...baseChartOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.15)" },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 11 }, precision: 0 },
      },
    },
  };

  const lineOptions = {
    ...baseChartOptions,
    plugins: { ...baseChartOptions.plugins, legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.15)" },
        ticks: { color: "rgb(100, 116, 139)", font: { size: 11 }, precision: 0 },
      },
    },
  };

  const adminName = user?.name || user?.email?.split("@")[0] || "Administrator";
  const roleLabel = user?.role ? ROLE_LABELS[user.role] || user.role : "Admin";

  return (
    <div className="space-y-6">
      {/* ---------- Welcome Header ---------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-500 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-blue-600 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-medium uppercase tracking-wider text-sky-300">
                Admin Console
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Welcome back, {adminName}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Here&apos;s what&apos;s happening at DGR Aviation Academy today.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <ShieldCheck className="h-3 w-3 mr-1" /> {roleLabel}
              </Badge>
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                {formatLongDate()}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => router.push("/admin/analytics")}
              className="bg-white text-slate-900 hover:bg-slate-100"
            >
              <BarChart3 className="h-4 w-4 mr-2" /> View Analytics
            </Button>
            <Button
              onClick={() => router.push("/admin/courses")}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> New Course
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- Stat Cards ---------- */}
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
                    <p className="text-3xl font-bold mt-2">{stat.value.toLocaleString()}</p>
                    <p className="text-white/70 text-xs mt-1">{stat.hint}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${stat.iconBg} backdrop-blur-sm flex items-center justify-center`}>
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
                <Users className="h-4 w-4 text-sky-600" />
              </span>
              User Roles Distribution
            </CardTitle>
            <CardDescription>Users grouped by their assigned role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {data.totalUsers === 0 ? (
                <EmptyState
                  icon={<Users className="h-8 w-8 text-slate-400" />}
                  title="No users yet"
                  description="Users will appear here once they register."
                />
              ) : (
                <Bar data={usersByRoleData} options={barOptions} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-emerald-600" />
              </span>
              Course Distribution
            </CardTitle>
            <CardDescription>Courses grouped by publication status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              {data.totalCourses === 0 ? (
                <EmptyState
                  icon={<BookOpen className="h-8 w-8 text-slate-400" />}
                  title="No courses yet"
                  description="Create your first course to see distribution."
                />
              ) : (
                <div className="w-full max-w-xs">
                  <Doughnut
                    data={courseStatusData}
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
      </div>

      {/* ---------- Charts Row 2 + Quick Actions ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-sky-600" />
              </span>
              Recent Activity
            </CardTitle>
            <CardDescription>Audit events logged in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {data.recentActivity.length === 0 ? (
                <EmptyState
                  icon={<Activity className="h-8 w-8 text-slate-400" />}
                  title="No recent activity"
                  description="Audit events will populate this chart as users interact with the system."
                />
              ) : (
                <Line data={activityTrendData} options={lineOptions} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-violet-600" />
              </span>
              Quick Actions
            </CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => router.push(action.href)}
                  className="w-full group flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm shrink-0`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {action.label}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ---------- Recent Audit Logs Table ---------- */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ScrollText className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </span>
                Recent Audit Logs
              </CardTitle>
              <CardDescription>Latest 10 administrative actions</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/settings")}
            >
              View All Logs
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <EmptyState
              icon={<ScrollText className="h-8 w-8 text-slate-400" />}
              title="No audit logs yet"
              description="Administrative actions will be recorded here for traceability."
            />
          ) : (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-500">User</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-500">Action</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-500">Entity</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-500">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentActivity.map((log) => (
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
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getActionColor(
                            log.action
                          )}`}
                        >
                          {prettifyAction(log.action)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {log.entity ? (
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                            {log.entity}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500" title={new Date(log.createdAt).toLocaleString()}>
                          {formatRelativeTime(log.createdAt)}
                        </span>
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
    <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</p>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}
