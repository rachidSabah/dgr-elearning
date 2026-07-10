"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Eye,
  Save,
  X,
  BookOpen,
  Loader2,
  Search,
  AlertCircle,
  Star,
  Users,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { initializeAuth } from "@/lib/client-auth";
import { allCourses } from "@/lib/courses-registry";

// ---------- Types ----------
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  icon: string | null;
  color: string | null;
  coverImage: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  objectives: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  modulesCount: number;
  enrollmentsCount: number;
}

// ---------- localStorage helpers ----------
const COURSES_KEY = "dgr-academy-courses-data";

function loadCoursesFromStorage(): Course[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(COURSES_KEY);
  if (!data) {
    // Initialize from registry
    const initial: Course[] = allCourses.map((c, idx) => ({
      id: `course-${idx + 1}`,
      title: c.title,
      slug: c.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      description: c.description || c.subtitle || "",
      category: "Cabin Crew Training",
      difficulty: c.difficulty || "Professional",
      duration: c.duration || 0,
      icon: null,
      color: "#0ea5e9",
      coverImage: null,
      isPublished: true,
      isFeatured: idx === 0,
      order: idx,
      objectives: c.objectives || [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modulesCount: c.modules?.length || 0,
      enrollmentsCount: 0,
    }));
    localStorage.setItem(COURSES_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function persistCourses(courses: Course[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  icon: string;
  color: string;
  coverImage: string;
  objectives: string;
  tags: string;
  isPublished: boolean;
  isFeatured: boolean;
}

const CATEGORIES = [
  "Cabin Crew Training",
  "Ground Operations",
  "Airport Operations",
  "Duty Free",
  "Hospitality",
  "Other",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Professional"];

const EMPTY_FORM: CourseFormData = {
  title: "",
  slug: "",
  description: "",
  category: "Cabin Crew Training",
  difficulty: "Professional",
  duration: 0,
  icon: "BookOpen",
  color: "#0ea5e9",
  coverImage: "",
  objectives: "",
  tags: "",
  isPublished: false,
  isFeatured: false,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function difficultyVariant(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Intermediate":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Professional":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function formatDuration(minutes: number): string {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = useCallback(() => {
    setLoading(true);
    try {
      const list = loadCoursesFromStorage();
      setCourses(list);
    } catch (err) {
      toast.error("Failed to load courses", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
    fetchCourses();
  }, [fetchCourses]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      slug: course.slug,
      description: course.description || "",
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      icon: course.icon || "BookOpen",
      color: course.color || "#0ea5e9",
      coverImage: course.coverImage || "",
      objectives: (course.objectives || []).join("\n"),
      tags: (course.tags || []).join(", "),
      isPublished: course.isPublished,
      isFeatured: course.isFeatured,
    });
    setSlugTouched(true);
    setDialogOpen(true);
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleSave = () => {
    if (
      !form.title.trim() ||
      !form.slug.trim() ||
      !form.description.trim() ||
      !form.category
    ) {
      toast.error("Missing required fields", {
        description: "Title, slug, description and category are required.",
      });
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      category: form.category,
      difficulty: form.difficulty,
      duration: Number(form.duration) || 0,
      icon: form.icon.trim() || null,
      color: form.color.trim() || null,
      coverImage: form.coverImage.trim() || null,
      objectives: form.objectives
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
    };

    try {
      const list = loadCoursesFromStorage();
      if (editingId) {
        const idx = list.findIndex((c) => c.id === editingId);
        if (idx < 0) {
          throw new Error("Course not found");
        }
        list[idx] = {
          ...list[idx],
          ...payload,
          updatedAt: new Date().toISOString(),
        };
        toast.success("Course updated", { description: payload.title });
      } else {
        const newCourse: Course = {
          id: `course-${Date.now()}`,
          ...payload,
          order: list.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          modulesCount: 0,
          enrollmentsCount: 0,
        };
        list.push(newCourse);
        toast.success("Course created", { description: payload.title });
      }
      persistCourses(list);
      setDialogOpen(false);
      fetchCourses();
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
    setDeleting(true);
    try {
      const list = loadCoursesFromStorage();
      const filtered = list.filter((c) => c.id !== deleteTarget.id);
      persistCourses(filtered);
      toast.success("Course deleted", { description: deleteTarget.title });
      setDeleteTarget(null);
      fetchCourses();
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Course Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, and organize training courses for the academy.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{courses.length}</div>
              <div className="text-xs text-slate-500">Total Courses</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {courses.filter((c) => c.isPublished).length}
              </div>
              <div className="text-xs text-slate-500">Published</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {courses.reduce(
                  (sum, c) => sum + (c.enrollmentsCount || 0),
                  0
                )}
              </div>
              <div className="text-xs text-slate-500">Enrollments</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
              <Star className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {courses.filter((c) => c.isFeatured).length}
              </div>
              <div className="text-xs text-slate-500">Featured</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">All Courses</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                {search ? "No matching courses" : "No courses yet"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {search
                  ? "Try a different search query."
                  : "Get started by creating your first course."}
              </p>
              {!search && (
                <Button onClick={openCreate} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Course
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Modules</TableHead>
                    <TableHead className="text-center">Enrolled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                            style={{
                              backgroundColor: course.color || "#0ea5e9",
                            }}
                          >
                            {(course.title[0] || "C").toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                              {course.title}
                              {course.isFeatured && (
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              /{course.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {course.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${difficultyVariant(
                            course.difficulty
                          )}`}
                        >
                          {course.difficulty}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {formatDuration(course.duration)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {course.isPublished ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                            Published
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-slate-500 border-slate-300"
                          >
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {course.modulesCount}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {course.enrollmentsCount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <a
                              href={`/courses/${course.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(course)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                            onClick={() => setDeleteTarget(course)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Course" : "Create Course"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Dangerous Goods Regulations - Cabin Crew"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((p) => ({ ...p, slug: slugify(e.target.value) }))
                }
                onFocus={() => setSlugTouched(true)}
                placeholder="auto-generated-from-title"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={0}
                value={form.duration}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    duration: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short course summary..."
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={form.difficulty}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, difficulty: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (lucide name)</Label>
              <Input
                id="icon"
                value={form.icon}
                onChange={(e) =>
                  setForm((p) => ({ ...p, icon: e.target.value }))
                }
                placeholder="BookOpen"
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, color: e.target.value }))
                  }
                  className="h-9 w-12 rounded border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
                />
                <Input
                  value={form.color}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, color: e.target.value }))
                  }
                  placeholder="#0ea5e9"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={form.coverImage}
                onChange={(e) =>
                  setForm((p) => ({ ...p, coverImage: e.target.value }))
                }
                placeholder="https://..."
              />
              {form.coverImage && (
                <div className="h-24 w-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                  { }
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                </div>
              )}
            </div>

            {/* Objectives */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="objectives">
                Objectives{" "}
                <span className="text-xs font-normal text-slate-500">
                  (one per line)
                </span>
              </Label>
              <Textarea
                id="objectives"
                rows={4}
                value={form.objectives}
                onChange={(e) =>
                  setForm((p) => ({ ...p, objectives: e.target.value }))
                }
                placeholder={"Identify hazard classes\nApply emergency procedures"}
              />
            </div>

            {/* Tags */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="tags">
                Tags{" "}
                <span className="text-xs font-normal text-slate-500">
                  (comma separated)
                </span>
              </Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tags: e.target.value }))
                }
                placeholder="IATA, DGR, safety"
              />
            </div>

            {/* Checkboxes */}
            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isPublished"
                  checked={form.isPublished}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, isPublished: Boolean(v) }))
                  }
                />
                <Label htmlFor="isPublished" className="cursor-pointer">
                  Published
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isFeatured"
                  checked={form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, isFeatured: Boolean(v) }))
                  }
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Featured
                </Label>
              </div>
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
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingId ? "Save Changes" : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) =>
          !deleting && setDeleteTarget(o ? deleteTarget : null)
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              Delete Course?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are about to delete{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {deleteTarget?.title}
            </span>
            . This will also delete all modules and lessons within it. This
            action cannot be undone.
          </p>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
