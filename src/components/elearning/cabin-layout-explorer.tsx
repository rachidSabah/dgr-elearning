"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DoorOpen, FireExtinguisher, Heart, Users, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CabinZone {
  id: string;
  label: string;
  type: "door" | "galley" | "lavatory" | "seat" | "equipment";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  info: {
    title: string;
    description: string;
    details: string[];
  };
}

const cabinZones: CabinZone[] = [
  {
    id: "cockpit",
    label: "Cockpit",
    type: "door",
    x: 5, y: 35, width: 12, height: 30,
    color: "#0c4a6e",
    info: {
      title: "Flight Deck (Cockpit)",
      description: "Where pilots operate the aircraft. NO dangerous goods may be carried here.",
      details: [
        "Access restricted to flight crew only",
        "DG strictly prohibited (exception: crew personal items per provisions)",
        "Emergency procedures initiated from here",
        "NOTOC must be available to Commander during entire flight",
      ],
    },
  },
  {
    id: "L1",
    label: "L1 Door",
    type: "door",
    x: 17, y: 12, width: 5, height: 8,
    color: "#16a34a",
    info: {
      title: "Door L1 (Type A)",
      description: "Main boarding door - front left. Primary evacuation exit.",
      details: [
        "Type A door - 42 inches wide minimum",
        "Must be armed before pushback",
        "Slide deploys automatically when armed",
        "Cabin crew station during boarding/disembarkation",
        "Manual evacuation command: 'Unfasten seatbelts! Come this way!'",
      ],
    },
  },
  {
    id: "R1",
    label: "R1 Door",
    type: "door",
    x: 17, y: 80, width: 5, height: 8,
    color: "#16a34a",
    info: {
      title: "Door R1 (Type A)",
      description: "Main boarding door - front right. Primary evacuation exit.",
      details: [
        "Mirror of L1 door",
        "Type A door - 42 inches wide minimum",
        "Must be armed before pushback",
        "Cabin crew station during boarding",
      ],
    },
  },
  {
    id: "galley-fwd",
    label: "Forward Galley",
    type: "galley",
    x: 24, y: 15, width: 8, height: 12,
    color: "#0ea5e9",
    info: {
      title: "Forward Galley",
      description: "Food preparation and storage area. Contains DG exception items.",
      details: [
        "Catering supplies (DG exception under provisions)",
        "Alcoholic beverages for service (DG exception)",
        "Dry ice may be used for cooling (within limits)",
        "Fire extinguisher location (Halon/BCF)",
        "Galley carts secured during taxi/takeoff/landing",
      ],
    },
  },
  {
    id: "cabin-main",
    label: "Passenger Cabin",
    type: "seat",
    x: 35, y: 30, width: 45, height: 40,
    color: "#64748b",
    info: {
      title: "Passenger Cabin",
      description: "Main seating area. NO dangerous goods allowed except per passenger provisions.",
      details: [
        "DG never carried in passenger cabin (exception: passenger provisions)",
        "Cabin crew monitor for suspicious items",
        "Passenger tickets contain IATA DGR information",
        "In-flight DG incidents handled per cabin crew checklist",
        "Emergency equipment located at crew stations",
      ],
    },
  },
  {
    id: "L2",
    label: "L2 Door",
    type: "door",
    x: 50, y: 12, width: 5, height: 8,
    color: "#16a34a",
    info: {
      title: "Door L2 (Type A)",
      description: "Mid-cabin exit - left side. Secondary evacuation exit.",
      details: [
        "Type A door",
        "Armed before pushback",
        "Cabin crew station during boarding",
        "Secondary evacuation route",
      ],
    },
  },
  {
    id: "R2",
    label: "R2 Door",
    type: "door",
    x: 50, y: 80, width: 5, height: 8,
    color: "#16a34a",
    info: {
      title: "Door R2 (Type A)",
      description: "Mid-cabin exit - right side. Secondary evacuation exit.",
      details: [
        "Mirror of L2 door",
        "Type A door",
        "Secondary evacuation route",
      ],
    },
  },
  {
    id: "L3",
    label: "L3 Door",
    type: "door",
    x: 82, y: 12, width: 5, height: 8,
    color: "#f59e0b",
    info: {
      title: "Door L3 (Type III)",
      description: "Aft exit - left side. May be Type III (smaller).",
      details: [
        "Type III or Type A depending on aircraft",
        "Type III: 20 inches wide, step-down exit",
        "Armed before pushback",
        "Tertiary evacuation route",
      ],
    },
  },
  {
    id: "R3",
    label: "R3 Door",
    type: "door",
    x: 82, y: 80, width: 5, height: 8,
    color: "#f59e0b",
    info: {
      title: "Door R3 (Type III)",
      description: "Aft exit - right side. May be Type III (smaller).",
      details: [
        "Mirror of L3 door",
        "Type III or Type A depending on aircraft",
        "Tertiary evacuation route",
      ],
    },
  },
  {
    id: "lav-aft",
    label: "Aft Lavatory",
    type: "lavatory",
    x: 78, y: 15, width: 5, height: 12,
    color: "#7c3aed",
    info: {
      title: "Aft Lavatory",
      description: "Passenger toilet. Contains smoke detector and ashtray.",
      details: [
        "Smoke detector mandatory (must be functional)",
        "Ashtray required (even though smoking prohibited)",
        "Fire suppression system in waste bin",
        "Cabin crew check regularly for smoking",
      ],
    },
  },
  {
    id: "ext-fwd",
    label: "Fire Ext.",
    type: "equipment",
    x: 28, y: 55, width: 3, height: 5,
    color: "#dc2626",
    info: {
      title: "Fire Extinguisher (BCF/Halon)",
      description: "Halon 1211 (BCF) fire extinguisher for cabin use.",
      details: [
        "Located at crew stations and galley areas",
        "Halon 1211 (BCF) - most common type",
        "Alternative: Water extinguisher for non-electrical fires",
        "Check water compatibility with DG before use",
        "PPE (smoke hood) required before use",
      ],
    },
  },
  {
    id: "ext-aft",
    label: "Fire Ext.",
    type: "equipment",
    x: 75, y: 55, width: 3, height: 5,
    color: "#dc2626",
    info: {
      title: "Fire Extinguisher (Aft)",
      description: "Second BCF fire extinguisher in aft cabin.",
      details: [
        "Backup extinguisher for aft cabin",
        "Same specifications as forward unit",
        "Minimum 2 extinguishers required in cabin",
      ],
    },
  },
  {
    id: "first-aid",
    label: "First Aid Kit",
    type: "equipment",
    x: 45, y: 60, width: 4, height: 4,
    color: "#16a34a",
    info: {
      title: "First Aid Kit",
      description: "Medical supplies for passenger/crew injuries.",
      details: [
        "Located at crew stations",
        "Contains basic medical supplies",
        "Enhanced Medical Kit (EMK) on larger aircraft",
        "Used for DG incident injuries (burns, contamination)",
        "Rubber gloves included for DG spillage response",
      ],
    },
  },
];

export function CabinLayoutExplorer() {
  const [selectedZone, setSelectedZone] = useState<CabinZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <div className="my-6">
      <div className="text-center mb-4">
        <Badge variant="secondary" className="mb-2">
          <Plane className="h-3 w-3 mr-1" />
          Interactive Cabin
        </Badge>
        <h3 className="text-lg font-bold">Explore the Aircraft Cabin</h3>
        <p className="text-sm text-muted-foreground">Click on any zone to learn about DG-related procedures</p>
      </div>

      <div className="relative rounded-xl border-2 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full" style={{ aspectRatio: "2/1" }}>
          {/* Fuselage outline */}
          <path
            d="M 3 50 Q 3 15 15 10 L 88 10 Q 97 15 97 50 Q 97 85 88 90 L 15 90 Q 3 85 3 50 Z"
            fill="#f1f5f9"
            stroke="#64748b"
            strokeWidth="0.5"
          />

          {/* Cabin zones */}
          {cabinZones.map((zone) => {
            const isSelected = selectedZone?.id === zone.id;
            const isHovered = hoveredZone === zone.id;
            return (
              <g key={zone.id}>
                <motion.rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="1"
                  fill={zone.color}
                  opacity={isSelected ? 0.9 : isHovered ? 0.8 : 0.6}
                  stroke={isSelected ? "#0f172a" : "#ffffff"}
                  strokeWidth={isSelected ? 0.5 : 0.3}
                  className="cursor-pointer"
                  onClick={() => setSelectedZone(zone)}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
                {zone.label && zone.width >= 4 && (
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 1}
                    textAnchor="middle"
                    fontSize="1.8"
                    fontWeight="bold"
                    fill="#ffffff"
                    className="pointer-events-none"
                  >
                    {zone.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Seats */}
          <g fill="#94a3b8" opacity="0.5">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={38 + col * 6.5}
                  y={33 + row * 4.5}
                  width="3"
                  height="2.5"
                  rx="0.3"
                />
              ))
            )}
          </g>

          {/* Aisle */}
          <line x1="50" y1="30" x2="50" y2="70" stroke="#cbd5e1" strokeWidth="1" strokeDashash="0.5" />
        </svg>

        {/* Legend */}
        <div className="absolute top-2 right-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-lg p-2 text-xs">
          <div className="font-semibold mb-1">Legend</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>Type A Door</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-500" />
              <span>Type III Door</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>Fire Extinguisher</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span>Galley</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedZone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-2xl max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-5 text-white rounded-t-2xl relative"
                style={{ background: `linear-gradient(135deg, ${selectedZone.color}, ${selectedZone.color}cc)` }}
              >
                <button
                  onClick={() => setSelectedZone(null)}
                  className="absolute top-3 right-3 text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  {selectedZone.type === "door" && <DoorOpen className="h-5 w-5" />}
                  {selectedZone.type === "equipment" && selectedZone.label.includes("Fire") && <FireExtinguisher className="h-5 w-5" />}
                  {selectedZone.type === "equipment" && selectedZone.label.includes("First") && <Heart className="h-5 w-5" />}
                  {selectedZone.type === "seat" && <Users className="h-5 w-5" />}
                  {selectedZone.type === "galley" && <Plane className="h-5 w-5" />}
                  <Badge className="bg-white/20 text-white border-white/30 capitalize">
                    {selectedZone.type}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold">{selectedZone.info.title}</h2>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-sm">{selectedZone.info.description}</p>

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Points</h3>
                  <ul className="space-y-1.5">
                    {selectedZone.info.details.map((detail, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setSelectedZone(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
