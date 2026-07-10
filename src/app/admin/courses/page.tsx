"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BookOpen, Plus, Edit2, Trash2, Eye, GripVertical, Star,
  AlertCircle, CheckCircle2, Clock, Users, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getAllCoursesFromStore, createCourseInStore, updateCourseInStore,
  deleteCourseFromStore, resetCoursesToDefaults, createBlankCourse, slugify
} from "@/lib/course-store";
import { initializeAuth } from "@/lib/client-auth";
import type { CourseData } from "@/lib/types";

const CATEGORIES = [
  "Cabin Crew Training", "Ground Operations", "Airport Operations",
  "Duty Free Training", "Hospitality Training", "Aviation Security", "Other"
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Professional"];
const COLORS = ["#0ea5e9", "#dc2626", "#16a34a", "#f59e0b", "#7c3aed", "#0891b2", "#be185d", "#ea580c"];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "", description: "", category: "Cabin Crew Training",
    difficulty: "Professional", duration: 300, color: "#0ea5e9",
    icon: "BookOpen", isPublished: true, isFeatured: false,
  });

  const loadCourses = useCallback(() => {
    setCourses(getAllCoursesFromStore());
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
    loadCourses();
  }, [loadCourses]);

  const handleCreate = () => {
    if (!formData.title.trim()) {
      toast.error("Course title is required");
      return;
    }

    const newCourse = createBlankCourse(formData);
    const result = createCourseInStore(newCourse);

    if (result.success) {
      toast.success(`Course "${formData.title}" created! It now appears on the student site.`);
      loadCourses();
      setShowCreateDialog(false);
      resetForm();
    } else {
      toast.error(result.error || "Failed to create course");
    }
  };

  const handleUpdate = () => {
    if (!editingCourse) return;

    const courseId = slugify(editingCourse.title);
    const updates: Partial<CourseData> = {
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      difficulty: formData.difficulty,
    };

    const result = updateCourseInStore(courseId, updates);
    if (result.success) {
      toast.success("Course updated! Changes are live on the student site.");
      loadCourses();
      setEditingCourse(null);
      resetForm();
    } else {
      toast.error(result.error || "Failed to update course");
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const result = deleteCourseFromStore(deleteTarget);
    if (result.success) {
      toast.success("Course deleted from the platform.");
      loadCourses();
    } else {
      toast.error(result.error || "Failed to delete course");
    }
    setDeleteTarget(null);
  };

  const handleReset = () => {
    resetCoursesToDefaults();
    loadCourses();
    toast.success("Courses reset to defaults.");
  };

  const resetForm = () => {
    setFormData({
      title: "", description: "", category: "Cabin Crew Training",
      difficulty: "Professional", duration: 300, color: "#0ea5e9",
      icon: "BookOpen", isPublished: true, isFeatured: false,
    });
  };

  const openEdit = (course: CourseData) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: "Cabin Crew Training",
      difficulty: course.difficulty,
      duration: course.duration,
      color: "#0ea5e9",
      icon: "BookOpen",
      isPublished: true,
      isFeatured: false,
    });
  };

  const openCreate = () => {
    resetForm();
    setEditingCourse(null);
    setShowCreateDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            {courses.length} courses • Changes are <span className="text-green-600 font-medium">live</span> on the student site instantly
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Reset to Defaults
          </Button>
          <Button onClick={openCreate} className="gap-1.5 bg-gradient-to-r from-sky-600 to-blue-600">
            <Plus className="h-4 w-4" /> Create Course
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold">{courses.length}</div>
          <div className="text-xs text-slate-500">Total Courses</div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold">{courses.reduce((acc, c) => acc + c.modules.length, 0)}</div>
          <div className="text-xs text-slate-500">Total Modules</div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold">{courses.reduce((acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0), 0)}</div>
          <div className="text-xs text-slate-500">Total Lessons</div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold">{courses.reduce((acc, c) => acc + c.finalExam.length, 0)}</div>
          <div className="text-xs text-slate-500">Exam Questions</div>
        </CardContent></Card>
      </div>

      {/* Course List */}
      <div className="space-y-3">
        {courses.map((course, idx) => (
          <motion.div
            key={slugify(course.title)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${course.modules[0]?.color || "#0ea5e9"}, transparent)` }} />
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: course.modules[0]?.color || "#0ea5e9" }}
                  >
                    <BookOpen className="h-6 w-6" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{course.title}</h3>
                      {course.difficulty === "Professional" && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                          <Star className="h-3 w-3 mr-0.5" /> Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">{course.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.modules.length} modules</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {course.difficulty}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => openEdit(course)}>
                      <Edit2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteTarget(slugify(course.title))}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>

                {/* Modules preview */}
                <div className="mt-3 pt-3 border-t flex flex-wrap gap-1.5">
                  {course.modules.slice(0, 5).map((m) => (
                    <Badge key={m.id} variant="outline" className="text-xs gap-1" style={{ borderColor: m.color + "40" }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                      {m.code} {m.title.substring(0, 25)}
                    </Badge>
                  ))}
                  {course.modules.length > 5 && (
                    <Badge variant="outline" className="text-xs">+{course.modules.length - 5} more</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingCourse} onOpenChange={(o) => { if (!o) { setShowCreateDialog(false); setEditingCourse(null); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Course Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Aviation Security Training"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the course..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number" value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c} onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-8 h-8 rounded-lg border-2 ${formData.color === c ? "border-slate-900 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {!editingCourse && (
              <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-800">
                <CheckCircle2 className="inline h-3.5 w-3.5 mr-1" />
                The new course will appear instantly on the student-facing Course Library.
                It will include a starter module with one lesson that you can expand using the Content Editor.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); setEditingCourse(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={editingCourse ? handleUpdate : handleCreate} className="bg-gradient-to-r from-sky-600 to-blue-600">
              {editingCourse ? "Save Changes" : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the course from the platform. Students will no longer see it.
              This action cannot be undone. You can reset to defaults later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Yes, Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
