"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// === ANIMATED DOOR ARMING PROCEDURE ===
export function AnimatedDoorArming() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const steps = [
    { title: "Approach Door", desc: "Cabin crew approaches the aircraft door during boarding/disembarkation preparation.", handleAngle: 0, slideVisible: false, armed: false },
    { title: "Verify Disarmed", desc: "Confirm door is in DISARMED position - handle horizontal, slide armed indicator not showing.", handleAngle: 0, slideVisible: false, armed: false },
    { title: "Rotate Handle", desc: "Rotate the arming lever/handle clockwise from horizontal to vertical position.", handleAngle: 90, slideVisible: false, armed: false },
    { title: "Engage Slide", desc: "The evacuation slide mechanism is now engaged. Armed indicator (red) becomes visible.", handleAngle: 90, slideVisible: true, armed: true },
    { title: "Verify Armed", desc: "Confirm door is ARMED - handle vertical, red indicator visible, slide bar engaged.", handleAngle: 90, slideVisible: true, armed: true },
  ];

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep(step + 1), 2500);
    return () => clearTimeout(timer);
  }, [playing, step, steps.length]);

  const currentStep = steps[step];

  return (
    <div className="my-6 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-sky-500/5 to-blue-500/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary" className="gap-1">
          <Play className="h-3 w-3" />
          Animated Procedure
        </Badge>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => { setStep(0); setPlaying(false); }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={playing ? "default" : "outline"}
            className="h-7 gap-1"
            onClick={() => {
              if (step >= steps.length - 1) setStep(0);
              setPlaying(!playing);
            }}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      <h3 className="font-bold mb-3">Door Arming Procedure</h3>

      {/* SVG Animation */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 mb-3">
        <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
          {/* Door frame */}
          <rect x="80" y="30" width="140" height="240" rx="4" fill="none" stroke="#64748b" strokeWidth="3" />
          {/* Door panel */}
          <rect x="90" y="40" width="120" height="220" rx="4" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />

          {/* Armed indicator */}
          <motion.circle
            cx="150"
            cy="80"
            r="15"
            fill={currentStep.armed ? "#dc2626" : "#16a34a"}
            stroke="#ffffff"
            strokeWidth="2"
            animate={{ scale: currentStep.armed ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 1.5, repeat: currentStep.armed ? Infinity : 0 }}
          />
          <text
            x="150"
            y="86"
            textAnchor="middle"
            fontFamily="Arial"
            fontSize="12"
            fontWeight="bold"
            fill="#ffffff"
          >
            {currentStep.armed ? "A" : "D"}
          </text>

          {/* Handle */}
          <motion.g
            style={{ transformOrigin: "150px 180px" }}
            animate={{ rotate: currentStep.handleAngle }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <rect x="145" y="155" width="10" height="50" rx="2" fill={currentStep.armed ? "#dc2626" : "#64748b"} stroke="#0f172a" strokeWidth="1" />
          </motion.g>

          {/* Slide (appears when armed) */}
          <AnimatePresence>
            {currentStep.slideVisible && (
              <motion.g
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <rect x="120" y="240" width="60" height="15" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                <text x="150" y="251" textAnchor="middle" fontFamily="Arial" fontSize="8" fontWeight="bold" fill="#ffffff">SLIDE</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Status text */}
          <text
            x="150"
            y="285"
            textAnchor="middle"
            fontFamily="Arial"
            fontSize="11"
            fontWeight="bold"
            fill={currentStep.armed ? "#dc2626" : "#16a34a"}
          >
            {currentStep.armed ? "ARMED" : "DISARMED"}
          </text>
        </svg>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1 mb-3">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-all",
              i === step ? "bg-primary" : i < step ? "bg-primary/50" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card rounded-lg p-3 border"
        >
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">Step {step + 1} of {steps.length}</Badge>
            <h4 className="font-semibold text-sm">{currentStep.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{currentStep.desc}</p>
        </motion.div>
      </AnimatePresence>

      {/* Manual navigation */}
      <div className="flex justify-between mt-3">
        <Button
          size="sm"
          variant="ghost"
          disabled={step === 0}
          onClick={() => { setPlaying(false); setStep(step - 1); }}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={step === steps.length - 1}
          onClick={() => { setPlaying(false); setStep(step + 1); }}
          className="gap-1"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// === ANIMATED EVACUATION FLOW ===
export function AnimatedEvacuationFlow() {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);

  const phases = [
    { title: "Normal Flight", desc: "Aircraft in cruise. Passengers seated, seatbelts fastened.", passengers: "seated", slide: false, door: "closed" },
    { title: "Emergency Declared", desc: "Commander declares emergency. Cabin crew prepares for evacuation.", passengers: "alert", slide: false, door: "closed" },
    { title: "Brace! Brace!", desc: "Cabin crew shouts brace commands. Passengers assume brace position.", passengers: "brace", slide: false, door: "closed" },
    { title: "Aircraft Stops", desc: "Aircraft comes to complete stop. Commander initiates evacuation.", passengers: "brace", slide: false, door: "closed" },
    { title: "Doors Open", desc: "Cabin crew opens doors. Slides deploy automatically if armed.", passengers: "moving", slide: true, door: "open" },
    { title: "Evacuation", desc: "Passengers exit via slides. Crew directs to exits, assists as needed.", passengers: "evacuating", slide: true, door: "open" },
    { title: "Clear of Aircraft", desc: "All passengers and crew clear of aircraft. Move upwind.", passengers: "clear", slide: true, door: "open" },
  ];

  useEffect(() => {
    if (!playing) return;
    if (phase >= phases.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setPhase(phase + 1), 3000);
    return () => clearTimeout(timer);
  }, [playing, phase, phases.length]);

  const current = phases[phase];

  return (
    <div className="my-6 rounded-xl border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-500/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary" className="gap-1 bg-orange-500/10 text-orange-700">
          <Play className="h-3 w-3" />
          Emergency Procedure Animation
        </Badge>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setPhase(0); setPlaying(false); }}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={playing ? "default" : "outline"}
            className="h-7 gap-1"
            onClick={() => {
              if (phase >= phases.length - 1) setPhase(0);
              setPlaying(!playing);
            }}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      <h3 className="font-bold mb-3">Emergency Evacuation Sequence</h3>

      {/* SVG Scene */}
      <div className="bg-gradient-to-b from-sky-100 to-sky-200 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 mb-3 overflow-hidden">
        <svg viewBox="0 0 400 200" className="w-full">
          {/* Sky/Ground */}
          <rect x="0" y="0" width="400" height="150" fill="currentColor" className="text-sky-200 dark:text-slate-800" />
          <rect x="0" y="150" width="400" height="50" fill="currentColor" className="text-green-300 dark:text-green-900" />

          {/* Aircraft body */}
          <motion.ellipse
            cx="200"
            cy="130"
            rx="100"
            ry="25"
            fill="#e2e8f0"
            stroke="#64748b"
            strokeWidth="1.5"
            animate={{ y: phase === 6 ? -10 : 0 }}
          />

          {/* Windows */}
          <g fill="#0ea5e9">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect key={i} x={120 + i * 22} y={122} width={8} height={6} rx={1} />
            ))}
          </g>

          {/* Door */}
          <motion.rect
            x="170"
            y="115"
            width="15"
            height="20"
            rx="2"
            fill={current.door === "open" ? "#16a34a" : "#475569"}
            animate={{
              x: current.door === "open" ? 155 : 170,
              rotate: current.door === "open" ? -60 : 0,
            }}
            style={{ transformOrigin: "177px 135px" }}
            transition={{ duration: 0.5 }}
          />

          {/* Slide */}
          <AnimatePresence>
            {current.slide && (
              <motion.path
                d="M 170 140 Q 130 160 110 175"
                stroke="#f59e0b"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </AnimatePresence>

          {/* Passengers */}
          {current.passengers === "seated" && (
            <g fill="#3b82f6">
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx={140 + i * 25} cy={128} r="3" />
              ))}
            </g>
          )}
          {current.passengers === "brace" && (
            <g fill="#dc2626">
              {[0, 1, 2, 3].map((i) => (
                <ellipse key={i} cx={140 + i * 25} cy={130} rx="5" ry="3" />
              ))}
            </g>
          )}
          {current.passengers === "moving" && (
            <g fill="#f59e0b">
              {[0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={i}
                  cx={140 + i * 25}
                  cy={130}
                  r="3"
                  animate={{ cx: [140 + i * 25, 130, 110], cy: [130, 150, 175] }}
                  transition={{ duration: 1, delay: i * 0.3, repeat: Infinity, repeatDelay: 1 }}
                />
              ))}
            </g>
          )}
          {current.passengers === "evacuating" && (
            <g fill="#16a34a">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.circle
                  key={i}
                  r="3"
                  animate={{
                    cx: [165, 130, 100, 80 + i * 15],
                    cy: [135, 155, 175, 185],
                  }}
                  transition={{ duration: 1.5, delay: i * 0.25, repeat: Infinity }}
                />
              ))}
            </g>
          )}
          {current.passengers === "clear" && (
            <g fill="#16a34a">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <circle key={i} cx={50 + i * 20} cy={185} r="3" />
              ))}
            </g>
          )}

          {/* Alert indicator */}
          {current.passengers === "alert" && (
            <motion.g
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <text x="200" y="40" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#dc2626">! ALERT !</text>
            </motion.g>
          )}
        </svg>
      </div>

      {/* Phase indicator */}
      <div className="flex gap-1 mb-3">
        {phases.map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-all",
              i === phase ? "bg-orange-500" : i < phase ? "bg-orange-500/50" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Phase content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card rounded-lg p-3 border"
        >
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">Phase {phase + 1} of {phases.length}</Badge>
            <h4 className="font-semibold text-sm">{current.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{current.desc}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-3">
        <Button size="sm" variant="ghost" disabled={phase === 0} onClick={() => { setPlaying(false); setPhase(phase - 1); }}>
          Previous
        </Button>
        <Button size="sm" variant="ghost" disabled={phase === phases.length - 1} onClick={() => { setPlaying(false); setPhase(phase + 1); }} className="gap-1">
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// === FIRE FIGHTING PROCEDURE ANIMATION ===
export function AnimatedFireFighting() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = [
    { title: "Identify Fire", desc: "Cabin crew identifies fire source - smoke, flames, or smell of burning.", action: "detect" },
    { title: "Don PBE", desc: "Cabin crew dons Protective Breathing Equipment (PBE) before approaching fire.", action: "ppe" },
    { title: "Obtain Extinguisher", desc: "Retrieve nearest BCF (Halon) or water fire extinguisher.", action: "retrieve" },
    { title: "Approach Fire", desc: "Approach from windward side, maintain safe distance (~2 meters).", action: "approach" },
    { title: "Discharge Extinguisher", desc: "Aim at BASE of fire, sweep side to side. Use short bursts.", action: "discharge" },
    { title: "Monitor & Report", desc: "Monitor for re-ignition. Notify Commander. Secure area.", action: "monitor" },
  ];

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep(step + 1), 2500);
    return () => clearTimeout(timer);
  }, [playing, step, steps.length]);

  const current = steps[step];

  return (
    <div className="my-6 rounded-xl border-2 border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary" className="gap-1 bg-red-500/10 text-red-700">
          <Play className="h-3 w-3" />
          Fire Fighting Procedure
        </Badge>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setStep(0); setPlaying(false); }}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={playing ? "default" : "outline"}
            className="h-7 gap-1"
            onClick={() => {
              if (step >= steps.length - 1) setStep(0);
              setPlaying(!playing);
            }}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      <h3 className="font-bold mb-3">Cabin Fire Response</h3>

      {/* SVG Animation */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 mb-3">
        <svg viewBox="0 0 300 200" className="w-full">
          {/* Floor */}
          <rect x="0" y="160" width="300" height="40" fill="#94a3b8" />

          {/* Fire (visible when detected) */}
          <AnimatePresence>
            {step >= 0 && step < 5 && (
              <motion.g
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ transformOrigin: "200px 150px" }}
              >
                <path d="M 190 150 Q 195 130 200 150 Q 205 125 210 150 Q 215 135 220 150 L 220 160 L 190 160 Z" fill="#dc2626" />
                <path d="M 195 155 Q 200 140 205 155 Q 210 145 215 155 L 215 160 L 195 160 Z" fill="#f59e0b" />
                <path d="M 200 158 Q 205 148 210 158 L 210 160 L 200 160 Z" fill="#fbbf24" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Crew member */}
          <g transform="translate(80, 100)">
            {/* Body */}
            <rect x="-8" y="0" width="16" height="40" rx="2" fill="#0ea5e9" />
            {/* Head */}
            <circle cx="0" cy="-8" r="8" fill="#fbbf24" />
            {/* PBE Hood (appears at step 1+) */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.ellipse
                  cx="0"
                  cy="-8"
                  rx="10"
                  ry="11"
                  fill="#f59e0b"
                  opacity="0.7"
                  stroke="#92400e"
                  strokeWidth="1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                />
              )}
            </AnimatePresence>
            {/* Arms */}
            <motion.rect
              x="-12"
              y="5"
              width="6"
              height="25"
              rx="2"
              fill="#0284c7"
              animate={{ rotate: step >= 3 && step <= 4 ? [0, -30, 0] : 0 }}
              style={{ transformOrigin: "-9px 5px" }}
              transition={{ duration: 0.5, repeat: step === 4 ? Infinity : 0 }}
            />
            <rect x="6" y="5" width="6" height="25" rx="2" fill="#0284c7" />
            {/* Legs */}
            <rect x="-7" y="40" width="5" height="25" fill="#1e293b" />
            <rect x="2" y="40" width="5" height="25" fill="#1e293b" />
          </g>

          {/* Extinguisher (appears at step 2+) */}
          <AnimatePresence>
            {step >= 2 && (
              <motion.g
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transform="translate(95, 130)"
              >
                <rect x="0" y="0" width="12" height="20" rx="2" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
                <rect x="3" y="-5" width="6" height="5" fill="#475569" />
                <rect x="4" y="-8" width="4" height="3" fill="#475569" />
                {/* Discharge stream */}
                <AnimatePresence>
                  {step === 4 && (
                    <motion.path
                      d="M 12 5 Q 50 0 100 10"
                      stroke="#ffffff"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Smoke detection indicator */}
          {step === 0 && (
            <motion.g
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <text x="150" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#dc2626">! FIRE !</text>
            </motion.g>
          )}

          {/* Step label */}
          <text x="150" y="190" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">
            Step {step + 1}: {current.title}
          </text>
        </svg>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1 mb-3">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-all",
              i === step ? "bg-red-500" : i < step ? "bg-red-500/50" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card rounded-lg p-3 border"
        >
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">Step {step + 1} of {steps.length}</Badge>
            <h4 className="font-semibold text-sm">{current.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{current.desc}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-3">
        <Button size="sm" variant="ghost" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1); }}>
          Previous
        </Button>
        <Button size="sm" variant="ghost" disabled={step === steps.length - 1} onClick={() => { setPlaying(false); setStep(step + 1); }} className="gap-1">
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
