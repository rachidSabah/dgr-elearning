"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  FileEdit, BookOpen, FolderTree, Save, Plus, Trash2,
  ChevronUp, ChevronDown, Type, Image as ImageIcon, AlertTriangle,
  Lightbulb, List, Table, HelpCircle, FileText, GripVertical, X, Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initializeAuth } from "@/lib/client-auth";
import { getAllCoursesFromStore, saveAllCoursesToStore, slugify } from "@/lib/course-store";
import type { CourseData, ContentBlock, Lesson, Module } from "@/lib/types";

export default function ContentEditorPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [selectedCourseIdx, setSelectedCourseIdx] = useState(0);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    initializeAuth();
    const c = getAllCoursesFromStore();
    setCourses(c);
  }, []);

  // Get current course/module/lesson
  const currentCourse = courses[selectedCourseIdx];
  const currentModule = currentCourse?.modules[selectedModuleIdx];
  const currentLessonData = currentModule?.lessons[selectedLessonIdx];

  // Load lesson into editor when selection changes
  useEffect(() => {
    if (currentLessonData) {
      setLesson(JSON.parse(JSON.stringify(currentLessonData)));
      setHasChanges(false);
    } else {
      setLesson(null);
    }
  }, [selectedCourseIdx, selectedModuleIdx, selectedLessonIdx, currentLessonData?.id]);

  const persistChanges = useCallback((updatedLesson: Lesson) => {
    if (!currentCourse || !currentModule) return;

    const updatedCourses = [...courses];
    updatedCourses[selectedCourseIdx].modules[selectedModuleIdx].lessons[selectedLessonIdx] = updatedLesson;
    saveAllCoursesToStore(updatedCourses);
    setCourses(updatedCourses);
    setHasChanges(false);
    toast.success("Lesson saved! Changes are live on the student site.");
  }, [courses, selectedCourseIdx, selectedModuleIdx, selectedLessonIdx, currentCourse, currentModule]);

  const handleSave = () => {
    if (!lesson) return;
    persistChanges(lesson);
  };

  // === LESSON METADATA EDITING ===
  const updateLessonMeta = (field: string, value: any) => {
    if (!lesson) return;
    setLesson({ ...lesson, [field]: value });
    setHasChanges(true);
  };

  // === CONTENT BLOCK OPERATIONS ===
  const updateContent = (newContent: ContentBlock[]) => {
    if (!lesson) return;
    setLesson({ ...lesson, content: newContent });
    setHasChanges(true);
  };

  const addBlock = (type: ContentBlock["type"]) => {
    if (!lesson) return;
    const newBlock = createDefaultBlock(type);
    updateContent([...lesson.content, newBlock]);
    toast.info(`${getBlockLabel(type)} block added`);
  };

  const updateBlock = (idx: number, updates: Partial<ContentBlock>) => {
    if (!lesson) return;
    const newContent = [...lesson.content];
    newContent[idx] = { ...newContent[idx], ...updates } as ContentBlock;
    updateContent(newContent);
  };

  const deleteBlock = (idx: number) => {
    if (!lesson) return;
    updateContent(lesson.content.filter((_, i) => i !== idx));
    toast.info("Block deleted");
  };

  const moveBlock = (idx: number, direction: "up" | "down") => {
    if (!lesson) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= lesson.content.length) return;
    const newContent = [...lesson.content];
    [newContent[idx], newContent[newIdx]] = [newContent[newIdx], newContent[idx]];
    updateContent(newContent);
  };

  // === ADD NEW LESSON ===
  const addNewLesson = () => {
    if (!currentModule) return;
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      moduleId: currentModule.id,
      code: `${currentModule.code}.${currentModule.lessons.length + 1}`,
      title: "New Lesson",
      duration: 15,
      objectives: ["New learning objective"],
      content: [
        { type: "paragraph", text: "Click here to edit this paragraph. You can add more content blocks using the Add Block button." }
      ],
      summary: ["Lesson summary point"],
      reviewQuestions: ["Review question?"],
    };

    const updatedCourses = [...courses];
    updatedCourses[selectedCourseIdx].modules[selectedModuleIdx].lessons.push(newLesson);
    saveAllCoursesToStore(updatedCourses);
    setCourses(updatedCourses);
    setSelectedLessonIdx(currentModule.lessons.length);
    toast.success("New lesson created! Start editing below.");
  };

  // === ADD NEW MODULE ===
  const addNewModule = () => {
    if (!currentCourse) return;
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      code: `${currentCourse.modules.length + 1}`,
      title: "New Module",
      description: "Module description",
      icon: "BookOpen",
      color: "#0ea5e9",
      lessons: [],
    };

    const updatedCourses = [...courses];
    updatedCourses[selectedCourseIdx].modules.push(newModule);
    saveAllCoursesToStore(updatedCourses);
    setCourses(updatedCourses);
    setSelectedModuleIdx(currentCourse.modules.length);
    toast.success("New module created!");
  };

  if (courses.length === 0) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Editor</h1>
          <p className="text-sm text-slate-500 mt-1">
            Edit lesson content directly — changes appear <span className="text-green-600 font-medium">live</span> on the student site
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Unsaved changes</Badge>
            <Button onClick={handleSave} className="gap-1.5 bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4" /> Save Lesson
            </Button>
          </div>
        )}
      </div>

      {/* Course/Module/Lesson Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Course</Label>
          <Select value={String(selectedCourseIdx)} onValueChange={(v) => { setSelectedCourseIdx(Number(v)); setSelectedModuleIdx(0); setSelectedLessonIdx(0); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {courses.map((c, i) => <SelectItem key={i} value={String(i)}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Module</Label>
          <div className="flex gap-1">
            <Select value={String(selectedModuleIdx)} onValueChange={(v) => { setSelectedModuleIdx(Number(v)); setSelectedLessonIdx(0); }} className="flex-1">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currentCourse?.modules.map((m, i) => <SelectItem key={i} value={String(i)}>{m.code} - {m.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={addNewModule} title="Add new module">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Lesson</Label>
          <div className="flex gap-1">
            <Select value={String(selectedLessonIdx)} onValueChange={(v) => setSelectedLessonIdx(Number(v))} className="flex-1">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currentModule?.lessons.map((l, i) => <SelectItem key={i} value={String(i)}>{l.code} - {l.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={addNewLesson} title="Add new lesson">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {lesson ? (
        <>
          {/* Lesson Metadata */}
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Lesson Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input value={lesson.title} onChange={(e) => updateLessonMeta("title", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Code</Label>
                <Input value={lesson.code || ""} onChange={(e) => updateLessonMeta("code", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Duration (min)</Label>
                <Input type="number" value={lesson.duration} onChange={(e) => updateLessonMeta("duration", parseInt(e.target.value) || 15)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Input value={lesson.description || ""} onChange={(e) => updateLessonMeta("description", e.target.value)} placeholder="Optional" />
              </div>
            </CardContent>
          </Card>

          {/* Content Blocks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2"><FileEdit className="h-4 w-4" /> Content Blocks ({lesson.content.length})</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Block</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => addBlock("paragraph")}><Type className="h-3.5 w-3.5 mr-2" /> Paragraph</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("heading")}><Type className="h-3.5 w-3.5 mr-2" /> Heading</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("callout")}><AlertTriangle className="h-3.5 w-3.5 mr-2" /> Callout (Info/Warning/Danger)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("list")}><List className="h-3.5 w-3.5 mr-2" /> List</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("table")}><Table className="h-3.5 w-3.5 mr-2" /> Table</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("image")}><ImageIcon className="h-3.5 w-3.5 mr-2" /> Image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("video")}><Video className="h-3.5 w-3.5 mr-2" /> Video</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("knowledgeCheck")}><HelpCircle className="h-3.5 w-3.5 mr-2" /> Knowledge Check</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("keyTerms")}><BookOpen className="h-3.5 w-3.5 mr-2" /> Key Terms</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lesson.content.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <FileEdit className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No content blocks yet. Click "Add Block" to start building this lesson.</p>
                </div>
              )}
              {lesson.content.map((block, idx) => (
                <BlockEditor
                  key={idx}
                  block={block}
                  index={idx}
                  total={lesson.content.length}
                  onChange={(updates) => updateBlock(idx, updates)}
                  onDelete={() => deleteBlock(idx)}
                  onMoveUp={() => moveBlock(idx, "up")}
                  onMoveDown={() => moveBlock(idx, "down")}
                />
              ))}
              {lesson.content.length > 0 && (
                <Button onClick={handleSave} className="w-full gap-1.5 bg-green-600 hover:bg-green-700" disabled={!hasChanges}>
                  <Save className="h-4 w-4" /> {hasChanges ? "Save Lesson (Live on Student Site)" : "All Changes Saved"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Summary & Review */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Summary &amp; Review Questions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Summary Points (one per line)</Label>
                <Textarea
                  value={lesson.summary.join("\n")}
                  onChange={(e) => { setLesson({ ...lesson, summary: e.target.value.split("\n").filter(Boolean) }); setHasChanges(true); }}
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Review Questions (one per line)</Label>
                <Textarea
                  value={lesson.reviewQuestions.join("\n")}
                  onChange={(e) => { setLesson({ ...lesson, reviewQuestions: e.target.value.split("\n").filter(Boolean) }); setHasChanges(true); }}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            <FileEdit className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Select a lesson to edit, or create a new one.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// BLOCK EDITOR COMPONENT
// ============================================================
function BlockEditor({ block, index, total, onChange, onDelete, onMoveUp, onMoveDown }: {
  block: ContentBlock;
  index: number;
  total: number;
  onChange: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900 space-y-2">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="gap-1 text-xs">
          <GripVertical className="h-3 w-3" /> Block {index + 1}: {getBlockLabel(block.type)}
        </Badge>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={index === 0} onClick={onMoveUp}><ChevronUp className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={index === total - 1} onClick={onMoveDown}><ChevronDown className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      {/* Block-specific editors */}
      {(block.type === "paragraph") && (
        <Textarea value={block.text} onChange={(e) => onChange({ text: e.target.value } as any)} rows={3} placeholder="Enter paragraph text..." />
      )}

      {(block.type === "heading") && (
        <div className="flex gap-2">
          <Select value={String(block.level || 3)} onValueChange={(v) => onChange({ level: Number(v) } as any)}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="2">H2</SelectItem><SelectItem value="3">H3</SelectItem><SelectItem value="4">H4</SelectItem></SelectContent>
          </Select>
          <Input value={block.text} onChange={(e) => onChange({ text: e.target.value } as any)} placeholder="Heading text..." className="flex-1" />
        </div>
      )}

      {(block.type === "callout") && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select value={block.variant} onValueChange={(v) => onChange({ variant: v as any } as any)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="danger">Danger</SelectItem>
                <SelectItem value="tip">Tip</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
            <Input value={block.title || ""} onChange={(e) => onChange({ title: e.target.value } as any)} placeholder="Title (optional)" className="flex-1" />
          </div>
          <Textarea value={block.text} onChange={(e) => onChange({ text: e.target.value } as any)} rows={2} placeholder="Callout content..." />
        </div>
      )}

      {(block.type === "list") && (
        <div className="space-y-2">
          <Select value={block.ordered ? "ordered" : "unordered"} onValueChange={(v) => onChange({ ordered: v === "ordered" } as any)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="unordered">Bullet List</SelectItem><SelectItem value="ordered">Numbered List</SelectItem></SelectContent>
          </Select>
          <Textarea value={block.items.join("\n")} onChange={(e) => onChange({ items: e.target.value.split("\n").filter(Boolean) } as any)} rows={4} placeholder="One item per line..." />
        </div>
      )}

      {(block.type === "table") && (
        <div className="space-y-2">
          <Input value={block.caption || ""} onChange={(e) => onChange({ caption: e.target.value } as any)} placeholder="Table caption (optional)" />
          <Label className="text-xs">Headers (comma-separated)</Label>
          <Input value={block.headers.join(", ")} onChange={(e) => onChange({ headers: e.target.value.split(",").map(s => s.trim()) } as any)} />
          <Label className="text-xs">Rows (pipe-separated columns, one row per line)</Label>
          <Textarea
            value={block.rows.map(r => r.join(" | ")).join("\n")}
            onChange={(e) => onChange({ rows: e.target.value.split("\n").filter(Boolean).map(r => r.split("|").map(s => s.trim())) } as any)}
            rows={4}
            placeholder="Cell 1 | Cell 2 | Cell 3"
          />
        </div>
      )}

      {(block.type === "image") && (
        <div className="space-y-2">
          <Input value={block.src} onChange={(e) => onChange({ src: e.target.value } as any)} placeholder="Image URL (e.g. /images/first-aid/cpr-training.jpg)" />
          <Input value={block.caption || ""} onChange={(e) => onChange({ caption: e.target.value } as any)} placeholder="Caption (optional)" />
          <Input value={block.alt || ""} onChange={(e) => onChange({ alt: e.target.value } as any)} placeholder="Alt text for accessibility" />
          {block.src && <img src={block.src} alt={block.alt || ""} className="max-h-32 rounded border mt-1" />}
        </div>
      )}

      {(block.type === "video") && (
        <div className="space-y-2">
          <Input value={block.src} onChange={(e) => onChange({ src: e.target.value } as any)} placeholder="Video URL (YouTube, Vimeo, or .mp4/.webm)" />
          <Input value={block.caption || ""} onChange={(e) => onChange({ caption: e.target.value } as any)} placeholder="Caption (optional)" />
          <p className="text-xs text-slate-500">
            Tip: paste a YouTube watch URL, a Vimeo URL, or a direct link to an .mp4/.webm file.
          </p>
        </div>
      )}

      {(block.type === "knowledgeCheck") && (
        <div className="space-y-2">
          <Input value={block.question} onChange={(e) => onChange({ question: e.target.value } as any)} placeholder="Question..." />
          <Label className="text-xs">Options (one per line, mark correct with *)</Label>
          <Textarea
            value={block.options.map((o, i) => `${i === block.correctAnswer ? "*" : ""}${o}`).join("\n")}
            onChange={(e) => {
              const lines = e.target.value.split("\n").filter(Boolean);
              const correctIdx = lines.findIndex(l => l.startsWith("*"));
              const options = lines.map(l => l.replace(/^\*/, ""));
              onChange({ options, correctAnswer: correctIdx >= 0 ? correctIdx : 0 } as any);
            }}
            rows={4}
            placeholder={"*Correct answer\nWrong answer 1\nWrong answer 2"}
          />
          <Textarea value={block.explanation} onChange={(e) => onChange({ explanation: e.target.value } as any)} rows={2} placeholder="Explanation (shown after answering)..." />
        </div>
      )}

      {(block.type === "keyTerms") && (
        <div className="space-y-2">
          <Label className="text-xs">Terms (format: Term | Definition, one per line)</Label>
          <Textarea
            value={block.terms.map(t => `${t.term} | ${t.definition}`).join("\n")}
            onChange={(e) => {
              const terms = e.target.value.split("\n").filter(Boolean).map(line => {
                const [term, ...defParts] = line.split("|");
                return { term: term.trim(), definition: defParts.join("|").trim() };
              });
              onChange({ terms } as any);
            }}
            rows={4}
            placeholder={"UN Number | The four-digit number assigned by UN\nNOTOC | Notification to Commander"}
          />
        </div>
      )}

      {(block.type === "svg") && (
        <div className="space-y-2">
          <Input value={block.src} onChange={(e) => onChange({ src: e.target.value } as any)} placeholder="SVG URL (e.g. /images/fa-svg/drabc-flowchart.svg)" />
          <Input value={block.caption || ""} onChange={(e) => onChange({ caption: e.target.value } as any)} placeholder="Caption (optional)" />
        </div>
      )}

      {(block.type === "clickToReveal") && (
        <div className="space-y-2">
          <Select value={block.variant || "info"} onValueChange={(v) => onChange({ variant: v as any } as any)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="info">Info</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="danger">Danger</SelectItem><SelectItem value="tip">Tip</SelectItem></SelectContent>
          </Select>
          <Input value={block.title} onChange={(e) => onChange({ title: e.target.value } as any)} placeholder="Title..." />
          <Textarea value={block.content} onChange={(e) => onChange({ content: e.target.value } as any)} rows={2} placeholder="Hidden content..." />
        </div>
      )}

      {(block.type === "matching") && (
        <div className="space-y-2">
          <Input value={block.title} onChange={(e) => onChange({ title: e.target.value } as any)} placeholder="Matching title..." />
          <Label className="text-xs">Left items (one per line)</Label>
          <Textarea value={block.left.join("\n")} onChange={(e) => onChange({ left: e.target.value.split("\n").filter(Boolean) } as any)} rows={3} />
          <Label className="text-xs">Right items (one per line, matches left order)</Label>
          <Textarea value={block.right.join("\n")} onChange={(e) => onChange({ right: e.target.value.split("\n").filter(Boolean) } as any)} rows={3} />
        </div>
      )}

      {(block.type === "sequence") && (
        <div className="space-y-2">
          <Input value={block.title} onChange={(e) => onChange({ title: e.target.value } as any)} placeholder="Sequence title..." />
          <Label className="text-xs">Steps in correct order (one per line)</Label>
          <Textarea
            value={block.steps.join("\n")}
            onChange={(e) => {
              const steps = e.target.value.split("\n").filter(Boolean);
              onChange({ steps, correctOrder: steps.map((_, i) => i) } as any);
            }}
            rows={4}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================
function createDefaultBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "paragraph": return { type: "paragraph", text: "New paragraph. Click to edit." };
    case "heading": return { type: "heading", text: "New Heading", level: 3 };
    case "callout": return { type: "callout", variant: "info", title: "Important", text: "Callout content here." };
    case "list": return { type: "list", items: ["First item", "Second item", "Third item"] };
    case "table": return { type: "table", headers: ["Column 1", "Column 2"], rows: [["Row 1 Cell 1", "Row 1 Cell 2"]], caption: "" };
    case "image": return { type: "image", src: "", caption: "", alt: "" };
    case "video": return { type: "video", src: "", caption: "" };
    case "knowledgeCheck": return { type: "knowledgeCheck", question: "New question?", options: ["*Correct answer", "Wrong answer 1", "Wrong answer 2"], correctAnswer: 0, explanation: "Explanation here." };
    case "keyTerms": return { type: "keyTerms", terms: [{ term: "Term", definition: "Definition" }] };
    case "svg": return { type: "svg", src: "", caption: "" };
    case "clickToReveal": return { type: "clickToReveal", title: "Click to reveal", content: "Hidden content", variant: "info" };
    case "matching": return { type: "matching", title: "Match the items", left: ["Item A", "Item B"], right: ["Match 1", "Match 2"] };
    case "sequence": return { type: "sequence", title: "Order the steps", steps: ["Step 1", "Step 2", "Step 3"], correctOrder: [0, 1, 2] };
    default: return { type: "paragraph", text: "" };
  }
}

function getBlockLabel(type: string): string {
  const labels: Record<string, string> = {
    paragraph: "Paragraph", heading: "Heading", callout: "Callout",
    list: "List", table: "Table", image: "Image", video: "Video",
    knowledgeCheck: "Knowledge Check", keyTerms: "Key Terms",
    svg: "SVG Diagram", clickToReveal: "Click to Reveal",
    matching: "Matching", sequence: "Sequence",
    definition: "Definition", interactive: "Interactive",
  };
  return labels[type] || type;
}
