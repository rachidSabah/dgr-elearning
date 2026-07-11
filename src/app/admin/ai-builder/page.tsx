"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Bot, Sparkles, Upload, FileText, Loader2, CheckCircle2, AlertCircle,
  Zap, Settings, Cpu, Brain, MessageSquare, Wind, Router, Zap as ZapIcon
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
import { initializeAuth, getSession } from "@/lib/client-auth";
import {
  AI_PROVIDERS, getProviderConfigs, getProviderById, generateCourse,
  convertGeneratedCourse, type ProviderConfig
} from "@/lib/ai-providers";
import { createCourseInStore } from "@/lib/course-store";
import type { GeneratedCourse } from "@/lib/ai-providers";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  router: Router, wind: Wind, sparkles: Sparkles, cpu: Cpu,
  github: Cpu, brain: Brain, "message-square": MessageSquare,
  zap: ZapIcon, settings: Settings,
};

export default function AIBuilderPage() {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [pdfText, setPdfText] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("Cabin Crew Training");
  const [difficulty, setDifficulty] = useState("Professional");
  const [numModules, setNumModules] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<GeneratedCourse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    initializeAuth();
    setProviders(getProviderConfigs().filter((p) => p.isEnabled && p.apiKey));
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setPdfName(file.name);
    setProgress("Extracting text from PDF...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractPdfText(arrayBuffer);
      setPdfText(text);
      setProgress("");
      toast.success(`Extracted ${text.length.toLocaleString()} characters from ${file.name}`);
    } catch (err) {
      toast.error("Failed to read PDF. Try a different file.");
      setProgress("");
    }
  };

  // Simple PDF text extraction using pdf.js
  const extractPdfText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    // Dynamic import of pdfjs-dist
    try {
      const pdfjsLib = await import("pdfjs-dist");
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      }

      return fullText;
    } catch (err) {
      // Fallback: return empty (user can paste text manually)
      throw new Error("PDF parsing failed");
    }
  };

  const handleGenerate = async () => {
    if (!pdfText || pdfText.trim().length < 100) {
      setError("Please upload a PDF first (or paste text content below)");
      return;
    }
    if (!prompt || prompt.trim().length < 10) {
      setError("Please provide instructions for how you want the course built");
      return;
    }
    if (providers.length === 0) {
      setError("No AI providers configured. Go to AI Providers settings to add an API key.");
      return;
    }

    setGenerating(true);
    setError("");
    setResult(null);
    setProgress("Connecting to AI provider...");

    const selectedProvider = providers[0]; // Use first enabled provider

    setProgress(`Sending ${pdfText.length.toLocaleString()} characters to ${getProviderById(selectedProvider.providerId)?.name}...`);

    const result = await generateCourse({
      pdfText,
      prompt,
      providerId: selectedProvider.providerId,
      model: selectedProvider.selectedModel,
      courseTitle: courseTitle || undefined,
      courseCategory: category,
      difficulty,
      numberOfModules: numModules ? parseInt(numModules) : undefined,
    });

    setGenerating(false);
    setProgress("");

    if (result.success && result.course) {
      setResult(result.course);
      toast.success("Course generated successfully!");
    } else {
      setError(result.error || "Generation failed");
      toast.error(result.error || "Generation failed");
    }
  };

  const handlePublishCourse = () => {
    if (!result) return;

    const courseData = convertGeneratedCourse(result);
    const pub = createCourseInStore(courseData);

    if (pub.success) {
      toast.success(`"${result.title}" is now live on the student site!`);
      setResult(null);
      setPdfText("");
      setPdfName("");
      setPrompt("");
      setCourseTitle("");
    } else {
      toast.error(pub.error || "Failed to publish course");
    }
  };

  const enabledProviders = providers;
  const hasProviders = enabledProviders.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-600" /> AI Course Builder
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload a PDF, give instructions, and AI builds a complete interactive course
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/ai-providers"} className="gap-1.5">
          <Settings className="h-3.5 w-3.5" /> AI Providers
        </Button>
      </div>

      {/* Provider Status */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-slate-600">Active AI Providers:</span>
            {hasProviders ? (
              enabledProviders.map((p) => {
                const provider = getProviderById(p.providerId);
                if (!provider) return null;
                const Icon = ICON_MAP[provider.icon] || Bot;
                return (
                  <Badge key={p.providerId} className="gap-1" style={{ backgroundColor: provider.color + "20", color: provider.color, border: `1px solid ${provider.color}40` }}>
                    <Icon className="h-3 w-3" />
                    {provider.name}
                    <span className="text-xs opacity-70">· {p.selectedModel.split("/").pop()}</span>
                  </Badge>
                );
              })
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" /> No providers configured
              </Badge>
            )}
          </div>
          {!hasProviders && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠ Go to AI Providers settings to add an API key (free providers available: OpenRouter, Mistral, NVIDIA, GitHub Models, Groq)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Step 1: Upload PDF */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">1</span>
            Upload Training Material (PDF)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="flex-1">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-medium">
                  {pdfName ? pdfName : "Click to upload PDF"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {pdfText ? `${pdfText.length.toLocaleString()} characters extracted` : "PDF, up to 80,000 characters"}
                </p>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </div>
            </label>
          </div>
          <details className="text-xs">
            <summary className="cursor-pointer text-slate-500 hover:text-slate-700">Or paste text content manually</summary>
            <Textarea
              value={pdfText}
              onChange={(e) => setPdfText(e.target.value)}
              rows={5}
              placeholder="Paste the PDF text content here..."
              className="mt-2"
            />
          </details>
        </CardContent>
      </Card>

      {/* Step 2: Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">2</span>
            Course Building Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>What kind of course do you want to build?</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g., Build a comprehensive cabin crew safety procedures course with interactive scenarios, emergency response procedures, and a final exam with 20 questions. Include callouts for critical safety warnings."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Course Title (optional)</Label>
              <Input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Auto-detect" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cabin Crew Training">Cabin Crew Training</SelectItem>
                  <SelectItem value="Ground Operations">Ground Operations</SelectItem>
                  <SelectItem value="Airport Operations">Airport Operations</SelectItem>
                  <SelectItem value="Aviation Security">Aviation Security</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Modules (optional)</Label>
              <Input type="number" value={numModules} onChange={(e) => setNumModules(e.target.value)} placeholder="Auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Generate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">3</span>
            Generate Course
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {progress && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-sm">
              <Loader2 className="h-4 w-4 animate-spin shrink-0" /> {progress}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generating || !pdfText || !prompt || !hasProviders}
            className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            size="lg"
          >
            {generating ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Building Course with AI...</>
            ) : (
              <><Sparkles className="h-5 w-5" /> Generate Interactive Course</>
            )}
          </Button>

          <p className="text-xs text-center text-slate-400">
            The AI will create modules, lessons, quizzes, flashcards, scenarios, and a final exam from your PDF
          </p>
        </CardContent>
      </Card>

      {/* Step 4: Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-green-300 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" /> Course Generated Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 rounded-lg bg-white border">
                  <div className="text-2xl font-bold text-purple-600">{result.modules.length}</div>
                  <div className="text-xs text-slate-500">Modules</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white border">
                  <div className="text-2xl font-bold text-blue-600">{result.modules.reduce((a, m) => a + m.lessons.length, 0)}</div>
                  <div className="text-xs text-slate-500">Lessons</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white border">
                  <div className="text-2xl font-bold text-green-600">{result.finalExam.length}</div>
                  <div className="text-xs text-slate-500">Exam Questions</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white border">
                  <div className="text-2xl font-bold text-amber-600">{result.flashcards.length}</div>
                  <div className="text-xs text-slate-500">Flashcards</div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Course Title</Label>
                <p className="text-lg font-bold mt-1">{result.title}</p>
                <p className="text-sm text-slate-500">{result.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Modules Preview</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.modules.map((m, i) => (
                    <Badge key={i} variant="outline" className="gap-1" style={{ borderColor: m.color + "40" }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                      {m.code} {m.title}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handlePublishCourse} className="flex-1 gap-1.5 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" /> Publish to Student Site
                </Button>
                <Button variant="outline" onClick={() => setResult(null)} className="gap-1.5">
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* MCP Connection Info */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-purple-700">
            <Bot className="h-4 w-4" /> MCP Agent Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-600 mb-2">
            Connect external AI agents (Hermes Desktop, Hermes Agent, Claude Desktop) via MCP (Model Context Protocol) to dispatch course-building tasks from your desktop to this platform.
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/ai-providers"} className="gap-1.5">
            <Settings className="h-3.5 w-3.5" /> Configure MCP Connections
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
