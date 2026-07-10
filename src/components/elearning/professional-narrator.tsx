"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Mic,
  Mic2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface VoiceOption {
  name: string;
  lang: string;
  gender: "male" | "female" | "unknown";
  voiceURI: string;
}

interface ProfessionalNarratorProps {
  text: string;
  lessonId: string;
  lang: "en" | "fr" | "ar";
  onProgress?: (progress: number) => void;
  onSentenceChange?: (idx: number) => void;
  className?: string;
}

// Split text into sentences for granular highlighting
function splitIntoSentences(text: string): string[] {
  // Match sentence endings while preserving abbreviations
  const sentences = text
    .replace(/\n+/g, " ")
    .match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);
  return sentences ? sentences.map((s) => s.trim()).filter(Boolean) : [text];
}

export function ProfessionalNarrator({
  text,
  lessonId,
  lang,
  onProgress,
  onSentenceChange,
  className,
}: ProfessionalNarratorProps) {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [highlightedSentence, setHighlightedSentence] = useState(-1);

  const sentences = splitIntoSentences(text);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const savedVoiceRef = useRef<string>("");

  // Load voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const voiceOptions: VoiceOption[] = availableVoices
        .filter((v) => {
          // Filter by language preference
          if (lang === "fr") return v.lang.startsWith("fr");
          if (lang === "ar") return v.lang.startsWith("ar");
          return v.lang.startsWith("en");
        })
        .map((v) => ({
          name: v.name,
          lang: v.lang,
          gender: detectGender(v.name),
          voiceURI: v.voiceURI,
        }));

      setVoices(voiceOptions);

      // Load saved voice preference
      const saved = localStorage.getItem(`narrator-voice-${lang}`);
      if (saved && voiceOptions.find((v) => v.voiceURI === saved)) {
        setSelectedVoiceURI(saved);
        savedVoiceRef.current = saved;
      } else if (voiceOptions.length > 0) {
        // Prefer female voices for training narration
        const preferred = voiceOptions.find((v) => v.gender === "female") || voiceOptions[0];
        setSelectedVoiceURI(preferred.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [lang]);

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem(`narrator-pos-${lessonId}`);
    if (saved) {
      const pos = parseInt(saved, 10);
      if (pos >= 0 && pos < sentences.length) {
        setCurrentSentenceIdx(pos);
      }
    }
  }, [lessonId, sentences.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const detectGender = (name: string): "male" | "female" | "unknown" => {
    const lower = name.toLowerCase();
    const femaleIndicators = ["female", "woman", "samantha", "victoria", "karen", "fiona", "tessa", "amélie", "amelie", "thomas", "google uk english female"];
    const maleIndicators = ["male", "man", "daniel", "alex", "fred", "jorge", "google uk english male"];
    if (femaleIndicators.some((i) => lower.includes(i))) return "female";
    if (maleIndicators.some((i) => lower.includes(i))) return "male";
    return "unknown";
  };

  const speakSentence = useCallback(
    (idx: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (idx < 0 || idx >= sentences.length) {
        setIsPlaying(false);
        setCurrentSentenceIdx(-1);
        setHighlightedSentence(-1);
        localStorage.removeItem(`narrator-pos-${lessonId}`);
        onProgress?.(100);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(sentences[idx]);
      utterance.rate = rate;
      utterance.volume = isMuted ? 0 : volume;
      utterance.lang = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-SA" : "en-US";

      // Set voice
      const allVoices = window.speechSynthesis.getVoices();
      const voice = allVoices.find((v) => v.voiceURI === selectedVoiceURI);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setCurrentSentenceIdx(idx);
        setHighlightedSentence(idx);
        onSentenceChange?.(idx);
        // Save position
        localStorage.setItem(`narrator-pos-${lessonId}`, String(idx));
        // Calculate progress
        const progress = Math.round(((idx + 1) / sentences.length) * 100);
        onProgress?.(progress);
      };

      utterance.onend = () => {
        // Auto-advance to next sentence
        if (idx + 1 < sentences.length) {
          speakSentence(idx + 1);
        } else {
          setIsPlaying(false);
          setCurrentSentenceIdx(-1);
          setHighlightedSentence(-1);
          localStorage.removeItem(`narrator-pos-${lessonId}`);
          onProgress?.(100);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [sentences, rate, volume, isMuted, lang, selectedVoiceURI, lessonId, onProgress, onSentenceChange]
  );

  const handlePlay = () => {
    if (isPaused) {
      // Resume
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      // Start from current position or beginning
      const startIdx = currentSentenceIdx >= 0 ? currentSentenceIdx : 0;
      setIsPlaying(true);
      speakSentence(startIdx);
    }
  };

  const handlePause = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIdx(-1);
    setHighlightedSentence(-1);
    localStorage.removeItem(`narrator-pos-${lessonId}`);
  };

  const handleSkipBack = () => {
    const newIdx = Math.max(0, currentSentenceIdx - 1);
    if (isPlaying) {
      speakSentence(newIdx);
    } else {
      setCurrentSentenceIdx(newIdx);
      setHighlightedSentence(newIdx);
    }
  };

  const handleSkipForward = () => {
    const newIdx = Math.min(sentences.length - 1, currentSentenceIdx + 1);
    if (isPlaying) {
      speakSentence(newIdx);
    } else {
      setCurrentSentenceIdx(newIdx);
      setHighlightedSentence(newIdx);
    }
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(() => {
      setIsPlaying(true);
      speakSentence(0);
    }, 100);
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    savedVoiceRef.current = uri;
    localStorage.setItem(`narrator-voice-${lang}`, uri);
    // If currently playing, restart with new voice
    if (isPlaying && currentSentenceIdx >= 0) {
      speakSentence(currentSentenceIdx);
    }
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying && currentSentenceIdx >= 0) {
      // Need to restart current sentence with new rate
      setTimeout(() => speakSentence(currentSentenceIdx), 50);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const progress = sentences.length > 0 && currentSentenceIdx >= 0
    ? Math.round(((currentSentenceIdx + 1) / sentences.length) * 100)
    : 0;

  return (
    <div className={cn("rounded-xl border bg-gradient-to-br from-primary/5 via-chart-4/5 to-chart-2/5 p-4", className)}>
      {/* Top row: controls */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Voice selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              {voices.find((v) => v.voiceURI === selectedVoiceURI)?.gender === "female" ? (
                <Mic2 className="h-3.5 w-3.5 text-purple-500" />
              ) : voices.find((v) => v.voiceURI === selectedVoiceURI)?.gender === "male" ? (
                <Mic className="h-3.5 w-3.5 text-blue-500" />
              ) : (
                <Mic className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline text-xs max-w-[100px] truncate">
                {voices.find((v) => v.voiceURI === selectedVoiceURI)?.name || "Select Voice"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Voice Selection</div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {voices.length === 0 ? (
                  <div className="text-xs text-muted-foreground p-2">No voices available for {lang}. Install language packs in your browser.</div>
                ) : (
                  voices.map((v) => (
                    <button
                      key={v.voiceURI}
                      onClick={() => handleVoiceChange(v.voiceURI)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 hover:bg-accent transition-colors",
                        selectedVoiceURI === v.voiceURI && "bg-primary/10 border border-primary/30"
                      )}
                    >
                      {v.gender === "female" ? (
                        <Mic2 className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                      ) : v.gender === "male" ? (
                        <Mic className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      ) : (
                        <Mic className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{v.name}</div>
                        <div className="text-muted-foreground">{v.lang} - {v.gender}</div>
                      </div>
                      {selectedVoiceURI === v.voiceURI && (
                        <Badge variant="secondary" className="text-[10px]">Active</Badge>
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="text-[10px] text-muted-foreground pt-2 border-t">
                Tip: Choose a natural-sounding voice for the best learning experience. Female voices often work well for training narration.
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Main controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleSkipBack}
            disabled={currentSentenceIdx <= 0 && !isPlaying}
            title="Previous sentence"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </Button>

          {isPlaying ? (
            <Button
              size="sm"
              variant="default"
              className="h-9 w-9 p-0 rounded-full"
              onClick={handlePause}
              title="Pause"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="default"
              className="h-9 w-9 p-0 rounded-full"
              onClick={handlePlay}
              title={isPaused ? "Resume" : "Play"}
            >
              <Play className="h-4 w-4 ml-0.5" />
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleStop}
            disabled={!isPlaying && !isPaused && currentSentenceIdx < 0}
            title="Stop"
          >
            <Square className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleSkipForward}
            disabled={currentSentenceIdx >= sentences.length - 1}
            title="Next sentence"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleRestart}
            title="Replay from start"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Speed control */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              <Gauge className="h-3.5 w-3.5" />
              <span className="text-xs">{rate}x</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="center">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Playback Speed</div>
              <Slider
                value={[rate]}
                onValueChange={(v) => handleRateChange(v[0])}
                min={0.5}
                max={2}
                step={0.25}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <button onClick={() => handleRateChange(0.75)} className="hover:text-foreground">0.75x</button>
                <button onClick={() => handleRateChange(1)} className="hover:text-foreground">1x</button>
                <button onClick={() => handleRateChange(1.25)} className="hover:text-foreground">1.25x</button>
                <button onClick={() => handleRateChange(1.5)} className="hover:text-foreground">1.5x</button>
                <button onClick={() => handleRateChange(2)} className="hover:text-foreground">2x</button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Volume control */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
              {isMuted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40" align="end">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase">Volume</div>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(v) => handleVolumeChange(v[0])}
                min={0}
                max={1}
                step={0.1}
              />
              <div className="text-[10px] text-center text-muted-foreground">
                {isMuted ? "Muted" : `${Math.round(volume * 100)}%`}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Status */}
        <div className="ml-auto flex items-center gap-2">
          {currentSentenceIdx >= 0 && (
            <Badge variant="secondary" className="text-xs">
              {currentSentenceIdx + 1} / {sentences.length}
            </Badge>
          )}
          {isPaused && (
            <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/30">
              Paused
            </Badge>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className="absolute h-full bg-gradient-to-r from-primary via-chart-2 to-chart-4 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sentence preview / current text */}
      {currentSentenceIdx >= 0 && currentSentenceIdx < sentences.length && (
        <div className="text-xs text-muted-foreground line-clamp-2 italic">
          <span className="text-primary font-medium">Now:</span> {sentences[currentSentenceIdx]}
        </div>
      )}

      {/* Highlighted text overlay (optional - shown when narrating) */}
      {(isPlaying || isPaused) && highlightedSentence >= 0 && (
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
          <div className="text-sm leading-relaxed">{sentences[highlightedSentence]}</div>
        </div>
      )}
    </div>
  );
}
