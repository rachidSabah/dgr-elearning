"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Trash2,
  GraduationCap,
  BookOpen,
  X,
  Search,
  Loader2,
  ChevronDown,
  TrendingUp,
  UserPlus,
  UserMinus,
  Library,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  initializeAuth,
  getAllUsersSafe,
  type AuthUser,
} from "@/lib/client-auth";
import { getAllCoursesFromStore, slugify } from "@/lib/course-store";
import {
  getGroups,
  createGroup,
  deleteGroup,
  addStudentToGroup,
  removeStudentFromGroup,
  addCourseToGroup,
  removeCourseFromGroup,
  subscribeToGroups,
  type StudyGroup,
} from "@/lib/groups-store";

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [courses, setCourses] = useState(getAllCoursesFromStore());
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const refresh = () => {
    setGroups(getGroups());
    setUsers(getAllUsersSafe().filter((u) => u.role === "STUDENT"));
    setCourses(getAllCoursesFromStore());
  };

  useEffect(() => {
    initializeAuth();
    refresh();
    setLoading(false);
    const unsub = subscribeToGroups(refresh);
    return unsub;
  }, []);

  const students = users;
  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Group name is required");
      return;
    }
    const g = createGroup(newName, newDescription);
    toast.success("Group created", { description: g.name });
    setNewName("");
    setNewDescription("");
    setCreateOpen(false);
    setSelectedGroupId(g.id);
  };

  const handleDelete = (id: string) => {
    deleteGroup(id);
    toast.success("Group deleted");
    if (selectedGroupId === id) setSelectedGroupId(null);
  };

  const handleAddStudent = (studentId: string) => {
    if (!selectedGroup) return;
    addStudentToGroup(selectedGroup.id, studentId);
    toast.success("Student added to group");
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!selectedGroup) return;
    removeStudentFromGroup(selectedGroup.id, studentId);
    toast.info("Student removed from group");
  };

  const handleAddCourse = (courseId: string) => {
    if (!selectedGroup) return;
    addCourseToGroup(selectedGroup.id, courseId);
    toast.success("Course assigned to group");
  };

  const handleRemoveCourse = (courseId: string) => {
    if (!selectedGroup) return;
    removeCourseFromGroup(selectedGroup.id, courseId);
    toast.info("Course removed from group");
  };

  const computeGroupProgress = (group: StudyGroup): { avg: number; enrolled: number } => {
    if (group.studentIds.length === 0) return { avg: 0, enrolled: 0 };
    let totalPct = 0;
    let enrolledCount = 0;
    for (const sid of group.studentIds) {
      const p = readStudentProgress(sid);
      const courseIds = group.courseIds.length > 0 ? group.courseIds : courses.map((c) => slugify(c.title));
      let studentCompleted = 0;
      let studentTotal = 0;
      for (const c of courses) {
        const cid = slugify(c.title);
        if (!courseIds.includes(cid)) continue;
        const all = c.modules.flatMap((m) => m.lessons);
        studentTotal += all.length;
        studentCompleted += all.filter((l) => p?.completedLessons?.includes(l.id)).length;
      }
      if (studentTotal > 0) {
        totalPct += (studentCompleted / studentTotal) * 100;
        enrolledCount++;
      }
    }
    return { avg: enrolledCount > 0 ? Math.round(totalPct / enrolledCount) : 0, enrolled: enrolledCount };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Study Groups</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create cohorts, assign students, and track average progress.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Group
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              Groups ({groups.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
            {groups.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No groups yet. Create one to get started.</p>
              </div>
            ) : (
              groups.map((g) => {
                const { avg } = computeGroupProgress(g);
                const isActive = selectedGroupId === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{g.name}</div>
                        {g.description && (
                          <div className={`text-xs mt-0.5 line-clamp-2 ${isActive ? "text-white/80" : "text-slate-500"}`}>
                            {g.description}
                          </div>
                        )}
                        <div className={`text-xs mt-1 flex items-center gap-2 ${isActive ? "text-white/90" : "text-slate-500"}`}>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {g.studentIds.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {g.courseIds.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {avg}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {!selectedGroup ? (
            <Card>
              <CardContent className="py-16 text-center text-slate-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Select a group to manage its students and courses.</p>
              </CardContent>
            </Card>
          ) : (
            <GroupDetail
              group={selectedGroup}
              students={students}
              courses={courses}
              onAddStudent={handleAddStudent}
              onRemoveStudent={handleRemoveStudent}
              onAddCourse={handleAddCourse}
              onRemoveCourse={handleRemoveCourse}
              onDelete={() => handleDelete(selectedGroup.id)}
              onComputeProgress={computeGroupProgress}
            />
          )}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Study Group</DialogTitle>
            <DialogDescription>
              Group students together for cohort-based learning and reporting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="grp-name">Group Name</Label>
              <Input
                id="grp-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Cabin Crew Batch 2024-A"
              />
            </div>
            <div>
              <Label htmlFor="grp-desc">Description (optional)</Label>
              <Textarea
                id="grp-desc"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of this group"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GroupDetail({
  group,
  students,
  courses,
  onAddStudent,
  onRemoveStudent,
  onAddCourse,
  onRemoveCourse,
  onDelete,
  onComputeProgress,
}: {
  group: StudyGroup;
  students: AuthUser[];
  courses: ReturnType<typeof getAllCoursesFromStore>;
  onAddStudent: (id: string) => void;
  onRemoveStudent: (id: string) => void;
  onAddCourse: (id: string) => void;
  onRemoveCourse: (id: string) => void;
  onDelete: () => void;
  onComputeProgress: (g: StudyGroup) => { avg: number; enrolled: number };
}) {
  const [studentSearch, setStudentSearch] = useState("");
  const [addCourseId, setAddCourseId] = useState("");

  const availableStudents = students.filter(
    (s) =>
      !group.studentIds.includes(s.id) &&
      (studentSearch === "" ||
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  const groupStudents = students.filter((s) => group.studentIds.includes(s.id));
  const { avg, enrolled } = onComputeProgress(group);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl">{group.name}</CardTitle>
              {group.description && (
                <CardDescription className="mt-1">{group.description}</CardDescription>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 gap-1.5 shrink-0">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="text-2xl font-bold">{group.studentIds.length}</div>
              <div className="text-xs text-slate-500">Students</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="text-2xl font-bold">{group.courseIds.length}</div>
              <div className="text-xs text-slate-500">Courses</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="text-2xl font-bold">{avg}%</div>
              <div className="text-xs text-slate-500">Avg Progress</div>
            </div>
          </div>
          {enrolled > 0 && (
            <div className="mt-3">
              <Progress value={avg} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Library className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            Assigned Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {group.courseIds.length === 0 ? (
            <p className="text-sm text-slate-500">No courses assigned yet. Assign courses to scope student progress.</p>
          ) : (
            <div className="space-y-2">
              {group.courseIds.map((cid) => {
                const course = courses.find((c) => slugify(c.title) === cid);
                return (
                  <div key={cid} className="flex items-center justify-between p-2 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 min-w-0">
                      <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm truncate">{course?.title || cid}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => onRemoveCourse(cid)} className="text-red-600 h-7 w-7 p-0">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-2">
            <Select value={addCourseId} onValueChange={setAddCourseId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select course to assign..." />
              </SelectTrigger>
              <SelectContent>
                {courses
                  .filter((c) => !group.courseIds.includes(slugify(c.title)))
                  .map((c) => (
                    <SelectItem key={c.title} value={slugify(c.title)}>
                      {c.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!addCourseId}
              onClick={() => {
                onAddCourse(addCourseId);
                setAddCourseId("");
              }}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Assign
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            Students in Group ({groupStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {groupStudents.length === 0 ? (
            <p className="text-sm text-slate-500">No students in this group yet.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {groupStudents.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg border bg-card">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                      {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-slate-500 truncate">{s.email}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => onRemoveStudent(s.id)} className="text-red-600 h-7 w-7 p-0">
                    <UserMinus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search students to add..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
            {studentSearch && availableStudents.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto border rounded-lg p-1">
                {availableStudents.slice(0, 8).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onAddStudent(s.id);
                      setStudentSearch("");
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-accent text-left transition-colors"
                  >
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-[10px] bg-muted">
                        {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{s.email}</div>
                    </div>
                    <UserPlus className="h-3.5 w-3.5 text-sky-500" />
                  </button>
                ))}
              </div>
            )}
            {studentSearch && availableStudents.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-2">No matching students found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function readStudentProgress(studentId: string): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`dgr-academy-progress-${studentId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.progress || null;
  } catch {
    return null;
  }
}
