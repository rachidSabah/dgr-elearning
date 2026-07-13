// DGR INFOHAS Images — maps the 20 extracted PDF images from the 40-page
// Academy INFOHAS Dangerous Goods Awareness manual (16-hour cabin crew course)
// to DGR lessons. Source: /public/images/dgr-infohas/dgr-img-XXX-YYY.png
// where XXX is the page number and YYY is the image index on that page.
//
// IMAGE-TO-TOPIC MAPPING (based on PDF page extraction):
//   Page 1   (dgr-img-001-000) — Course header/banner (1187x326)              → Ch1 Intro
//   Page 1   (dgr-img-001-001) — Regulatory framework badges (1713x358)       → Ch2 ICAO/IATA
//   Page 7   (dgr-img-007-003) — Airport security screening (1300x795)        → Ch2 Pax info
//   Page 11  (dgr-img-011-004) — Cabin crew at boarding door (1600x900)       → Ch3 Crew role
//   Page 13  (dgr-img-013-005) — Nine-class wheel diagram (1580x1664)         → Ch4 Classes
//   Page 17  (dgr-img-017-007) — Hazard label reference grid (2116x2144)      → Ch4 + Ch5 Labels
//   Page 19  (dgr-img-019-009) — Passenger DG decision tree (1745x1272)       → Ch6 Pax DG
//   Page 20  (dgr-img-020-011) — Hidden DG infographic (1745x1118)            → Ch1 + Ch6 Hidden DG
//   Page 21  (dgr-img-021-013) — Lithium battery cross-section (1589x964)     → Ch7 Li battery
//   Page 22  (dgr-img-022-015) — Thermal runaway 5 stages (1779x1272)         → Ch7 Thermal runaway
//   Page 22  (dgr-img-022-017) — Swollen battery photo (1280x720)             → Ch7 Recognition signs
//   Page 24  (dgr-img-024-018) — Wheelchair handling (1600x1067)              → Ch8 Mobility aids
//   Page 27  (dgr-img-027-020) — Halon extinguisher photo (1280x1061)         → Ch9 DG emergencies
//   Page 27  (dgr-img-027-021) — PBE photo (1280x720)                         → Ch9 PBE
//   Page 28  (dgr-img-028-022) — SFF response flow diagram (1745x1349)        → Ch10 SFF
//   Page 29  (dgr-img-029-024) — Cabin crew communication NITS flow (1745x1040) → Ch10 NITS
//   Page 30  (dgr-img-030-026) — Action timeline for cabin fire (1900x810)    → Ch11 Case study
//   Page 32  (dgr-img-032-028) — Cabin smoke event response (1536x2048)       → Ch11 Case study
//   Page 37  (dgr-img-037-029) — DG awareness pyramid (1745x964)              → Ch11 Lessons learned
//   Page 38  (dgr-img-038-031) — Summary/takeaway (1280x1426)                 → Ch11 Conclusion
//
// NOTE: The page 25 DG emergency equipment table image is text-only and was
// skipped during extraction (it has no graphical content worth reproducing).

export const dgrInfohasImages: Record<string, { src: string; caption: string }[]> = {
  // ============================================================================
  // MODULE 1 — INTRODUCTION & REGULATORY FRAMEWORK
  // ============================================================================

  // ---- lesson-1-1 → Ch1: DG definitions, why regulated, air transport risks ----
  "lesson-1-1": [
    {
      src: "/images/dgr-infohas/dgr-img-001-000.png",
      caption: "Academy INFOHAS Dangerous Goods Awareness course header and banner (page 1). The 16-hour cabin crew course is structured around 11 chapters covering definitions, regulations, classification, passenger provisions, lithium batteries, PEDs, emergencies, and case studies. The course concludes with a 10-MCQ assessment, 5 short-answer questions, and 3 practical exercises (PBE donning, cabin fire response, passenger DG identification) plus a 25-term glossary.",
    },
    {
      src: "/images/dgr-infohas/dgr-img-020-011.png",
      caption: "Hidden dangerous goods infographic (page 20). Illustrates the categories of dangerous goods commonly concealed in passenger baggage — camping equipment, household items, personal care products, automotive supplies, sporting equipment, and medical items. These are the items cabin crew must learn to recognise because passengers do not realise they are restricted.",
    },
  ],

  // ---- lesson-1-2 → Ch1: Hidden DG, cabin crew role as last line of defense ----
  "lesson-1-2": [
    {
      src: "/images/dgr-infohas/dgr-img-020-011.png",
      caption: "Hidden dangerous goods infographic (page 20). Cabin crew are the LAST LINE OF DEFENCE against hidden dangerous goods. The infographic shows the categories of items passengers unknowingly carry, the entry pathways (carry-on, checked baggage, worn/carried on person), and the multi-sensory detection cues (visual, olfactory, auditory, tactile).",
    },
    {
      src: "/images/dgr-infohas/dgr-img-011-004.png",
      caption: "Cabin crew at the boarding door (page 11). The boarding door is the highest-leverage DG detection point — the last opportunity to prevent a hidden dangerous good from entering the aircraft before pushback. The three-second scan technique: as each passenger approaches, the crew member observes the passenger and their bags before greeting and directing to their seat.",
    },
  ],

  // ---- lesson-1-3 → Ch2: ICAO framework, Annex 18, Doc 9284, IATA DGR hierarchy ----
  "lesson-1-3": [
    {
      src: "/images/dgr-infohas/dgr-img-001-001.png",
      caption: "Regulatory framework badges (page 1). The five-level hierarchy of dangerous goods regulation: (1) Chicago Convention Annex 18 — international law; (2) ICAO Doc 9284 Technical Instructions — operational specifications; (3) IATA Dangerous Goods Regulations (DGR) — industry practical rules; (4) National aviation authority regulations (FAA/EASA/CAA) — enforcement and state variations; (5) Operator Operations Manual — company-specific procedures. The principle of 'most restrictive wins' applies at every level.",
    },
  ],

  // ---- lesson-1-4 → Ch2: Passenger info requirements, regulatory violations ----
  "lesson-1-4": [
    {
      src: "/images/dgr-infohas/dgr-img-007-003.png",
      caption: "Airport security screening (page 7). Security screening is primarily for weapons and explosives, not all dangerous goods — many DG items slip through. The ICAO-required signage at check-in, security, and boarding gates listing the prohibited DG categories is the passenger-facing layer of the DG prevention system. Violations carry criminal, civil, and administrative penalties for passengers, crew, operators, and shippers.",
    },
  ],

  // ============================================================================
  // MODULE 2 — RESPONSIBILITIES, CLASSIFICATION, PASSENGER PROVISIONS
  // ============================================================================

  // ---- lesson-2-1 → Ch3: Pre-flight, boarding, in-flight responsibilities, crew matrix ----
  "lesson-2-1": [
    {
      src: "/images/dgr-infohas/dgr-img-011-004.png",
      caption: "Cabin crew at the boarding door (page 11). The Crew Responsibility Matrix assigns specific DG duties to each crew position across the flight cycle: pre-flight (NOTOC briefing, equipment check), boarding (screening passengers and bags), in-flight (continuous vigilance and walk-throughs), emergency (assigned-area firefighting), and post-incident (area documentation and CSR input).",
    },
  ],

  // ---- lesson-2-2 → Ch3: Post-incident, CSR, Just Culture, reporting ----
  "lesson-2-2": [
    {
      src: "/images/dgr-infohas/dgr-img-029-024.png",
      caption: "Cabin crew communication flow with NITS format (page 29). The post-incident reporting chain: detecting crew → SCCM (verbal, immediate) → captain (NITS, immediate) → operator safety office (CSR, end of duty) → civil aviation authority (within 72 hours) → ICAO incident database. Just Culture protects honest error reporting; the Aviation Safety Action Program (ASAP) and equivalent EASA schemes are the framework that enables it.",
    },
  ],

  // ---- lesson-2-3 → Ch1: Hidden DG common items, indicators ----
  "lesson-2-3": [
    {
      src: "/images/dgr-infohas/dgr-img-020-011.png",
      caption: "Hidden DG infographic (page 20). The '80/20 of Hidden DG' — 80% of detections fall into 8 categories: lithium batteries, aerosols, matches and lighters, high-proof alcohol, camping fuel, bleach/cleaners, ammunition, and e-cigarettes. Cabin crew who memorise these eight categories and their visual/olfactory/auditory/tactile indicators will catch the vast majority of hidden DG before it becomes an incident.",
    },
  ],

  // ---- lesson-2-4 → Ch4: Nine classes overview, classification system ----
  "lesson-2-4": [
    {
      src: "/images/dgr-infohas/dgr-img-013-005.png",
      caption: "Nine-class wheel diagram (page 13). The UN-developed nine-class hazard system used across all transport modes worldwide: Class 1 Explosives, Class 2 Gases (2.1 flammable, 2.2 non-flammable, 2.3 toxic), Class 3 Flammable liquids, Class 4 Flammable solids (4.1, 4.2, 4.3), Class 5 Oxidizers (5.1, 5.2), Class 6 Toxic/infectious (6.1, 6.2), Class 7 Radioactive, Class 8 Corrosives, Class 9 Miscellaneous. Each class has a distinctive diamond label with a specific colour and symbol.",
    },
  ],

  // ---- lesson-2-5 → Ch4: Classes 1-3 detailed (explosives, gases, flammable liquids) ----
  "lesson-2-5": [
    {
      src: "/images/dgr-infohas/dgr-img-017-007.png",
      caption: "Hazard label reference grid (page 17). Detailed view of the Class 1 (Explosives — orange exploding bomb symbol), Class 2.1 (Flammable gas — red flame), Class 2.2 (Non-flammable gas — green cylinder), Class 2.3 (Toxic gas — white skull and crossbones), and Class 3 (Flammable liquid — red flame) hazard labels. Class 1 is divided into six divisions (1.1 through 1.6) with 13 compatibility groups; only 1.4S ammunition is permitted on passenger aircraft. Class 2.3 toxic gases are Cargo Aircraft Only.",
    },
  ],

  // ---- lesson-2-6 → Ch4: Classes 4-6 (flammable solids, oxidizers, toxic/infectious) ----
  "lesson-2-6": [
    {
      src: "/images/dgr-infohas/dgr-img-017-007.png",
      caption: "Hazard label reference grid (page 17). Class 4 (Flammable solids — red stripes/flame, white-over-red for 4.2, blue flame for 4.3), Class 5 (Oxidizers — yellow flame over circle for 5.1, red-over-yellow for 5.2), and Class 6 (Toxic — white skull and crossbones for 6.1, biohazard trefoil for 6.2). Division 4.3 (dangerous when wet) is particularly hazardous in aircraft because the cabin humidity can trigger hydrogen gas production from contact with moisture.",
    },
  ],

  // ---- lesson-2-7 → Ch4: Class 7 radioactive, Class 8 corrosives ----
  "lesson-2-7": [
    {
      src: "/images/dgr-infohas/dgr-img-017-007.png",
      caption: "Hazard label reference grid (page 17). Class 7 (Radioactive — white trefoil on white/yellow background) divided into Category I-White, II-Yellow, and III-Yellow based on surface radiation level and Transport Index (TI). Class 8 (Corrosive — black test tube on hand/metal symbol on white background). The three principles of radiation protection: TIME (minimise exposure duration), DISTANCE (maximise — inverse square law), SHIELDING (lead, concrete, water).",
    },
  ],

  // ---- lesson-2-8 → Ch4: Class 9 miscellaneous, Ch5: Label anatomy, handling labels ----
  "lesson-2-8": [
    {
      src: "/images/dgr-infohas/dgr-img-017-007.png",
      caption: "Hazard label reference grid (page 17). Class 9 (Miscellaneous — seven vertical black stripes on white top half, often called the 'piano' label) covers dry ice, lithium batteries, magnetised material, and environmentally hazardous substances. Label anatomy: square set at 45° (diamond shape), minimum 100×100mm, line dividing the diamond horizontally 5mm from top, symbol on coloured upper half, class number at bottom corner. Handling labels include Cargo Aircraft Only (CAO), This Way Up arrows, Lithium Battery mark, and Magnetised Material.",
    },
  ],

  // ---- lesson-2-9 → Ch4: All nine classes detailed with passenger relevance ----
  "lesson-2-9": [
    {
      src: "/images/dgr-infohas/dgr-img-013-005.png",
      caption: "Nine-class wheel diagram (page 13). The passenger aircraft DG frequency pyramid: at the top (very high frequency) are Class 9 lithium batteries (every passenger), Class 3 flammable liquids (perfume, alcohol, sanitiser), Class 2.1 flammable gases (aerosol propellants), and Class 8 corrosives (bleach, drain cleaner). The middle contains Class 2.2, 4.1, 5.1, 6.1, and 7. The bottom contains the rare passenger-aircraft DG: 1.4S ammunition, 4.2, 4.3, 5.2, and 6.2.",
    },
    {
      src: "/images/dgr-infohas/dgr-img-017-007.png",
      caption: "Hazard label reference grid (page 17). All nine class hazard labels in one reference image for visual memorisation. Cabin crew must be able to identify each class from the symbol and colour alone, without reading the text — in an emergency the diamond label on a package may be the only information available to determine the correct response. The wrong extinguishing agent (water on Class 4.3, smothering on Class 5.1) can dramatically worsen the situation.",
    },
  ],

  // ---- lesson-2-10 → Ch6: Passenger allowance table, what's permitted/forbidden ----
  "lesson-2-10": [
    {
      src: "/images/dgr-infohas/dgr-img-019-009.png",
      caption: "Passenger DG decision tree (page 19). Visual representation of IATA DGR Table 2.3.A — the passenger dangerous goods allowance table. Three categories: permitted without conditions (everyday items below thresholds), permitted with conditions (allowed if specific requirements are met), and forbidden (never permitted in passenger baggage). A permitted item carried in violation of its conditions is treated the same as a forbidden item — illegal and must be removed.",
    },
  ],

  // ---- lesson-2-11 → Ch6: Hidden DG vigilance at the door, decision tree ----
  "lesson-2-11": [
    {
      src: "/images/dgr-infohas/dgr-img-019-009.png",
      caption: "Passenger DG decision tree (page 19). The six-step decision tree for handling a suspected hidden DG at the boarding door: (1) OBSERVE — sensory scan; (2) ASSESS — immediate risk vs reasonable suspicion; (3) ENQUIRE — polite approach to the passenger; (4) INSPECT — examine the item; (5) DECIDE — apply the allowance table (permit, condition, surrender, or refuse boarding); (6) DOCUMENT — file Cabin Safety Report regardless of outcome.",
    },
    {
      src: "/images/dgr-infohas/dgr-img-020-011.png",
      caption: "Hidden DG infographic (page 20). Behavioural indicators that should heighten crew suspicion at the boarding door: passenger reluctance to let crew handle their bag, bags that feel unusually warm or vibrate, chemical or fuel smells in the cabin, visible leakage or staining from a bag, passengers attempting to recharge devices with non-original or damaged chargers, and passengers who become agitated during routine safety announcements.",
    },
  ],

  // ---- lesson-2-12 → Ch7: Lithium battery chemistry, thermal runaway 5 stages ----
  "lesson-2-12": [
    {
      src: "/images/dgr-infohas/dgr-img-021-013.png",
      caption: "Lithium battery cross-section (page 21). Internal structure of a lithium-ion cell: graphite anode, lithium cobalt oxide cathode, flammable organic electrolyte, and separator. Lithium metal batteries (UN 3090/3091) use metallic lithium anode — non-rechargeable but higher energy density and more dangerous (lithium reacts violently with water). Lithium-ion batteries (UN 3480/3481) use intercalation chemistry — rechargeable, used in phones, laptops, tablets, e-cigarettes, and mobility aids.",
    },
    {
      src: "/images/dgr-infohas/dgr-img-022-015.png",
      caption: "Thermal runaway — five stages (page 22). The five-stage cascade: (1) ONSET — internal fault causes localised heating; (2) GAS RELEASE — electrolyte decomposes, releasing flammable gases; (3) SMOKE AND SWELLING — dense smoke, battery case swells, neighbouring cells heat; (4) IGNITION — gases ignite, jet of flame up to 1 metre, temperatures exceed 600°C; (5) PROPAGATION — adjacent cells ignite in chain reaction. Once started, almost impossible to stop — only cooling surrounding materials prevents spread.",
    },
  ],

  // ---- lesson-2-13 → Ch7: Wh ratings, passenger limits, recognition signs ----
  "lesson-2-13": [
    {
      src: "/images/dgr-infohas/dgr-img-021-013.png",
      caption: "Lithium battery cross-section (page 21). The Watt-hour (Wh) rating measures energy content: Wh = nominal voltage (V) × capacity (Ah). Passenger limits based on Wh: ≤100Wh (smartphones 10-15Wh, tablets 25-40Wh, laptops 50-100Wh) unlimited in carry-on; 100-160Wh (mobility aids, professional equipment) max 2 spares with operator approval; >160Wh forbidden on passenger aircraft. The Wh rating correlates with thermal runaway energy — higher Wh = harder to extinguish.",
    },
    {
      src: "/images/dgr-infohas/dgr-img-022-017.png",
      caption: "Swollen lithium battery photo (page 22). A recognisable early-warning sign of thermal runaway onset: a battery or device that has visibly bulged, indicating gas generation inside the cell. Cabin crew have only 30-60 seconds between recognition of this sign and an uncontrolled fire — immediate action is required: don PBE, isolate device, prepare firefighting equipment, and notify the captain in NITS format. Other recognition signs: heat, smell (sweet/chemical), smoke, hissing/popping sound, and visual distortion.",
    },
  ],

  // ---- lesson-2-14 → Ch8: PEDs, e-cigarettes, smart baggage rules ----
  "lesson-2-14": [
    {
      src: "/images/dgr-infohas/dgr-img-022-015.png",
      caption: "Thermal runaway five stages (page 22). PEDs (phones, laptops, tablets, e-cigarettes) are the single most common source of in-flight DG incidents. Key rules: spare lithium batteries FORBIDDEN in checked baggage; e-cigarettes FORBIDDEN in checked baggage; laptops in checked baggage must be COMPLETELY OFF (not sleep mode); smart baggage must have REMOVABLE batteries (battery removed and carried in cabin); Samsung Galaxy Note 7 FORBIDDEN globally; charging is the highest-risk activity — use only original chargers.",
    },
  ],

  // ---- lesson-2-15 → Ch8: Mobility aids, wheelchairs, medical equipment ----
  "lesson-2-15": [
    {
      src: "/images/dgr-infohas/dgr-img-024-018.png",
      caption: "Wheelchair handling (page 24). Three wheelchair battery types with different handling requirements: non-spillable (gel/AGM) — may remain attached to wheelchair in cargo hold with terminals protected and battery disconnected; spillable wet (acid) — must be removed, placed in operator-provided battery box, loaded upright in cargo hold; lithium-ion ≤300Wh — must be removed, terminals protected, carried in cabin as spare (300Wh limit is higher than the 100Wh normal passenger limit because mobility aids are essential).",
    },
  ],

  // ---- lesson-2-16 → Ch8: Medical equipment table, battery requirements ----
  "lesson-2-16": [
    {
      src: "/images/dgr-infohas/dgr-img-024-018.png",
      caption: "Wheelchair handling (page 24). Medical equipment allowance parallels mobility aid rules: lithium-ion batteries up to 160Wh are permitted for medical devices (higher than the 100Wh limit for general PEDs, recognising the essential nature of medical equipment); spare medical batteries up to 160Wh permitted in carry-on with no quantity limit; Portable Oxygen Concentrators (POCs) must be on the operator's approved list and the passenger must carry ≥150% of flight time in battery capacity; compressed oxygen cylinders (UN 1072, Class 2.2) require operator approval and have stricter rules.",
    },
  ],

  // ---- lesson-2-17 → Ch3: Crew responsibility matrix, authority levels ----
  "lesson-2-17": [
    {
      src: "/images/dgr-infohas/dgr-img-011-004.png",
      caption: "Cabin crew at the boarding door (page 11). Three authority levels in DG incidents: IMMEDIATE ACTION AUTHORITY (act without permission to protect safety — don PBE, attack fire, isolate area); NOTIFICATION AUTHORITY (require immediate captain notification via SCCM in NITS format); COMMAND AUTHORITY (SCCM directs cabin response, delegates to position-based assignments). The SCCM is the single point of communication between cabin and flight deck — prevents information overload on flight deck and ensures captain's decisions are based on a coherent picture.",
    },
  ],

  // ============================================================================
  // MODULE 3 — EMERGENCY RESPONSE, SFF, CASE STUDIES
  // ============================================================================

  // ---- lesson-3-1 → Ch9: Types of in-flight DG emergencies, cabin emergency equipment ----
  "lesson-3-1": [
    {
      src: "/images/dgr-infohas/dgr-img-027-020.png",
      caption: "Halon 1211 fire extinguisher (page 27). Standard cabin firefighting equipment: Halon 1211 extinguisher (typically 2-4 per aircraft, located at galley and cabin stations) for knockdown of all fire types; water extinguisher (1-2 per aircraft) for cooling lithium batteries and Class A fires; PBE; fire-resistant gloves; crash axe; fire blanket; rubber gloves; polythene bags for spillage containment. Each crew member verifies their assigned equipment during pre-flight preparation — missing or unserviceable equipment is a no-go item.",
    },
  ],

  // ---- lesson-3-2 → Ch9: PBE detailed, 30-second donning requirement ----
  "lesson-3-2": [
    {
      src: "/images/dgr-infohas/dgr-img-027-021.png",
      caption: "Protective Breathing Equipment (PBE) photo (page 27). The PBE is the single most important piece of cabin emergency equipment. Provides 15 minutes of breathable air independent of the cabin atmosphere — essential because toxic gases (carbon monoxide, hydrogen cyanide, hydrogen fluoride, hydrogen chloride) and reduced oxygen can incapacitate crew within 60-90 seconds. The 30-second donning requirement is a regulatory standard (EASA/FAA): open pouch, remove, unfold, orient, open neck seal, don over head, position visor, close neck seal, activate oxygen, verify flow.",
    },
  ],

  // ---- lesson-3-3 → Ch10: SFF procedure steps 1-3 (detect, alert, protect) ----
  "lesson-3-3": [
    {
      src: "/images/dgr-infohas/dgr-img-028-022.png",
      caption: "SFF response flow diagram (page 28). The six-step Smoke, Fire, Fumes procedure: DETECT → ALERT → PROTECT → ATTACK → CONTAIN → DOCUMENT. Steps 1-3 (this lesson): DETECT — recognise incident, classify type (fire/smoke/fumes/spill), identify location; ALERT — notify SCCM and captain in NITS format within 30 seconds; PROTECT — don PBE (always first), isolate area, move passengers at least 3 rows away, gather equipment. PROTECT is the most frequently skipped step — crew under stress rush to ATTACK without first protecting themselves or passengers.",
    },
  ],

  // ---- lesson-3-4 → Ch10: SFF steps 4-6 (attack, contain, document), NITS format ----
  "lesson-3-4": [
    {
      src: "/images/dgr-infohas/dgr-img-028-022.png",
      caption: "SFF response flow diagram (page 28). Steps 4-6 (this lesson): ATTACK — apply correct extinguishing agent for the fire type (Halon for knockdown, water for lithium battery cooling, never water on electrical or Class D); CONTAIN — place burnt item in fire blanket/bag, stow in metal bin, monitor for 30+ minutes for re-ignition (lithium batteries especially can re-ignite); DOCUMENT — Cabin Safety Report, individual statements, physical evidence preservation, passenger statements. The wrong agent can dramatically worsen the situation.",
    },
    {
      src: "/images/dgr-infohas/dgr-img-029-024.png",
      caption: "Cabin crew communication flow with NITS format (page 29). NITS is the standard cabin-to-flight-deck emergency communication format: NATURE (what is happening in concrete descriptive terms), INTENTIONS (what cabin crew are doing/planning), TIME (how long the situation has been developing, any time-critical factor like 'PBE has 12 minutes remaining'), SPECIAL INSTRUCTIONS (what cabin crew need from the captain — descent, diversion, medical). The SCCM is the single point of communication between cabin and flight deck.",
    },
  ],

  // ---- lesson-3-5 → Ch11: Case studies (lithium fire, e-cig fire, cabin smoke) ----
  "lesson-3-5": [
    {
      src: "/images/dgr-infohas/dgr-img-030-026.png",
      caption: "Action timeline for cabin fire response (page 30). Case Study 1 — lithium battery fire in overhead bin: passenger reports smoke → crew confirms and notifies SCCM → SCCM notifies captain in NITS → crew dons PBE → opens bin, removes backpack → identifies laptop with swollen battery → applies Halon (15 sec) then water (3 min) → places in fire blanket, stows in metal bin → captain declares PAN-PAN, diverts → lands safely 25 minutes after initial report. Textbook response throughout.",
    },
    {
      src: "/images/dgr-infohas/dgr-img-032-028.png",
      caption: "Cabin smoke event response (page 32). Case Study 3 — cabin smoke of unknown origin: multiple passengers report 'hot electrical smell' → cabin crew investigate but cannot locate source → smell intensifies, visible smoke from forward cabin air vents → captain declares MAYDAY, initiates diversion, requests descent → cabin crew move passengers, distribute wet towels, prepare for evacuation → land 35 minutes after initial report → ground investigation finds failing AC pack seal allowed oil mist from engine bleed air into cabin. Aircraft system failure, not DG — but cabin crew response was identical.",
    },
  ],

  // ---- lesson-3-6 → Ch10: Post-incident documentation, CSR, reporting ----
  "lesson-3-6": [
    {
      src: "/images/dgr-infohas/dgr-img-029-024.png",
      caption: "Cabin crew communication flow with NITS format (page 29). Post-incident reporting chain and documentation: Cabin Safety Report (CSR) submitted by SCCM to captain before crew leaves aircraft, containing 8 sections — flight information, incident description, item identification, crew response, captain notification, passenger impact, equipment used, outcome. ICAO Annex 18 timeline: detecting crew → SCCM (immediate) → captain (immediate) → operator safety office (CSR, end of duty) → civil aviation authority (72 hours initial, 30 days full) → ICAO incident database. Just Culture framework (ASAP, EASA occurrence reporting) protects honest error reporting.",
    },
  ],

  // ---- lesson-3-7 → Ch11: Lessons learned, prevention strategies ----
  "lesson-3-7": [
    {
      src: "/images/dgr-infohas/dgr-img-037-029.png",
      caption: "DG awareness pyramid (page 37). The DG Awareness Pyramid synthesises the prevention layers: from base to apex — (1) REGULATION (ICAO Annex 18, Doc 9284, IATA DGR); (2) OPERATOR IMPLEMENTATION (Operations Manuals); (3) TRAINING (initial and recurrent); (4) EQUIPMENT (PBE, extinguishers); (5) VIGILANCE (continuous cabin crew scanning); (6) DETECTION (early identification of incidents); (7) RESPONSE (trained crew using correct procedures); (8) RECOVERY (containment, documentation, learning). Each layer depends on layers below; a failure at any layer can be caught by the layers above — but only if those layers are intact.",
    },
    {
      src: "/images/dgr-infohas/dgr-img-038-031.png",
      caption: "Course summary and takeaway (page 38). The 16-hour INFOHAS DG Awareness course distils to three principles: (1) KNOW THE RULES — the nine classes, the passenger allowance table, the SFF procedure; (2) STAY VIGILANT — boarding, in-flight, and pre-landing scanning for hidden DG; (3) ACT DECISIVELY — when an incident occurs, follow the training without hesitation: DETECT, ALERT, PROTECT, ATTACK, CONTAIN, DOCUMENT. Vigilance is the price of safety.",
    },
  ],
};

// Helper: retrieve image content blocks for a lesson by ID.
// Returns an array of { type, src, caption, alt } objects ready to be merged
// into the lesson content stream.
export function getDGRInfohasImages(lessonId: string): any[] {
  const images = dgrInfohasImages[lessonId];
  if (!images) return [];

  return images.map(({ src, caption }) => ({
    type: "image" as const,
    src,
    caption,
    alt: `Academy INFOHAS Dangerous Goods Awareness Manual illustration: ${caption}`,
  }));
}

// Helper: count of lessons with image mappings.
export function getDGRInfohasImageCount(): number {
  return Object.keys(dgrInfohasImages).length;
}

// Helper: list of lesson IDs with image mappings.
export function getDGRInfohasImageLessonIds(): string[] {
  return Object.keys(dgrInfohasImages);
}

// Helper: total count of unique image references across all lessons
// (an image may be referenced by multiple lessons — this counts all references).
export function getDGRInfohasImageTotalReferences(): number {
  return Object.values(dgrInfohasImages).reduce(
    (total, images) => total + images.length,
    0,
  );
}

// Helper: list of all unique image source paths referenced (for asset audit).
export function getDGRInfohasImageUniqueSources(): string[] {
  const sources = new Set<string>();
  for (const images of Object.values(dgrInfohasImages)) {
    for (const img of images) {
      sources.add(img.src);
    }
  }
  return Array.from(sources).sort();
}
