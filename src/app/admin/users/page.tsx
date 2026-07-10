"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  AlertCircle,
  Users as UsersIcon,
  Shield,
  ShieldCheck,
  GraduationCap,
  FileEdit,
  UserCircle,
  Mail,
  Phone,
  Building2,
  Hash,
  KeyRound,
  PauseCircle,
  PlayCircle,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllUsersSafe,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  reactivateUser,
  getSession,
  initializeAuth,
  type AuthUser,
} from "@/lib/client-auth";

// ---------- Types ----------
type Role = AuthUser["role"];

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: Role;
  department: string;
  phone: string;
  employeeId: string;
  isActive: boolean;
  enrolledCourses: string[];
}

const ROLES: Role[] = [
  "SUPER_ADMIN",
  "ACADEMY_ADMIN",
  "INSTRUCTOR",
  "CONTENT_EDITOR",
  "STUDENT",
];

const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    statBg: string;
    statText: string;
    statIcon: string;
  }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    badge:
      "bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
    icon: Shield,
    statBg: "bg-red-100 dark:bg-red-900/40",
    statText: "text-red-600 dark:text-red-400",
    statIcon: "text-red-600 dark:text-red-400",
  },
  ACADEMY_ADMIN: {
    label: "Academy Admin",
    badge:
      "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800",
    icon: ShieldCheck,
    statBg: "bg-orange-100 dark:bg-orange-900/40",
    statText: "text-orange-600 dark:text-orange-400",
    statIcon: "text-orange-600 dark:text-orange-400",
  },
  INSTRUCTOR: {
    label: "Instructor",
    badge:
      "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    icon: GraduationCap,
    statBg: "bg-blue-100 dark:bg-blue-900/40",
    statText: "text-blue-600 dark:text-blue-400",
    statIcon: "text-blue-600 dark:text-blue-400",
  },
  CONTENT_EDITOR: {
    label: "Content Editor",
    badge:
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
    icon: FileEdit,
    statBg: "bg-purple-100 dark:bg-purple-900/40",
    statText: "text-purple-600 dark:text-purple-400",
    statIcon: "text-purple-600 dark:text-purple-400",
  },
  STUDENT: {
    label: "Student",
    badge:
      "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: UserCircle,
    statBg: "bg-slate-100 dark:bg-slate-800",
    statText: "text-slate-600 dark:text-slate-300",
    statIcon: "text-slate-600 dark:text-slate-300",
  },
};

const AVAILABLE_COURSES = [
  {
    id: "dangerous-goods-regulations",
    title: "Dangerous Goods Regulations",
  },
  {
    id: "cabin-crew-first-aid-training",
    title: "Cabin Crew First Aid Training",
  },
];

const EMPTY_FORM: UserFormData = {
  name: "",
  email: "",
  password: "",
  role: "STUDENT",
  department: "",
  phone: "",
  employeeId: "",
  isActive: true,
  enrolledCourses: [],
};

function formatDateTime(iso?: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name?: string | null, email?: string): string {
  const src = name || email || "U";
  return src
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<AuthUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Suspend confirmation
  const [suspendTarget, setSuspendTarget] = useState<AuthUser | null>(null);
  const [suspending, setSuspending] = useState(false);

  const refreshUsers = useCallback(() => {
    setUsers(getAllUsersSafe());
  }, []);

  useEffect(() => {
    initializeAuth();
    refreshUsers();
    setCurrentUser(getSession());
    setLoading(false);
  }, [refreshUsers]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setDialogOpen(true);
  };

  const openEdit = (user: AuthUser) => {
    setEditingId(user.id);
    setForm({
      name: user.name || "",
      email: user.email,
      password: "",
      role: user.role,
      department: user.department || "",
      phone: user.phone || "",
      employeeId: user.employeeId || "",
      isActive: user.isActive,
      enrolledCourses: user.enrolledCourses || [],
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.email.trim() || !form.name.trim()) {
      toast.error("Missing required fields", {
        description: "Name and email are required.",
      });
      return;
    }
    if (!editingId && !form.password.trim()) {
      toast.error("Password required", {
        description: "Password is required when creating a new user.",
      });
      return;
    }
    if (form.password.trim() && form.password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    setSaving(true);
    try {
      const trimmedEmail = form.email.trim().toLowerCase();
      if (editingId) {
        const updatePayload: Parameters<typeof updateUser>[1] = {
          name: form.name.trim(),
          email: trimmedEmail,
          role: form.role,
          department: form.department.trim(),
          phone: form.phone.trim(),
          employeeId: form.employeeId.trim(),
          isActive: form.isActive,
        };
        if (form.password.trim()) {
          updatePayload.password = form.password.trim();
        }
        if (form.role === "STUDENT") {
          updatePayload.enrolledCourses = form.enrolledCourses;
        }
        const result = updateUser(editingId, updatePayload);
        if (!result.success) {
          throw new Error(result.error || "Failed to update user");
        }
        toast.success("User updated", { description: trimmedEmail });
      } else {
        const createPayload: Parameters<typeof createUser>[0] = {
          name: form.name.trim(),
          email: trimmedEmail,
          password: form.password.trim(),
          role: form.role,
          department: form.department.trim() || undefined,
          phone: form.phone.trim() || undefined,
          employeeId: form.employeeId.trim() || undefined,
          enrolledCourses: form.role === "STUDENT" ? form.enrolledCourses : [],
        };
        const result = createUser(createPayload);
        if (!result.success) {
          throw new Error(result.error || "Failed to create user");
        }
        toast.success("User created", { description: trimmedEmail });
      }
      setDialogOpen(false);
      refreshUsers();
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (currentUser && deleteTarget.id === currentUser.id) {
      toast.error("Cannot delete your own account");
      return;
    }

    setDeleting(true);
    try {
      const result = deleteUser(deleteTarget.id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete user");
      }
      toast.success("User deleted", { description: deleteTarget.email });
      setDeleteTarget(null);
      refreshUsers();
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleSuspend = () => {
    if (!suspendTarget) return;
    if (currentUser && suspendTarget.id === currentUser.id) {
      toast.error("Cannot suspend your own account");
      setSuspendTarget(null);
      return;
    }

    setSuspending(true);
    try {
      const result = suspendUser(suspendTarget.id);
      if (!result.success) {
        throw new Error(result.error || "Failed to suspend user");
      }
      toast.success("User suspended", { description: suspendTarget.email });
      setSuspendTarget(null);
      refreshUsers();
    } catch (err) {
      toast.error("Suspend failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSuspending(false);
    }
  };

  const handleReactivate = (user: AuthUser) => {
    try {
      const result = reactivateUser(user.id);
      if (!result.success) {
        throw new Error(result.error || "Failed to reactivate user");
      }
      toast.success("User reactivated", { description: user.email });
      refreshUsers();
    } catch (err) {
      toast.error("Reactivate failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const toggleEnrolledCourse = (courseId: string) => {
    setForm((p) => {
      const exists = p.enrolledCourses.includes(courseId);
      return {
        ...p,
        enrolledCourses: exists
          ? p.enrolledCourses.filter((c) => c !== courseId)
          : [...p.enrolledCourses, courseId],
      };
    });
  };

  // ---------- Derived data ----------
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (u.name || "").toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.employeeId || "").toLowerCase().includes(q) ||
      (u.department || "").toLowerCase().includes(q);
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const countsByRole = (role: Role) =>
    users.filter((u) => u.role === role).length;

  const activeCount = users.filter((u) => u.isActive).length;
  const suspendedCount = users.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage academy staff, instructors, and student accounts.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{users.length}</div>
              <div className="text-xs text-slate-500">Total Users</div>
            </div>
          </CardContent>
        </Card>
        {ROLES.map((role) => {
          const cfg = ROLE_CONFIG[role];
          const Icon = cfg.icon;
          return (
            <Card key={role}>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${cfg.statBg} flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${cfg.statIcon}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{countsByRole(role)}</div>
                  <div className="text-xs text-slate-500">{cfg.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active vs Suspended summary */}
      <div className="flex flex-wrap gap-3 text-sm">
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800">
          {activeCount} Active
        </Badge>
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800">
          {suspendedCount} Suspended
        </Badge>
      </div>

      {/* Search + Filter + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">All Users</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search name, email, ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as Role | "ALL")}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_CONFIG[r].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <UsersIcon className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                {search || roleFilter !== "ALL"
                  ? "No matching users"
                  : "No users yet"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {search || roleFilter !== "ALL"
                  ? "Try a different search or filter."
                  : "Get started by adding your first user."}
              </p>
              {!search && roleFilter === "ALL" && (
                <Button onClick={openCreate} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrolled Courses</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => {
                    const cfg = ROLE_CONFIG[user.role];
                    const RoleIcon = cfg.icon;
                    const isSelf = currentUser?.id === user.id;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-gradient-to-br from-sky-500 to-blue-600 text-white text-xs">
                                {initials(user.name, user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                {user.name || "—"}
                                {isSelf && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] py-0 px-1.5 h-4 border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-300"
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                              {user.employeeId && (
                                <div className="text-xs text-slate-400 truncate flex items-center gap-1">
                                  <Hash className="h-3 w-3" />
                                  {user.employeeId}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`font-normal gap-1 ${cfg.badge}`}
                          >
                            <RoleIcon className="h-3 w-3" />
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-300">
                          {user.department || "—"}
                        </TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800">
                              Suspended
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.role === "STUDENT" ? (
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {user.enrolledCourses &&
                              user.enrolledCourses.length > 0 ? (
                                user.enrolledCourses.map((cid) => {
                                  const course = AVAILABLE_COURSES.find(
                                    (c) => c.id === cid,
                                  );
                                  return (
                                    <Badge
                                      key={cid}
                                      variant="outline"
                                      className="font-normal text-[10px] py-0 px-1.5 gap-1"
                                    >
                                      <BookOpen className="h-3 w-3" />
                                      {course?.title.split(" ")[0] || cid}
                                    </Badge>
                                  );
                                })
                              ) : (
                                <span className="text-xs text-slate-400">
                                  No courses
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {formatDateTime(user.lastLogin)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {user.isActive ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
                                onClick={() => setSuspendTarget(user)}
                                title={
                                  isSelf
                                    ? "Cannot suspend yourself"
                                    : "Suspend user"
                                }
                                disabled={isSelf}
                              >
                                <PauseCircle className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                onClick={() => handleReactivate(user)}
                                title="Reactivate user"
                              >
                                <PlayCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(user)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
                              onClick={() => setDeleteTarget(user)}
                              title={
                                isSelf ? "Cannot delete yourself" : "Delete"
                              }
                              disabled={isSelf}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="mt-3 text-xs text-slate-500 px-2">
                Showing {filtered.length} of {users.length} users ·{" "}
                {activeCount} active · {suspendedCount} suspended
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update account details and role. Leave password blank to keep current."
                : "Create a new academy account. Required fields are marked with *."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="pl-9"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="pl-9"
                  placeholder="jane@dgr-academy.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password{" "}
                {!editingId && <span className="text-red-500">*</span>}{" "}
                <span className="text-xs font-normal text-slate-500">
                  {editingId
                    ? "(leave blank to keep current)"
                    : "(min 6 chars)"}
                </span>
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className="pl-9"
                  placeholder={editingId ? "••••••••" : "Set a password"}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((p) => ({ ...p, role: v as Role }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => {
                    const cfg = ROLE_CONFIG[r];
                    const Icon = cfg.icon;
                    return (
                      <SelectItem key={r} value={r}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {cfg.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="department"
                  value={form.department}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, department: e.target.value }))
                  }
                  className="pl-9"
                  placeholder="Cabin Crew Training"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="pl-9"
                  placeholder="+1 555 0100"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="employeeId"
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, employeeId: e.target.value }))
                  }
                  className="pl-9"
                  placeholder="EMP-001"
                />
              </div>
            </div>

            {/* Enrolled Courses (students only) */}
            {form.role === "STUDENT" && (
              <div className="sm:col-span-2 space-y-2">
                <Label>Enrolled Courses</Label>
                <div className="space-y-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                  {AVAILABLE_COURSES.map((course) => {
                    const checked = form.enrolledCourses.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleEnrolledCourse(course.id)}
                        />
                        <span className="text-sm flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                          {course.title}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active checkbox */}
            <div className="sm:col-span-2 flex items-center gap-2 pt-2">
              <Checkbox
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isActive: Boolean(v) }))
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Account active
                <span className="block text-xs font-normal text-slate-500">
                  Inactive users cannot sign in.
                </span>
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4" />
              {editingId ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !deleting && !o && setDeleteTarget(null)}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              Delete User?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deleteTarget?.name || deleteTarget?.email}
              </span>{" "}
              ({deleteTarget?.email}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTarget?.role === "SUPER_ADMIN" && (
            <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-md p-2">
              Warning: This is a Super Admin account. At least one Super Admin
              must remain.
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Confirmation */}
      <AlertDialog
        open={!!suspendTarget}
        onOpenChange={(o) => !suspending && !o && setSuspendTarget(null)}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <PauseCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              Suspend User?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to suspend{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {suspendTarget?.name || suspendTarget?.email}
              </span>
              . Suspended users cannot sign in until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={suspending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleSuspend();
              }}
              disabled={suspending}
              className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
            >
              {suspending ? "Suspending..." : "Suspend User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
