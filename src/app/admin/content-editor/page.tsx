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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  FileEdit,
  BookOpen,
  FolderTree,
  FileText,
  Type,
  Heading,
  Image as ImageIcon,
  Megaphone,
  List as ListIcon,
  Table as TableIcon,
  HelpCircle,
  Spline,
  GripVertical,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { ContentBlock } from "@/lib/types";

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
}

interface LessonListItem {
  id: string;
  moduleId: string;
  title: string;
  code: string | null;
  description: string | null;
  duration: number;
  order: number;
  isPublished: boolean;
  _count?: { quizzes: number; progress: number };
}

interface LessonFull extends LessonListItem {
  objectives: string[];
  content: ContentBlock[];
  keyTerms: { term: string; definition: string }[];
  summary: string[];
  reviewQuestions: string[];
}

interface LessonMetadata {
  title: string;
  code: string;
  description: string;
  duration: number;
  order: number;
  isPublished: boolean;
}

// ---------- Block definitions ----------
type BlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "callout"
  | "list"
  | "table"
  | "knowledgeCheck"
  | "svg";

const BLOCK_TYPES: {
  type: BlockType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    type: "paragraph",
    label: "Paragraph",
    icon: Type,
    description: "A block of text",
  },
  {
    type: "heading",
    label: "Heading",
    icon: Heading,
    description: "Section heading (H2-H4)",
  },
  {
    type: "image",
    label: "Image",
    icon: ImageIcon,
    description: "Image with caption",
  },
  {
    type: "callout",
    label: "Callout",
    icon: Megaphone,
    description: "Highlighted note/tip/warning",
  },
  {
    type: "list",
    label: "List",
    icon: ListIcon,
    description: "Ordered or unordered list",
  },
  {
    type: "table",
    label: "Table",
    icon: TableIcon,
    description: "Tabular data",
  },
  {
    type: "knowledgeCheck",
    label: "Knowledge Check",
    icon: HelpCircle,
    description: "Multiple-choice question",
  },
  {
    type: "svg",
    label: "SVG Diagram",
    icon: Spline,
    description: "Inline SVG diagram with caption",
  },
];

const CALLOUT_VARIANTS = ["info", "warning", "danger", "tip", "note"] as const;

const calloutStyles: Record<string, string> = {
  info: "bg-sky-50 border-sky-200 text-sky-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  danger: "bg-rose-50 border-rose-200 text-rose-900",
  tip: "bg-emerald-50 border-emerald-200 text-emerald-900",
  note: "bg-slate-50 border-slate-200 text-slate-900",
};

const EMPTY_LESSON_META: LessonMetadata = {
  title: "",
  code: "",
  description: "",
  duration: 15,
  order: 0,
  isPublished: true,
};

function createEmptyBlock(type: BlockType): ContentBlock {
  switch (type) {
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "heading":
      return { type: "heading", text: "", level: 2 };
    case "image":
      return { type: "image", src: "", alt: "", caption: "" };
    case "callout":
      return { type: "callout", variant: "info", title: "", text: "" };
    case "list":
      return { type: "list", ordered: false, items: [] };
    case "table":
      return { type: "table", headers: ["", ""], rows: [["", ""]] };
    case "knowledgeCheck":
      return {
        type: "knowledgeCheck",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      };
    case "svg":
      return { type: "svg", src: "", caption: "" };
    default:
      return { type: "paragraph", text: "" };
  }
}

export default function ContentEditorPage() {
  // Cascading selectors
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");

  // Lesson editor state
  const [lesson, setLesson] = useState<LessonFull | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [meta, setMeta] = useState<LessonMetadata>(EMPTY_LESSON_META);
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Create new lesson dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<LessonMetadata>(EMPTY_LESSON_META);
  const [creating, setCreating] = useState(false);

  // ---------- Fetchers ----------
  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const json = await res.json();
      setCourses(
        (json.data || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
        }))
      );
    } catch (err) {
      toast.error("Failed to load courses", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  const fetchModules = useCallback(async (courseId: string) => {
    setModulesLoading(true);
    setModules([]);
    setLessons([]);
    setLesson(null);
    setSelectedModuleId("");
    setSelectedLessonId("");
    if (!courseId) {
      setModulesLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/modules?courseId=${encodeURIComponent(courseId)}`
      );
      if (!res.ok) throw new Error("Failed to fetch modules");
      const json = await res.json();
      setModules(
        (json.data || []).map((m: any) => ({
          id: m.id,
          courseId: m.courseId,
          title: m.title,
          code: m.code,
        }))
      );
    } catch (err) {
      toast.error("Failed to load modules", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setModulesLoading(false);
    }
  }, []);

  const fetchLessons = useCallback(async (moduleId: string) => {
    setLessonsLoading(true);
    setLessons([]);
    setLesson(null);
    setSelectedLessonId("");
    if (!moduleId) {
      setLessonsLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/admin/lessons?moduleId=${encodeURIComponent(moduleId)}`
      );
      if (!res.ok) throw new Error("Failed to fetch lessons");
      const json = await res.json();
      setLessons(json.data || []);
    } catch (err) {
      toast.error("Failed to load lessons", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLessonsLoading(false);
    }
  }, []);

  const fetchLesson = useCallback(async (lessonId: string) => {
    setLessonLoading(true);
    setLesson(null);
    if (!lessonId) {
      setLessonLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`);
      if (!res.ok) throw new Error("Failed to fetch lesson");
      const json = await res.json();
      const data = json.data;
      setLesson(data);
      setMeta({
        title: data.title,
        code: data.code || "",
        description: data.description || "",
        duration: data.duration,
        order: data.order,
        isPublished: data.isPublished,
      });
      setContent(Array.isArray(data.content) ? data.content : []);
      setDirty(false);
    } catch (err) {
      toast.error("Failed to load lesson content", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLessonLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ---------- Mutations ----------
  const handleSave = async () => {
    if (!lesson) return;
    if (!meta.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }
    setSaving(true);
    const payload = {
      title: meta.title.trim(),
      code: meta.code.trim() || null,
      description: meta.description.trim() || null,
      duration: Number(meta.duration) || 15,
      order: Number(meta.order) || 0,
      isPublished: meta.isPublished,
      content,
    };
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save lesson");
      toast.success("Lesson saved", { description: payload.title });
      setDirty(false);
      // Refresh lesson list to reflect title changes
      if (selectedModuleId) fetchLessons(selectedModuleId);
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLesson = async () => {
    if (!selectedModuleId) {
      toast.error("Select a module first");
      return;
    }
    if (!createForm.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }
    setCreating(true);
    const payload = {
      moduleId: selectedModuleId,
      title: createForm.title.trim(),
      code: createForm.code.trim() || null,
      description: createForm.description.trim() || null,
      duration: Number(createForm.duration) || 15,
      order: Number(createForm.order) || 0,
      isPublished: createForm.isPublished,
      content: [{ type: "paragraph", text: "" }],
    };
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create lesson");
      toast.success("Lesson created", { description: payload.title });
      setCreateOpen(false);
      setCreateForm(EMPTY_LESSON_META);
      await fetchLessons(selectedModuleId);
      // Auto-select the new lesson
      if (json.data?.id) {
        setSelectedLessonId(json.data.id);
        fetchLesson(json.data.id);
      }
    } catch (err) {
      toast.error("Create failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setCreating(false);
    }
  };

  // ---------- Block operations ----------
  const addBlock = (type: BlockType) => {
    setContent((prev) => [...prev, createEmptyBlock(type)]);
    setDirty(true);
  };

  const updateBlock = (index: number, updated: ContentBlock) => {
    setContent((prev) => prev.map((b, i) => (i === index ? updated : b)));
    setDirty(true);
  };

  const deleteBlock = (index: number) => {
    setContent((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.length) return;
    setContent((prev) => {
      const arr = [...prev];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
    setDirty(true);
  };

  const openCreateLesson = () => {
    setCreateForm({
      ...EMPTY_LESSON_META,
      order: lessons.length,
    });
    setCreateOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Content Editor
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build and edit rich lesson content with visual blocks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={openCreateLesson}
            disabled={!selectedModuleId}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Lesson
          </Button>
          <Button
            onClick={handleSave}
            disabled={!lesson || saving || !dirty}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Lesson
          </Button>
        </div>
      </div>

      {/* Cascading selectors */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Course
              </Label>
              {coursesLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select
                  value={selectedCourseId}
                  onValueChange={(v) => {
                    setSelectedCourseId(v);
                    fetchModules(v);
                  }}
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
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <FolderTree className="h-3.5 w-3.5" />
                Module
              </Label>
              {modulesLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select
                  value={selectedModuleId}
                  onValueChange={(v) => {
                    setSelectedModuleId(v);
                    fetchLessons(v);
                  }}
                  disabled={!selectedCourseId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a module..." />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.code ? `[${m.code}] ` : ""}
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Lesson
              </Label>
              {lessonsLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select
                  value={selectedLessonId}
                  onValueChange={(v) => {
                    setSelectedLessonId(v);
                    fetchLesson(v);
                  }}
                  disabled={!selectedModuleId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a lesson..." />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.code ? `[${l.code}] ` : ""}
                        {l.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      {!selectedLessonId ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <FileEdit className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
              No lesson selected
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Pick a course, module, and lesson above to begin editing. Or
              create a new lesson in the selected module.
            </p>
            {selectedModuleId && (
              <Button
                onClick={openCreateLesson}
                className="mt-4 gap-2"
                variant="outline"
              >
                <PlusCircle className="h-4 w-4" />
                Create New Lesson
              </Button>
            )}
          </CardContent>
        </Card>
      ) : lessonLoading ? (
        <Card>
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : lesson ? (
        <div className="space-y-4">
          {/* Dirty indicator */}
          {dirty && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-sm text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-4 w-4" />
              You have unsaved changes. Press <strong>Save Lesson</strong> to
              commit them.
            </div>
          )}

          {/* Metadata Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                Lesson Metadata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="l-title">Title *</Label>
                  <Input
                    id="l-title"
                    value={meta.title}
                    onChange={(e) => {
                      setMeta((p) => ({ ...p, title: e.target.value }));
                      setDirty(true);
                    }}
                    placeholder="Lesson title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l-code">Code</Label>
                  <Input
                    id="l-code"
                    value={meta.code}
                    onChange={(e) => {
                      setMeta((p) => ({ ...p, code: e.target.value }));
                      setDirty(true);
                    }}
                    placeholder="e.g., 11.4.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l-duration">Duration (minutes)</Label>
                  <Input
                    id="l-duration"
                    type="number"
                    min={0}
                    value={meta.duration}
                    onChange={(e) => {
                      setMeta((p) => ({
                        ...p,
                        duration: Number(e.target.value) || 0,
                      }));
                      setDirty(true);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l-order">Order</Label>
                  <Input
                    id="l-order"
                    type="number"
                    min={0}
                    value={meta.order}
                    onChange={(e) => {
                      setMeta((p) => ({
                        ...p,
                        order: Number(e.target.value) || 0,
                      }));
                      setDirty(true);
                    }}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="l-published"
                      checked={meta.isPublished}
                      onCheckedChange={(v) => {
                        setMeta((p) => ({ ...p, isPublished: Boolean(v) }));
                        setDirty(true);
                      }}
                    />
                    <Label htmlFor="l-published" className="cursor-pointer">
                      Published
                    </Label>
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="l-description">Description</Label>
                  <Textarea
                    id="l-description"
                    rows={2}
                    value={meta.description}
                    onChange={(e) => {
                      setMeta((p) => ({ ...p, description: e.target.value }));
                      setDirty(true);
                    }}
                    placeholder="Short lesson description"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Blocks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileEdit className="h-4 w-4 text-slate-400" />
                  Content Blocks
                  <Badge variant="secondary" className="font-mono ml-1">
                    {content.length}
                  </Badge>
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Block
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Choose block type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {BLOCK_TYPES.map((bt) => {
                      const Icon = bt.icon;
                      return (
                        <DropdownMenuItem
                          key={bt.type}
                          onClick={() => addBlock(bt.type)}
                          className="gap-2 py-2"
                        >
                          <Icon className="h-4 w-4 text-slate-500" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {bt.label}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {bt.description}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {content.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <FileEdit className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 mb-3">
                    No content blocks yet. Add your first block to start
                    writing.
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Block
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-64">
                      <DropdownMenuLabel>Choose block type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {BLOCK_TYPES.map((bt) => {
                        const Icon = bt.icon;
                        return (
                          <DropdownMenuItem
                            key={bt.type}
                            onClick={() => addBlock(bt.type)}
                            className="gap-2 py-2"
                          >
                            <Icon className="h-4 w-4 text-slate-500" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">
                                {bt.label}
                              </div>
                              <div className="text-xs text-slate-500 truncate">
                                {bt.description}
                              </div>
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="space-y-3">
                  {content.map((block, index) => (
                    <BlockCard
                      key={index}
                      index={index}
                      total={content.length}
                      block={block}
                      onChange={(b) => updateBlock(index, b)}
                      onDelete={() => deleteBlock(index)}
                      onMoveUp={() => moveBlock(index, "up")}
                      onMoveDown={() => moveBlock(index, "down")}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Create New Lesson Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Lesson</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="c-title">Title *</Label>
              <Input
                id="c-title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Lesson title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-code">Code</Label>
              <Input
                id="c-code"
                value={createForm.code}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, code: e.target.value }))
                }
                placeholder="e.g., 11.4.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-duration">Duration (minutes)</Label>
              <Input
                id="c-duration"
                type="number"
                min={0}
                value={createForm.duration}
                onChange={(e) =>
                  setCreateForm((p) => ({
                    ...p,
                    duration: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-order">Order</Label>
              <Input
                id="c-order"
                type="number"
                min={0}
                value={createForm.order}
                onChange={(e) =>
                  setCreateForm((p) => ({
                    ...p,
                    order: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="c-published"
                  checked={createForm.isPublished}
                  onCheckedChange={(v) =>
                    setCreateForm((p) => ({
                      ...p,
                      isPublished: Boolean(v),
                    }))
                  }
                />
                <Label htmlFor="c-published" className="cursor-pointer">
                  Published
                </Label>
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="c-description">Description</Label>
              <Textarea
                id="c-description"
                rows={2}
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description"
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleCreateLesson} disabled={creating}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- Block Card Component ----------
interface BlockCardProps {
  index: number;
  total: number;
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function BlockCard({
  index,
  total,
  block,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: BlockCardProps) {
  const meta =
    BLOCK_TYPES.find((b) => b.type === block.type) || BLOCK_TYPES[0];
  const Icon = meta.icon;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="h-4 w-4 text-slate-300" />
          <span className="text-xs font-mono text-slate-400 w-6">
            {index + 1}
          </span>
          <Icon className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={index === 0}
            onClick={onMoveUp}
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={index === total - 1}
            onClick={onMoveDown}
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
            onClick={onDelete}
            title="Delete block"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <BlockEditor block={block} onChange={onChange} />
      </div>
    </div>
  );
}

// ---------- Block Editor (per type) ----------
function BlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <Textarea
          rows={4}
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Write your paragraph text..."
        />
      );

    case "heading":
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select
              value={String(block.level || 2)}
              onValueChange={(v) =>
                onChange({
                  ...block,
                  level: Number(v) as 2 | 3 | 4,
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder="Heading text"
              className="flex-1 font-semibold"
            />
          </div>
          <div className="text-xs text-slate-500 px-1">
            Preview:{" "}
            <span
              className={
                block.level === 4
                  ? "text-base font-semibold"
                  : block.level === 3
                    ? "text-lg font-semibold"
                    : "text-xl font-bold"
              }
            >
              {block.text || <span className="text-slate-300">Heading text</span>}
            </span>
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Image URL</Label>
            <Input
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              placeholder="https://... or /images/..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Alt text</Label>
              <Input
                value={block.alt || ""}
                onChange={(e) =>
                  onChange({ ...block, alt: e.target.value })
                }
                placeholder="Descriptive alt text"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Caption</Label>
              <Input
                value={block.caption || ""}
                onChange={(e) =>
                  onChange({ ...block, caption: e.target.value })
                }
                placeholder="Optional caption"
              />
            </div>
          </div>
          {block.src && (
            <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              { }
              <img
                src={block.src}
                alt={block.alt || ""}
                className="max-h-48 w-auto mx-auto"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      );

    case "callout":
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Variant</Label>
            <Select
              value={block.variant}
              onValueChange={(v) =>
                onChange({
                  ...block,
                  variant: v as typeof block.variant,
                })
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CALLOUT_VARIANTS.map((v) => (
                  <SelectItem key={v} value={v} className="capitalize">
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Title (optional)</Label>
            <Input
              value={block.title || ""}
              onChange={(e) =>
                onChange({ ...block, title: e.target.value })
              }
              placeholder="Callout title"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Text</Label>
            <Textarea
              rows={3}
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder="Callout message"
            />
          </div>
          {/* Preview */}
          <div
            className={`rounded-md border px-3 py-2 text-sm ${
              calloutStyles[block.variant]
            }`}
          >
            {block.title && (
              <div className="font-semibold mb-0.5">{block.title}</div>
            )}
            <div>{block.text || <span className="opacity-50">Callout message</span>}</div>
          </div>
        </div>
      );

    case "list":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Type:</Label>
            <Select
              value={block.ordered ? "ordered" : "unordered"}
              onValueChange={(v) =>
                onChange({ ...block, ordered: v === "ordered" })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unordered">• Unordered</SelectItem>
                <SelectItem value="ordered">1. Ordered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">
              Items (one per line)
            </Label>
            <Textarea
              rows={5}
              value={block.items.join("\n")}
              onChange={(e) =>
                onChange({
                  ...block,
                  items: e.target.value.split("\n"),
                })
              }
              placeholder={"First item\nSecond item\nThird item"}
            />
          </div>
        </div>
      );

    case "table":
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">
              Headers (comma separated)
            </Label>
            <Input
              value={block.headers.join(", ")}
              onChange={(e) =>
                onChange({
                  ...block,
                  headers: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== "" || true),
                })
              }
              placeholder="Column 1, Column 2, Column 3"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">
              Rows (each row comma separated; one row per line)
            </Label>
            <Textarea
              rows={5}
              value={block.rows.map((r) => r.join(", ")).join("\n")}
              onChange={(e) =>
                onChange({
                  ...block,
                  rows: e.target.value.split("\n").map((line) =>
                    line
                      .split(",")
                      .map((s) => s.trim())
                      .filter(() => true)
                  ),
                })
              }
              placeholder={"A1, B1, C1\nA2, B2, C2"}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Caption (optional)</Label>
            <Input
              value={block.caption || ""}
              onChange={(e) =>
                onChange({ ...block, caption: e.target.value })
              }
              placeholder="Table caption"
            />
          </div>
        </div>
      );

    case "knowledgeCheck":
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Question</Label>
            <Input
              value={block.question}
              onChange={(e) =>
                onChange({ ...block, question: e.target.value })
              }
              placeholder="What is the correct answer to..."
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Options (one per line)</Label>
              <span className="text-xs text-slate-500">
                Click the radio to mark correct
              </span>
            </div>
            <div className="space-y-2">
              {block.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({ ...block, correctAnswer: i })
                    }
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      block.correctAnswer === i
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    title="Mark as correct answer"
                  >
                    {block.correctAnswer === i && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...block.options];
                      next[i] = e.target.value;
                      onChange({ ...block, options: next });
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    onClick={() => {
                      const next = block.options.filter((_, idx) => idx !== i);
                      const newCorrect =
                        block.correctAnswer === i
                          ? 0
                          : block.correctAnswer > i
                            ? block.correctAnswer - 1
                            : block.correctAnswer;
                      onChange({
                        ...block,
                        options: next.length ? next : [""],
                        correctAnswer: newCorrect,
                      });
                    }}
                    title="Remove option"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() =>
                  onChange({
                    ...block,
                    options: [...block.options, ""],
                  })
                }
              >
                <Plus className="h-3.5 w-3.5" />
                Add Option
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Explanation</Label>
            <Textarea
              rows={2}
              value={block.explanation}
              onChange={(e) =>
                onChange({ ...block, explanation: e.target.value })
              }
              placeholder="Explain why the correct answer is right"
            />
          </div>
        </div>
      );

    case "svg":
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">SVG URL</Label>
            <Input
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              placeholder="/images/svg/... or https://..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Caption (optional)</Label>
            <Input
              value={block.caption || ""}
              onChange={(e) =>
                onChange({ ...block, caption: e.target.value })
              }
              placeholder="Diagram caption"
            />
          </div>
          {block.src && (
            <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
              { }
              <img
                src={block.src}
                alt={block.caption || "SVG diagram"}
                className="max-h-40 w-auto mx-auto"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = "none";
                }}
              />
              {block.caption && (
                <div className="text-xs text-center text-slate-500 mt-2">
                  {block.caption}
                </div>
              )}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-sm text-slate-500">
          Unsupported block type: {block.type}
        </div>
      );
  }
}
