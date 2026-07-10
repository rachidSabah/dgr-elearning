"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse } from "@/lib/use-course";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { BookMarked, Search, Volume2, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GlossaryView() {
  const { language } = useAppStore();
  const courseData = useCurrentCourse();
  const lang = language || "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    if (!searchQuery) return courseData.glossary;
    const q = searchQuery.toLowerCase();
    return courseData.glossary.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q)
    );
  }, [searchQuery, courseData]);

  const handleSpeak = (term: string, definition: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingTerm === term) {
      window.speechSynthesis.cancel();
      setSpeakingTerm(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${term}. ${definition}`);
    utterance.lang = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-SA" : "en-US";
    utterance.onend = () => setSpeakingTerm(null);
    setSpeakingTerm(term);
    window.speechSynthesis.speak(utterance);
  };

  // Group by first letter
  const grouped = useMemo(() => {
    const groups: { [letter: string]: typeof courseData.glossary } = {};
    filteredTerms.forEach((term) => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTerms]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <BookMarked className="h-5 w-5 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold">{t(lang, "glossary")}</h1>
        </div>
        <p className="text-muted-foreground">
          {courseData.glossary.length} key terms and definitions from the Dangerous Goods Regulations
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search terms or definitions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Terms grouped by letter */}
      {grouped.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No terms found matching &ldquo;{searchQuery}&rdquo;</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([letter, terms]) => (
            <div key={letter}>
              <div className="sticky top-16 z-30 glass">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {letter}
                  </div>
                  <div className="h-px flex-1 bg-border" />
                  <Badge variant="outline">{terms.length}</Badge>
                </div>
              </div>
              <div className="space-y-2 mt-2">
                {terms.map((term) => (
                  <Card key={term.term} className="card-hover">
                    <CardContent className="py-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{term.term}</div>
                          <div className="text-sm text-muted-foreground">{term.definition}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="shrink-0"
                          onClick={() => handleSpeak(term.term, term.definition)}
                        >
                          <Volume2
                            className={`h-4 w-4 ${speakingTerm === term.term ? "text-primary" : ""}`}
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
