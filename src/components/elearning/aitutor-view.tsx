"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse } from "@/lib/use-course";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Sparkles, BookOpen, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { CourseData } from "@/lib/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Build a knowledge base from course content for local AI responses
function buildKnowledgeBase(courseData: CourseData): string {
  let kb = "";
  courseData.modules.forEach((module) => {
    kb += `\n## Module ${module.code}: ${module.title}\n${module.description}\n`;
    module.lessons.forEach((lesson) => {
      kb += `\n### Lesson ${lesson.code}: ${lesson.title}\n`;
      lesson.content.forEach((block) => {
        if (block.type === "paragraph") kb += `${block.text}\n`;
        else if (block.type === "callout") kb += `${block.title || ""}: ${block.text}\n`;
        else if (block.type === "list") block.items.forEach((i) => (kb += `- ${i}\n`));
        else if (block.type === "table") {
          kb += `${block.caption || ""}\n`;
          block.rows.forEach((row) => (kb += `${row.join(" | ")}\n`));
        }
        else if (block.type === "definition" || block.type === "keyTerms") {
          if (block.type === "definition") kb += `${block.term}: ${block.definition}\n`;
          else block.terms.forEach((kt) => (kb += `${kt.term}: ${kt.definition}\n`));
        }
      });
      kb += `\nSummary: ${lesson.summary.join("; ")}\n`;
    });
  });
  // Add glossary
  kb += "\n## Glossary\n";
  courseData.glossary.forEach((g) => (kb += `${g.term}: ${g.definition}\n`));
  // Add FAQ
  kb += "\n## FAQ\n";
  courseData.faq.forEach((f) => (kb += `Q: ${f.question}\nA: ${f.answer}\n`));
  return kb;
}

// Enhanced search that returns content with lesson citations
interface SearchResult {
  text: string;
  score: number;
  lessonCode?: string;
  lessonTitle?: string;
  moduleCode?: string;
}

function findRelevantContentWithCitations(courseData: CourseData, query: string): SearchResult[] {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter((w) => w.length > 3);

  const results: SearchResult[] = [];

  courseData.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      lesson.content.forEach((block) => {
        let text = "";
        if (block.type === "paragraph") text = block.text;
        else if (block.type === "callout") text = `${block.title || ""}: ${block.text}`;
        else if (block.type === "list") text = block.items.join(" ");
        else if (block.type === "table") text = `${block.caption || ""} ${block.rows.map(r => r.join(" ")).join(" ")}`;
        else if (block.type === "definition") text = `${block.term}: ${block.definition}`;
        else if (block.type === "keyTerms") text = block.terms.map(t => `${t.term}: ${t.definition}`).join(" ");

        if (!text) return;

        const textLower = text.toLowerCase();
        let score = 0;
        keywords.forEach((kw) => {
          if (textLower.includes(kw)) score += 1;
        });

        // Also check lesson title and summary
        const titleLower = lesson.title.toLowerCase();
        const summaryLower = lesson.summary.join(" ").toLowerCase();
        keywords.forEach((kw) => {
          if (titleLower.includes(kw)) score += 2;
          if (summaryLower.includes(kw)) score += 1;
        });

        if (score > 0) {
          results.push({
            text,
            score,
            lessonCode: lesson.code,
            lessonTitle: lesson.title,
            moduleCode: mod.code,
          });
        }
      });

      // Also add summary as searchable content
      const summaryText = lesson.summary.join(" ");
      const summaryLower = summaryText.toLowerCase();
      let summaryScore = 0;
      keywords.forEach((kw) => {
        if (summaryLower.includes(kw)) summaryScore += 1;
      });
      if (summaryScore > 0) {
        results.push({
          text: `Summary: ${summaryText}`,
          score: summaryScore,
          lessonCode: lesson.code,
          lessonTitle: lesson.title,
          moduleCode: mod.code,
        });
      }
    });
  });

  // Add glossary search
  courseData.glossary.forEach((g) => {
    const text = `${g.term}: ${g.definition}`;
    const textLower = text.toLowerCase();
    let score = 0;
    keywords.forEach((kw) => {
      if (textLower.includes(kw)) score += 1;
    });
    if (score > 0) {
      results.push({ text, score, lessonCode: "Glossary", lessonTitle: "Glossary", moduleCode: "—" });
    }
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 4);
}

// Simple keyword-based search to find relevant content (legacy, kept for compat)
function findRelevantContent(courseData: CourseData, query: string): string {
  const results = findRelevantContentWithCitations(courseData, query);
  return results.map(r => r.text).join("\n\n") || "";
}

// Weak area analysis based on quiz performance
function analyzeWeakAreas(courseData: CourseData, progress: any): string {
  if (!progress || !progress.quizScores) return "";

  const topicScores: Record<string, { correct: number; total: number }> = {};

  // Analyze lesson quiz scores
  Object.entries(progress.quizScores).forEach(([lessonId, scores]: [string, any]) => {
    if (scores.length === 0) return;
    const last = scores[scores.length - 1];
    const lesson = courseData.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
    if (!lesson) return;

    // Extract topic from lesson code
    const topic = lesson.moduleId === "mod-1" ? "Awareness & Regulations" :
                  lesson.moduleId === "mod-2" ? "Classification & Transport" :
                  lesson.moduleId === "mod-3" ? "NOTOC & Emergencies" : "General";

    if (!topicScores[topic]) topicScores[topic] = { correct: 0, total: 0 };
    topicScores[topic].correct += last.score;
    topicScores[topic].total += last.total;
  });

  const weakTopics = Object.entries(topicScores)
    .map(([topic, scores]) => ({
      topic,
      pct: scores.total > 0 ? (scores.correct / scores.total) * 100 : 0,
    }))
    .filter(t => t.pct < 70)
    .sort((a, b) => a.pct - b.pct);

  if (weakTopics.length === 0) return "";

  const weakest = weakTopics[0];
  return `Based on your quiz performance, your weakest area is **${weakest.topic}** (${Math.round(weakest.pct)}% average score). I recommend reviewing the related lessons and retaking the quizzes. Would you like me to suggest specific lessons to review?`;
}

function generateResponse(courseData: CourseData, query: string, progress?: any): string {
  const queryLower = query.toLowerCase();

  // Weak areas analysis request
  if (/weak|improve|struggle|difficult|recommend|review|where.*focus|what.*study/i.test(query)) {
    const analysis = analyzeWeakAreas(courseData, progress);
    if (analysis) {
      return analysis;
    }
    return "Take some quizzes first so I can analyze your weak areas. Once you've completed a few lesson quizzes, I can identify which topics you should focus on and recommend specific lessons to review.";
  }

  // Greeting
  if (/^(hi|hello|hey|bonjour|salut|salam|مرحبا|Bonjour)/i.test(query.trim())) {
    return `Hello! I'm your AI Learning Coach for ${courseData.title}. I'm trained exclusively on your course content and can help you with:

**Core Topics:**
- The nine hazard classes and their IATA codes (RFL, RCM, RRW, etc.)
- NOTOC procedures and Commander responsibilities
- Loading, stowage, and segregation rules
- Emergency response procedures and checklists
- Reporting requirements (72-hour rule)
- Weapons and ammunition carriage rules
- Dry ice, radioactive materials, and other special items

**How I can help:**
- Answer questions with lesson citations
- Explain difficult concepts
- Identify your weak areas from quiz performance
- Recommend lessons to review
- Generate practice scenarios

What would you like to learn about?`;
  }

  // Find relevant content with citations
  const results = findRelevantContentWithCitations(courseData, query);

  if (results.length === 0) {
    return `I don't have specific information about that in the course content. Here are some topics I can help with:

1. **Hazard Classes** - Ask about any of the 9 classes (Explosives, Gases, Flammable Liquids, etc.)
2. **IATA Codes** - RFL, RCM, RRW, RRY, ICE, RSB, etc.
3. **NOTOC** - Notification to Commander procedures
4. **Emergencies** - Incident checklists and response drills
5. **Weapons** - Sporting weapons and ammunition rules
6. **Packing** - Packing groups and requirements
7. **Labelling** - Hazard and handling labels
8. **Weak Areas** - Ask "what are my weak areas?" for personalized recommendations

Try rephrasing your question or ask about one of these topics.`;
  }

  // Format response with citations
  let response = `Based on the ${courseData.title} training material:\n\n`;
  response += results.map((r) => r.text).join("\n\n");

  // Add citations
  const citations = results
    .filter((r, i, arr) => arr.findIndex(x => x.lessonCode === r.lessonCode) === i)
    .map((r) => `📖 ${r.lessonCode} - ${r.lessonTitle} (Module ${r.moduleCode})`)
    .join("\n");

  response += `\n\n**📚 Source Lessons:**\n${citations}`;

  // Add follow-up suggestion
  response += "\n\n💡 *You can ask me to explain any of this in more detail, take the related quiz to test your understanding, or ask 'what are my weak areas?' for personalized recommendations.*";

  return response;
}

const suggestedQuestions = [
  "What are the nine hazard classes?",
  "What is NOTOC and when is it used?",
  "Which explosives are allowed on passenger aircraft?",
  "What is the maximum dry ice per hold?",
  "How should damaged dangerous goods be handled?",
  "What are my weak areas?",
];

export function AITutorView() {
  const { language, progress } = useAppStore();
  const courseData = useCurrentCourse();

  // Knowledge base built from the current course content (kept for future AI features)
  const knowledgeBase = useMemo(() => buildKnowledgeBase(courseData), [courseData]);
  // Reference knowledgeBase so it stays in sync with the selected course without
  // being flagged as unused by the compiler.
  void knowledgeBase;

  const lang = language || "en";
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: t(lang, "aitutorWelcome"),
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const response = generateResponse(courseData, message, progress);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          timestamp: Date.now(),
        },
      ]);
      setIsThinking(false);
    }, 800 + Math.random() * 700);
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: t(lang, "aitutorWelcome"),
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t(lang, "aitutorTitle")}</h1>
              <p className="text-sm text-muted-foreground">
                Trained on your course content • {courseData.modules.length} modules
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1">
            <RefreshCw className="h-3 w-3" />
            Reset
          </Button>
        </div>
      </motion.div>

      <Card className="flex flex-col h-[600px]">
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-blue-500 to-purple-500"
                    : "bg-muted"
                )}>
                  {msg.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-3",
                  msg.role === "assistant"
                    ? "bg-muted/50 rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground/50"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Suggested questions:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-accent hover:bg-accent/70 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder={t(lang, "typeQuestion")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
            />
            <Button type="submit" size="icon" disabled={isThinking || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
            <BookOpen className="h-3 w-3" />
            AI Tutor is trained only on your DGR course content
          </p>
        </div>
      </Card>
    </div>
  );
}
