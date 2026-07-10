"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, AlertTriangle, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HazardClassInfo {
  num: string;
  name: string;
  code: string;
  color: string;
  description: string;
  examples: string[];
  cargoOnly?: boolean;
  passengerAllowed?: boolean;
  divisions?: { num: string; code: string; desc: string }[];
}

const hazardClasses: HazardClassInfo[] = [
  {
    num: "1",
    name: "Explosives",
    code: "REX",
    color: "#ea580c",
    description: "Substances that can rapidly release gases, heat, and energy causing an explosion. Divided into 6 compatibility groups.",
    examples: ["Fireworks", "Ammunition", "Detonators", "Blasting caps"],
    divisions: [
      { num: "1.1", code: "REX", desc: "Mass explosion hazard - FORBIDDEN" },
      { num: "1.3C", code: "RCX", desc: "Fire hazard + minor blast - CAO only" },
      { num: "1.3G", code: "RGX", desc: "Fire hazard + minor blast - CAO only" },
      { num: "1.4S", code: "RXS", desc: "No significant hazard - PASSENGER OK" },
    ],
  },
  {
    num: "2.1",
    name: "Flammable Gas",
    code: "RFG",
    color: "#dc2626",
    description: "Gases that ignite at 13°C or below, or have flammable range with air.",
    examples: ["Propane", "Butane", "Hydrogen", "Acetylene"],
    passengerAllowed: true,
  },
  {
    num: "2.2",
    name: "Non-Flammable Gas",
    code: "RNG",
    color: "#16a34a",
    description: "Gases that are neither flammable nor toxic, but can displace oxygen causing asphyxiation.",
    examples: ["Nitrogen", "Carbon dioxide", "Helium", "Argon"],
    passengerAllowed: true,
  },
  {
    num: "2.3",
    name: "Toxic Gas",
    code: "RPG",
    color: "#64748b",
    description: "Gases harmful to humans, can cause injury or death even in small quantities.",
    examples: ["Chlorine", "Ammonia", "Phosgene", "Carbon monoxide"],
    cargoOnly: true,
  },
  {
    num: "3",
    name: "Flammable Liquids",
    code: "RFL",
    color: "#dc2626",
    description: "Liquids with flash point not exceeding 60°C. Most common DG class in cargo.",
    examples: ["Gasoline", "Ethanol", "Acetone", "Paint thinners"],
    passengerAllowed: true,
  },
  {
    num: "4.1",
    name: "Flammable Solids",
    code: "RFS",
    color: "#dc2626",
    description: "Solids easily ignited by friction or brief contact with ignition source.",
    examples: ["Matches", "Nitrocellulose", "Metal powders"],
    passengerAllowed: true,
  },
  {
    num: "4.2",
    name: "Spontaneously Combustible",
    code: "RSC",
    color: "#dc2626",
    description: "Substances liable to spontaneous heating or heating in contact with air.",
    examples: ["White phosphorus", "Charcoal", "Wet wool"],
    passengerAllowed: true,
  },
  {
    num: "4.3",
    name: "Dangerous When Wet",
    code: "RFW",
    color: "#2563eb",
    description: "Substances that emit flammable gases when in contact with water.",
    examples: ["Sodium", "Potassium", "Calcium carbide", "Lithium"],
    passengerAllowed: true,
  },
  {
    num: "5.1",
    name: "Oxidizer",
    code: "ROX",
    color: "#eab308",
    description: "Substances that cause or contribute to combustion by yielding oxygen.",
    examples: ["Hydrogen peroxide", "Potassium permanganate", "Nitrates"],
    passengerAllowed: true,
  },
  {
    num: "5.2",
    name: "Organic Peroxide",
    code: "ROP",
    color: "#dc2626",
    description: "Organic compounds containing bivalent -O-O- structure, can be explosive and flammable.",
    examples: ["Benzoyl peroxide", "Methyl ethyl ketone peroxide"],
    passengerAllowed: false,
  },
  {
    num: "6.1",
    name: "Toxic Substance",
    code: "RPB",
    color: "#64748b",
    description: "Substances liable to cause death or injury if swallowed, inhaled, or absorbed through skin.",
    examples: ["Cyanides", "Arsenic", "Phenol", "Pesticides"],
    passengerAllowed: true,
  },
  {
    num: "6.2",
    name: "Infectious Substance",
    code: "RIS",
    color: "#64748b",
    description: "Substances known or reasonably expected to contain pathogens.",
    examples: ["Bacteria cultures", "Viruses", "Medical specimens", "Biological products"],
    passengerAllowed: true,
  },
  {
    num: "7",
    name: "Radioactive Material",
    code: "RRW/RRY",
    color: "#eab308",
    description: "Materials with spontaneous disintegration of atomic nuclei emitting ionizing radiation. Three categories based on radiation level.",
    examples: ["Uranium", "Plutonium", "Medical isotopes", "Smoke detectors"],
    divisions: [
      { num: "Cat I (RRW)", code: "RRW", desc: "White label - No restriction" },
      { num: "Cat II (RRY)", code: "RRY", desc: "Yellow label - TI required, max 50 TI pax" },
      { num: "Cat III (RRY)", code: "RRY", desc: "Yellow label - TI required, max 50 TI pax" },
    ],
  },
  {
    num: "8",
    name: "Corrosives",
    code: "RCM",
    color: "#64748b",
    description: "Substances that can cause severe damage by chemical action to living tissue or materials.",
    examples: ["Sulfuric acid", "Hydrochloric acid", "Sodium hydroxide", "Battery acid"],
    passengerAllowed: true,
  },
  {
    num: "9",
    name: "Miscellaneous",
    code: "RMD",
    color: "#64748b",
    description: "Substances presenting dangers not covered by other classes.",
    examples: ["Dry ice (ICE)", "Lithium batteries", "Magnetised material (MAG)", "Polymeric beads (RSB)"],
    passengerAllowed: true,
  },
];

export function HazardClassExplorer() {
  const [selectedClass, setSelectedClass] = useState<HazardClassInfo | null>(null);

  return (
    <div className="my-6">
      <div className="text-center mb-4">
        <Badge variant="secondary" className="mb-2">
          <Zap className="h-3 w-3 mr-1" />
          Interactive Explorer
        </Badge>
        <h3 className="text-lg font-bold">The Nine Hazard Classes</h3>
        <p className="text-sm text-muted-foreground">Click any diamond to learn more about that class</p>
      </div>

      {/* Diamond grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3 justify-items-center">
        {hazardClasses.map((cls) => (
          <motion.button
            key={cls.num}
            onClick={() => setSelectedClass(cls)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <svg viewBox="0 0 200 200" className="w-16 h-16 sm:w-20 sm:h-20 transition-all group-hover:drop-shadow-lg">
              <polygon
                points="100,10 190,100 100,190 10,100"
                fill={cls.color}
                stroke="#0f172a"
                strokeWidth="3"
              />
              <polygon
                points="100,25 175,100 100,175 25,100"
                fill="none"
                stroke="#0f172a"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <text
                x="100"
                y="115"
                textAnchor="middle"
                fontFamily="Arial Black, sans-serif"
                fontSize="42"
                fontWeight="900"
                fill="#0f172a"
              >
                {cls.num}
              </text>
            </svg>
            <div className="text-[10px] font-medium text-center mt-1 truncate max-w-[80px]">
              {cls.name}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClass(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-6 text-white relative"
                style={{ background: `linear-gradient(135deg, ${selectedClass.color}, ${selectedClass.color}cc)` }}
              >
                <button
                  onClick={() => setSelectedClass(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 200 200" className="w-16 h-16">
                    <polygon
                      points="100,10 190,100 100,190 10,100"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="3"
                    />
                    <text
                      x="100"
                      y="120"
                      textAnchor="middle"
                      fontFamily="Arial Black, sans-serif"
                      fontSize="56"
                      fontWeight="900"
                      fill={selectedClass.color}
                    >
                      {selectedClass.num}
                    </text>
                  </svg>
                  <div>
                    <div className="text-xs uppercase tracking-wide opacity-90">
                      Class {selectedClass.num} • IATA Code: {selectedClass.code}
                    </div>
                    <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-1">Description</h3>
                  <p className="text-sm">{selectedClass.description}</p>
                </div>

                {/* Permissions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={cn(
                    "p-3 rounded-lg border-2",
                    selectedClass.cargoOnly
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-green-500/30 bg-green-500/5"
                  )}>
                    <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Cargo Aircraft</div>
                    <div className="text-sm font-medium">
                      {selectedClass.cargoOnly ? "Required (CAO)" : "Permitted"}
                    </div>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg border-2",
                    selectedClass.passengerAllowed === false || selectedClass.cargoOnly
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-green-500/30 bg-green-500/5"
                  )}>
                    <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Passenger Aircraft</div>
                    <div className="text-sm font-medium">
                      {selectedClass.passengerAllowed === false || selectedClass.cargoOnly
                        ? "Prohibited"
                        : "Permitted"}
                    </div>
                  </div>
                </div>

                {/* Divisions */}
                {selectedClass.divisions && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Divisions</h3>
                    <div className="space-y-2">
                      {selectedClass.divisions.map((div, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-accent/30">
                          <Badge variant="outline" className="font-mono">{div.code}</Badge>
                          <div>
                            <div className="font-medium text-sm">{div.num}</div>
                            <div className="text-xs text-muted-foreground">{div.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Common Examples</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedClass.examples.map((ex, i) => (
                      <Badge key={i} variant="secondary">{ex}</Badge>
                    ))}
                  </div>
                </div>

                {/* Special notes */}
                {selectedClass.num === "1" && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border-l-4 border-amber-500">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <strong>Important:</strong> Only Explosives 1.4S are allowed on passenger aircraft.
                        Classes 1.1, 1.2, 1.5, 1.6 are forbidden for air transport.
                      </div>
                    </div>
                  </div>
                )}
                {selectedClass.num === "7" && (
                  <div className="p-3 rounded-lg bg-yellow-500/10 border-l-4 border-yellow-500">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <strong>Transport Index Limits:</strong> Passenger aircraft max 50 TI, Freighter max 200 TI.
                        RRY packages must be stowed on compartment floor for maximum distance to passengers.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
