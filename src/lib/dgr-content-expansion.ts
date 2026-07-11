// Deep content expansion for DGR lessons
// Adds substantial additional content to each DGR lesson

export const dgrContentExpansion: Record<string, any[]> = {
  "lesson-1-1": [
    { type: "heading", text: "The Real-World Impact of Dangerous Goods", level: 3 },
    { type: "paragraph", text: "Every day, millions of passengers board aircraft carrying items they don't realize are dangerous. Lithium batteries in laptops and phones, aerosol sprays, camping fuel, alcoholic beverages above permitted limits, and even certain medical equipment all fall under dangerous goods regulations. The cabin crew's ability to identify and manage these items is a critical safety function." },
    { type: "paragraph", text: "The aviation environment creates unique risks for dangerous goods. At cruising altitude, the cabin is pressurized to approximately 8,000 feet, meaning atmospheric pressure is lower than at sea level. This pressure reduction can cause sealed containers to expand, leak, or rupture. Temperature variations during flight can cause chemical reactions in certain substances. Turbulence can shift and damage packages. All of these factors make air transport of dangerous goods significantly more hazardous than ground transport." },
    { type: "callout", variant: "warning", title: "Why Cabin Crew Need DGR Training", text: "Cabin crew are the last line of defense against dangerous goods incidents in the passenger cabin. While acceptance staff, ramp handlers, and cargo personnel screen goods before loading, passengers may still bring prohibited items onboard in carry-on or checked baggage. Cabin crew must be able to recognize dangerous goods, understand the risks, and know how to respond if an incident occurs during flight." },
    { type: "heading", text: "The Regulatory Framework", level: 3 },
    { type: "paragraph", text: "Dangerous goods transportation by air is governed by a multi-layered regulatory framework. At the international level, ICAO (International Civil Aviation Organization) publishes the Technical Instructions for the Safe Transport of Dangerous Goods by Air, which sets the legal requirements. IATA (International Air Transport Association) publishes the Dangerous Goods Regulations (DGR), which translates the ICAO requirements into practical, operational rules that airlines use daily. National civil aviation authorities (FAA, EASA, CAA, etc.) enforce these regulations within their jurisdictions." },
    { type: "table", caption: "Regulatory Bodies and Their Roles", headers: ["Body", "Role", "Key Publication"], rows: [
      ["ICAO", "International legal framework", "Technical Instructions (Doc 9284)"],
      ["IATA", "Industry operational standards", "Dangerous Goods Regulations (DGR)"],
      ["FAA/EASA/CAA", "National enforcement", "National aviation regulations"],
      ["Airlines", "Operational implementation", "Operations manuals, training programs"],
    ]},
  ],
  "lesson-1-4": [
    { type: "heading", text: "Lessons from Real Incidents", level: 3 },
    { type: "paragraph", text: "History provides powerful lessons about why dangerous goods training matters. In one documented case, a passenger checked a bag containing 48 long fireworks (roman candle type), 32 packets of friction ignition fireworks, and 2 cigarette lighters — all in the same bag. The passenger had started their journey with another airline and made two transit stops before connecting with the flight where the items were discovered. This case illustrates how easily prohibited dangerous goods can pass through multiple checkpoints if crew and ground staff are not vigilant." },
    { type: "paragraph", text: "In another case, bottles of 35-percent hydrogen peroxide solution — an oxidizer with corrosive properties — leaked in a cargo compartment, causing a suitcase to smolder. The bottles were packed in an ice chest checked by a passenger. Baggage handlers discovered the smouldering suitcase, which could easily have ignited during flight. This incident demonstrates why quantity limits, proper packaging, and segregation rules exist — without them, a leaking container can create a fire in the cargo hold that crew cannot access during flight." },
    { type: "callout", variant: "danger", title: "The Chain of Events", text: "Most dangerous goods incidents follow a chain: passenger doesn't know item is prohibited → item passes screening → item is loaded on aircraft → conditions during flight (pressure, temperature, turbulence) cause item to leak/ignite/react → crew must manage the incident. CRM and DGR training break this chain at multiple points: passenger awareness, crew vigilance, and effective emergency response." },
    { type: "heading", text: "Cabin Crew's Role in Prevention", level: 3 },
    { type: "paragraph", text: "Cabin crew can prevent dangerous goods incidents through vigilance during boarding and flight. Watch for passengers carrying unusual items, unusual smells, visible leakage from bags, or passengers acting nervously about their belongings. If you notice anything suspicious, discreetly investigate and report to the CSD/CS. It is always better to ask about a suspicious item than to discover its danger at 35,000 feet." },
  ],
  "lesson-2-5": [
    { type: "heading", text: "Understanding the Nine Hazard Classes", level: 3 },
    { type: "paragraph", text: "The nine hazard classes are not arbitrary — each represents a specific type of danger that requires specific handling, packaging, and emergency response. Understanding what each class means helps cabin crew recognize the risk and respond appropriately if an incident occurs. For example, knowing that Class 3 (flammable liquids) can ignite without an external ignition source at high temperatures tells you that a fire from these materials may be self-sustaining and requires specific extinguishing techniques." },
    { type: "paragraph", text: "Each class has a distinctive diamond-shaped label with a specific color and symbol. These labels are not decorative — they are critical safety communication tools that tell crew at a glance what hazard is present. In a smoke-filled cabin or during an emergency, recognizing a hazard label can determine the correct response. For example, seeing a Class 5.1 (oxidizer) label tells you that water may not be the best extinguishing agent, as oxidizers provide oxygen that can feed a fire." },
    { type: "table", caption: "Quick Reference: Hazard Classes and Cabin Crew Response", headers: ["Class", "Name", "Key Danger", "Cabin Crew Consideration"], rows: [
      ["1", "Explosives", "Mass explosion, fire, blast", "Only 1.4S allowed on passenger aircraft — extremely rare"],
      ["2", "Gases", "Pressure, toxicity, flammability", "Toxic gas (2.3) = CAO only; check for asphyxiation risk"],
      ["3", "Flammable Liquids", "Fire, vapor ignition", "Vapors can ignite — check water compatibility before use"],
      ["4", "Flammable Solids", "Fire, spontaneous combustion, water-reactive", "Class 4.3 produces flammable gas on contact with water"],
      ["5", "Oxidizers", "Oxygen source for fires", "Can intensify fires — do not use water on Class 5.2"],
      ["6", "Toxic/Infectious", "Poisoning, infection", "Infectious substances require PPE — gloves, masks"],
      ["7", "Radioactive", "Radiation exposure", "Maximize distance, minimize time, use shielding"],
      ["8", "Corrosives", "Tissue damage, material destruction", "Skin/eye contact requires immediate flushing with water"],
      ["9", "Miscellaneous", "Various (dry ice = CO2 asphyxiation)", "Dry ice sublimates — ensure ventilation, not with live animals"],
    ]},
    { type: "callout", variant: "tip", title: "Memory Aid", text: "Remember the classes in order: 'Every Good Fire Occurs Through Rain Causing Many Disasters' = Explosives, Gases, Flammable liquids, Flammable solids, Oxidizers, Toxic/Infectious, Radioactive, Corrosives, Miscellaneous. This mnemonic can help you recall all nine classes during training and assessments." },
  ],
  "lesson-2-9": [
    { type: "heading", text: "Detailed Classification — Why It Matters", level: 3 },
    { type: "paragraph", text: "The detailed classification of dangerous goods goes beyond just knowing the nine classes. Each class is subdivided into divisions, and each substance is assigned a specific UN number, proper shipping name, and packing group. This level of detail exists because different substances within the same class can have very different properties and require different handling. For example, Division 2.1 (flammable gas) and Division 2.3 (toxic gas) are both Class 2 gases, but their hazards and emergency responses are completely different." },
    { type: "paragraph", text: "The IATA CARGO IMP codes are three-letter abbreviations that appear on the NOTOC and in load messages. They allow crew and ground staff to quickly identify what dangerous goods are on board without reading lengthy proper shipping names. Understanding these codes is essential for cabin crew, as they will encounter them on the NOTOC and may need to reference them during an emergency." },
    { type: "callout", variant: "danger", title: "Critical Exception: Explosives", text: "Explosives (Class 1) are unique in that most divisions are FORBIDDEN for air transport entirely. Only Division 1.4S is permitted on passenger aircraft, and Divisions 1.3C and 1.3G are permitted on Cargo Aircraft Only (CAO). This is because the blast, fragmentation, and fire risks from explosives are too high for the pressurized cabin environment. If you see an explosive label in the passenger cabin, it is almost certainly a prohibited item." },
    { type: "paragraph", text: "The compatibility groups for explosives (letters B, C, D, E, G, S) indicate which explosives can be safely stored together. Explosives with different compatibility groups can react with each other, so they must be segregated. Division 1.4S is the only explosive allowed on passenger aircraft because it presents no significant hazard — items in this division are designed so that any accidental ignition does not propagate to other packages." },
  ],
  "lesson-2-12": [
    { type: "heading", text: "Dry Ice — A Common but Dangerous Cargo", level: 3 },
    { type: "paragraph", text: "Dry ice (solid carbon dioxide, UN 1845) is one of the most common dangerous goods on passenger aircraft. It is used extensively for cooling perishable goods, medical specimens, and catering supplies. While it may seem harmless, dry ice sublimates (turns directly from solid to gas) at a rate of approximately 2-3 kg per hour per 10 kg of dry ice. In a sealed cargo hold, this CO2 can displace oxygen, creating an asphyxiation hazard for anyone entering the compartment." },
    { type: "paragraph", text: "This is why the regulations limit dry ice to 200 kg per cargo hold and require that compartments be ventilated before anyone enters. It is also why live animals and dry ice must never be loaded in the same hold — the CO2 from sublimating dry ice can asphyxiate the animals. Cabin crew should be aware of dry ice loads because if a cargo hold fire or smoke indication occurs, the presence of dry ice may contribute to the situation." },
    { type: "table", caption: "Dry Ice Rules Summary", headers: ["Parameter", "Limit/Requirement", "Reason"], rows: [
      ["Maximum per hold", "200 kg", "Prevents excessive CO2 buildup"],
      ["Insulation", "Required between dry ice and aircraft structure", "Prevents cold burns to aircraft structure"],
      ["Ventilation", "Compartments must be ventilated before entering", "Prevents CO2 asphyxiation of ground/crew"],
      ["With live animals", "NEVER in same hold", "CO2 can asphyxiate animals"],
      ["NOTOC entry", "Required with net weight", "Crew must know quantity for emergency response"],
    ]},
  ],
  "lesson-3-4": [
    { type: "heading", text: "The Cabin Crew Incident Checklist in Detail", level: 3 },
    { type: "paragraph", text: "When a dangerous goods incident occurs in the passenger cabin, cabin crew must follow a specific sequence of actions. The checklist is designed to be executed from memory under stress, so it is structured in a logical flow: alert, identify, protect, contain, and report. Each step builds on the previous one, and skipping a step can compromise safety." },
    { type: "paragraph", text: "The first action is always to NOTIFY THE COMMANDER. The flight deck needs to know what's happening in the cabin because it may affect their decisions — they may need to initiate a diversion, descend to a safer altitude, or declare an emergency. Use the interphone or emergency communication system, and be clear and concise: 'Captain, we have a [describe situation] in the cabin at [location]. Request your advice/instructions.'" },
    { type: "list", ordered: true, items: [
      "NOTIFY THE COMMANDER immediately via interphone — be clear and specific",
      "IDENTIFY THE ITEM — check NOTOC for declared DG, check labels/markings, ask passenger",
      "In case of FIRE — use standard fire procedures but CHECK WATER COMPATIBILITY (some DG reacts with water)",
      "Determine the EMERGENCY RESPONSE DRILL CODE — use ICAO Emergency Response Guidance (Doc 9481)",
      "If the situation permits, notify ATC with UN/ID numbers from the NOTOC",
      "Consider LANDING AS SOON AS POSSIBLE if the situation is uncontrolled or escalating",
      "Turn on NO SMOKING signs (even though smoking is prohibited, this is a visual signal)",
      "Consider turning off non-essential electrical power near the incident",
    ]},
    { type: "callout", variant: "danger", title: "Spillage Response Sequence", text: "For spillage or leakage: 1) Put on rubber gloves and smoke hood/mask; 2) Move passengers away from the area; 3) Distribute wet towels/cloths to passengers for breathing protection; 4) Place the suspect item in polythene bags; 5) Stow sealed bags securely; 6) Treat affected seats and covers as contaminated; 7) Cover spillage on carpet; 8) Regularly inspect stowed items and contaminated areas." },
  ],
};

export function getDGRContentExpansion(lessonId: string): any[] {
  return dgrContentExpansion[lessonId] || [];
}
