"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Plane,
  BookOpen,
  Building2,
  CheckCircle2,
  LogIn,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUser,
  login,
  initializeAuth,
  getAllUsersSafe,
} from "@/lib/client-auth";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEPARTMENTS = [
  "Cabin Crew",
  "Ground Operations",
  "Airport Operations",
  "Other",
] as const;
type Department = (typeof DEPARTMENTS)[number];

interface CourseOption {
  id: string;
  label: string;
  description: string;
}

const COURSE_OPTIONS: CourseOption[] = [
  {
    id: "dangerous-goods-regulations",
    label: "Dangerous Goods Regulations",
    description:
      "Cabin Crew Training Manual – Section 11 · ICAO Technical Instructions & IATA DGR",
  },
  {
    id: "cabin-crew-first-aid-training",
    label: "First Aid Training",
    description:
      "Cabin Crew Training Manual – Section 9 · Aviation first-aid & emergency response",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StudentRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeAuth();
    // If a session already exists, send the user to the academy.
    try {
      const raw = localStorage.getItem("dgr-academy-session-v2");
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.role === "STUDENT") router.push("/");
        else if (user?.role) router.push("/admin");
      }
    } catch {
      /* ignore */
    }
  }, [router]);

  // ---- Field-level validation -------------------------------------------
  const emailValid = useMemo(() => {
    if (!email) return true; // empty handled by required check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const passwordValid = useMemo(() => password.length >= 6, [password]);
  const passwordsMatch = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword]
  );
  const nameValid = useMemo(() => name.trim().length >= 2, [name]);
  const departmentValid = useMemo(
    () => department !== "" && DEPARTMENTS.includes(department as Department),
    [department]
  );
  const coursesValid = useMemo(
    () => selectedCourses.length > 0,
    [selectedCourses]
  );

  const formValid =
    nameValid &&
    emailValid &&
    passwordValid &&
    passwordsMatch &&
    departmentValid &&
    coursesValid &&
    agreeTerms;

  // Pre-flight email uniqueness check (uses safe user list, no password hashes).
  const emailTaken = useMemo(() => {
    if (!mounted || !email || !emailValid) return false;
    const users = getAllUsersSafe();
    return users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
  }, [mounted, email, emailValid]);

  // ---- Course checkbox toggle -------------------------------------------
  const toggleCourse = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // ---- Submit ------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nameValid) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!passwordValid) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    if (!departmentValid) {
      setError("Please select your department.");
      return;
    }
    if (!coursesValid) {
      setError("Please select at least one course to enrol in.");
      return;
    }
    if (!agreeTerms) {
      setError("You must accept the terms and conditions to register.");
      return;
    }

    setLoading(true);

    // Defer to next tick so the loading state renders before any synchronous
    // localStorage work happens.
    window.setTimeout(() => {
      try {
        const createResult = createUser({
          email: email.trim(),
          name: name.trim(),
          password,
          role: "STUDENT",
          department: department as Department,
          enrolledCourses: selectedCourses,
        });

        if (!createResult.success) {
          setError(createResult.error || "Registration failed. Please try again.");
          setLoading(false);
          return;
        }

        // Auto-login the freshly created account.
        const loginResult = login(email.trim(), password);
        if (!loginResult.success) {
          // Account was created but auto-login failed – fall back to login page.
          setLoading(false);
          router.push("/login");
          return;
        }

        setSuccess(true);
        setLoading(false);

        // Brief success state before redirecting into the academy.
        window.setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 900);
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-80 h-80 bg-sky-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
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
            <p className="text-xs text-sky-200">New Student Registration</p>
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
              <UserPlus className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Create Your Student Account
            </CardTitle>
            <CardDescription className="text-sm">
              Register to enrol in aviation safety training courses and earn
              verifiable completion certificates.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Global error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    autoComplete="name"
                    required
                  />
                </div>
                {name && !nameValid && (
                  <p className="text-xs text-red-600">
                    Name must be at least 2 characters.
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-9 ${
                      email && !emailValid
                        ? "border-red-400 focus-visible:border-red-500"
                        : ""
                    }`}
                    autoComplete="email"
                    required
                  />
                </div>
                {email && !emailValid && (
                  <p className="text-xs text-red-600">
                    Please enter a valid email address.
                  </p>
                )}
                {emailTaken && emailValid && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    This email is already registered.{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="underline font-medium hover:text-red-700"
                    >
                      Log in instead
                    </button>
                  </p>
                )}
                {email && emailValid && !emailTaken && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Email is available.
                  </p>
                )}
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-9 pr-9 ${
                        password && !passwordValid
                          ? "border-red-400 focus-visible:border-red-500"
                          : ""
                      }`}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {password && !passwordValid && (
                    <p className="text-xs text-red-600">
                      Password must be at least 6 characters.
                    </p>
                  )}
                  {password && passwordValid && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Password strength OK.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-sm font-medium">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-9 pr-9 ${
                        confirmPassword && !passwordsMatch
                          ? "border-red-400 focus-visible:border-red-500"
                          : ""
                      }`}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-600">
                      Passwords do not match.
                    </p>
                  )}
                  {confirmPassword && passwordsMatch && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Passwords match.
                    </p>
                  )}
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="dept" className="text-sm font-medium">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={department}
                  onValueChange={(v) => setDepartment(v as Department)}
                >
                  <SelectTrigger id="dept" className="w-full h-10">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <SelectValue placeholder="Select your department" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Courses to Enrol <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-slate-500">
                  Select one or more courses. You can change your selection
                  later from the dashboard.
                </p>
                <div className="space-y-2">
                  {COURSE_OPTIONS.map((course) => {
                    const checked = selectedCourses.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        htmlFor={`course-${course.id}`}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          checked
                            ? "border-sky-400 bg-sky-50"
                            : "border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                        }`}
                      >
                        <Checkbox
                          id={`course-${course.id}`}
                          checked={checked}
                          onCheckedChange={() => toggleCourse(course.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-sky-600 shrink-0" />
                            <span className="text-sm font-semibold text-slate-800">
                              {course.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {course.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-2">
                <label
                  htmlFor="terms"
                  className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-700"
                >
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(v) => setAgreeTerms(v === true)}
                    className="mt-0.5"
                  />
                  <span className="leading-relaxed">
                    I agree to the{" "}
                    <span className="font-medium text-sky-700">
                      Terms &amp; Conditions
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-sky-700">
                      Privacy Policy
                    </span>{" "}
                    of DGR Aviation Academy. I confirm that the information
                    provided is accurate and I understand my progress and
                    certificates are stored locally on this device.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !formValid}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 h-12"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating your account…
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Account created! Redirecting…
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Student Account
                  </>
                )}
              </Button>

              {!formValid && !loading && (
                <p className="text-xs text-slate-500 text-center">
                  Please complete all required fields and accept the terms to
                  continue.
                </p>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-400 uppercase tracking-wide">
                  Already have an account?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in to your account
            </Button>

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <TrustBadge
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Secure"
              />
              <TrustBadge
                icon={<GraduationCap className="h-4 w-4" />}
                label="Certified"
              />
              <TrustBadge
                icon={<BookOpen className="h-4 w-4" />}
                label="Self-paced"
              />
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

function TrustBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/60 border border-slate-200">
      <div className="text-sky-600">{icon}</div>
      <span className="text-[11px] font-semibold text-slate-600">{label}</span>
    </div>
  );
}
