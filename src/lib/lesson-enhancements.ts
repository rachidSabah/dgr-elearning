// Interactive content enhancements for DGR lessons
// Adds knowledge checks, SVG diagrams, interactive components to lessons
// Also includes high-resolution NotebookLM training slide images mapped per module.

export const lessonEnhancements: Record<string, any[]> = {
  // ============================================================
  // MODULE 1 — Dangerous Goods Awareness (artifact2 images)
  // ============================================================
  "lesson-1-1": [
    { type: "image", src: "/images/notebooklm/artifact2-img01.jpg", caption: "Dangerous goods overview — introduction to hazards handled in air transport" },
    { type: "image", src: "/images/notebooklm/artifact2-img02.jpg", caption: "Course aim and structure for cabin crew dangerous goods training" },
  ],
  "lesson-1-2": [
    { type: "image", src: "/images/notebooklm/artifact2-img03.jpg", caption: "Background and context of dangerous goods awareness in aviation" },
    { type: "image", src: "/images/notebooklm/artifact2-img04.jpg", caption: "ICAO definition of dangerous goods and key foundational concepts" },
    { type: "knowledgeCheck", question: "Which organization defines dangerous goods for air transport?", options: ["IATA", "ICAO", "FAA", "EASA"], correctAnswer: 1, explanation: "ICAO (International Civil Aviation Organization) defines dangerous goods in its Technical Instructions for the Safe Transport of Dangerous Goods by Air." },
  ],
  "lesson-1-3": [
    { type: "image", src: "/images/notebooklm/artifact2-img05.jpg", caption: "Regulatory framework for dangerous goods transport (ICAO, IATA, national authorities)" },
    { type: "image", src: "/images/notebooklm/artifact2-img06.jpg", caption: "Training requirements for cabin crew under ICAO and IATA regulations" },
  ],
  "lesson-1-4": [
    { type: "image", src: "/images/notebooklm/artifact2-img07.jpg", caption: "Case studies of reported dangerous goods incidents in passenger baggage" },
    { type: "image", src: "/images/notebooklm/artifact2-img08.jpg", caption: "Lessons learned from past DG incidents — fireworks, hydrogen peroxide leakage" },
  ],

  // ============================================================
  // MODULE 2 — Transport of Dangerous Goods (artifact1 images)
  // ============================================================
  "lesson-2-1": [
    { type: "image", src: "/images/notebooklm/artifact1-img01.jpg", caption: "Overview of dangerous goods transport regulations and general provisions" },
  ],
  "lesson-2-2": [
    { type: "image", src: "/images/notebooklm/artifact1-img02.jpg", caption: "Dangerous goods terminology and key definitions used in operations" },
  ],
  "lesson-2-3": [
    { type: "image", src: "/images/notebooklm/artifact1-img03.jpg", caption: "Categories of dangerous goods accepted for air transport" },
  ],
  "lesson-2-4": [
    { type: "image", src: "/images/notebooklm/artifact1-img04.jpg", caption: "IATA Special Load (SPC) codes and CARGO IMP abbreviations for dangerous goods" },
  ],
  "lesson-2-5": [
    { type: "image", src: "/images/notebooklm/artifact1-img05.jpg", caption: "Hazard class classification diagram — the nine hazard classes" },
    { type: "image", src: "/images/notebooklm/artifact1-img06.jpg", caption: "Nine hazard classes overview and classification principles" },
    { type: "svg", src: "/images/svg/packing-groups.svg", caption: "The three packing groups indicating degree of danger" },
    { type: "interactive", component: "hazardExplorer" },
    { type: "knowledgeCheck", question: "How many hazard classes are there in dangerous goods regulations?", options: ["6", "7", "9", "12"], correctAnswer: 2, explanation: "There are 9 hazard classes: Explosives, Gases, Flammable Liquids, Flammable Solids, Oxidizing/Organics, Toxic/Infectious, Radioactive, Corrosives, and Miscellaneous." },
    { type: "clickToReveal", title: "Which class has compatibility groups?", content: "Only Class 1 (Explosives) is further divided into compatibility groups indicated by a letter (B, C, D, E, G, or S). Explosives with different compatibility groups cannot be stowed together.", variant: "info" },
  ],
  "lesson-2-6": [
    { type: "image", src: "/images/notebooklm/artifact1-img07.jpg", caption: "Packing groups and packaging requirements for dangerous goods" },
    { type: "svg", src: "/images/svg/packing-groups.svg", caption: "Packing Groups I, II, III - degree of danger classification" },
    { type: "knowledgeCheck", question: "Which packing group indicates HIGH danger?", options: ["Group I", "Group II", "Group III", "Group IV"], correctAnswer: 0, explanation: "Packing Group I indicates high danger, Group II indicates medium danger, and Group III indicates minor danger." },
    { type: "clickToReveal", title: "Where is the packing group displayed?", content: "The packing group is shown on the NOTOC (Notification to Commander/Special Load Notification). Radioactive materials (Category II and III) also show their Transport Index on the NOTOC.", variant: "info" },
  ],
  "lesson-2-7": [
    { type: "image", src: "/images/notebooklm/artifact1-img08.jpg", caption: "Required markings on dangerous goods packages — UN number, proper shipping name" },
  ],
  "lesson-2-8": [
    { type: "image", src: "/images/notebooklm/artifact1-img09.jpg", caption: "Hazard and handling labels for dangerous goods packages" },
    { type: "interactive", component: "hazardExplorer" },
    { type: "clickToReveal", title: "What are the two types of labels?", content: "Hazard Labels are diamond-shaped and show the hazard symbol with class/division number. Handling Labels provide stowage and handling information (e.g., Cargo Aircraft Only, Package Orientation, Cryogenic, Keep Away From Heat, Magnetised Material).", variant: "info" },
  ],
  "lesson-2-9": [
    { type: "image", src: "/images/notebooklm/artifact1-img10.jpg", caption: "Dangerous goods hazard classes overview — all nine classes detailed" },
    { type: "image", src: "/images/notebooklm/artifact1-img11.jpg", caption: "Class 1 Explosives divisions and compatibility groups" },
    { type: "image", src: "/images/notebooklm/artifact1-img12.jpg", caption: "Gases, flammable liquids and flammable solids — hazard class details" },
    { type: "interactive", component: "hazardExplorer" },
    { type: "svg", src: "/images/svg/aircraft-cross-section.svg", caption: "Aircraft cross-section showing DG stowage locations" },
    { type: "knowledgeCheck", question: "Which explosive division is the ONLY one allowed on passenger aircraft?", options: ["1.3C", "1.4S", "1.4B", "1.3G"], correctAnswer: 1, explanation: "Explosives 1.4S are the only type of explosives allowed in passenger aircraft. All other explosives (1.1, 1.2, 1.3 except 1.3C/1.3G, 1.5, 1.6) are forbidden." },
    { type: "knowledgeCheck", question: "What is the IATA CARGO IMP code for Toxic Gas (Division 2.3)?", options: ["RFG", "RNG", "RPG", "RCM"], correctAnswer: 2, explanation: "Toxic Gas is RPG. All RPG articles are Cargo Aircraft only (CAO) - they cannot be carried on passenger aircraft." },
    { type: "knowledgeCheck", question: "Which class includes Dry Ice and Polymeric Beads?", options: ["Class 7", "Class 8", "Class 9", "Class 5"], correctAnswer: 2, explanation: "Class 9 (Miscellaneous Dangerous Goods) includes Dry Ice (ICE), Polymeric Beads (RSB), and Magnetised Material (MAG)." },
    { type: "clickToReveal", title: "What is special about Magnetised Material?", content: "Magnetised material (MAG) does not need a hazard label but requires a handling label. It must only be carried in the AFT hold to avoid affecting the aircraft's magnetic compasses.", variant: "warning" },
    { type: "matching", title: "Match Hazard Classes to their IATA Codes", left: ["Flammable Liquid", "Corrosive", "Radioactive Cat I", "Oxidizer", "Infectious Substance"], right: ["RFL", "RCM", "RRW", "ROX", "RIS"] },
  ],
  "lesson-2-10": [
    { type: "image", src: "/images/notebooklm/artifact1-img13.jpg", caption: "General transport regulations and pre-loading inspection requirements" },
    { type: "svg", src: "/images/svg/segregation-chart.svg", caption: "Dangerous goods segregation chart" },
    { type: "knowledgeCheck", question: "What is the minimum segregation distance for Rule 1?", options: ["0.5 m", "1 m", "1.5 m", "2 m"], correctAnswer: 0, explanation: "Rule 1 requires a minimum distance of 0.5 m and goods must not be loaded in a position that would allow interaction in case of leakage." },
    { type: "clickToReveal", title: "Can dangerous goods be carried in the passenger cabin?", content: "NO! Dangerous Goods must NEVER be carried in the passenger cabin or cockpit. The only exception is items allowed under 'Provision for Dangerous Goods Carried by Passengers or Crew'.", variant: "danger" },
  ],
  "lesson-2-11": [
    { type: "image", src: "/images/notebooklm/artifact1-img14.jpg", caption: "Loading and stowage rules for dangerous goods in aircraft holds" },
    { type: "svg", src: "/images/svg/cabin-layout.svg", caption: "Interactive cabin layout - click zones to explore" },
    { type: "interactive", component: "cabinExplorer" },
    { type: "knowledgeCheck", question: "Where can magnetised material be stowed?", options: ["Forward hold", "AFT hold only", "Either hold", "Cabin overhead"], correctAnswer: 1, explanation: "Magnetised material must only be carried in the AFT hold to avoid affecting the aircraft's direct reading magnetic compasses or master compass detector units." },
    { type: "clickToReveal", title: "What does the Transport Index represent?", content: "The Transport Index (TI) represents the radiation level of a radioactive package. It's used to determine separation distances from passengers and crew, and limits total radioactive material per flight.", variant: "info" },
  ],
  "lesson-2-12": [
    { type: "image", src: "/images/notebooklm/artifact1-img15.jpg", caption: "Dry ice (ICE) handling, ventilation and loading requirements" },
    { type: "knowledgeCheck", question: "What is the maximum dry ice per hold?", options: ["100 kg", "150 kg", "200 kg", "250 kg"], correctAnswer: 2, explanation: "Maximum of 200 kg dry ice per hold is allowed. The structure must be protected with insulating material, and compartments must be ventilated before entering." },
    { type: "knowledgeCheck", question: "Can dry ice be loaded with live animals?", options: ["Yes, always", "Yes, with ventilation", "No, never in same hold", "Yes, if separated"], correctAnswer: 2, explanation: "Live animals and dry ice must NOT be loaded together in the same hold under any circumstances." },
    { type: "clickToReveal", title: "Why is dry ice dangerous?", content: "Dry ice (solid CO2) sublimates into gas, displacing oxygen in enclosed spaces. Without proper ventilation, it can cause asphyxiation. This is why compartments must be ventilated before entering, and it cannot share a hold with live animals.", variant: "warning" },
  ],
  "lesson-2-13": [
    { type: "image", src: "/images/notebooklm/artifact1-img16.jpg", caption: "Polymeric beads (RSB) carriage requirements and quantity limits" },
  ],
  "lesson-2-14": [
    { type: "image", src: "/images/notebooklm/artifact1-img17.jpg", caption: "Radioactive materials categories, Transport Index and stowage rules" },
    { type: "svg", src: "/images/svg/transport-index.svg", caption: "Transport Index categories and limits for radioactive materials" },
    { type: "knowledgeCheck", question: "What is the TI limit for passenger aircraft?", options: ["20 TI", "50 TI", "100 TI", "200 TI"], correctAnswer: 1, explanation: "Passenger aircraft: max 50 TI. Freighter aircraft: max 200 TI. RRY packages must be stowed on compartment floor for maximum distance to passengers." },
    { type: "knowledgeCheck", question: "Where must RRY packages be stowed?", options: ["On top of cargo", "In overhead bin", "On compartment floor", "In passenger area"], correctAnswer: 2, explanation: "RRY packages must be stowed on the compartment floor to ensure maximum distance to passengers and crew. No load can be placed on top." },
    { type: "clickToReveal", title: "When must RRY packages be REFUSED?", content: "RRY packages without the Transport Index entered on the label, or with broken seals (if any), must NOT be carried. Radioactive materials must be restrained so movement is impossible during flight.", variant: "danger" },
    { type: "matching", title: "Match Radioactive Categories to their Codes", left: ["Category I", "Category II", "Category III"], right: ["RRW - White label", "RRY - Yellow label", "RRY - Yellow label (higher TI)"] },
  ],
  "lesson-2-15": [
    { type: "image", src: "/images/notebooklm/artifact1-img18.jpg", caption: "Carriage of employees with company material — exceptions and conditions" },
  ],
  "lesson-2-16": [
    { type: "image", src: "/images/notebooklm/artifact1-img19.jpg", caption: "Provisions for dangerous goods carried by passengers and crew" },
  ],
  "lesson-2-17": [
    { type: "image", src: "/images/notebooklm/artifact1-img20.jpg", caption: "Responsibilities of individuals in dangerous goods operations" },
    { type: "image", src: "/images/notebooklm/artifact1-img21.jpg", caption: "Acceptance, handling and Commander responsibilities for DG" },
    { type: "sequence", title: "Order the acceptance staff verification steps", steps: ["Properly identify goods using 9 hazard classes", "Limit quantity per package to maximum allowed", "Use correct type of packaging", "Place required markings and labels on package", "Complete and sign Shippers Declaration"], correctOrder: [0, 1, 2, 3, 4] },
    { type: "knowledgeCheck", question: "Whose responsibility is it to check packages are free from leakage?", options: ["Commander", "Acceptance staff", "Passengers", "Ground handlers only"], correctAnswer: 1, explanation: "Acceptance staff are personally responsible for checking that packages are free from leakage and damage, and correctly marked and labelled." },
    { type: "clickToReveal", title: "What can the Commander assume from a signed NOTOC?", content: "In practice, provided that the authorised responsible person(s) have signed the relevant sections of the NOTOC, the Commander can assume that the dangerous goods have been correctly prepared and loaded.", variant: "tip" },
  ],

  // ============================================================
  // MODULE 3 — NOTOC and Emergency Response (artifact3 images)
  // ============================================================
  "lesson-3-1": [
    { type: "image", src: "/images/notebooklm/artifact3-img01.jpg", caption: "NOTOC document sample and procedures — Notification to Commander" },
    { type: "image", src: "/images/notebooklm/artifact3-img02.jpg", caption: "NOTOC contents and availability to the Commander during the entire flight" },
    { type: "svg", src: "/images/svg/notoc-document.svg", caption: "Sample NOTOC (Notification to Commander) document" },
    { type: "knowledgeCheck", question: "How long must the NOTOC be available to the Commander?", options: ["Only before takeoff", "During emergencies", "Entire flight", "24 hours after landing"], correctAnswer: 2, explanation: "The NOTOC shall be readily available to the Commander during the ENTIRE flight." },
    { type: "clickToReveal", title: "What if NOTOC specifies temperature below aircraft capability?", content: "When a NOTOC specifies a temperature setting for perishable cargo, the cargo compartment temperature should be adjusted accordingly to maintain cool storage, EVEN IF the temperature mentioned is below the cooling capability of the aircraft.", variant: "warning" },
  ],
  "lesson-3-2": [
    { type: "image", src: "/images/notebooklm/artifact3-img03.jpg", caption: "Pre-loading inspection of dangerous goods packages for damage" },
    { type: "image", src: "/images/notebooklm/artifact3-img04.jpg", caption: "Checking for damage, leakage and contamination before loading" },
  ],
  "lesson-3-3": [
    { type: "image", src: "/images/notebooklm/artifact3-img05.jpg", caption: "Procedures for handling damaged dangerous goods shipments" },
    { type: "image", src: "/images/notebooklm/artifact3-img06.jpg", caption: "Damaged radioactive and infectious substance response procedures" },
    { type: "knowledgeCheck", question: "What is the minimum distance from damaged radioactive packages?", options: ["10 m", "15 m", "20 m", "25 m"], correctAnswer: 3, explanation: "In case of damaged radioactive material, all personnel must stay at least 25 meters away from the damaged packages." },
    { type: "knowledgeCheck", question: "Damaged DG shipments can be loaded if...", options: ["Commander approves", "Labeled correctly", "NEVER - damaged shipments never loaded", "During emergencies"], correctAnswer: 2, explanation: "Damaged dangerous goods shipments shall NEVER be loaded on the aircraft under any circumstances." },
    { type: "clickToReveal", title: "What happens when damaged infectious substance (RIS) is found?", content: "A teletype message must be sent to the Airport Managers of ALL previous and subsequent line stations. All persons involved in loading or unloading activities must be informed immediately.", variant: "danger" },
    { type: "sequence", title: "Order the damage response steps", steps: ["Inform Commander, Cargo dept, Station engineer", "Ramp Agent ensures nobody touches packages", "Determine nature of hazard", "Inform salvage organizations (fire brigade, medical)", "Check other cargo for contamination"], correctOrder: [0, 1, 2, 3, 4] },
  ],
  "lesson-3-4": [
    { type: "image", src: "/images/notebooklm/artifact3-img07.jpg", caption: "Emergency response procedures for in-flight dangerous goods incidents" },
    { type: "image", src: "/images/notebooklm/artifact3-img08.jpg", caption: "Cabin crew checklist for dangerous goods incidents in the passenger cabin" },
    { type: "svg", src: "/images/svg/emergency-flowchart.svg", caption: "Cabin crew DG incident response flowchart" },
    { type: "interactive", component: "animatedEvacuation" },
    { type: "knowledgeCheck", question: "What signs must be turned ON during a DG incident?", options: ["Seatbelt only", "No smoking", "Exit signs", "All lights"], correctAnswer: 1, explanation: "No smoking signs must be turned ON during a DG incident. Other actions include considering landing ASAP and turning off non-essential electrical power." },
    { type: "knowledgeCheck", question: "What should cabin crew do FIRST in a passenger cabin DG incident?", options: ["Evacuate passengers", "Notify the Commander", "Use fire extinguisher", "Open doors"], correctAnswer: 1, explanation: "The first action in the cabin crew checklist is to NOTIFY THE COMMANDER. Then identify the item and determine the emergency response drill code." },
    { type: "clickToReveal", title: "How is spillage/leakage handled in the cabin?", content: "For spillage: Put on rubber gloves and smoke hoods/masks; Move passengers away and distribute wet towels; Place suspect items in polythene bags; Stow polythene bags; Treat affected seats like DG; Cover spillage on carpet; Regularly inspect stowed items.", variant: "warning" },
    { type: "sequence", title: "Order the cabin crew spillage response", steps: ["Put on rubber gloves and smoke hoods", "Move passengers away from area", "Distribute wet towels/cloths", "Place suspect items in polythene bags", "Stow polythene bags securely", "Cover spillage on carpet floor", "Regularly inspect stowed items"], correctOrder: [0, 1, 2, 3, 4, 5, 6] },
  ],
  "lesson-3-5": [
    { type: "image", src: "/images/notebooklm/artifact3-img09.jpg", caption: "Post-landing actions following dangerous goods incidents" },
    { type: "image", src: "/images/notebooklm/artifact3-img10.jpg", caption: "Reporting and aircraft technical log entry procedures after landing" },
    { type: "knowledgeCheck", question: "What must happen before cargo doors are opened after landing?", options: ["Nothing special", "Passengers and crew disembarked first", "Cargo doors opened immediately", "Only passengers disembark"], correctAnswer: 1, explanation: "Passengers and crew must be disembarked before any cargo compartment doors are opened. Emergency services should be in attendance before any cargo door is opened." },
    { type: "clickToReveal", title: "What reports must be filed after a DG incident landing?", content: "After landing: 1) Ground handling personnel informed of offending items and stowage; 2) Entry made in Aircraft Technical Log; 3) ASR (Air Safety Report) filed. The Commander raises the ASR and hands it to Flight Safety Office.", variant: "info" },
  ],
  "lesson-3-6": [
    { type: "image", src: "/images/notebooklm/artifact3-img11.jpg", caption: "ICAO Emergency Response Guidance reference for dangerous goods drills" },
    { type: "image", src: "/images/notebooklm/artifact3-img12.jpg", caption: "Accident and incident reporting procedures and required information" },
    { type: "svg", src: "/images/svg/reporting-timeline.svg", caption: "DG incident reporting timeline - 72 hour deadline" },
    { type: "knowledgeCheck", question: "Within what timeframe must DG incidents be reported to DGCA?", options: ["24 hours", "48 hours", "72 hours", "96 hours"], correctAnswer: 2, explanation: "A report must be sent to the DGCA within 72 hours, unless exceptional circumstances prevent this." },
    { type: "clickToReveal", title: "What information must be in the incident report?", content: "The report must include: date/location/flight info; reference numbers (air waybill, baggage tag); goods description (proper shipping name, UN number, class); packaging type and quantity; shipper name/address; suspected cause; action taken; reporter's contact info; copies of documents and photos.", variant: "info" },
    { type: "knowledgeCheck", question: "What must the Commander do regarding ASR?", options: ["File after 24 hours", "Raise ASR and handover to Flight Safety Office", "Only if requested", "No ASR needed"], correctAnswer: 1, explanation: "The Commander shall raise an ASR (Air Safety Report) and hand it over to the Flight Safety Office." },
  ],
  "lesson-3-7": [
    { type: "image", src: "/images/notebooklm/artifact3-img13.jpg", caption: "Transport of weapons and ammunition — overview and acceptance rules" },
    { type: "image", src: "/images/notebooklm/artifact3-img14.jpg", caption: "Sporting weapons acceptance — types allowed as accompanied baggage" },
    { type: "image", src: "/images/notebooklm/artifact3-img15.jpg", caption: "Ammunition weight limits and prohibited firearms (war material)" },
    { type: "svg", src: "/images/svg/door-arming.svg", caption: "Aircraft door armed vs disarmed states" },
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
