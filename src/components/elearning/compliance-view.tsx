"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useAllCourses } from "@/lib/use-course";
import { slugify } from "@/lib/courses-registry";
import { exportComplianceToCSV, computeComplianceRows, type ComplianceRow } from "@/lib/csv-export";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Calendar,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Bell,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// DGR training: 2 years. First aid: 1 year.
function getValidityYears(courseTitle: string): number {
  return courseTitle.toLowerCase().includes("first aid") ? 1 : 2;
}

interface LocalCompliance {
  courseId: string;
  courseTitle: string;
  completionDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: "Valid" | "Expiring Soon" | "Expired" | "Not Started";
}

export function ComplianceView() {
  const { progress, studentName, setView, setSelectedCourse } = useAppStore();
  const allCourses = useAllCourses();
  const [mounted, setMounted] = useState(false);
  const [reminder, setReminder] = useState<string | null>(null);
  const [orgRows, setOrgRows] = useState<ComplianceRow[]>([]);

  useEffect(() => {
    setMounted(true);
    setOrgRows(computeComplianceRows());
  }, []);

  // Compute the current user's compliance from their Zustand store progress
  const myCompliance: LocalCompliance[] = useMemo(() => {
    return allCourses.map((c) => {
      const courseId = slugify(c.title);
      const years = getValidityYears(c.title);
      const completionDate = progress.examScore?.date && progress.certificateEarned
        ? new Date(progress.examScore.date)
        : null;
      if (!completionDate) {
        return {
          courseId,
          courseTitle: c.title,
          completionDate: "",
          expiryDate: "",
          daysRemaining: 0,
          status: "Not Started" as const,
        };
      }
      const expiry = new Date(completionDate);
      expiry.setFullYear(expiry.getFullYear() + years);
      const now = new Date();
      const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let status: LocalCompliance["status"] = "Valid";
      if (daysRemaining < 0) status = "Expired";
      else if (daysRemaining < 30) status = "Expiring Soon";
      return {
        courseId,
        courseTitle: c.title,
        completionDate: completionDate.toISOString().slice(0, 10),
        expiryDate: expiry.toISOString().slice(0, 10),
        daysRemaining,
        status,
      };
    });
  }, [allCourses, progress.examScore, progress.certificateEarned]);

  const stats = useMemo(() => {
    const valid = myCompliance.filter((r) => r.status === "Valid").length;
    const expiring = myCompliance.filter((r) => r.status === "Expiring Soon").length;
    const expired = myCompliance.filter((r) => r.status === "Expired").length;
    const notStarted = myCompliance.filter((r) => r.status === "Not Started").length;
    return { valid, expiring, expired, notStarted };
  }, [myCompliance]);

  const handleScheduleRecert = (row: LocalCompliance | ComplianceRow) => {
    const title = "courseTitle" in row ? row.courseTitle : "";
    const exp = "expiryDate" in row ? row.expiryDate : "";
    const msg = `Recertification reminder set for "${title}"${exp ? ` (expiring ${exp})` : ""}. We'll remind you 30 days before expiry via the dashboard.`;
    setReminder(msg);
    toast.success("Reminder scheduled", { description: msg });
  };

  const handleExport = () => {
    try {
      exportComplianceToCSV();
      toast.success("Compliance report exported");
    } catch (e) {
      toast.error("Export failed", { description: e instanceof Error ? e.message : "Unknown error" });
    }
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
        <div className="h-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Compliance &amp; Recurrency</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Track training expiry dates for {studentName || "your account"}. DGR training is valid for
            2 years; First Aid training is valid for 1 year. Renew before expiry to stay compliant.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2 shrink-0">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* Reminder banner */}
      {reminder && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <div className="flex items-start gap-3 p-4 rounded-lg bg-sky-500/10 border border-sky-500/30">
            <Bell className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <div className="font-semibold mb-1">Reminder scheduled</div>
              <div className="text-muted-foreground">{reminder}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setReminder(null)}>
              Dismiss
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Valid</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Expiring (&lt;30d)</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.expiring}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Expired</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-muted-foreground">Not Started</span>
            </div>
            <div className="text-2xl font-bold text-slate-600">{stats.notStarted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Your compliance table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            My Training Status
          </CardTitle>
          <CardDescription>Certificates earned and their validity windows</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {myCompliance.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No courses available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myCompliance.map((row) => (
                    <TableRow key={row.courseId}>
                      <TableCell className="font-medium">{row.courseTitle}</TableCell>
                      <TableCell>
                        {row.completionDate ? (
                          <span className="flex items-center gap-1.5 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {row.completionDate}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm italic">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.expiryDate ? (
                          <span className="flex items-center gap-1.5 text-sm">
                            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                            {row.expiryDate}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm italic">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.status === "Not Started" ? (
                          <span className="text-muted-foreground text-sm">—</span>
                        ) : (
                          <span className={cn(
                            "font-medium text-sm",
                            row.daysRemaining < 0 ? "text-red-600" : row.daysRemaining < 30 ? "text-yellow-600" : "text-green-600"
                          )}>
                            {row.daysRemaining < 0 ? `${Math.abs(row.daysRemaining)}d overdue` : `${row.daysRemaining}d`}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {row.status === "Not Started" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCourse(row.courseId);
                              setView("dashboard");
                            }}
                          >
                            Start Course
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScheduleRecert(row)}
                            className="gap-1.5"
                          >
                            <Bell className="h-3.5 w-3.5" />
                            Schedule Recert
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organization-wide compliance */}
      {orgRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Organization Compliance ({orgRows.length})
            </CardTitle>
            <CardDescription>
              Recurrency status across all enrolled students. Use Export CSV above to download.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgRows.map((r, i) => (
                    <TableRow key={`${r.studentId}-${r.courseId}-${i}`}>
                      <TableCell>
                        <div className="font-medium text-sm">{r.studentName}</div>
                        <div className="text-xs text-muted-foreground">{r.email}</div>
                      </TableCell>
                      <TableCell className="text-sm">{r.courseTitle}</TableCell>
                      <TableCell className="text-sm">
                        {r.completionDate || <span className="text-muted-foreground italic">—</span>}
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.expiryDate || <span className="text-muted-foreground italic">—</span>}
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.status === "Not Started" ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className={cn(
                            r.daysRemaining < 0 ? "text-red-600 font-medium" : r.daysRemaining < 30 ? "text-yellow-600 font-medium" : "text-green-600"
                          )}>
                            {r.daysRemaining < 0 ? `${Math.abs(r.daysRemaining)}d overdue` : `${r.daysRemaining}d`}
                          </span>
                        )}
                      </TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Color legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          Valid (&gt;90 days remaining)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          Expiring Soon (30–90 days)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          Critical / Expired (&lt;30 days or overdue)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-400" />
          Not Started
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LocalCompliance["status"] }) {
  switch (status) {
    case "Valid":
      return (
        <Badge className="bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Valid
        </Badge>
      );
    case "Expiring Soon":
      return (
        <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expiring
        </Badge>
      );
    case "Expired":
      return (
        <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    case "Not Started":
      return (
        <Badge variant="outline">
          <FileText className="h-3 w-3 mr-1" />
          Not Started
        </Badge>
      );
  }
}
