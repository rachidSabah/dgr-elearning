"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Award,
  User,
  BookOpen,
  Calendar,
  Trophy,
  Hash,
  Plane,
  ArrowLeft,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CertificateRecord {
  certificateNumber: string;
  studentName: string;
  courseName: string;
  courseId?: string;
  completionDate: string; // ISO string
  score?: number; // 0-100
  examScore?: number;
  examTotal?: number;
  edition?: string;
  issuedAt?: string;
  expiresAt?: string;
}

type VerifyStatus = "idle" | "searching" | "valid" | "expired" | "not-found";

// ---------------------------------------------------------------------------
// Helpers – read certificates from the various client-side storage locations
// ---------------------------------------------------------------------------

/**
 * Read the dedicated certificate registry (if present). Future certificate
 * issuance code is expected to push records here under the key
 * `dgr-academy-certificates`.
 */
function readCertificateRegistry(): CertificateRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("dgr-academy-certificates");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c) => c && typeof c === "object" && c.certificateNumber)
      .map((c) => ({
        certificateNumber: String(c.certificateNumber).trim().toUpperCase(),
        studentName: c.studentName || c.name || "Learner",
        courseName: c.courseName || c.course || "Dangerous Goods Regulations",
        courseId: c.courseId,
        completionDate: c.completionDate || c.date || new Date().toISOString(),
        score: typeof c.score === "number" ? c.score : undefined,
        examScore: c.examScore,
        examTotal: c.examTotal,
        edition: c.edition,
        issuedAt: c.issuedAt || c.completionDate || c.date,
        expiresAt: c.expiresAt,
      }));
  } catch {
    return [];
  }
}

/**
 * Read the persisted Zustand store at `dgr-elearning-storage`. The certificate
 * is stored inside `state.progress` (`certificateEarned`, `certificateNumber`,
 * `examScore`, `studentName`). The active course id lives in
 * `state.selectedCourseId`.
 */
function readZustandCertificates(): CertificateRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("dgr-elearning-storage");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Zustand persist wraps the state in { state: ..., version: ... }
    const state = parsed?.state ?? parsed;
    if (!state || typeof state !== "object") return [];

    const progress = state.progress || {};
    const studentName = state.studentName || "Learner";
    const selectedCourseId =
      state.selectedCourseId || "dangerous-goods-regulations";

    const certs: CertificateRecord[] = [];

    if (progress.certificateEarned && progress.certificateNumber) {
      const exam = progress.examScore;
      const scorePct =
        exam &&
        typeof exam.score === "number" &&
        typeof exam.total === "number" &&
        exam.total > 0
          ? Math.round((exam.score / exam.total) * 100)
          : undefined;
      certs.push({
        certificateNumber: String(progress.certificateNumber)
          .trim()
          .toUpperCase(),
        studentName,
        courseName: courseIdToName(selectedCourseId),
        courseId: selectedCourseId,
        completionDate: exam?.date || new Date().toISOString(),
        score: scorePct,
        examScore: exam?.score,
        examTotal: exam?.total,
        edition: "2024 Edition",
        issuedAt: exam?.date,
      });
    }

    // The Zustand store may also keep a per-course progress map (if the app
    // ever stores certificates for multiple courses on the same browser).
    if (Array.isArray(progress.courseCertificates)) {
      for (const c of progress.courseCertificates) {
        if (c && c.certificateNumber) {
          certs.push({
            certificateNumber: String(c.certificateNumber)
              .trim()
              .toUpperCase(),
            studentName: c.studentName || studentName,
            courseName: c.courseName || courseIdToName(c.courseId),
            courseId: c.courseId,
            completionDate:
              c.completionDate || c.date || new Date().toISOString(),
            score: typeof c.score === "number" ? c.score : undefined,
            examScore: c.examScore,
            examTotal: c.examTotal,
            edition: c.edition,
            issuedAt: c.issuedAt || c.completionDate,
          });
        }
      }
    }

    return certs;
  } catch {
    return [];
  }
}

/** Map course ids to human-friendly course names. */
function courseIdToName(courseId?: string): string {
  if (!courseId) return "Dangerous Goods Regulations";
  const map: Record<string, string> = {
    "dangerous-goods-regulations": "Dangerous Goods Regulations",
    "cabin-crew-first-aid-training": "Cabin Crew First Aid Training",
  };
  return map[courseId] || "DGR Aviation Academy Course";
}

/** Compute expiry date – default 2 years from completion per academy policy. */
function getExpiryDate(cert: CertificateRecord): Date {
  if (cert.expiresAt) return new Date(cert.expiresAt);
  const issued = new Date(cert.completionDate || cert.issuedAt || Date.now());
  issued.setFullYear(issued.getFullYear() + 2);
  return issued;
}

function formatDate(value?: string | Date): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VerifyCertificatePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [result, setResult] = useState<CertificateRecord | null>(null);
  const [expiry, setExpiry] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Aggregate all known certificates (registry + Zustand) on the client only.
  const allCerts = useMemo<CertificateRecord[]>(() => {
    if (!mounted) return [];
    const seen = new Set<string>();
    const merged: CertificateRecord[] = [];
    for (const cert of [
      ...readCertificateRegistry(),
      ...readZustandCertificates(),
    ]) {
      const key = cert.certificateNumber;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(cert);
      }
    }
    return merged;
  }, [mounted]);

  const handleVerify = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = query.trim().toUpperCase();
    if (!term) {
      setStatus("not-found");
      setResult(null);
      return;
    }

    setStatus("searching");
    setResult(null);
    setExpiry(null);

    // Brief delay so the searching state is perceivable (feels like a real
    // verification round-trip even though everything is local).
    window.setTimeout(() => {
      const match =
        allCerts.find((c) => c.certificateNumber === term) || null;
      if (!match) {
        setStatus("not-found");
        setResult(null);
        return;
      }
      const exp = getExpiryDate(match);
      setExpiry(exp);
      setStatus(exp.getTime() < Date.now() ? "expired" : "valid");
      setResult(match);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-80 h-80 bg-sky-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Branding header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-2xl shadow-lg">
            <Plane className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">DGR Aviation Academy</h1>
            <p className="text-xs text-sky-200">Certificate Verification Portal</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.15 }}
              className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg"
            >
              <ShieldCheck className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Verify a Certificate
            </CardTitle>
            <CardDescription className="text-sm">
              Enter the certificate number exactly as it appears on the issued
              certificate to confirm its authenticity.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Search form */}
            <form onSubmit={handleVerify} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="certNo" className="text-sm font-medium">
                  Certificate Number
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="certNo"
                    type="text"
                    placeholder="e.g. DGR-2024-AB12CD"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 h-12 text-base font-mono uppercase tracking-wide"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Certificate numbers are case-insensitive. Include the full
                  code (e.g. <span className="font-mono">DGR-2024-XXXXXX</span>).
                </p>
              </div>

              <Button
                type="submit"
                disabled={status === "searching" || !query.trim()}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 h-12 text-base"
                size="lg"
              >
                {status === "searching" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Verify Certificate
                  </>
                )}
              </Button>
            </form>

            {/* Results */}
            {status === "valid" && result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border-2 border-green-200 bg-green-50/60 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-green-100/70 border-b border-green-200">
                  <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
                  <div>
                    <p className="font-bold text-green-800 text-lg leading-tight">
                      Certificate Verified
                    </p>
                    <p className="text-xs text-green-700">
                      This certificate is genuine and currently valid.
                    </p>
                  </div>
                  <Badge className="ml-auto bg-green-600 hover:bg-green-600 text-white">
                    Valid
                  </Badge>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailRow
                    icon={<User className="h-4 w-4" />}
                    label="Student Name"
                    value={result.studentName}
                  />
                  <DetailRow
                    icon={<BookOpen className="h-4 w-4" />}
                    label="Course"
                    value={result.courseName}
                  />
                  <DetailRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Completion Date"
                    value={formatDate(result.completionDate)}
                  />
                  <DetailRow
                    icon={<Trophy className="h-4 w-4" />}
                    label="Final Score"
                    value={
                      typeof result.score === "number"
                        ? `${result.score}%`
                        : result.examScore && result.examTotal
                        ? `${result.examScore}/${result.examTotal}`
                        : "—"
                    }
                  />
                  <DetailRow
                    icon={<Hash className="h-4 w-4" />}
                    label="Certificate Number"
                    value={result.certificateNumber}
                    mono
                  />
                  <DetailRow
                    icon={<Award className="h-4 w-4" />}
                    label="Valid Until"
                    value={formatDate(expiry || undefined)}
                  />
                </div>

                <div className="px-4 pb-4">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-white/70 border border-green-200">
                    <Info className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800">
                      This certificate was issued by DGR Aviation Academy upon
                      successful completion of the training program. It is valid
                      for two (2) years from the completion date, in accordance
                      with ICAO Technical Instructions and IATA Dangerous Goods
                      Regulations.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {status === "expired" && result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border-2 border-amber-200 bg-amber-50/60 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-amber-100/70 border-b border-amber-200">
                  <AlertTriangle className="h-8 w-8 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-800 text-lg leading-tight">
                      Certificate Expired
                    </p>
                    <p className="text-xs text-amber-700">
                      This certificate is genuine but has passed its expiry date.
                    </p>
                  </div>
                  <Badge className="ml-auto bg-amber-600 hover:bg-amber-600 text-white">
                    Expired
                  </Badge>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailRow
                    icon={<User className="h-4 w-4" />}
                    label="Student Name"
                    value={result.studentName}
                  />
                  <DetailRow
                    icon={<BookOpen className="h-4 w-4" />}
                    label="Course"
                    value={result.courseName}
                  />
                  <DetailRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Completion Date"
                    value={formatDate(result.completionDate)}
                  />
                  <DetailRow
                    icon={<Trophy className="h-4 w-4" />}
                    label="Final Score"
                    value={
                      typeof result.score === "number"
                        ? `${result.score}%`
                        : "—"
                    }
                  />
                  <DetailRow
                    icon={<Hash className="h-4 w-4" />}
                    label="Certificate Number"
                    value={result.certificateNumber}
                    mono
                  />
                  <DetailRow
                    icon={<Award className="h-4 w-4" />}
                    label="Expired On"
                    value={formatDate(expiry || undefined)}
                  />
                </div>

                <div className="px-4 pb-4">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-white/70 border border-amber-200">
                    <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      The holder is encouraged to recertify by completing the
                      latest edition of the training program to maintain
                      regulatory compliance.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {status === "not-found" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border-2 border-red-200 bg-red-50/60 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-red-100/70 border-b border-red-200">
                  <XCircle className="h-8 w-8 text-red-600 shrink-0" />
                  <div>
                    <p className="font-bold text-red-800 text-lg leading-tight">
                      Certificate Not Found
                    </p>
                    <p className="text-xs text-red-700">
                      No record matches the certificate number you entered.
                    </p>
                  </div>
                  <Badge className="ml-auto bg-red-600 hover:bg-red-600 text-white">
                    Not Found
                  </Badge>
                </div>
                <div className="p-4">
                  <ul className="text-xs text-red-800 space-y-1.5 list-disc list-inside">
                    <li>Double-check the certificate number for typos.</li>
                    <li>
                      Include the full prefix (e.g.{" "}
                      <span className="font-mono">DGR-</span>).
                    </li>
                    <li>
                      Verification only works on devices where the certificate
                      was issued (the academy uses browser-local storage for
                      static hosting). For cross-device verification, please
                      contact the academy administration.
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {status === "idle" && (
              <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-sky-900 space-y-1">
                    <p className="font-semibold">How verification works</p>
                    <p>
                      Enter the certificate number printed on the certificate.
                      We check it against records stored on this device
                      (certificate registry and the local learner progress
                      store). Genuine certificates will display the student
                      name, course, completion date, and final score.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer links */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => router.push("/")}
                className="text-slate-600 hover:text-slate-800 font-medium flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Academy
              </button>
              <button
                onClick={() => router.push("/login")}
                className="text-slate-500 hover:text-slate-700"
              >
                Student Login →
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-4">
          © {new Date().getFullYear()} DGR Aviation Academy. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DetailRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/70 border border-slate-200">
      <div className="text-sky-600 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
          {label}
        </div>
        <div
          className={`text-sm font-semibold text-slate-800 break-words ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
