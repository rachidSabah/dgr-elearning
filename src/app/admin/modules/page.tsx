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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Search,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  FolderTree,
  BookOpen,
  FileText,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

// ---------- Types ----------
interface Course {
  id: string;
  title: string;
  slug: string;
}

interface ModuleItem {
  id: string;
  courseId: string;
  title: string;
  code: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  course?: { id: string; title: string; slug: string };
  _count?: { lessons: number };
}

interface ModuleFormData {
  title: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

const EMPTY_FORM: ModuleFormData = {
  title: "",
  code: "",
  description: "",
  icon: "FolderTree",
  color: "#0ea5e9",
  order: 0,
};

export default function ModulesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModuleFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<ModuleItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Reordering
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const json = await res.json();
      const list: Course[] = (json.data || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
      }));
      setCourses(list);
      if (list.length && !selectedCourseId) {
        setSelectedCourseId(list[0].id);
      }
    } catch (err) {
      toast.error("Failed to load courses", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setCoursesLoading(false);
    }
  }, [selectedCourseId]);

  const fetchModules = useCallback(async () => {
    if (!selectedCourseId) {
      setModules([]);
      return;
    }
    setModulesLoading(true);
    try {
      const res = await fetch(
        `/api/admin/modules?courseId=${encodeURIComponent(selectedCourseId)}`
      );
      if (!res.ok) throw new Error("Failed to fetch modules");
      const json = await res.json();
      setModules(json.data || []);
    } catch (err) {
      toast.error("Failed to load modules", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setModulesLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      order: modules.length,
    });
    setDialogOpen(true);
  };

  const openEdit = (mod: ModuleItem) => {
    setEditingId(mod.id);
    setForm({
      title: mod.title,
      code: mod.code || "",
      description: mod.description || "",
      icon: mod.icon || "FolderTree",
      color: mod.color || "#0ea5e9",
      order: mod.order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Missing required fields", {
        description: "Title is required.",
      });
      return;
    }
    if (!selectedCourseId && !editingId) {
      toast.error("No course selected");
      return;
    }

    setSaving(true);
    const payload = {
      courseId: selectedCourseId,
      title: form.title.trim(),
      code: form.code.trim() || null,
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      color: form.color.trim() || null,
      order: Number(form.order) || 0,
    };

    try {
      const url = editingId
        ? `/api/admin/modules/${editingId}`
        : "/api/admin/modules";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save module");
      }
      toast.success(editingId ? "Module updated" : "Module created", {
        description: payload.title,
      });
      setDialogOpen(false);
      fetchModules();
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/modules/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete module");
      toast.success("Module deleted", { description: deleteTarget.title });
      setDeleteTarget(null);
      fetchModules();
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const moveModule = async (mod: ModuleItem, direction: "up" | "down") => {
    const sorted = [...modules].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((m) => m.id === mod.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx];
    setReorderingId(mod.id);
    try {
      // Swap orders in parallel
      const [res1, res2] = await Promise.all([
        fetch(`/api/admin/modules/${mod.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: other.order }),
        }),
        fetch(`/api/admin/modules/${other.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: mod.order }),
        }),
      ]);
      if (!res1.ok || !res2.ok) throw new Error("Reorder failed");
      toast.success("Module reordered");
      fetchModules();
    } catch (err) {
      toast.error("Reorder failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setReorderingId(null);
    }
  };

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);
  const filtered = sortedModules.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      m.title.toLowerCase().includes(q) ||
      (m.code || "").toLowerCase().includes(q)
    );
  });

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Module Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize modules within courses and reorder lessons structure.
          </p>
        </div>
      </div>

      {/* Course selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500">
                Select Course
              </Label>
              {coursesLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : courses.length === 0 ? (
                <div className="text-sm text-slate-500 py-2">
                  No courses available. Create a course first.
                </div>
              ) : (
                <Select
                  value={selectedCourseId}
                  onValueChange={(v) => setSelectedCourseId(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a course..." />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button
              onClick={openCreate}
              disabled={!selectedCourseId}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Module
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modules list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-slate-400" />
              Modules
              {selectedCourse && (
                <span className="text-sm font-normal text-slate-500">
                  in {selectedCourse.title}
                </span>
              )}
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedCourseId ? (
            <div className="text-center py-12">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Select a course
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Choose a course above to manage its modules.
              </p>
            </div>
          ) : modulesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <FolderTree className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                {search ? "No matching modules" : "No modules yet"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {search
                  ? "Try a different search."
                  : "Add your first module to start building the course."}
              </p>
              {!search && (
                <Button onClick={openCreate} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Module
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex items-stretch">
                    {/* Drag handle / order */}
                    <div className="flex flex-col items-center justify-center px-3 py-4 bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800">
                      <GripVertical className="h-4 w-4 text-slate-300" />
                      <span className="text-xs font-mono text-slate-400 mt-1">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                          style={{ backgroundColor: mod.color || "#0ea5e9" }}
                        >
                          <FolderTree className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {mod.code && (
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                {mod.code}
                              </Badge>
                            )}
                            <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                              {mod.title}
                            </h4>
                            {!mod.isPublished && (
                              <Badge
                                variant="outline"
                                className="text-slate-500 border-slate-300 text-xs"
                              >
                                Draft
                              </Badge>
                            )}
                          </div>
                          {mod.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {mod.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {mod._count?.lessons ?? 0} lessons
                            </span>
                            <span className="font-mono">
                              order: {mod.order}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 px-3 border-l border-slate-200 dark:border-slate-800">
                      <div className="flex flex-col gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={
                            idx === 0 || reorderingId === mod.id
                          }
                          onClick={() => moveModule(mod, "up")}
                          title="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={
                            idx === filtered.length - 1 ||
                            reorderingId === mod.id
                          }
                          onClick={() => moveModule(mod, "down")}
                          title="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(mod)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                        onClick={() => setDeleteTarget(mod)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {reorderingId === mod.id && (
                    <div className="px-4 py-1 bg-sky-50 dark:bg-sky-950/40 border-t border-sky-200 dark:border-sky-900 text-xs text-sky-700 dark:text-sky-300 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Reordering...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Module" : "Create Module"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="m-title">Title *</Label>
              <Input
                id="m-title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g., Hazard Classes & Identification"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-code">Code</Label>
              <Input
                id="m-code"
                value={form.code}
                onChange={(e) =>
                  setForm((p) => ({ ...p, code: e.target.value }))
                }
                placeholder="e.g., 11.4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-order">Order</Label>
              <Input
                id="m-order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    order: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="m-description">Description</Label>
              <Textarea
                id="m-description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short module description..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-icon">Icon (lucide name)</Label>
              <Input
                id="m-icon"
                value={form.icon}
                onChange={(e) =>
                  setForm((p) => ({ ...p, icon: e.target.value }))
                }
                placeholder="FolderTree"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-color">Color</Label>
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
                  className="flex-1"
                />
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
              {editingId ? "Save Changes" : "Create Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !deleting && setDeleteTarget(o ? deleteTarget : null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              Delete Module?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are about to delete{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {deleteTarget?.title}
            </span>
            . This will also delete all lessons within it. This action cannot be
            undone.
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
              Delete Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
