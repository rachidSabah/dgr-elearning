// Interactive content enhancements for DGR lessons
// Adds knowledge checks, SVG diagrams, interactive components to lessons
// Images are topic-relevant high-resolution from web search (dangerous goods labels, procedures, etc.)

export const lessonEnhancements: Record<string, any[]> = {
  // ============================================================
  // MODULE 1 — Dangerous Goods Awareness
  // ============================================================
  "lesson-1-1": [
    { type: "image", src: "/images/dg-topics/all-hazard-labels-overview.jpg", caption: "The nine hazard class diamond labels used in dangerous goods transport — each class has a distinctive colour and symbol", alt: "All nine dangerous goods hazard class diamond labels in a grid" },
    { type: "image", src: "/images/dg-topics/cabin-crew-safety-demo.jpg", caption: "Cabin crew play a critical role in identifying and responding to dangerous goods incidents", alt: "Cabin crew performing safety demonstration" },
  ],
  "lesson-1-2": [
    { type: "image", src: "/images/dg-topics/icao-technical-instructions.jpg", caption: "ICAO Technical Instructions for the Safe Transport of Dangerous Goods by Air (Doc 9284) — the primary legal framework", alt: "ICAO Technical Instructions document" },
    { type: "knowledgeCheck", question: "Which organization defines dangerous goods for air transport?", options: ["IATA", "ICAO", "FAA", "EASA"], correctAnswer: 1, explanation: "ICAO (International Civil Aviation Organization) defines dangerous goods in its Technical Instructions for the Safe Transport of Dangerous Goods by Air." },
  ],
  "lesson-1-3": [
    { type: "image", src: "/images/dg-topics/iata-dgr-manual.jpg", caption: "IATA Dangerous Goods Regulations (DGR) manual — updated annually, used by cargo handling departments worldwide for daily compliance", alt: "IATA Dangerous Goods Regulations manual" },
    { type: "clickToReveal", title: "Training Requirement", content: "Many aviation authorities require Operators to provide dangerous goods training for cabin crew during initial AND recurrent training. ICAO and IATA guidance material is updated annually.", variant: "info" },
  ],
  "lesson-1-4": [
    { type: "image", src: "/images/dg-topics/dg-incident-baggage.jpg", caption: "Case study: Damage to passenger baggage from leaked hydrogen peroxide (35%) — an oxidizer with corrosive properties that caused smouldering in the cargo compartment", alt: "Damaged passenger baggage from dangerous goods leak" },
    { type: "image", src: "/images/dg-topics/dangerous-goods-accident.jpg", caption: "Dangerous goods incidents can occur with everyday items — proper identification and reporting are critical safety functions", alt: "Dangerous goods accident scene" },
  ],

  // ============================================================
  // MODULE 2 — Transport of Dangerous Goods
  // ============================================================
  "lesson-2-1": [
    { type: "image", src: "/images/dg-topics/cargo-hold-loading.jpg", caption: "Aircraft cargo hold loading operations — airlines must comply with Technical Instructions whenever dangerous goods are carried", alt: "Aircraft cargo hold being loaded with pallets" },
  ],
  "lesson-2-2": [
    { type: "image", src: "/images/dg-topics/dg-packaging-marking.jpg", caption: "Dangerous goods package with UN number marking — proper shipping name, UN/ID number, and shipper/consignee details are required standard markings", alt: "Dangerous goods package with UN number and markings" },
  ],
  "lesson-2-3": [
    { type: "image", src: "/images/dg-topics/dg-package-labels.png", caption: "Forbidden dangerous goods include pyrophoric liquids, infected animals, and vented radioactive packages — these must never be transported by air", alt: "Dangerous goods package with hazard labels" },
  ],
  "lesson-2-4": [
    { type: "image", src: "/images/dg-topics/aircraft-cargo-pallets.png", caption: "Special load codes (AOG, AVI, ICE, RRY, etc.) identify cargo types for loading position and handling requirements", alt: "Aircraft cargo pallets with special load codes" },
  ],
  "lesson-2-5": [
    { type: "svg", src: "/images/svg/packing-groups.svg", caption: "The three packing groups indicating degree of danger — Group I (high), Group II (medium), Group III (minor)" },
    { type: "image", src: "/images/dg-topics/hazard-labels-grid.png", caption: "All nine hazard classes with their diamond-shaped labels and IATA CARGO IMP codes", alt: "Grid of all nine hazard class diamond labels" },
    { type: "interactive", component: "hazardExplorer" },
    { type: "knowledgeCheck", question: "How many hazard classes are there in dangerous goods regulations?", options: ["6", "7", "9", "12"], correctAnswer: 2, explanation: "There are 9 hazard classes: Explosives, Gases, Flammable Liquids, Flammable Solids, Oxidizing/Organics, Toxic/Infectious, Radioactive, Corrosives, and Miscellaneous." },
    { type: "clickToReveal", title: "Which class has compatibility groups?", content: "Only Class 1 (Explosives) is further divided into compatibility groups indicated by a letter (B, C, D, E, G, or S). Explosives with different compatibility groups cannot be stowed together.", variant: "info" },
  ],
  "lesson-2-6": [
    { type: "svg", src: "/images/svg/packing-groups.svg", caption: "Packing Groups I, II, III — degree of danger classification shown on the NOTOC" },
    { type: "knowledgeCheck", question: "Which packing group indicates HIGH danger?", options: ["Group I", "Group II", "Group III", "Group IV"], correctAnswer: 0, explanation: "Packing Group I indicates high danger, Group II indicates medium danger, and Group III indicates minor danger." },
    { type: "clickToReveal", title: "Where is the packing group displayed?", content: "The packing group is shown on the NOTOC (Notification to Commander/Special Load Notification). Radioactive materials (Category II and III) also show their Transport Index on the NOTOC.", variant: "info" },
  ],
  "lesson-2-7": [
    { type: "image", src: "/images/dg-topics/dg-packaging-marking.jpg", caption: "Standard package markings: proper shipping name, UN/ID number, and shipper/consignee name and address", alt: "Dangerous goods package markings" },
  ],
  "lesson-2-8": [
    { type: "image", src: "/images/dg-topics/dg-package-labels.png", caption: "Hazard labels (diamond-shaped) and handling labels on dangerous goods packages", alt: "Hazard and handling labels on packages" },
    { type: "interactive", component: "hazardExplorer" },
    { type: "clickToReveal", title: "What are the two types of labels?", content: "Hazard Labels are diamond-shaped and show the hazard symbol with class/division number. Handling Labels provide stowage and handling information (e.g., Cargo Aircraft Only, Package Orientation, Cryogenic, Keep Away From Heat, Magnetised Material).", variant: "info" },
  ],
  "lesson-2-9": [
    { type: "image", src: "/images/dg-topics/class1-explosives-label.jpg", caption: "Class 1 Explosives hazard label — orange diamond with bursting bomb symbol. Only 1.4S is allowed on passenger aircraft", alt: "Class 1 Explosives hazard diamond label" },
    { type: "image", src: "/images/dg-topics/class2-flammable-gas-label.png", caption: "Class 2 Gases: flammable (RFG), non-flammable (RNG), and toxic (RPG — CAO only)", alt: "Class 2 gas hazard labels" },
    { type: "image", src: "/images/dg-topics/class3-flammable-liquid.jpg", caption: "Class 3 Flammable Liquids (RFL) — red diamond with flame symbol. Examples include gasoline, ethanol, acetone", alt: "Class 3 flammable liquid hazard label" },
    { type: "image", src: "/images/dg-topics/class5-oxidizer-label.webp", caption: "Class 5 Oxidizers (ROX) and Organic Peroxides (ROP) — yellow/red diamonds with flame and circle symbol", alt: "Class 5 oxidizer hazard label" },
    { type: "image", src: "/images/dg-topics/class6-infectious-label.png", caption: "Class 6 Toxic (RPB) and Infectious Substances (RIS) — biohazard symbol for infectious materials", alt: "Class 6 infectious substance hazard label" },
    { type: "image", src: "/images/dg-topics/class7-radioactive-label.jpg", caption: "Class 7 Radioactive Materials — Category I (RRW, white) and Categories II/III (RRY, yellow) with trefoil symbol", alt: "Class 7 radioactive material hazard label" },
    { type: "image", src: "/images/dg-topics/class8-corrosive-label.png", caption: "Class 8 Corrosives (RCM) — diamond with test tube pouring liquid on hand and metal, causing corrosion", alt: "Class 8 corrosive hazard label" },
    { type: "image", src: "/images/dg-topics/class9-dry-ice-label.jpg", caption: "Class 9 Miscellaneous — includes Dry Ice (ICE), Polymeric Beads (RSB), and Lithium Batteries", alt: "Class 9 miscellaneous hazard label" },
    { type: "image", src: "/images/dg-topics/lithium-battery-dg.png", caption: "Lithium batteries are a common Class 9 miscellaneous dangerous good — strict quantity and packaging limits apply", alt: "Lithium battery dangerous goods label" },
    { type: "svg", src: "/images/svg/aircraft-cross-section.svg", caption: "Aircraft cross-section showing DG stowage locations — forward and aft cargo holds" },
    { type: "knowledgeCheck", question: "Which explosive division is the ONLY one allowed on passenger aircraft?", options: ["1.3C", "1.4S", "1.4B", "1.3G"], correctAnswer: 1, explanation: "Explosives 1.4S are the only type of explosives allowed in passenger aircraft. All other explosives (1.1, 1.2, 1.3 except 1.3C/1.3G, 1.5, 1.6) are forbidden." },
    { type: "knowledgeCheck", question: "What is the IATA CARGO IMP code for Toxic Gas (Division 2.3)?", options: ["RFG", "RNG", "RPG", "RCM"], correctAnswer: 2, explanation: "Toxic Gas is RPG. All RPG articles are Cargo Aircraft only (CAO) - they cannot be carried on passenger aircraft." },
    { type: "knowledgeCheck", question: "Which class includes Dry Ice and Polymeric Beads?", options: ["Class 7", "Class 8", "Class 9", "Class 5"], correctAnswer: 2, explanation: "Class 9 (Miscellaneous Dangerous Goods) includes Dry Ice (ICE), Polymeric Beads (RSB), and Magnetised Material (MAG)." },
    { type: "clickToReveal", title: "What is special about Magnetised Material?", content: "Magnetised material (MAG) does not need a hazard label but requires a handling label. It must only be carried in the AFT hold to avoid affecting the aircraft's magnetic compasses.", variant: "warning" },
    { type: "matching", title: "Match Hazard Classes to their IATA Codes", left: ["Flammable Liquid", "Corrosive", "Radioactive Cat I", "Oxidizer", "Infectious Substance"], right: ["RFL", "RCM", "RRW", "ROX", "RIS"] },
  ],
  "lesson-2-10": [
    { type: "svg", src: "/images/svg/segregation-chart.svg", caption: "Dangerous goods segregation chart — numbers indicate minimum separation rules between classes" },
    { type: "knowledgeCheck", question: "What is the minimum segregation distance for Rule 1?", options: ["0.5 m", "1 m", "1.5 m", "2 m"], correctAnswer: 0, explanation: "Rule 1 requires a minimum distance of 0.5 m and goods must not be loaded in a position that would allow interaction in case of leakage." },
    { type: "clickToReveal", title: "Can dangerous goods be carried in the passenger cabin?", content: "NO! Dangerous Goods must NEVER be carried in the passenger cabin or cockpit. The only exception is items allowed under 'Provision for Dangerous Goods Carried by Passengers or Crew'.", variant: "danger" },
  ],
  "lesson-2-11": [
    { type: "image", src: "/images/dg-topics/cargo-hold-loading.jpg", caption: "Loading and stowage — incompatible dangerous goods must be segregated in the cargo hold to prevent reactions", alt: "Cargo hold loading with dangerous goods" },
    { type: "svg", src: "/images/svg/cabin-layout.svg", caption: "Interactive cabin layout — click zones to explore DG-related areas" },
    { type: "interactive", component: "cabinExplorer" },
    { type: "knowledgeCheck", question: "Where can magnetised material be stowed?", options: ["Forward hold", "AFT hold only", "Either hold", "Cabin overhead"], correctAnswer: 1, explanation: "Magnetised material must only be carried in the AFT hold to avoid affecting the aircraft's direct reading magnetic compasses or master compass detector units." },
    { type: "clickToReveal", title: "What does the Transport Index represent?", content: "The Transport Index (TI) represents the radiation level of a radioactive package. It's used to determine separation distances from passengers and crew, and limits total radioactive material per flight.", variant: "info" },
  ],
  "lesson-2-12": [
    { type: "image", src: "/images/dg-topics/class9-dry-ice-label.jpg", caption: "Dry Ice (ICE) — Class 9 miscellaneous dangerous good. Maximum 200 kg per hold, cannot be loaded with live animals", alt: "Dry ice dangerous goods label" },
    { type: "knowledgeCheck", question: "What is the maximum dry ice per hold?", options: ["100 kg", "150 kg", "200 kg", "250 kg"], correctAnswer: 2, explanation: "Maximum of 200 kg dry ice per hold is allowed. The structure must be protected with insulating material, and compartments must be ventilated before entering." },
    { type: "knowledgeCheck", question: "Can dry ice be loaded with live animals?", options: ["Yes, always", "Yes, with ventilation", "No, never in same hold", "Yes, if separated"], correctAnswer: 2, explanation: "Live animals and dry ice must NOT be loaded together in the same hold under any circumstances." },
    { type: "clickToReveal", title: "Why is dry ice dangerous?", content: "Dry ice (solid CO2) sublimates into gas, displacing oxygen in enclosed spaces. Without proper ventilation, it can cause asphyxiation. This is why compartments must be ventilated before entering, and it cannot share a hold with live animals.", variant: "warning" },
  ],
  "lesson-2-13": [
    { type: "knowledgeCheck", question: "What is the maximum polymeric beads (RSB) per hold?", options: ["50 kg", "100 kg", "150 kg", "200 kg"], correctAnswer: 1, explanation: "A maximum of 100 kg of polymeric beads (RSB) may be carried in each hold." },
  ],
  "lesson-2-14": [
    { type: "svg", src: "/images/svg/transport-index.svg", caption: "Transport Index categories and limits for radioactive materials" },
    { type: "image", src: "/images/dg-topics/class7-radioactive-label.jpg", caption: "Radioactive material labels — Category I (white, RRW) and Categories II/III (yellow, RRY) with Transport Index", alt: "Radioactive material hazard labels showing categories" },
    { type: "image", src: "/images/dg-topics/radioactive-trefoil.png", caption: "The trefoil radiation symbol — universally recognized warning for radioactive materials", alt: "Radioactive trefoil symbol" },
    { type: "knowledgeCheck", question: "What is the TI limit for passenger aircraft?", options: ["20 TI", "50 TI", "100 TI", "200 TI"], correctAnswer: 1, explanation: "Passenger aircraft: max 50 TI. Freighter aircraft: max 200 TI. RRY packages must be stowed on compartment floor for maximum distance to passengers." },
    { type: "knowledgeCheck", question: "Where must RRY packages be stowed?", options: ["On top of cargo", "In overhead bin", "On compartment floor", "In passenger area"], correctAnswer: 2, explanation: "RRY packages must be stowed on the compartment floor to ensure maximum distance to passengers and crew. No load can be placed on top." },
    { type: "clickToReveal", title: "When must RRY packages be REFUSED?", content: "RRY packages without the Transport Index entered on the label, or with broken seals (if any), must NOT be carried. Radioactive materials must be restrained so movement is impossible during flight.", variant: "danger" },
    { type: "matching", title: "Match Radioactive Categories to their Codes", left: ["Category I", "Category II", "Category III"], right: ["RRW - White label", "RRY - Yellow label", "RRY - Yellow label (higher TI)"] },
  ],
  "lesson-2-15": [
    { type: "clickToReveal", title: "Can employees travel with cargo-only DG?", content: "Employees may travel on aircraft with cargo-only DG if in official capacity — meaning they have duties concerned with the preparation or undertaking of a flight.", variant: "info" },
  ],
  "lesson-2-16": [
    { type: "image", src: "/images/dg-topics/cabin-crew-safety-demo.jpg", caption: "Passenger tickets contain IATA DGR information — cabin crew must identify prohibited items passengers may carry", alt: "Cabin crew and passenger safety" },
  ],
  "lesson-2-17": [
    { type: "sequence", title: "Order the acceptance staff verification steps", steps: ["Properly identify goods using 9 hazard classes", "Limit quantity per package to maximum allowed", "Use correct type of packaging", "Place required markings and labels on package", "Complete and sign Shippers Declaration"], correctOrder: [0, 1, 2, 3, 4] },
    { type: "knowledgeCheck", question: "Whose responsibility is it to check packages are free from leakage?", options: ["Commander", "Acceptance staff", "Passengers", "Ground handlers only"], correctAnswer: 1, explanation: "Acceptance staff are personally responsible for checking that packages are free from leakage and damage, and correctly marked and labelled." },
    { type: "clickToReveal", title: "What can the Commander assume from a signed NOTOC?", content: "In practice, provided that the authorised responsible person(s) have signed the relevant sections of the NOTOC, the Commander can assume that the dangerous goods have been correctly prepared and loaded.", variant: "tip" },
  ],

  // ============================================================
  // MODULE 3 — NOTOC and Emergency Response
  // ============================================================
  "lesson-3-1": [
    { type: "image", src: "/images/dg-topics/notoc-document.jpg", caption: "Sample NOTOC (Notification to Commander) document — contains all DG information and must be available during entire flight", alt: "NOTOC document sample" },
    { type: "svg", src: "/images/svg/notoc-document.svg", caption: "Detailed NOTOC layout with flight info, DG manifest, signatures, and special instructions" },
    { type: "knowledgeCheck", question: "How long must the NOTOC be available to the Commander?", options: ["Only before takeoff", "During emergencies", "Entire flight", "24 hours after landing"], correctAnswer: 2, explanation: "The NOTOC shall be readily available to the Commander during the ENTIRE flight." },
    { type: "clickToReveal", title: "What if NOTOC specifies temperature below aircraft capability?", content: "When a NOTOC specifies a temperature setting for perishable cargo, the cargo compartment temperature should be adjusted accordingly to maintain cool storage, EVEN IF the temperature mentioned is below the cooling capability of the aircraft.", variant: "warning" },
  ],
  "lesson-3-2": [
    { type: "image", src: "/images/dg-topics/dg-spillage-cleanup.jpg", caption: "Inspection for damage and leakage — packages must be inspected before loading and after unloading", alt: "Dangerous goods spillage inspection" },
    { type: "knowledgeCheck", question: "When must loading inspection occur?", options: ["Before departure only", "Immediately prior to loading", "After landing only", "Weekly"], correctAnswer: 1, explanation: "The loading supervisor must inspect packages immediately prior to loading and find them free from leakage or damage." },
  ],
  "lesson-3-3": [
    { type: "image", src: "/images/dg-topics/radioactive-trefoil.png", caption: "Damaged radioactive packages — personnel must stay at least 25 meters away", alt: "Radioactive trefoil warning symbol" },
    { type: "knowledgeCheck", question: "What is the minimum distance from damaged radioactive packages?", options: ["10 m", "15 m", "20 m", "25 m"], correctAnswer: 3, explanation: "In case of damaged radioactive material, all personnel must stay at least 25 meters away from the damaged packages." },
    { type: "knowledgeCheck", question: "Damaged DG shipments can be loaded if...", options: ["Commander approves", "Labeled correctly", "NEVER - damaged shipments never loaded", "During emergencies"], correctAnswer: 2, explanation: "Damaged dangerous goods shipments shall NEVER be loaded on the aircraft under any circumstances." },
    { type: "clickToReveal", title: "What happens when damaged infectious substance (RIS) is found?", content: "A teletype message must be sent to the Airport Managers of ALL previous and subsequent line stations. All persons involved in loading or unloading activities must be informed immediately.", variant: "danger" },
    { type: "sequence", title: "Order the damage response steps", steps: ["Inform Commander, Cargo dept, Station engineer", "Ramp Agent ensures nobody touches packages", "Determine nature of hazard", "Inform salvage organizations (fire brigade, medical)", "Check other cargo for contamination"], correctOrder: [0, 1, 2, 3, 4] },
  ],
  "lesson-3-4": [
    { type: "svg", src: "/images/svg/emergency-flowchart.svg", caption: "Cabin crew DG incident response flowchart — from detection to landing" },
    { type: "image", src: "/images/dg-topics/dg-spillage-cleanup.jpg", caption: "Spillage response — cabin crew use rubber gloves, smoke hoods, and polythene bags for cleanup", alt: "Dangerous goods spillage cleanup" },
    { type: "interactive", component: "animatedEvacuation" },
    { type: "knowledgeCheck", question: "What signs must be turned ON during a DG incident?", options: ["Seatbelt only", "No smoking", "Exit signs", "All lights"], correctAnswer: 1, explanation: "No smoking signs must be turned ON during a DG incident. Other actions include considering landing ASAP and turning off non-essential electrical power." },
    { type: "knowledgeCheck", question: "What should cabin crew do FIRST in a passenger cabin DG incident?", options: ["Evacuate passengers", "Notify the Commander", "Use fire extinguisher", "Open doors"], correctAnswer: 1, explanation: "The first action in the cabin crew checklist is to NOTIFY THE COMMANDER. Then identify the item and determine the emergency response drill code." },
    { type: "clickToReveal", title: "How is spillage/leakage handled in the cabin?", content: "For spillage: Put on rubber gloves and smoke hoods/masks; Move passengers away and distribute wet towels; Place suspect items in polythene bags; Stow polythene bags; Treat affected seats like DG; Cover spillage on carpet; Regularly inspect stowed items.", variant: "warning" },
    { type: "sequence", title: "Order the cabin crew spillage response", steps: ["Put on rubber gloves and smoke hoods", "Move passengers away from area", "Distribute wet towels/cloths", "Place suspect items in polythene bags", "Stow polythene bags securely", "Cover spillage on carpet floor", "Regularly inspect stowed items"], correctOrder: [0, 1, 2, 3, 4, 5, 6] },
  ],
  "lesson-3-5": [
    { type: "image", src: "/images/dg-topics/cabin-crew-evacuation.jpg", caption: "After landing — passengers and crew must be disembarked before any cargo compartment doors are opened", alt: "Cabin crew evacuation procedure" },
    { type: "knowledgeCheck", question: "What must happen before cargo doors are opened after landing?", options: ["Nothing special", "Passengers and crew disembarked first", "Cargo doors opened immediately", "Only passengers disembark"], correctAnswer: 1, explanation: "Passengers and crew must be disembarked before any cargo compartment doors are opened. Emergency services should be in attendance before any cargo door is opened." },
    { type: "clickToReveal", title: "What reports must be filed after a DG incident landing?", content: "After landing: 1) Ground handling personnel informed of offending items and stowage; 2) Entry made in Aircraft Technical Log; 3) ASR (Air Safety Report) filed. The Commander raises the ASR and hands it to Flight Safety Office.", variant: "info" },
  ],
  "lesson-3-6": [
    { type: "svg", src: "/images/svg/reporting-timeline.svg", caption: "DG incident reporting timeline — 72 hour deadline for DGCA report" },
    { type: "knowledgeCheck", question: "Within what timeframe must DG incidents be reported to DGCA?", options: ["24 hours", "48 hours", "72 hours", "96 hours"], correctAnswer: 2, explanation: "A report must be sent to the DGCA within 72 hours, unless exceptional circumstances prevent this." },
    { type: "clickToReveal", title: "What information must be in the incident report?", content: "The report must include: date/location/flight info; reference numbers (air waybill, baggage tag); goods description (proper shipping name, UN number, class); packaging type and quantity; shipper name/address; suspected cause; action taken; reporter's contact info; copies of documents and photos.", variant: "info" },
    { type: "knowledgeCheck", question: "What must the Commander do regarding ASR?", options: ["File after 24 hours", "Raise ASR and handover to Flight Safety Office", "Only if requested", "No ASR needed"], correctAnswer: 1, explanation: "The Commander shall raise an ASR (Air Safety Report) and hand it over to the Flight Safety Office." },
  ],
  "lesson-3-7": [
    { type: "svg", src: "/images/svg/door-arming.svg", caption: "Aircraft door armed vs disarmed states — slide deploys automatically when armed" },
    { type: "interactive", component: "animatedDoorArming" },
    { type: "knowledgeCheck", question: "What is the maximum ammunition weight per passenger?", options: ["2 kg", "3 kg", "4 kg", "5 kg"], correctAnswer: 3, explanation: "The maximum gross weight of ammunition must not exceed 5 kg per passenger. For group travel, max 5 kg per suitcase." },
    { type: "knowledgeCheck", question: "What is the policy on firearms in cabin or flight deck?", options: ["Allowed if secured", "Allowed for VVIP protection", "Not allowed under any circumstances", "Allowed with permission"], correctAnswer: 2, explanation: "Firearms and potential weapons must NOT be allowed under ANY circumstances on the flight deck or in the cabin." },
    { type: "clickToReveal", title: "Are handguns for personal protection considered sporting weapons?", content: "NO! Handguns for personal protection are considered to be WAR MATERIAL and are not accepted on the aircraft. Only weapons designed for sporting purposes (target pistols, air guns, safari rifles, hunting rifles) can be accepted as accompanied baggage.", variant: "danger" },
    { type: "knowledgeCheck", question: "Is there a limit on sporting weapons per passenger?", options: ["1 weapon", "2 weapons", "5 weapons", "No limit"], correctAnswer: 3, explanation: "There is NO limit on the number of sporting weapons per passenger. However, ammunition is limited to 5 kg per passenger." },
    { type: "matching", title: "Match weapon types to their acceptance", left: ["Hunting rifle", "Handgun for protection", "Target pistol", "War material firearms"], right: ["Accepted as baggage", "War material - NOT accepted", "Accepted as baggage", "NOT accepted"] },
  ],
};

// Get enhanced content for a lesson
export function getEnhancedContent(lessonId: string): any[] {
  return lessonEnhancements[lessonId] || [];
}
