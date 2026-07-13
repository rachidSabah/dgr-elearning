// CRM Manual Expansion — based on the 169-page Academy INFOHAS CRM Training Manual
// 10 chapters + final examination + 10 appendices
// This file adds DEEP, DETAILED content (500+ words per lesson) for CRM lessons
// mapped to the Academy INFOHAS professional CRM training manual chapters.
// Content is merged with the base lesson content at runtime.

export const crmManualExpansion: Record<string, any[]> = {
  // ============================================================================
  // CHAPTER 1 — INTRODUCTION TO CRM (crm-lesson-1-1 to 2-3)
  // ============================================================================

  "crm-lesson-1-1": [
    { type: "heading", text: "CRM Origins According to the Academy INFOHAS Manual", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS CRM training manual opens by tracing the discipline's origins to a single catastrophic event: the Tenerife disaster of 27 March 1977, when two Boeing 747 aircraft collided on the runway at Los Rodeos Airport, killing 583 people. The investigation concluded that the accident was not caused by a mechanical failure but by a breakdown in communication, leadership, and crew coordination. This watershed moment forced the aviation industry to confront a difficult truth: the technical reliability of modern aircraft had outpaced the human ability to operate them safely under pressure. The chapter emphasises that CRM was born not from theory but from the blood of passengers and crew, and that every CRM principle taught today can be traced back to a specific accident, a specific failure, a specific lesson learned." },
    { type: "paragraph", text: "Two years after Tenerife, in 1979, NASA convened a workshop titled 'Resource Management on the Flightdeck' that brought together aviation psychologists, airline training managers, and regulators. The workshop concluded that the dominant cause of aviation accidents was no longer technical failure but human factors — specifically failures of communication, teamwork, leadership, and decision-making. This workshop is universally credited as the birthplace of CRM. The Academy INFOHAS manual positions this moment as the moment aviation shifted from a 'pilot-as-hero' culture to a 'crew-as-system' culture, recognising that no single individual, however skilled, can manage every threat alone. The manual also traces the early adoption by United Airlines in 1981 and the subsequent spread of CRM to every major carrier worldwide." },
    { type: "callout", variant: "info", title: "ICAO Definition of CRM (Annex 6)", text: "Crew Resource Management is 'the effective utilisation of all resources by flight crew and cabin crew to achieve safe and efficient operations.' The Academy INFOHAS manual emphasises the word ALL — CRM is not only about people, but about procedures, equipment, information, and time. Cabin crew are explicitly named in the ICAO definition, confirming that CRM is not a flight-deck-only discipline." },
    { type: "table", caption: "The Six Generations of CRM (per Academy INFOHAS Manual)", headers: ["Generation", "Years", "Focus", "Key Concept"], rows: [
      ["1st", "1981–1985", "Cockpit Resource Management", "Psychological testing, captain's personality"],
      ["2nd", "1985–1989", "Team concept and LOFT", "Crew rather than individual; Line Oriented Flight Training"],
      ["3rd", "1989–1995", "Specialised CRM", "Tailored to specific roles and operations"],
      ["4th", "1995–2000", "Integration with procedures", "CRM embedded in SOPs and checklists"],
      ["5th", "2000–2010", "Error Management (TEM)", "Threat and Error Management integration"],
      ["6th", "2010–present", "Cultural and organisational CRM", "Just culture, resilience, data-driven"],
    ]},
    { type: "callout", variant: "warning", title: "CRM Is Not Optional", text: "The Academy INFOHAS manual states clearly that CRM is a regulatory requirement under ICAO Annex 6, EASA Regulation (EU) No 965/2012, and FAA AC 120-51. Cabin crew must receive CRM initial training before operating commercially and CRM recurrent training annually. Failure to complete CRM training invalidates a cabin crew member's licence to operate." },
    { type: "knowledgeCheck", question: "What event is universally recognised as the catalyst for the development of CRM?", options: ["United 232 (1989)", "Tenerife disaster (1977)", "US Airways 1549 (2009)", "Air Canada 797 (1983)"], correctAnswer: 1, explanation: "The 1977 Tenerife disaster, in which 583 people died, exposed the catastrophic consequences of communication and leadership failures, and led directly to the 1979 NASA workshop that founded CRM as a discipline." },
  ],

  "crm-lesson-1-2": [
    { type: "heading", text: "The Human Error Problem", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual devotes significant space to the statistics of human error in aviation. Industry studies, including Boeing's annual statistical summary and ICAO accident reports, consistently show that 70 to 80 percent of aviation accidents involve human factors as a primary or contributing cause. This is not because humans are inherently careless, but because aircraft and systems have become so reliable that the remaining failure modes are almost entirely human. Mechanical failures that once caused accidents have been engineered out through redundancy, monitoring, and improved design. What remains is the cognitive, social, and organisational dimension — exactly the territory CRM was created to address." },
    { type: "paragraph", text: "The manual is particularly emphatic about the role of cabin crew as safety-critical personnel. Cabin crew are not merely service staff — they are the only trained safety personnel in the cabin, often the first to detect an abnormal situation (smoke, unusual noise, suspicious behaviour, medical distress), and in many cases the only crew with direct visual access to the passenger cabin. The flight deck, by contrast, is sealed behind a reinforced door. Information from the cabin to the flight deck is therefore a critical safety input. The manual describes cabin crew as 'the eyes and ears of the aircraft' and frames every cabin crew action — even routine service — as a safety-relevant activity." },
    { type: "callout", variant: "danger", title: "The Shared Responsibility Model", text: "The Academy INFOHAS manual rejects the idea that safety is the captain's responsibility alone. Safety is shared across the entire crew: every cabin crew member has both the right and the obligation to speak up when something is unsafe. The most junior crew member may notice something the most senior missed. CRM creates the environment where this is expected and valued, not punished." },
    { type: "table", caption: "Shared Responsibility — Cabin Crew Safety Contributions", headers: ["Phase", "Cabin Crew Safety Contribution", "Flight Deck Reliance"], rows: [
      ["Boarding", "Identify suspicious items, intoxicated passengers, special needs", "Cabin secure confirmation"],
      ["Pre-departure", "Cabin secure check, exit row briefing, equipment verification", "Cabin secure for taxi/takeoff"],
      ["Cruise", "Detect smoke, unusual smells, abnormal noises, passenger distress", "Cabin condition reports"],
      ["Approach", "Cabin secure, galley secure, passenger compliance", "Cabin secure for landing"],
      ["Emergency", "Evacuation, firefighting, medical, crowd control", "Cabin status during evacuation decision"],
    ]},
    { type: "list", items: [
      "Cabin crew are the only trained safety personnel in the passenger cabin",
      "Cabin crew are typically the first to detect abnormal situations",
      "Cabin-to-flight-deck communication is a critical safety input",
      "Every cabin crew member has the obligation to speak up about safety concerns",
      "CRM training is mandatory and recurrent — it is not optional",
    ]},
    { type: "knowledgeCheck", question: "According to industry studies cited in the Academy INFOHAS manual, what percentage of aviation accidents involve human factors as a primary or contributing cause?", options: ["30 to 40 percent", "50 to 60 percent", "70 to 80 percent", "90 to 95 percent"], correctAnswer: 2, explanation: "The manual cites consistent industry data showing that 70-80% of aviation accidents involve human factors. As aircraft have become more reliable technically, the remaining failure modes are predominantly human, which is exactly what CRM addresses." },
  ],

  "crm-lesson-1-3": [
    { type: "heading", text: "Core CRM Principles from the Manual", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual identifies ten core CRM principles that underpin the entire discipline. These are not abstract concepts but operational guidelines that shape how cabin crew behave on every flight. The first principle is shared responsibility: safety belongs to everyone, not just the captain. The second is open communication: every crew member must be willing and able to speak up. The third is situational awareness: continuous awareness of what is happening, what it means, and what will happen next. The fourth is teamwork: the crew operates as a single coordinated unit, not as a collection of individuals. The fifth is decision-making: structured, deliberate decisions even under pressure." },
    { type: "paragraph", text: "The remaining five principles are leadership (the SCCM leads but does not dictate), workload management (maintaining optimal workload, neither overload nor underload), threat and error management (anticipating and managing threats before they become errors), fatigue management (recognising and reporting fatigue), and continuous learning (every flight is a learning opportunity). The manual emphasises that these principles are interdependent: you cannot have good decision-making without good situational awareness; you cannot have good situational awareness without managing fatigue; you cannot manage threats without open communication. CRM is a system, not a list." },
    { type: "callout", variant: "tip", title: "The Six Core CRM Skills", text: "The manual distils CRM into six core behavioural skills: communication, teamwork, leadership/followership, situational awareness, decision-making, and workload management. These are the skills assessed in CRM evaluations and the skills cabin crew should be consciously practising on every flight." },
    { type: "table", caption: "CRM Objectives Mapped to Cabin Operations", headers: ["CRM Objective", "Operational Manifestation", "How to Measure"], rows: [
      ["Reduce human-error accidents", "Fewer cabin-related incidents", "Safety reports, audits"],
      ["Improve crew coordination", "Smooth briefings, clear handovers", "Observation, peer feedback"],
      ["Optimise resource use", "Right crew member, right task", "Task allocation reviews"],
      ["Enhance communication", "Closed-loop comms, no ambiguity", "Communication audits"],
      ["Build safety culture", "Crew speak up without fear", "Just Culture surveys"],
    ]},
    { type: "list", items: [
      "Shared responsibility — safety belongs to everyone",
      "Open communication — every crew member can speak up",
      "Situational awareness — continuous awareness of the operation",
      "Teamwork — the crew is one coordinated unit",
      "Structured decision-making — deliberate, not reactive",
      "Adaptive leadership — the SCCM leads but listens",
      "Workload management — optimal, not overloaded",
      "Threat and error management — anticipate and trap",
      "Fatigue management — recognise and report",
      "Continuous learning — every flight teaches something",
    ]},
    { type: "knowledgeCheck", question: "Which of the following is NOT one of the six core CRM behavioural skills identified in the Academy INFOHAS manual?", options: ["Communication", "Situational awareness", "Aircraft technical knowledge", "Decision-making"], correctAnswer: 2, explanation: "The six core CRM behavioural skills are communication, teamwork, leadership/followership, situational awareness, decision-making, and workload management. Aircraft technical knowledge is a separate technical competency, not a CRM behavioural skill." },
  ],

  "crm-lesson-2-1": [
    { type: "heading", text: "Tenerife 1977 — The Catalyst", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual devotes an entire chapter section to the Tenerife disaster, treating it as the founding case study of CRM. On 27 March 1977, two Boeing 747s — a KLM aircraft commanded by Captain Jacob Veldhuyzen van Zanten and a Pan Am aircraft commanded by Captain Victor Grubbs — collided on the runway at Los Rodeos Airport in dense fog. The KLM aircraft had begun its takeoff roll without clearance; the Pan Am aircraft was still taxiing on the same runway, having missed its assigned exit. The collision killed 583 people, making it the deadliest accident in aviation history. The Dutch investigation concluded that the KLM captain took off without clearance, influenced by a combination of impatience, ambiguous radio communication, and a steep authority gradient that prevented his first officer from challenging the decision." },
    { type: "paragraph", text: "The 1979 NASA workshop, formally titled 'Resource Management on the Flightdeck,' was convened specifically in response to Tenerife and similar accidents. Aviation psychologists including John Lauber, Earl Wiener, and Robert Helmreich presented research showing that the dominant accident causes had shifted from technical to human factors. The workshop produced three landmark conclusions: first, that most aviation accidents involved crew coordination failures rather than individual incompetence; second, that traditional pilot training focused on technical skills but neglected the interpersonal and cognitive skills needed for crew operations; and third, that these skills could be taught and assessed. United Airlines became the first carrier to implement CRM training in 1981, originally calling it 'Cockpit Resource Management' before expanding the concept to cabin crew and renaming it 'Crew Resource Management.'" },
    { type: "callout", variant: "danger", title: "Key Human Factors Findings from Tenerife", text: "The Tenerife investigation identified: (1) a steep authority gradient that prevented the first officer from challenging the captain; (2) ambiguous communication — the phrase 'we are now at takeoff' was misinterpreted by ATC; (3) time pressure and impatience that biased the captain toward action; (4) confirmation bias — the captain heard what he expected to hear, not what was actually said; and (5) lack of structured cross-checking between crew members. Every one of these failure modes is now addressed directly by CRM training." },
    { type: "table", caption: "The Six Generations of CRM — Detailed Evolution", headers: ["Gen", "Era", "Key Characteristics", "Representative Programme"], rows: [
      ["1st", "1981–1985", "Personality-focused, individual psychological assessment", "United Airlines ACLS"],
      ["2nd", "1985–1989", "Team-building, LOFT simulation, full-crew exercises", "Delta CRM, Northwest CRM"],
      ["3rd", "1989–1995", "Role-specific modules, cockpit-cabin integration", "US Airways, Continental"],
      ["4th", "1995–2000", "Procedural integration, SOPs and checklists include CRM", "FAA AC 120-51C"],
      ["5th", "2000–2010", "Threat and Error Management (TEM) integration", "ICAO TEM framework"],
      ["6th", "2010–present", "Just culture, resilience, organisational integration", "EASA, SMS integration"],
    ]},
    { type: "knowledgeCheck", question: "Why was the original name 'Cockpit Resource Management' changed to 'Crew Resource Management'?", options: ["Because pilots preferred the new name", "Because the concept expanded to include cabin crew and other team members", "Because the FAA required the name change", "Because 'cockpit' was considered obsolete"], correctAnswer: 1, explanation: "The name changed from 'Cockpit' to 'Crew' Resource Management to reflect the expansion of CRM beyond the flight deck to include cabin crew, dispatchers, maintenance, and other operational team members. This shift recognised that safety is a team effort across the whole operation." },
  ],

  "crm-lesson-2-2": [
    { type: "heading", text: "The Six Generations of CRM", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents the six generations of CRM as a story of continuous refinement. Generation 1 (1981–1985), pioneered by United Airlines, focused on individual captain personality — the assumption was that accidents were caused by 'bad captains' with authoritarian personalities, and the solution was to identify and retrain them. This approach failed because it ignored the systemic nature of crew performance. Generation 2 (1985–1989) shifted to team-building and introduced Line Oriented Flight Training (LOFT), where full crews flew simulated line operations together. Generation 3 (1989–1995) introduced role-specific modules — separate CRM training for captains, first officers, and, importantly for the first time, cabin crew." },
    { type: "paragraph", text: "Generation 4 (1995–2000) was a major conceptual shift: CRM was no longer a separate training event but was integrated into standard operating procedures and checklists. Every SOP now included CRM behaviours. Generation 5 (2000–2010) integrated Threat and Error Management (TEM), the ICAO framework that reframed CRM as an operational tool for managing real threats and errors rather than a set of abstract interpersonal skills. Generation 6 (2010 to present) extends CRM into organisational culture, just culture, safety management systems (SMS), and resilience engineering. The manual emphasises that CRM is not finished — it continues to evolve as aviation itself evolves." },
    { type: "callout", variant: "info", title: "Generation 6 CRM (Today)", text: "Modern CRM (6th generation) is characterised by: integration with Safety Management Systems (SMS); a Just Culture framework that distinguishes honest errors from reckless behaviour; resilience engineering that builds crew capacity to recover from unexpected events; and data-driven training using flight operational quality assurance (FOQA) and line operations safety audit (LOSA) data to identify and address real-world CRM issues." },
    { type: "table", caption: "Generational Comparison — Focus and Methodology", headers: ["Generation", "Primary Focus", "Training Method", "Weakness"], rows: [
      ["1st", "Captain's personality", "Psychological testing", "Ignored team dynamics"],
      ["2nd", "Team building", "LOFT simulation", "Cabin crew excluded"],
      ["3rd", "Role-specific skills", "Module-based training", "Still separate from SOPs"],
      ["4th", "Procedural integration", "CRM in SOPs/checklists", "Could become checklist-driven"],
      ["5th", "Threat/Error Management", "TEM operational framework", "Risk of over-formalisation"],
      ["6th", "Culture and resilience", "Organisational, data-driven", "Requires sustained commitment"],
    ]},
    { type: "list", items: [
      "1981 — United Airlines launches first CRM programme",
      "1989 — First ICAO CRM guidance published",
      "1989 — United 232 accident validates CRM principles",
      "1995 — FAA AC 120-51C formalises CRM requirements",
      "2000s — TEM framework integrated into CRM",
      "2010s — Just Culture and SMS integration",
      "Today — Data-driven, evidence-based CRM training",
    ]},
    { type: "knowledgeCheck", question: "Which CRM generation introduced Line Oriented Flight Training (LOFT) and a focus on team-building rather than individual captain personality?", options: ["1st generation", "2nd generation", "3rd generation", "4th generation"], correctAnswer: 1, explanation: "The 2nd generation of CRM (1985-1989) shifted focus from individual captain personality to team-building, and introduced Line Oriented Flight Training (LOFT) where full crews flew simulated line operations together to develop team skills." },
  ],

  "crm-lesson-2-3": [
    { type: "heading", text: "Modern CRM and Future Directions", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual closes Chapter 1 with a forward-looking analysis of modern CRM. Today's CRM is anchored in three regulatory frameworks: ICAO Annex 6 Part I (international standard), EASA Regulation (EU) No 965/2012 (European standard), and FAA Advisory Circular 120-51 (US standard). Each of these frameworks requires CRM initial training before commercial operations, CRM recurrent training at defined intervals (typically annually for cabin crew), and CRM assessment as part of the operator's competency framework. The manual emphasises that CRM is no longer a 'soft' subject — it is a regulated, assessed, safety-critical competency on the same footing as technical training." },
    { type: "paragraph", text: "The future of CRM, according to the manual, will be shaped by four trends. First, the integration of CRM with Safety Management Systems (SMS) means CRM data (errors, threats, recoveries) is fed back into organisational safety analysis. Second, data-driven training uses Line Operations Safety Audit (LOSA) and Flight Operational Quality Assurance (FOQA) data to identify the actual CRM issues crews face, rather than assumed issues. Third, automation and artificial intelligence are changing the role of the human — crews must now manage systems rather than operate them, requiring new CRM skills for monitoring and intervention. Fourth, the increasing diversity of cabin crews (cultural, generational, linguistic) requires CRM to address cross-cultural communication more explicitly than ever before." },
    { type: "callout", variant: "tip", title: "Continuous Learning", text: "The manual emphasises that CRM is a 'career-long competency.' Even the most experienced cabin crew members must complete annual recurrent CRM training, and every operator is required to update its CRM programme based on its own operational experience. CRM is never 'finished' — it evolves with the operation." },
    { type: "table", caption: "Regulatory Framework Comparison", headers: ["Framework", "Jurisdiction", "Initial Training", "Recurrent Training"], rows: [
      ["ICAO Annex 6", "International", "Before commercial ops", "Periodic (operator-defined)"],
      ["EASA Reg. (EU) 965/2012", "European Union", "Before commercial ops", "Annual for cabin crew"],
      ["FAA AC 120-51", "United States", "Before commercial ops", "Annual or as specified"],
      ["CAA CAP 737", "United Kingdom", "Before commercial ops", "Annual"],
    ]},
    { type: "list", items: [
      "Integration of CRM with Safety Management Systems (SMS)",
      "Data-driven training using LOSA and FOQA data",
      "New CRM skills for managing automation and AI",
      "Cross-cultural communication in diverse crews",
      "Just Culture and non-punitive error reporting",
      "Resilience engineering — building recovery capacity",
      "CRM for single-cabin-crew operations (small aircraft)",
      "Extended-range and long-haul fatigue-specific CRM",
    ]},
    { type: "knowledgeCheck", question: "Under EASA Regulation (EU) No 965/2012, how often must cabin crew complete CRM recurrent training?", options: ["Every 6 months", "Annually", "Every 2 years", "Every 3 years"], correctAnswer: 1, explanation: "EASA Regulation (EU) No 965/2012 requires cabin crew to complete CRM recurrent training annually. This is a regulatory requirement, not an operator choice, and failure to complete recurrent CRM training invalidates the crew member's qualification to operate." },
  ],

  // ============================================================================
  // CHAPTER 2 — HUMAN FACTORS (crm-lesson-3-1 to 3-3)
  // ============================================================================

  "crm-lesson-3-1": [
    { type: "heading", text: "Defining Human Factors in Aviation", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual defines Human Factors as 'the interdisciplinary field that studies how humans interact with systems, equipment, procedures, other people, and the environment, with the goal of optimising both human wellbeing and overall system performance.' In aviation, Human Factors addresses the question: how do we design work so that fallible humans operating in complex environments can perform reliably? The chapter makes clear that Human Factors is not about blaming humans for errors — it is about understanding why errors occur and redesigning the system to prevent them or mitigate their effects. ICAO Circular 227 describes Human Factors as 'about people in their working and living environments, their relationship with machines, procedures, and with each other.'" },
    { type: "paragraph", text: "For cabin crew, Human Factors is the foundation of every CRM skill. The cabin environment is uniquely challenging: confined space, low ambient pressure (equivalent to 8,000 feet altitude), noise levels of 80-90 decibels, dry air, time-zone disruption, demanding passengers, emergency equipment that must be operated under stress, and a team that may have been assembled for the first time that morning. The manual lists the key Human Factors contributors whose work shapes CRM: James Reason (Swiss Cheese Model of accident causation), Frank Hawkins (SHELL Model), Gordon Dupont (Dirty Dozen), Mica Endsley (Situational Awareness model), and Robert Helmreich (crew resource management research). Each of these thinkers is given dedicated treatment in subsequent chapters." },
    { type: "callout", variant: "info", title: "Human Factors Is a Systems Approach", text: "The manual emphasises that Human Factors takes a systems perspective: it does not ask 'who made the error?' but 'what system conditions allowed or encouraged the error?' This shift from individual blame to system design is the foundation of a Just Culture and underpins all modern CRM practice." },
    { type: "table", caption: "Human Factors Disciplines and Cabin Crew Application", headers: ["Discipline", "Focus", "Cabin Crew Application"], rows: [
      ["Ergonomics", "Physical human-machine interface", "Galley design, seat layout, equipment access"],
      ["Cognitive psychology", "Mental processes — perception, attention, memory", "Checklist design, alarm recognition, decision aids"],
      ["Social psychology", "Group behaviour, leadership, culture", "Crew coordination, authority gradient, Just Culture"],
      ["Physiology", "Human body and its limitations", "Fatigue, hypoxia, circadian rhythms, decompression"],
      ["Organisational psychology", "Organisation-individual interface", "Reporting culture, training, leadership"],
    ]},
    { type: "list", items: [
      "James Reason — Swiss Cheese Model of accident causation",
      "Frank Hawkins — SHELL Model of human-system interaction",
      "Gordon Dupont — The Dirty Dozen causes of human error",
      "Mica Endsley — Three-level model of situational awareness",
      "Robert Helmreich — Crew Resource Management research",
      "Daniel Goleman — Emotional intelligence and leadership styles",
      "Bruce Tuckman — Team development stages (forming, storming, norming, performing)",
      "Geert Hofstede — Cultural dimensions in multicultural crews",
    ]},
    { type: "knowledgeCheck", question: "What is the fundamental question that Human Factors asks when investigating an error, according to the Academy INFOHAS manual?", options: ["Who made the error?", "What system conditions allowed or encouraged the error?", "How can the individual be punished?", "Was the individual properly trained?"], correctAnswer: 1, explanation: "Human Factors takes a systems approach: rather than asking 'who made the error?', it asks 'what system conditions allowed or encouraged the error?' This shift from individual blame to system design is the foundation of a Just Culture and modern CRM practice." },
  ],

  "crm-lesson-3-2": [
    { type: "heading", text: "The SHELL Model by Frank Hawkins", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents the SHELL Model, originally proposed by Edwards in 1972 and refined by Frank Hawkins in 1987, as the central conceptual framework for understanding Human Factors in aviation. The model places the human — Liveware — at the centre, surrounded by four components: Software (procedures, manuals, checklists, SOPs), Hardware (equipment, aircraft systems, tools), Environment (physical and operational conditions), and Liveware (other people in the system). The interfaces between these components are the critical points where Human Factors problems occur. A mismatch at any interface can lead to error, inefficiency, or accident." },
    { type: "paragraph", text: "For cabin crew, every interface in the SHELL Model has practical implications. The Liveware-Software interface (crew and procedures): are checklists clear, are SOPs realistic under operational pressure? The Liveware-Hardware interface (crew and equipment): can the interphone be heard above cabin noise, can the fire extinguisher be operated with gloves on, are emergency exits mechanically reliable? The Liveware-Environment interface (crew and environment): does cabin noise mask announcements, does low humidity affect crew alertness, does turbulence prevent safe movement? The Liveware-Liveware interface (crew and other people): does the authority gradient permit junior crew to speak up, do cultural differences create misunderstandings, does the team communicate effectively? The manual also introduces the PEAR Model (People, Environment, Actions, Resources) as a complementary framework for analysing Human Factors in specific situations." },
    { type: "callout", variant: "warning", title: "Where SHELL Interfaces Fail", text: "The manual highlights that most aviation incidents involve failures at SHELL interfaces, not failures of individual components. A perfectly trained crew member (good Liveware) using perfectly designed equipment (good Hardware) under perfectly written procedures (good Software) can still fail if the interfaces between them are mismatched. CRM training specifically addresses the Liveware-Liveware interface, while other training addresses the other interfaces." },
    { type: "table", caption: "SHELL Model Applied to Cabin Crew Operations", headers: ["Component", "Description", "Cabin Crew Example", "Interface Risk"], rows: [
      ["Software (S)", "Procedures, manuals, checklists, SOPs", "Emergency evacuation checklist, service flow", "Unclear wording, unrealistic under pressure"],
      ["Hardware (H)", "Equipment, aircraft systems, tools", "Interphone, PA, galley, exits, oxygen", "Controls hard to operate, audible alarms masked"],
      ["Environment (E)", "Physical and operational environment", "Cabin pressure, noise, turbulence, lighting", "Fatigue, sensory impairment, distraction"],
      ["Liveware-Self (L)", "The individual crew member", "Physical state, fatigue, stress, training", "Fatigue, overload, knowledge gaps"],
      ["Liveware-Others (L)", "Other people in the system", "Fellow crew, passengers, flight deck", "Communication failure, authority gradient"],
    ]},
    { type: "list", items: [
      "PEAR Model — People: who is involved and their capabilities",
      "PEAR Model — Environment: physical and operational conditions",
      "PEAR Model — Actions: what is being done and how",
      "PEAR Model — Resources: what is available to support the action",
      "Use SHELL for structural analysis of system interfaces",
      "Use PEAR for real-time assessment of operational situations",
    ]},
    { type: "knowledgeCheck", question: "In the SHELL Model, what does the 'Software' component refer to?", options: ["Computer software and avionics", "Procedures, manuals, checklists, and SOPs", "Crew training materials", "Maintenance documentation"], correctAnswer: 1, explanation: "In the SHELL Model, 'Software' refers to procedures, manuals, checklists, and SOPs — the non-physical 'rules' that govern how work is done. It is distinct from 'Hardware' (physical equipment) and 'Liveware' (people)." },
  ],

  "crm-lesson-3-3": [
    { type: "heading", text: "The Dirty Dozen by Gordon Dupont", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents Gordon Dupont's Dirty Dozen — twelve conditions that predispose humans to make errors — as a practical tool for cabin crew self-assessment. Developed in 1993 for aviation maintenance, the Dirty Dozen has since been applied across aviation operations including cabin crew. The twelve factors are: lack of communication, complacency, lack of knowledge, distraction, lack of teamwork, fatigue, lack of resources, pressure, lack of assertiveness, stress, lack of awareness, and norms. The manual argues that almost every cabin crew error can be traced back to one or more of these twelve conditions, and that simply being aware of which Dirty Dozen factors are active at any moment is a powerful error-prevention strategy." },
    { type: "paragraph", text: "The chapter then presents James Reason's Swiss Cheese Model, which explains how organisations defend against errors through multiple layers of protection (the 'cheese slices'), each with holes (weaknesses). An accident occurs only when the holes in all layers align — allowing a hazard to pass through every defence. No single layer is expected to be perfect; the system is designed so that any one layer catching the hazard prevents the accident. Reason's insight is that breaking any single link in the chain prevents the accident — cabin crew are one of those defensive layers, and CRM training is what keeps their 'holes' small. The chapter closes with the Human Error Chain concept: errors typically cascade, and breaking any link prevents the cascade." },
    { type: "callout", variant: "danger", title: "The Human Error Chain", text: "Aviation accidents rarely result from a single error. They almost always involve a chain of errors where each one enables the next. Breaking ANY link in the chain prevents the accident. This is why CRM emphasises detection and trapping of errors at every stage — you do not need to prevent every error, you need to catch them before they cascade." },
    { type: "table", caption: "The Dirty Dozen with Cabin Crew Examples", headers: ["#", "Factor", "Cabin Crew Example", "Countermeasure"], rows: [
      ["1", "Lack of communication", "Not briefing crew about a special needs passenger", "Pre-flight briefings, closed-loop comms"],
      ["2", "Complacency", "Skipping checks on a familiar aircraft", "Treat every check as if first time"],
      ["3", "Lack of knowledge", "Not knowing new equipment procedure", "Continuous training, ask questions"],
      ["4", "Distraction", "Passenger interrupts cabin secure check", "Pause, refocus, complete task"],
      ["5", "Lack of teamwork", "Crew member not helping during boarding", "Mutual support, role clarity"],
      ["6", "Fatigue", "Day 4 of long-haul trip, slow reactions", "Strategic rest, report fatigue"],
      ["7", "Lack of resources", "Medical kit not stocked as expected", "Pre-flight check, request supplies"],
      ["8", "Pressure", "On-time departure pressure rushes checks", "Safety first, communicate delay"],
      ["9", "Lack of assertiveness", "Junior crew doesn't speak up about safety", "PACE model, Just Culture"],
      ["10", "Stress", "Personal stress affects performance", "Peer support, employee assistance"],
      ["11", "Lack of awareness", "Not noticing cabin condition change", "Continuous SA, scan patterns"],
      ["12", "Norms", "We always skip this step", "Follow SOPs, challenge bad norms"],
    ]},
    { type: "list", items: [
      "Identify which Dirty Dozen factors are active — name them",
      "Apply the corresponding countermeasure consciously",
      "Break the error chain at the earliest possible link",
      "Use the Swiss Cheese Model — be the layer that catches the hazard",
      "Report near-misses — every near-miss is a Swiss Cheese hole identified",
      "Practise self-assessment: 'Am I fatigued, distracted, pressured right now?'",
    ]},
    { type: "knowledgeCheck", question: "According to James Reason's Swiss Cheese Model, when does an accident occur?", options: ["When the first defence fails", "When all defensive layers have aligned holes", "When there are no defensive layers", "When the captain makes an error"], correctAnswer: 1, explanation: "Reason's Swiss Cheese Model states that an accident occurs only when the holes (weaknesses) in all defensive layers align, allowing a hazard to pass through every defence. No single layer is expected to be perfect — the system relies on multiple layers so that any one catching the hazard prevents the accident." },
  ],

  // ============================================================================
  // CHAPTER 3 — COMMUNICATION (crm-lesson-4-1 to 4-3)
  // ============================================================================

  "crm-lesson-4-1": [
    { type: "heading", text: "The Communication Cycle", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents communication as a structured cycle, not a one-way transmission. The cycle has five elements: a sender who encodes a message, the message itself, the channel through which it travels, a receiver who decodes it, and feedback that confirms understanding. Each element is a potential failure point. The sender may encode ambiguously ('get the thing' instead of 'get the BCF fire extinguisher'); the channel may be noisy or interrupted (cabin noise masking an interphone call); the receiver may decode differently based on context or experience; and feedback may be missing or incomplete. The manual emphasises that communication is only complete when the receiver's understanding matches the sender's intent — verified through feedback." },
    { type: "paragraph", text: "The cabin environment creates unique communication barriers. Cabin noise during flight reaches 80 to 90 decibels — comparable to a loud lawnmower — making spoken communication difficult without amplification. Physical separation means crew may be 30 metres apart in a wide-body cabin, out of sight and out of earshot. Time pressure during boarding, turbulence, or emergencies compresses communication into rushed fragments. Cultural and language differences among both crew and passengers create misunderstanding risk. Stress and emergencies cause auditory exclusion — the brain literally stops processing sound under extreme stress. The manual insists that closed-loop communication is the single most powerful countermeasure to all these barriers, and should be the default communication mode for any safety-critical information." },
    { type: "callout", variant: "warning", title: "Common Communication Barriers in the Cabin", text: "The manual lists the most frequent barriers as: noise (80-90 dB cabin), physical distance, time pressure, stress/emergency effects (auditory exclusion, tunnel vision), cultural and language differences, and authority gradient (junior crew hesitant to speak up). Each barrier has a specific CRM countermeasure — closed-loop communication, standard phraseology, PACE assertiveness, and Just Culture." },
    { type: "table", caption: "Communication Barriers and CRM Countermeasures", headers: ["Barrier", "Effect on Communication", "CRM Countermeasure"], rows: [
      ["Cabin noise (80-90 dB)", "Messages not heard or misheard", "Closed-loop comms, interphone, clear enunciation"],
      ["Physical distance", "Cannot see or hear fellow crew", "Interphone checks, PA, position reports"],
      ["Time pressure", "Rushed, incomplete communication", "Briefings, standard phraseology, prioritise"],
      ["Stress/emergency", "Tunnel vision, auditory exclusion", "Training, SOPs, checklists, designated roles"],
      ["Cultural differences", "Misunderstandings, offense", "Standard phraseology, cultural awareness training"],
      ["Authority gradient", "Junior crew don't speak up", "PACE model, Just Culture, flatten gradient"],
      ["Language differences", "Misinterpretation, ambiguity", "Aviation English, standard phraseology"],
      ["Fatigue", "Slower processing, missed cues", "Confirm and verify, cross-check"],
    ]},
    { type: "list", items: [
      "Step 1 — Sender transmits a clear, concise message using standard phraseology",
      "Step 2 — Receiver acknowledges by reading back the message in full",
      "Step 3 — Sender confirms the readback was correct, or corrects it",
      "Use closed-loop communication for ALL safety-critical information",
      "If no readback is received, repeat the message — never assume it was heard",
      "If the readback is incorrect, correct immediately — never let it stand",
      "Closed-loop communication catches approximately 95% of communication errors",
    ]},
    { type: "knowledgeCheck", question: "What is closed-loop communication, and why is it the most powerful CRM communication tool?", options: ["A communication method using radios", "A three-step process of transmit, readback, confirm that catches 95% of errors", "A way to end conversations", "A formal communication protocol for the flight deck only"], correctAnswer: 1, explanation: "Closed-loop communication is a three-step process: the sender transmits a message, the receiver acknowledges by reading back the message, and the sender confirms the readback was correct. This process catches approximately 95% of communication errors before they can affect safety, making it the most powerful CRM communication tool." },
  ],

  "crm-lesson-4-2": [
    { type: "heading", text: "Closed-Loop Communication and the PACE Model", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual devotes detailed treatment to closed-loop communication as the operational standard for cabin crew. The process is: the sender transmits a clear, concise message using standard phraseology ('Galley 1, this is Senior Crew, please bring the medical kit to row 23.'); the receiver acknowledges by reading back the message ('Senior Crew, this is Galley 1, bringing medical kit to row 23, copy.'); and the sender confirms the readback was correct ('Galley 1, Senior Crew, confirmed.'). This three-step process catches errors at multiple points — the receiver may have misheard, the readback makes the misunderstanding visible, and the sender's confirmation closes the loop. The manual is emphatic that closed-loop communication is not optional for safety-critical information — it is the standard." },
    { type: "paragraph", text: "The PACE model (Probe, Alert, Challenge, Emergency) is the manual's recommended tool for assertive communication when initial communication has not been effective — particularly when a junior crew member needs to raise a safety concern with a more senior colleague. Probe: ask a question to draw attention to the concern ('Have you noticed the smell in the cabin?'). Alert: state the concern clearly and directly ('I think there is smoke coming from the galley.'). Challenge: demand action in stronger terms ('We need to investigate this now, before it gets worse.'). Emergency: take overriding action if necessary, even if it means bypassing the senior ('I am calling the flight deck now.'). PACE is designed to escalate assertiveness progressively while preserving professional respect." },
    { type: "callout", variant: "tip", title: "PACE Acronym Breakdown", text: "P — Probe: ask a question to draw attention. A — Alert: state the concern directly and clearly. C — Challenge: demand action in stronger terms. E — Emergency: take overriding action if necessary. PACE escalates assertiveness progressively, allowing the receiver multiple opportunities to respond before the highest level of intervention." },
    { type: "table", caption: "Verbal vs Non-Verbal Communication in the Cabin", headers: ["Aspect", "Verbal Communication", "Non-Verbal Communication"], rows: [
      ["Content", "Words spoken (7% of message impact)", "Tone, body language, facial expression (93%)"],
      ["Channel", "Voice, interphone, PA", "Gestures, eye contact, posture, touch"],
      ["Strength", "Precise, can be recorded", "Immediate, intuitive, emotional"],
      ["Risk", "Misheard, misinterpreted", "Misread, culturally variable"],
      ["Cabin use", "Briefings, announcements, interphone", "Eye contact during briefing, hand signals"],
      ["Stress effect", "Auditory exclusion can mask verbal", "Tunnel vision can miss non-verbal cues"],
    ]},
    { type: "list", items: [
      "Probe — 'Have you noticed the smell near seat 23A?'",
      "Alert — 'There is smoke coming from the overhead panel at row 23.'",
      "Challenge — 'We need to investigate this immediately, before it gets worse.'",
      "Emergency — 'I am calling the flight deck now; please get the BCF extinguisher.'",
      "Use PACE when initial communication has not produced a response",
      "Each step escalates assertiveness while preserving professional respect",
      "PACE is designed for junior-to-senior communication under a steep authority gradient",
    ]},
    { type: "knowledgeCheck", question: "In the PACE model, what is the purpose of the 'Probe' step?", options: ["To challenge the senior crew member", "To take overriding action", "To draw attention to a concern by asking a question", "To formally report the issue"], correctAnswer: 2, explanation: "The 'Probe' step in the PACE model is to ask a question that draws attention to the concern without confrontation — for example, 'Have you noticed the smell near seat 23A?' This allows the receiver to recognise and respond to the concern before more assertive steps are needed." },
  ],

  "crm-lesson-4-3": [
    { type: "heading", text: "Active Listening and Cross-Cultural Communication", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual treats active listening as a learned skill, not a natural ability. Active listening means giving full attention to the speaker, suspending judgement, reflecting back what was heard, asking clarifying questions, and responding thoughtfully. The manual identifies specific barriers to active listening: rehearsing your response while the other person is still speaking, filtering (hearing only what you expect to hear), advising before understanding, judging prematurely, and distraction from the environment. Cabin crew face all of these barriers in the noisy, time-pressured cabin environment. The countermeasure is structured listening: stop other tasks, make eye contact, paraphrase what was said, and ask 'is that correct?' before responding." },
    { type: "paragraph", text: "Cross-cultural communication receives dedicated treatment because modern cabin crews are typically multinational and serve passengers from every continent. The manual draws on Geert Hofstede's cultural dimensions — power distance, individualism vs collectivism, masculinity vs femininity, uncertainty avoidance, long-term orientation, and indulgence vs restraint — to explain why the same message can be received differently by crew from different cultures. A crew member from a high power-distance culture may be reluctant to challenge a senior; a crew member from a low-context culture expects direct communication; a crew member from a collectivist culture may defer to group consensus. CRM training must explicitly address these differences, providing common communication standards (standard phraseology, English as the operational language) while respecting cultural variation." },
    { type: "callout", variant: "info", title: "Hofstede's Cultural Dimensions", text: "Power distance: how much inequality is accepted. Individualism vs collectivism: priority of self vs group. Uncertainty avoidance: tolerance for ambiguity. These dimensions explain why crew from different cultures may interpret the same communication differently, and why standard phraseology and explicit communication norms are essential in multinational crews." },
    { type: "table", caption: "Listening Barriers and Countermeasures", headers: ["Barrier", "Description", "Countermeasure"], rows: [
      ["Rehearsing", "Forming your response while other speaks", "Wait until speaker finishes, then think"],
      ["Filtering", "Hearing only what you expect", "Listen for content that surprises you"],
      ["Advising", "Giving solutions before understanding", "Ask 'what would help most?'"],
      ["Judging", "Evaluating prematurely", "Suspend judgement, seek to understand"],
      ["Mind reading", "Assuming you know what they think", "Ask explicitly, do not assume"],
      ["Daydreaming", "Mind wandering to other topics", "Make eye contact, take notes"],
    ]},
    { type: "list", items: [
      "Use standard phraseology — the same words mean the same things to all crew",
      "Speak slowly and clearly — slower than you think is necessary",
      "Confirm understanding with readback — never assume",
      "Be aware of cultural differences in directness and hierarchy",
      "Avoid idioms, slang, and culture-specific references",
      "Use simple sentence structure — subject, verb, object",
      "When in doubt, ask — better to ask twice than misunderstand once",
      "Respect cultural variation in non-verbal communication (eye contact, touch, gesture)",
    ]},
    { type: "knowledgeCheck", question: "Why does the Academy INFOHAS manual recommend standard phraseology for communication in multinational cabin crews?", options: ["Because it sounds more professional", "Because the same words mean the same things to all crew regardless of cultural background", "Because regulators require it", "Because it is faster"], correctAnswer: 1, explanation: "Standard phraseology ensures that the same words mean the same things to all crew members regardless of cultural or linguistic background. In multinational crews with different communication norms and expectations, standard phraseology provides a common communication baseline that reduces misunderstanding." },
  ],

  // ============================================================================
  // CHAPTER 4 — TEAMWORK (crm-lesson-5-1 to 5-3)
  // ============================================================================

  "crm-lesson-5-1": [
    { type: "heading", text: "The Teamwork Pyramid", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents the Teamwork Pyramid as the conceptual model for understanding high-performing cabin crews. The pyramid has four levels, built from the base up: Goals (shared objectives), Roles (clear responsibilities), Processes (how the team works together), and Relationships (trust and mutual support). The pyramid's order is significant — a team cannot have effective relationships without effective processes, cannot have effective processes without clear roles, and cannot have clear roles without shared goals. When cabin crew teams underperform, the manual recommends diagnosing the problem by working down from the apex: are relationships strained? Then check processes. Are processes failing? Then check roles. Are roles unclear? Then check goals." },
    { type: "paragraph", text: "The chapter also integrates Bruce Tuckman's team development model: Forming (team meets, polite, uncertain), Storming (conflict emerges as roles are negotiated), Norming (agreements reached, cohesion develops), Performing (team operates effectively), and Adjourning (team disbands after the task). Cabin crew teams are unusual in that they form, develop, perform, and disband within a single duty period — sometimes within a few hours. This compressed team lifecycle requires explicit attention to the forming stage (pre-flight briefing is critical), rapid navigation of storming (conflict resolution skills), and conscious effort to reach performing as quickly as possible. The manual emphasises that the SCCM's briefing is the single most important factor in accelerating team development." },
    { type: "callout", variant: "tip", title: "Tuckman's Stages of Team Development", text: "Forming (polite, uncertain) → Storming (conflict, role negotiation) → Norming (agreements, cohesion) → Performing (effective operation) → Adjourning (disband). Cabin crew teams pass through all stages within a single duty period — the pre-flight briefing accelerates forming and norming." },
    { type: "table", caption: "The Teamwork Pyramid — Levels and Diagnostics", headers: ["Level", "Description", "Cabin Crew Example", "Failure Symptom"], rows: [
      ["Goals (base)", "Shared objectives", "Safe, efficient, passenger-friendly flight", "Crew working at cross-purposes"],
      ["Roles", "Clear responsibilities", "Each crew knows their position and tasks", "Tasks missed or duplicated"],
      ["Processes", "How the team works", "Briefings, handovers, communication norms", "Confusion, miscommunication"],
      ["Relationships (apex)", "Trust and mutual support", "Crew help each other, speak up freely", "Conflict, withholding information"],
    ]},
    { type: "list", items: [
      "Forming — team meets for the first time, polite, uncertain about each other",
      "Storming — conflict emerges as roles and expectations are negotiated",
      "Norming — agreements reached, cohesion develops, team identity forms",
      "Performing — team operates effectively, focused on the task",
      "Adjourning — team disbands after the task is complete",
      "Cabin crew teams pass through all stages within a single duty period",
      "Pre-flight briefing accelerates forming and norming",
      "SCCM leadership is critical in moving quickly to performing",
    ]},
    { type: "knowledgeCheck", question: "According to the Teamwork Pyramid, which level must be established before relationships can develop effectively?", options: ["Goals", "Roles", "Processes", "All lower levels must be in place first"], correctAnswer: 3, explanation: "The Teamwork Pyramid is built from the base up: Goals support Roles, Roles support Processes, and Processes support Relationships. All lower levels must be in place before the apex (Relationships) can develop effectively. Diagnosing team problems requires working down from the apex to find the failing foundation." },
  ],

  "crm-lesson-5-2": [
    { type: "heading", text: "Cabin Crew Team Roles", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual defines the cabin crew team as a structured hierarchy with specific roles. The SCCM (Senior Cabin Crew Member, also called CSD or CS depending on operator) is the team leader, responsible for overall cabin safety, crew coordination, and flight deck liaison. Senior cabin crew (sometimes called Pursers) lead cabin zones or specific functions (galley, service, etc.) and report to the SCCM. Cabin crew members operate at assigned positions (doors, zones, galleys) and report to their senior or directly to the SCCM depending on operator structure. Each role has clearly defined responsibilities specified in the operator's Operations Manual, and role clarity is essential for effective team performance." },
    { type: "paragraph", text: "The manual also draws on Belbin's team role theory to explain that beyond formal positions, individuals bring natural team-role preferences: implementer (turns ideas into action), coordinator (chairs and delegates), shaper (drives action), plant (creative ideas), resource investigator (explores opportunities), monitor-evaluator (analytical), teamworker (builds cohesion), completer-finisher (ensures quality), and specialist (technical expertise). A high-performing cabin crew typically has a balance of these roles, and the SCCM should recognise and leverage each crew member's natural strengths. Role ambiguity — when crew are uncertain about who is responsible for what — is a leading cause of cabin incidents, and the manual recommends explicit role assignment in every pre-flight briefing." },
    { type: "callout", variant: "info", title: "Belbin's Team Roles in Cabin Crew Context", text: "Belbin identified nine team roles that individuals naturally assume. The SCCM's job is to recognise these natural preferences and balance the team accordingly. A crew full of 'shapers' will be energetic but conflict-prone; a crew full of 'teamworkers' will be harmonious but lack drive. The best teams have a mix." },
    { type: "table", caption: "Cabin Crew Roles and Responsibilities", headers: ["Role", "Primary Responsibility", "Reports To", "Key CRM Behaviours"], rows: [
      ["SCCM/CSD", "Overall cabin safety, crew coordination, flight deck liaison", "Captain", "Leadership, communication, decision-making"],
      ["Senior/Purser", "Zone or function leadership, crew supervision", "SCCM", "Coordination, support, monitoring"],
      ["Cabin Crew Member", "Position operation, passenger service, safety duties", "Senior or SCCM", "Teamwork, communication, SA"],
      ["Galley Operator", "Galley safety, food service, equipment management", "Senior or SCCM", "Resource management, safety"],
      ["Door Crew", "Door operation, evacuation, passenger management", "Senior or SCCM", "Procedure compliance, SA"],
    ]},
    { type: "list", items: [
      "Every crew member knows their position and primary responsibilities",
      "Backup roles are assigned in case a crew member is incapacitated",
      "Communication paths are clear — who reports to whom",
      "Special responsibilities (medical, security, languages) are explicitly assigned",
      "Cross-checking responsibilities are defined (each critical task has a checker)",
      "The SCCM is always identified to the crew and to the flight deck",
      "Roles are reviewed and adjusted in the pre-flight briefing as needed",
    ]},
    { type: "knowledgeCheck", question: "What is the primary responsibility of the SCCM (Senior Cabin Crew Member)?", options: ["Passenger service", "Galley operations", "Overall cabin safety, crew coordination, and flight deck liaison", "Door operation during evacuation"], correctAnswer: 2, explanation: "The SCCM is the team leader responsible for overall cabin safety, crew coordination, and flight deck liaison. While passenger service and door operation are important, the SCCM's primary role is leadership of the cabin crew team and coordination with the flight deck, not direct execution of cabin tasks." },
  ],

  "crm-lesson-5-3": [
    { type: "heading", text: "Trust, Mutual Support, and Conflict", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual identifies trust as the foundation of effective cabin crew teamwork. Trust is built through consistent behaviour, competent performance, open communication, and mutual respect. It is fragile — a single betrayal (a colleague who gossips, a leader who punishes honest reporting) can erode trust that took months to build. The manual recommends specific trust-building behaviours: do what you say you will do, admit mistakes openly, share information freely, support colleagues publicly and challenge them privately, and never throw a colleague under the bus — to passengers, to other crew, or to management. Trust enables the open communication that CRM depends on; without trust, crew withhold information, fail to speak up, and errors cascade." },
    { type: "paragraph", text: "Mutual support is the operational expression of trust. The manual describes specific mutual support behaviours: monitoring colleagues for signs of overload or fatigue, offering to take tasks when a colleague is struggling, providing backup on safety-critical tasks, sharing information that affects the team, and offering constructive feedback. Conflict is inevitable in any team, and the manual draws on the Thomas-Kilmann Conflict Mode Instrument to describe five conflict-handling modes: competing (assertive, uncooperative), collaborating (assertive, cooperative), compromising (moderate on both), avoiding (unassertive, uncooperative), and accommodating (unassertive, cooperative). Different modes are appropriate for different situations — collaborating is ideal when time allows and the relationship matters, while compromising may be appropriate for quick resolutions during operations." },
    { type: "callout", variant: "warning", title: "Conflict in Cabin Crew Teams", text: "Unresolved conflict damages team performance and safety. Common sources include workload imbalance, perceived unfairness, communication style differences, and cultural misunderstandings. The SCCM is responsible for addressing conflict promptly — typically through private conversation, active listening, and collaborative problem-solving. Conflicts that cannot be resolved at SCCM level should be escalated to the inflight manager or crew report system." },
    { type: "table", caption: "Thomas-Kilmann Conflict Modes — When to Use Each", headers: ["Mode", "Assertiveness", "Cooperativeness", "When to Use"], rows: [
      ["Competing", "High", "Low", "Emergencies, safety-critical decisions, when right"],
      ["Collaborating", "High", "High", "Complex issues, relationship matters, time available"],
      ["Compromising", "Moderate", "Moderate", "Quick resolution, moderate importance"],
      ["Avoiding", "Low", "Low", "Trivial issues, need time to cool down"],
      ["Accommodating", "Low", "High", "You are wrong, build goodwill, preserve harmony"],
    ]},
    { type: "list", items: [
      "Monitor colleagues for signs of overload — offer to take a task",
      "Provide backup on safety-critical tasks — cross-check each other",
      "Share information that affects the team — no hoarding",
      "Offer constructive feedback — private, specific, actionable",
      "Support colleagues publicly — never criticise in front of passengers",
      "Address conflict promptly — do not let it fester",
      "Use the appropriate conflict mode for the situation",
      "Escalate unresolvable conflicts to the SCCM and then to management",
    ]},
    { type: "knowledgeCheck", question: "According to the Thomas-Kilmann model, which conflict mode is most appropriate for an emergency situation where a safety-critical decision must be made quickly?", options: ["Avoiding", "Accommodating", "Competing", "Collaborating"], correctAnswer: 2, explanation: "The 'Competing' mode (high assertiveness, low cooperativeness) is most appropriate for emergencies and safety-critical decisions where a quick, decisive call must be made. In these situations, the leader must assert authority and make the decision — collaboration and compromise take too long. Collaboration is ideal when time allows, but emergencies require decisive leadership." },
  ],

  // ============================================================================
  // CHAPTER 5 — LEADERSHIP (crm-lesson-6-1 to 6-3)
  // ============================================================================

  "crm-lesson-6-1": [
    { type: "heading", text: "Leadership vs Management in Cabin Operations", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual draws a clear distinction between leadership and management. Management is about processes, planning, organisation, and control — ensuring things are done correctly. Leadership is about people, vision, motivation, and inspiration — ensuring the right things are done with commitment. The SCCM must be both a manager (ensuring SOPs are followed, tasks completed, time managed) and a leader (motivating the crew, setting the tone, making tough calls under pressure). The manual cites Daniel Goleman's research identifying six leadership styles, each appropriate for different situations: visionary (motivating toward shared vision), coaching (developing individuals), affiliative (building harmony), democratic (building consensus), pacesetting (leading by example), and commanding (demanding compliance)." },
    { type: "paragraph", text: "The Leadership Pyramid presented in the manual has four levels: leading self (personal accountability, self-management), leading others (direct team leadership, the SCCM role), leading teams (coordinating multiple teams, the senior role), and leading the organisation (cultural influence, the operator's role). For cabin crew, the most relevant levels are leading self (every crew member must lead themselves) and leading others (the SCCM leads the cabin team). The manual emphasises that effective leadership is situational — no single style is best for all situations. The SCCM must read the situation, the team, and the task, then apply the appropriate style. A new, inexperienced crew may need more coaching; a fatigued crew under pressure may need more commanding; a high-performing experienced crew may need more affiliative or democratic leadership." },
    { type: "callout", variant: "info", title: "The Leadership Pyramid", text: "Lead self (personal accountability) → Lead others (direct team leadership) → Lead teams (multi-team coordination) → Lead organisation (cultural influence). Cabin crew operate at the first two levels, but their collective behaviour shapes the third and fourth — every cabin crew member contributes to organisational culture through daily behaviour." },
    { type: "table", caption: "Six Leadership Styles — When to Use Each in Cabin Operations", headers: ["Style", "Description", "When to Use", "Risk if Overused"], rows: [
      ["Visionary", "Motivates toward shared vision", "New team, change, purpose-setting", "Vague, lacks specifics"],
      ["Coaching", "Develops individuals", "New crew, growth opportunities", "Slow for urgent tasks"],
      ["Affiliative", "Builds harmony, connections", "After stress, team repair", "Avoids difficult feedback"],
      ["Democratic", "Builds consensus", "Complex decisions, time available", "Slow, indecisive"],
      ["Pacesetting", "Leads by example", "High-performing team, clear standards", "Demoralises slower crew"],
      ["Commanding", "Demands compliance", "Emergencies, safety-critical", "Kills initiative, creates fear"],
    ]},
    { type: "list", items: [
      "Use Visionary style when setting direction for a new team or after change",
      "Use Coaching style when developing new or junior crew members",
      "Use Affiliative style after stressful events to repair team cohesion",
      "Use Democratic style for complex decisions when time allows",
      "Use Pacesetting style with high-performing, experienced teams",
      "Use Commanding style in emergencies and safety-critical situations",
      "Match the style to the situation, the team, and the task",
      "The best leaders fluidly switch between styles as situations change",
    ]},
    { type: "knowledgeCheck", question: "According to Daniel Goleman's six leadership styles, which style is most appropriate for use in an emergency situation where immediate compliance is required?", options: ["Visionary", "Coaching", "Commanding", "Democratic"], correctAnswer: 2, explanation: "The Commanding style (also called coercive or directive) is most appropriate for emergencies where immediate compliance is required. This style demands obedience and leaves no room for debate. However, it must not be overused — in non-emergency situations, it kills initiative and creates a culture of fear that suppresses the open communication CRM depends on." },
  ],

  "crm-lesson-6-2": [
    { type: "heading", text: "The SCCM Role and Authority Gradient", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual describes the SCCM as the focal point of cabin crew leadership. The SCCM's responsibilities span the entire flight: pre-flight briefing and crew coordination, in-flight monitoring and decision-making, and post-flight debriefing and reporting. Specifically, the SCCM briefs the cabin crew on the flight, passengers, special situations, and emergency contingencies; coordinates with the flight deck on timing, conditions, and any cabin issues; makes operational decisions within their authority (and escalates beyond it); manages crew workload and fatigue; handles passenger escalations that junior crew cannot resolve; and is the primary communicator with the flight deck for cabin-related matters. The SCCM is also the bridge between the cabin crew and the captain, ensuring information flows both ways." },
    { type: "paragraph", text: "Authority gradient is the manual's term for the perceived difference in authority between crew members, particularly between the leader and subordinates. A steep authority gradient — where the leader is perceived as much more powerful and intimidating — discourages subordinates from speaking up, asking questions, or challenging decisions. Tenerife was the classic example of a steep authority gradient with fatal consequences. A flat authority gradient — where the leader is perceived as approachable and equal — encourages open communication but can blur role clarity and slow decision-making. The optimal authority gradient is moderate: clear leadership and decision rights, but explicit encouragement of input and challenge from all crew. The SCCM sets the gradient through their behaviour — asking for input, acknowledging challenges, never punishing honest dissent." },
    { type: "callout", variant: "warning", title: "Steep vs Flat Authority Gradient", text: "Steep gradient (Tenerife risk): leader is intimidating, juniors don't speak up, errors go unchallenged. Flat gradient: leader is approachable, juniors speak freely, but decision rights may blur and decisions may be slow. Optimal: moderate gradient — clear leadership AND explicit invitation for input. The SCCM's behaviour sets the gradient: invite input, acknowledge challenges, never punish honest dissent." },
    { type: "table", caption: "Authority Gradient Effects on Team Behaviour", headers: ["Gradient", "Crew Behaviour", "Decision Quality", "Risk"], rows: [
      ["Steep", "Juniors don't speak up, errors unchallenged", "Poor (no input)", "Tenerife-type accidents"],
      ["Moderate (optimal)", "Juniors speak up respectfully", "High (input + decision)", "Lowest risk"],
      ["Flat", "Juniors speak up, but decisions slow", "Variable (consensus needed)", "Slow decisions in emergency"],
    ]},
    { type: "list", items: [
      "Conduct the pre-flight briefing — flight details, passengers, special situations, contingencies",
      "Coordinate with the flight deck — timing, conditions, cabin issues",
      "Make operational decisions within authority, escalate beyond it",
      "Monitor and manage crew workload and fatigue",
      "Handle passenger escalations beyond junior crew capability",
      "Be the primary communicator with the flight deck for cabin matters",
      "Conduct the post-flight debrief — what went well, what to improve",
      "Set the authority gradient through behaviour — invite input, never punish dissent",
    ]},
    { type: "knowledgeCheck", question: "What is the optimal authority gradient in a cabin crew team, according to the Academy INFOHAS manual?", options: ["As steep as possible for clear leadership", "As flat as possible for open communication", "Moderate — clear leadership combined with explicit invitation for input", "Depends entirely on the operator's policy"], correctAnswer: 2, explanation: "The optimal authority gradient is moderate: clear leadership and decision rights combined with explicit encouragement of input and challenge from all crew. Too steep suppresses communication (Tenerife risk); too flat blurs decision rights and slows response. The SCCM sets the gradient through behaviour — asking for input, acknowledging challenges, never punishing honest dissent." },
  ],

  "crm-lesson-6-3": [
    { type: "heading", text: "The Art of Followership", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual treats followership as a skill of equal importance to leadership — every crew member is a follower most of the time, and the quality of followership determines the quality of team performance. Followership is not passive obedience; it is active, engaged support of the leader and the team. The manual defines effective followership as: understanding the leader's intent and objectives, executing assigned tasks competently, providing honest feedback and input, supporting the leader's decisions once made (even if you disagreed during discussion), taking initiative within your role, and being willing to challenge the leader when safety is at stake. The chapter on followership follows directly from the leadership chapter because, as the manual notes, 'good followers make good leaders.'" },
    { type: "paragraph", text: "Followership styles range from passive (passive follower, yes-person) to active (active follower, critical thinker). The manual identifies the ideal as the 'exemplary follower' or 'critical thinker' — someone who thinks for themselves, offers constructive input, supports team decisions, and is willing to challenge when necessary. The 'yes-person' follower agrees with everything and offers no input — dangerous because the leader misses critical perspectives. The 'alienated' follower thinks critically but is cynical and disengaged — they see problems but do not raise them constructively. The 'pragmatist' follower sits in the middle, sometimes engaged, sometimes not. The SCCM should cultivate exemplary followership by inviting input, recognising challenge as loyalty, and never punishing honest dissent. Followership is a CRM skill that requires training and practice like any other." },
    { type: "callout", variant: "tip", title: "Effective Followership Behaviours", text: "Understand intent. Execute competently. Provide honest input. Support decisions once made. Take initiative within role. Challenge when safety is at stake. Followership is not passive — it is active, engaged support of the leader and the team. Good followers make good leaders." },
    { type: "table", caption: "Followership Styles — Characteristics and Risks", headers: ["Style", "Engagement", "Critical Thinking", "Risk"], rows: [
      ["Exemplary (ideal)", "High", "High", "Lowest — best team performance"],
      ["Yes-person", "High", "Low", "High — leader misses critical perspectives"],
      ["Alienated", "Low", "High", "High — sees problems but does not raise them"],
      ["Pragmatist", "Variable", "Variable", "Moderate — inconsistent"],
      ["Passive", "Low", "Low", "High — disengaged, no contribution"],
    ]},
    { type: "list", items: [
      "Understand the leader's intent and objectives — not just the task",
      "Execute assigned tasks competently and on time",
      "Provide honest feedback and constructive input",
      "Support the leader's decisions once made, even if you disagreed during discussion",
      "Take initiative within your role — do not wait to be told everything",
      "Challenge the leader when safety is at stake — use PACE if necessary",
      "Never undermine the leader publicly — address concerns privately",
      "Cultivate your own followership skills — they are CRM skills",
    ]},
    { type: "knowledgeCheck", question: "Which followership style is considered ideal according to the Academy INFOHAS manual?", options: ["Yes-person", "Alienated", "Exemplary (critical thinker)", "Passive"], correctAnswer: 2, explanation: "The 'exemplary follower' or 'critical thinker' is the ideal style: someone who thinks for themselves, offers constructive input, supports team decisions, and is willing to challenge when necessary. This style combines high engagement with high critical thinking, producing the best team performance and the safest operations." },
  ],

  // ============================================================================
  // CHAPTER 6 — SITUATIONAL AWARENESS (crm-lesson-7-1 to 7-3)
  // ============================================================================

  "crm-lesson-7-1": [
    { type: "heading", text: "Endsley's Three Levels of Situational Awareness", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents Dr. Mica Endsley's three-level model of situational awareness as the foundational framework for understanding SA in cabin operations. SA is defined as 'the perception of the elements in the environment within a volume of time and space, the comprehension of their meaning, and the projection of their status in the near future.' The three levels are sequential and build upon each other: Level 1 (Perception) is detecting and sensing what is happening; Level 2 (Comprehension) is understanding what the perceived information means; Level 3 (Projection) is anticipating what will happen next. Failure at any level compromises the entire SA process — you cannot comprehend what you have not perceived, and you cannot project what you do not comprehend." },
    { type: "paragraph", text: "For cabin crew, each level has specific operational meaning. Level 1 (Perception): smelling smoke, hearing an unusual noise, seeing a passenger in distress, feeling unusual vibration, noticing a galley indicator light. The cabin environment provides constant sensory input, but humans can only consciously process a small fraction — Level 1 failures occur when critical information is missed due to distraction, fatigue, or sensory limitations. Level 2 (Comprehension): recognising that the smell is an electrical fire (not food burning), that the noise is an engine anomaly, that the passenger is having a heart attack (not just sleeping), that the vibration indicates turbulence. Comprehension requires training and experience — the same sensory input can mean different things. Level 3 (Projection): anticipating that the electrical fire will spread if not addressed, that the engine anomaly may require diversion, that the heart attack will require CPR and AED, that the turbulence will require cabin secure. Projection requires imagination and forward thinking — it is the most cognitively demanding and the most often skipped." },
    { type: "callout", variant: "info", title: "Situational Awareness Defined (Endsley)", text: "SA is 'the perception of the elements in the environment within a volume of time and space, the comprehension of their meaning, and the projection of their status in the near future.' The three levels are sequential: perception enables comprehension, comprehension enables projection. Failure at any level compromises the entire SA process." },
    { type: "table", caption: "Endsley's Three Levels of SA — Cabin Crew Examples", headers: ["Level", "Name", "Cabin Crew Example"], rows: [
      ["1", "Perception", "Smelling smoke, hearing unusual noise, seeing passenger in distress"],
      ["2", "Comprehension", "Recognising the smell is electrical fire, the noise is engine anomaly, the passenger is having a cardiac arrest"],
      ["3", "Projection", "Anticipating fire will spread, engine will require diversion, cardiac arrest will require CPR and AED"],
    ]},
    { type: "list", items: [
      "Visual inputs — cabin condition, passenger behaviour, equipment status, smoke or fire",
      "Auditory inputs — unusual noises, alarms, passenger calls, interphone",
      "Olfactory inputs — smoke, fuel, electrical burning, unusual food smells",
      "Tactile inputs — vibration, temperature, equipment condition",
      "Information inputs — flight deck updates, PA announcements, NOTOC, manifest",
      "Crew inputs — reports from fellow crew, observations, concerns",
    ]},
    { type: "knowledgeCheck", question: "In Endsley's model, what is Level 3 situational awareness?", options: ["Perceiving what is happening", "Understanding what the perceived information means", "Anticipating what will happen next", "Recalling past events"], correctAnswer: 2, explanation: "Level 3 SA is Projection — anticipating what will happen next based on the current situation. For cabin crew, this means anticipating that an electrical fire will spread, that an engine anomaly will require diversion, or that a cardiac arrest will require CPR. Projection is the most cognitively demanding level and the most often skipped." },
  ],

  "crm-lesson-7-2": [
    { type: "heading", text: "The SA Cycle and Its Breakdown", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents the SA cycle as a continuous four-step process: Gather (collect information from all available sources), Interpret (make sense of the information, comparing with experience and expectations), Anticipate (project what will happen next), Act (take action based on the projection). The cycle then repeats — actions change the situation, requiring new information gathering, interpretation, anticipation, and action. SA is not a static state but a dynamic process that must be continuously maintained. The cycle can break down at any step: information not gathered (distraction, sensory limitation), information misinterpreted (bias, lack of experience), anticipation not performed (cognitive overload, fatigue), or action not taken (hesitation, fear of being wrong)." },
    { type: "paragraph", text: "The manual identifies the most common SA threats for cabin crew: fatigue (degrades attention and processing), distraction (interrupts the SA cycle), complacency (lowers vigilance), high workload (exceeds cognitive capacity), stress (narrows attention — tunnel vision), and poor communication (information not shared). Specific SA traps include fixation (focusing on one thing and missing others), ambiguity (unclear situation but not seeking clarification), confusion (losing track of what is happening), and SOP deviation (doing something different without communicating). Tunnel vision is particularly dangerous — under stress, the brain narrows attention to what it perceives as the immediate threat, missing other critical information. The manual describes this as the brain's stress response: helpful when running from a predator, dangerous when managing a complex cabin emergency." },
    { type: "callout", variant: "danger", title: "Tunnel Vision and Fixation", text: "Tunnel vision and fixation are the most dangerous SA traps under stress. Tunnel vision: the brain narrows attention to one perceived threat, missing other critical information. Fixation: focusing on one task or one piece of equipment and not moving on. Both can cause crew to miss a developing emergency while attending to something less critical. The countermeasure is structured scanning and crew cross-monitoring." },
    { type: "table", caption: "SA Threats and CRM Countermeasures", headers: ["SA Threat", "Effect on SA", "CRM Countermeasure"], rows: [
      ["Fatigue", "Degrades attention and processing", "Strategic rest, fatigue reporting, task rotation"],
      ["Distraction", "Interrupts the SA cycle", "Structured scanning, 'pause and refocus' technique"],
      ["Complacency", "Lowers vigilance", "Treat every check as first time, brief risks"],
      ["High workload", "Exceeds cognitive capacity", "Prioritise, delegate, communicate"],
      ["Stress", "Narrows attention (tunnel vision)", "Crew cross-monitoring, command voice, SOPs"],
      ["Poor communication", "Information not shared", "Closed-loop comms, briefings, position reports"],
    ]},
    { type: "list", items: [
      "Pause and refocus — when interrupted, consciously return to the task",
      "Structured scanning — move attention systematically across all areas",
      "Cross-monitoring — crew check on each other's SA",
      "Verbalise concerns — say what you notice, even if uncertain",
      "Use checklists — they support SA under high workload",
      "Avoid multitasking on safety-critical tasks",
      "Take breaks when possible — even 30 seconds helps reset",
      "Brief expected threats — pre-thinking primes SA",
    ]},
    { type: "knowledgeCheck", question: "What is the most dangerous situational awareness trap that occurs under stress, according to the Academy INFOHAS manual?", options: ["Complacency", "Tunnel vision (and fixation)", "Ambiguity", "Communication failure"], correctAnswer: 1, explanation: "Tunnel vision (and the related trap of fixation) is the most dangerous SA trap under stress. The brain narrows attention to one perceived threat, missing other critical information. This stress response is helpful when running from a predator but dangerous when managing a complex cabin emergency, where crew must maintain awareness of multiple factors simultaneously." },
  ],

  "crm-lesson-7-3": [
    { type: "heading", text: "Recognising and Recovering from Loss of SA", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual identifies specific signs that SA has been lost: confusion or uncertainty about what is happening, fixation on one aspect of the situation, missed information (you realise you have not been monitoring something), feeling rushed or behind, communication breakdown (crew are not talking), SOP deviation (doing something different without communicating), and the 'gut feeling' that something is wrong without being able to articulate what. The manual emphasises that the gut feeling should never be ignored — it is the brain's pattern-matching system detecting something the conscious mind has not yet identified. When any of these signs appear, the immediate action should be to pause, take a breath, and consciously rebuild SA — not to push on with degraded awareness." },
    { type: "paragraph", text: "The manual's recommended recovery technique is STOP-THINK-ACT: Stop what you are doing (literally pause, take a breath), Think about the situation (what is happening? what should be happening? what is the gap?), Act deliberately (take one clear action, then reassess). This technique sounds simple but is profoundly effective — it interrupts the stress-driven reaction pattern and re-engages the deliberative brain. Other recovery techniques include: verbalising the situation to a colleague (speaking forces organisation of thought), requesting a 'time out' to regroup, using a checklist to rebuild systematic awareness, and explicitly delegating one task to free cognitive capacity. The manual is clear that losing SA is not a personal failure — it is a normal human response to high workload and stress — and that recovering SA quickly is the CRM skill that matters." },
    { type: "callout", variant: "warning", title: "SOP Deviation Warning", text: "If you find yourself doing something different from the SOP without having communicated it, stop. SOP deviation without communication is a leading indicator of SA loss. Either return to the SOP, or explicitly communicate and justify the deviation. The deviation itself is not always wrong — what is wrong is deviation without conscious decision and communication." },
    { type: "table", caption: "SA Recovery Techniques and When to Use Them", headers: ["Technique", "Description", "When to Use"], rows: [
      ["STOP-THINK-ACT", "Stop, think about the situation, act deliberately", "SA loss recognised, individual"],
      ["Verbalise to colleague", "Speak the situation aloud to force organised thought", "Confusion, uncertainty"],
      ["Request time-out", "Brief pause to regroup and rebuild SA", "Crew coordination breakdown"],
      ["Use checklist", "Systematic rebuild of awareness", "High workload, missed items"],
      ["Delegate one task", "Free cognitive capacity by offloading", "Cognitive overload"],
      ["Crew cross-check", "Ask crew what they see — different perspective", "Ambiguity, possible misinterpretation"],
    ]},
    { type: "list", items: [
      "S — Stop what you are doing (literally pause, take a breath)",
      "T — Think about the situation (what is happening? what should be? what is the gap?)",
      "O — Observe (deliberately scan all areas, not just the focus of attention)",
      "P — Proceed (act deliberately, one clear action, then reassess)",
      "Use STOP-THINK-ACT whenever you recognise SA loss in yourself or others",
      "Encourage colleagues to use it — 'Let's STOP and think about this for a second'",
      "Verbalise your thought process — it forces organised thinking",
      "Rebuild SA systematically — do not just react",
    ]},
    { type: "knowledgeCheck", question: "What does the STOP-THINK-ACT technique require you to do first when you recognise loss of situational awareness?", options: ["Act immediately", "Communicate with the flight deck", "Stop what you are doing — literally pause and take a breath", "Run the evacuation checklist"], correctAnswer: 2, explanation: "The first step of STOP-THINK-ACT is to Stop — literally pause what you are doing and take a breath. This interrupts the stress-driven reaction pattern and re-engages the deliberative brain. Only after stopping can you effectively think about the situation and then act deliberately." },
  ],

  // ============================================================================
  // CHAPTER 7 — DECISION MAKING (crm-lesson-8-1 to 8-3)
  // ============================================================================

  "crm-lesson-8-1": [
    { type: "heading", text: "The Five-Step Decision Process and FOR-DEC Model", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents decision-making as a structured skill, not an innate ability. The five-step decision process is: Define the problem (what decision needs to be made?), Gather information (what do we know? what do we need to know?), Evaluate options (what are the possible courses of action, and what are the consequences of each?), Decide (select the best option), and Review (did the decision work? if not, cycle back). This five-step process is appropriate for non-time-critical decisions — those where minutes or hours are available. For time-critical decisions (seconds available), the manual recommends Recognition-Primed Decision (RPD): recognise the pattern from experience and act on the first workable option, without explicit comparison of alternatives." },
    { type: "paragraph", text: "The FOR-DEC model, developed by Lufthansa and adopted across European aviation, is the manual's recommended team decision-making tool. FOR-DEC stands for Facts, Options, Risks, Decision, Execution, Check. Facts: what do we actually know about the situation? Options: what are the possible courses of action? Risks: what are the risks and consequences of each option? Decision: which option do we choose? Execution: who does what, when? Check: did the decision work, and do we need to adjust? FOR-DEC is particularly useful for cabin crew because it structures team input — the SCCM gathers facts from all crew, considers options with the team, assesses risks collectively, makes the decision, assigns execution, and checks the outcome. The entire process can be completed in two to five minutes for most cabin decisions." },
    { type: "callout", variant: "info", title: "FOR-DEC Acronym", text: "F — Facts: what do we know? O — Options: what can we do? R — Risks: what are the consequences? D — Decision: which option? E — Execution: who does what? C — Check: did it work? FOR-DEC structures team decision-making and ensures all crew input is considered." },
    { type: "table", caption: "FOR-DEC Applied to a Cabin Decision Example", headers: ["Step", "Question", "Example (medical diversion decision)"], rows: [
      ["F", "Facts", "Passenger in row 23, male, 60s, chest pain, sweating, shortness of breath, 4 hours to destination"],
      ["O", "Options", "Continue to destination; divert to nearest suitable; request medical advice via radio"],
      ["R", "Risks", "Continue: passenger may deteriorate; Divert: delay, cost, passenger inconvenience; Radio: takes time"],
      ["D", "Decision", "Request medical advice via radio, prepare for possible diversion"],
      ["E", "Execution", "SCCM calls flight deck with NITS, Purser prepares medical kit, crew prepares cabin"],
      ["C", "Check", "Monitor passenger; if medical advice recommends diversion, execute diversion plan"],
    ]},
    { type: "list", items: [
      "Define the problem — what decision needs to be made?",
      "Gather information — what do we know? what do we need to know?",
      "Evaluate options — what are the possible courses of action?",
      "Decide — select the best option",
      "Review — did the decision work? if not, cycle back",
      "For team decisions, use FOR-DEC: Facts, Options, Risks, Decision, Execution, Check",
      "For time-critical decisions, use RPD: recognise pattern, act on first workable option",
    ]},
    { type: "knowledgeCheck", question: "What does the 'R' in FOR-DEC stand for, and what question does it ask?", options: ["Response — what is our response?", "Risks — what are the consequences of each option?", "Resources — what do we have available?", "Review — did we make the right call?"], correctAnswer: 1, explanation: "In FOR-DEC, the 'R' stands for Risks — what are the risks and consequences of each option? This step ensures that decisions are not made without considering the potential downsides, and that risk trade-offs are explicit. Skipping the Risks step leads to decisions that look good in theory but have unconsidered negative consequences." },
  ],

  "crm-lesson-8-2": [
    { type: "heading", text: "Common Decision Errors and Cognitive Biases", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual devotes extensive treatment to the cognitive biases that distort decision-making. Confirmation bias is the tendency to seek information that confirms what we already believe and ignore information that contradicts it. Anchoring bias is the tendency to give excessive weight to the first piece of information received. Availability bias is the tendency to judge events as more likely if examples come easily to mind (recent or vivid events). Sunk cost bias is the tendency to continue a course of action because of prior investment, even when it is no longer the best option. Plan continuation bias is the tendency to continue with the original plan despite changing conditions that should prompt re-evaluation. These biases are not signs of poor intelligence — they are universal features of human cognition, and the only defence is awareness and structured decision processes." },
    { type: "paragraph", text: "The manual distinguishes good decisions from poor decisions along several dimensions. Good decisions: based on facts not assumptions, consider multiple options, account for risks, are made with appropriate crew input, are communicated clearly, and are reviewed after execution. Poor decisions: based on assumptions not verified, consider only one option, ignore risks, are made without crew input, are poorly communicated, and are not reviewed. Critically, a good decision can still produce a bad outcome (due to factors beyond the decision-maker's control), and a poor decision can sometimes produce a good outcome (by luck). The manual emphasises that CRM judges decision quality by the process, not the outcome — because we cannot control outcomes, only the quality of the decisions we make. This is the foundation of a Just Culture that supports learning rather than blame." },
    { type: "callout", variant: "warning", title: "Decision Traps to Watch For", text: "Confirmation bias: seeking only confirming information. Anchoring: over-weighting first information. Plan continuation: sticking with the original plan despite changed conditions. Sunk cost: continuing because of past investment. These biases are universal — the only defence is awareness and structured decision processes (FOR-DEC, deliberate option evaluation, crew cross-checking)." },
    { type: "table", caption: "Cognitive Biases in Aviation Decision-Making", headers: ["Bias", "Description", "Cabin Crew Example", "Countermeasure"], rows: [
      ["Confirmation", "Seek confirming info, ignore disconfirming", "Believing smoke is food, dismissing evidence of fire", "Actively seek disconfirming evidence"],
      ["Anchoring", "Over-weight first information", "First report says 'small fire', underestimating spread", "Re-evaluate as new info arrives"],
      ["Availability", "Judge by what comes to mind", "Recent dramatic event skews risk perception", "Use data, not just memory"],
      ["Sunk cost", "Continue due to past investment", "Continuing approach because much preparation done", "Decide based on current situation only"],
      ["Plan continuation", "Stick with original plan", "Continuing to destination despite medical emergency", "Re-evaluate when conditions change"],
      ["Authority", "Defer to perceived authority", "Junior crew not questioning senior's bad call", "PACE model, Just Culture"],
    ]},
    { type: "list", items: [
      "Decision based on facts, not assumptions — verify before deciding",
      "Consider multiple options — never just one",
      "Account for risks — what could go wrong?",
      "Get appropriate crew input — do not decide alone when crew are available",
      "Communicate the decision clearly — say what you decided and why",
      "Review after execution — did it work? if not, cycle back",
      "Judge decision quality by process, not just outcome",
      "Use FOR-DEC for team decisions; RPD for time-critical solo decisions",
    ]},
    { type: "knowledgeCheck", question: "What is 'confirmation bias' and how does it affect decision-making?", options: ["Confirming a decision before acting", "Seeking information that confirms what we already believe and ignoring disconfirming information", "Asking crew to confirm your decision", "Confirming the flight plan before departure"], correctAnswer: 1, explanation: "Confirmation bias is the tendency to seek information that confirms what we already believe and ignore or discount information that contradicts it. For example, believing that smoke is from food preparation and dismissing evidence of an actual fire. The countermeasure is to actively seek disconfirming evidence — to ask 'what would prove me wrong?' rather than 'what supports my view?'" },
  ],

  "crm-lesson-8-3": [
    { type: "heading", text: "Group Decision Making Under Time Pressure", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual addresses the specific challenge of group decision-making under time pressure — a common cabin crew situation. Time pressure affects decisions in predictable ways: it narrows the options considered, increases reliance on heuristics (mental shortcuts), increases authority bias (deference to the most senior), and decreases the quality of information gathering. The manual distinguishes time-critical decisions (seconds available — fire, evacuation, decompression) from time-available decisions (minutes to hours available — medical diversion, unruly passenger management, weather diversion). For time-critical decisions, the manual recommends RPD: the leader recognises the pattern and acts on the first workable option without explicit team consultation. For time-available decisions, the manual recommends FOR-DEC with full crew input." },
    { type: "paragraph", text: "Risk assessment is an integral part of group decision-making. The manual presents a simple risk matrix: assess the probability of each outcome (low, medium, high) and the severity of each outcome (low, medium, high, catastrophic). High probability + high severity outcomes are unacceptable risks; low probability + low severity outcomes are acceptable. Most decisions fall in between, requiring judgement. The matrix is not a formula — it is a structure that forces explicit consideration of probability and severity. The manual also presents the 'time-based' decision rule: if a decision is time-critical, make the safest conservative call now and reassess later; if a decision is not time-critical, take the time to gather information and consult. The worst decision is no decision — indecision under pressure is itself a decision, and usually the worst one." },
    { type: "callout", variant: "danger", title: "Time-Critical vs Deliberate Decisions", text: "Time-critical (seconds available): use RPD — recognise the pattern, act on the first workable option, do not seek consensus. Time-available (minutes to hours): use FOR-DEC — gather facts, consider options, assess risks, decide, execute, check. The wrong choice of decision model is itself a critical error — using RPD when time was available loses valuable input; using FOR-DEC in a time-critical situation wastes precious seconds." },
    { type: "table", caption: "Risk Assessment Matrix — Probability vs Severity", headers: ["Probability / Severity", "Low", "Medium", "High/Catastrophic"], rows: [
      ["High", "Acceptable with mitigation", "Marginal — minimise risk", "Unacceptable — do not proceed"],
      ["Medium", "Acceptable", "Acceptable with mitigation", "Marginal — minimise risk"],
      ["Low", "Acceptable", "Acceptable", "Acceptable with mitigation"],
    ]},
    { type: "list", items: [
      "Identify whether the decision is time-critical or time-available",
      "Time-critical: use RPD — leader recognises pattern, acts on first workable option",
      "Time-available: use FOR-DEC — Facts, Options, Risks, Decision, Execution, Check",
      "Assess probability and severity of each outcome using risk matrix",
      "Get input from all relevant crew — do not decide alone unnecessarily",
      "Communicate the decision clearly — what, who, when",
      "Execute decisively — once decided, commit",
      "Review — did it work? if not, cycle back through the process",
      "Indecision is itself a decision — usually the worst one",
    ]},
    { type: "knowledgeCheck", question: "In a time-critical cabin emergency (e.g., sudden cabin fire), which decision-making model does the Academy INFOHAS manual recommend?", options: ["FOR-DEC with full crew consultation", "Recognition-Primed Decision (RPD) — leader recognises pattern and acts", "OODA loop with multiple iterations", "Stop and consult the operations manual"], correctAnswer: 1, explanation: "In time-critical emergencies (seconds available), the manual recommends Recognition-Primed Decision (RPD): the leader recognises the pattern from training and experience and acts on the first workable option without explicit team consultation. FOR-DEC is appropriate for time-available decisions (minutes to hours) where crew input can be gathered." },
  ],

  // ============================================================================
  // CHAPTER 8 — THREAT AND ERROR MANAGEMENT (crm-lesson-9-1 to 9-3)
  // ============================================================================

  "crm-lesson-9-1": [
    { type: "heading", text: "The ICAO TEM Model", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents Threat and Error Management (TEM) as the operational framework that translates CRM principles into daily practice. TEM was developed jointly by ICAO and the University of Texas under the leadership of Dr. Robert Helmreich. The model describes how threats (events or conditions beyond the crew's influence that require management) develop into errors (actions or inactions that lead to deviation from intentions), which can develop into undesired states (conditions where safety margins have been compromised), which can develop into incidents or accidents. Critically, at each transition, crew countermeasures can break the chain — preventing a threat from becoming an error, an error from becoming an undesired state, or an undesired state from becoming an accident." },
    { type: "paragraph", text: "The TEM process flow has multiple pathways: THREAT → crew management → safe outcome; THREAT → mismanaged → ERROR → crew management → safe outcome; THREAT → mismanaged → ERROR → mismanaged → UNDESIRED STATE → crew management → safe outcome; THREAT → mismanaged → ERROR → mismanaged → UNDESIRED STATE → mismanaged → INCIDENT/ACCIDENT. The key insight is that there are multiple opportunities to break the chain — at each stage, crew intervention can prevent escalation. This reframes CRM from 'preventing all errors' (impossible) to 'detecting and trapping errors before they cascade' (achievable). The manual emphasises that errors are inevitable; what matters is whether they are caught. TEM is now integrated into ICAO Annex 6 and EASA regulation, and is the framework used in Line Operations Safety Audits (LOSA) worldwide." },
    { type: "callout", variant: "info", title: "TEM Origins", text: "TEM was developed by ICAO and the University of Texas (Dr. Robert Helmreich's team) in the late 1990s. It evolved from earlier CRM research and is now the operational framework that translates CRM principles into daily practice. TEM is integrated into ICAO Annex 6 and EASA regulation, and is the framework used in Line Operations Safety Audits (LOSA) worldwide." },
    { type: "table", caption: "TEM Components in Cabin Operations", headers: ["Component", "Definition", "Cabin Examples"], rows: [
      ["Threat", "Event or condition beyond crew's influence that requires management", "Severe turbulence, unruly passenger, galley fire, medical emergency, system malfunction"],
      ["Error", "Action or inaction by crew that leads to deviation from intentions", "Missed item on cabin secure check, miscommunication with flight deck, wrong extinguisher"],
      ["Undesired State", "Condition where safety margins have been compromised", "Unsecured galley during turbulence, passenger near exit during emergency"],
      ["Countermeasure", "Crew actions that detect, trap, or mitigate threats and errors", "Checklists, briefings, cross-monitoring, SOPs, communication, calling for help"],
    ]},
    { type: "list", items: [
      "Checklists — systematic verification that catches errors",
      "Briefings — shared mental model before tasks begin",
      "Cross-monitoring — crew check on each other",
      "SOPs — standard procedures that prevent many errors",
      "Communication — closed-loop, clear, unambiguous",
      "Calling for help — early escalation when in doubt",
      "Threat briefings — explicitly naming anticipated threats before they occur",
      "Time management — preserve margin for safety-critical tasks",
    ]},
    { type: "knowledgeCheck", question: "In the TEM model, what is the difference between a 'threat' and an 'error'?", options: ["Threats are external, errors are internal", "Threats are beyond the crew's influence; errors are actions or inactions by the crew", "Threats are minor, errors are major", "Threats are physical, errors are verbal"], correctAnswer: 1, explanation: "In TEM, a threat is an event or condition that occurs beyond the crew's influence (e.g., severe turbulence, unruly passenger, system malfunction) but requires management. An error is an action or inaction by the crew that leads to a deviation from intentions. Threats can lead to errors if mismanaged; errors can lead to undesired states if mismanaged; undesired states can lead to incidents if mismanaged." },
  ],

  "crm-lesson-9-2": [
    { type: "heading", text: "Identifying and Managing Threats", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual categorises threats into three types: environmental (weather, turbulence, contamination, cabin pressure, temperature), operational (aircraft malfunctions, system faults, equipment failures, ATC delays, gate changes), and human (unruly passengers, intoxicated passengers, medical events, fatigue, stress, cultural misunderstandings, special needs passengers). Each threat type has characteristic management strategies. Environmental threats are typically managed through anticipation (briefing), preparation (cabin secure, equipment ready), and response (executing trained procedures). Operational threats are managed through system knowledge, abnormal procedures, and coordination with the flight deck. Human threats are managed through communication skills, de-escalation techniques, and crew coordination." },
    { type: "paragraph", text: "Threats can be further classified as latent or active. Latent threats exist in the system but have not yet manifested — for example, a poorly designed procedure, an unreliable piece of equipment, an inadequate training programme, an organisational culture that discourages reporting. Latent threats are the holes in the Swiss Cheese Model's defensive layers. Active threats are present in the current operation — a passenger behaving erratically, a system warning, deteriorating weather. The cabin crew's primary TEM task is to identify active threats early and apply countermeasures before they produce errors. The manual recommends explicit threat briefings during the pre-flight SCCM briefing — naming the anticipated threats for the specific flight (weather, passenger mix, special needs, equipment status) and assigning management strategies." },
    { type: "callout", variant: "warning", title: "Latent vs Active Threats", text: "Latent threats exist in the system (poor procedures, unreliable equipment, inadequate training, poor reporting culture) but have not yet manifested. Active threats are present in the current operation (unruly passenger, system warning, weather). Cabin crew primarily manage active threats through early identification and countermeasures. Latent threats are addressed at the organisational level through safety management systems (SMS)." },
    { type: "table", caption: "Cabin Threats and Management Strategies", headers: ["Threat Type", "Examples", "Management Strategy"], rows: [
      ["Environmental — turbulence", "Severe turbulence encounter", "Cabin secure, PA, seatbelt check, galley shutdown"],
      ["Environmental — contamination", "Smoke, fumes, spill", "Identify source, isolate, PPE, communicate"],
      ["Operational — system malfunction", "PA failure, interphone fault", "Backup communication, workaround, report"],
      ["Operational — equipment failure", "Door fault, slide problem", "Use alternate exit, communicate, document"],
      ["Human — unruly passenger", "Intoxicated, aggressive passenger", "De-escalation, restraint, divert if necessary"],
      ["Human — medical event", "Cardiac arrest, allergic reaction", "Medical kit, AED, request assistance, NITS to flight deck"],
      ["Human — fatigue", "Crew fatigue on long duty", "Task rotation, strategic rest, reporting"],
    ]},
    { type: "list", items: [
      "Identify threats early — actively scan, brief anticipated threats",
      "Apply countermeasures proactively — do not wait for the threat to manifest",
      "Communicate threats to the team — share awareness",
      "Manage threats systematically — SOPs, checklists, briefings",
      "Report threats — feed organisational learning (SMS)",
      "Anticipate cascading threats — one threat can trigger others",
      "Brief contingencies — what will we do if X happens?",
      "Prioritise — manage the most safety-critical threats first",
    ]},
    { type: "knowledgeCheck", question: "What is the difference between a latent threat and an active threat in TEM?", options: ["Latent threats are physical, active threats are psychological", "Latent threats exist in the system but have not yet manifested; active threats are present in the current operation", "Latent threats are minor, active threats are major", "Latent threats are environmental, active threats are human"], correctAnswer: 1, explanation: "Latent threats exist in the system (poor procedures, unreliable equipment, inadequate training, poor reporting culture) but have not yet manifested. Active threats are present in the current operation (unruly passenger, system warning, weather). Cabin crew primarily manage active threats; latent threats are addressed at the organisational level through Safety Management Systems." },
  ],

  "crm-lesson-9-3": [
    { type: "heading", text: "Errors, Safety Barriers, and Cabin TEM Examples", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual classifies errors into three types based on Reason's taxonomy: slips (action executed incorrectly, e.g., grabbing the wrong fire extinguisher), lapses (action omitted due to memory failure, e.g., forgetting an item on the cabin secure checklist), and mistakes (wrong action chosen due to incorrect knowledge or judgement, e.g., applying the wrong procedure). Slips and lapses are skill-based errors — they occur during routine, well-practised tasks when attention drifts. Mistakes are knowledge-based or rule-based errors — they occur when the wrong plan is chosen. The management strategy differs: slips and lapses are prevented through attention management, checklists, and cross-monitoring; mistakes are prevented through training, SOPs, and decision support tools." },
    { type: "paragraph", text: "Safety barriers — the defensive layers in the Swiss Cheese Model — are presented as the system's protection against errors cascading to accidents. Each barrier has holes (weaknesses), but no single barrier is expected to be perfect. The system relies on multiple barriers so that if one fails, others catch the hazard. For cabin crew, the barriers include: SOPs (procedural barriers), checklists (verification barriers), crew cross-monitoring (human barriers), aircraft systems (technical barriers), training (competency barriers), and reporting culture (organisational barriers). The manual presents cabin TEM examples that illustrate the model in action: a galley fire (threat) detected by smell (perception), correctly identified (comprehension), managed with BCF extinguisher and isolation (countermeasure), reported to flight deck (communication), and debriefed after landing (organisational learning). Each step is a barrier; missing any step increases the risk of escalation." },
    { type: "callout", variant: "danger", title: "The Error Chain", text: "Aviation accidents rarely result from a single error. They almost always involve a chain of errors where each one enables the next. Breaking ANY link in the chain prevents the accident. This is why CRM emphasises detection and trapping of errors at every stage — you do not need to prevent every error, you just need to catch them before they cascade. Every countermeasure is a potential chain-breaker." },
    { type: "table", caption: "Cabin TEM Examples — Threats, Errors, Outcomes", headers: ["Situation", "Threat", "Error Risk", "Countermeasure"], rows: [
      ["Smell of smoke in galley", "Possible fire", "Misidentify source, use wrong extinguisher", "Investigate, BCF for electrical, isolate power, call flight deck"],
      ["Unruly passenger", "Passenger behaviour", "Escalate confrontation, ignore warning signs", "De-escalate, crew support, restraint as last resort"],
      ["Turbulence encounter", "Weather", "Cabin not secured, crew injured", "Cabin secure check, PA, galley secure, seatbelt verify"],
      ["Medical event", "Passenger health", "Misdiagnosis, delay in treatment", "Assess, medical kit, AED, request ground assistance, NITS"],
      ["Door fault", "Equipment", "Use wrong procedure, force operation", "Verify status, use alternate, communicate, document"],
    ]},
    { type: "list", items: [
      "Slips — action executed incorrectly (grab wrong equipment) — prevent with attention, cross-monitor",
      "Lapses — action omitted (forget checklist item) — prevent with checklists, verification",
      "Mistakes — wrong action chosen (wrong procedure) — prevent with training, SOPs",
      "Multiple barriers prevent any single error from causing an accident",
      "SOPs, checklists, cross-monitoring, systems, training, reporting — all are barriers",
      "Crew cross-monitoring is the most important human barrier",
      "Reporting culture closes the loop — turns errors into organisational learning",
      "Every countermeasure is a potential chain-breaker — catch errors before they cascade",
    ]},
    { type: "knowledgeCheck", question: "What is the difference between a 'slip' and a 'mistake' in Reason's error taxonomy?", options: ["Slips are physical, mistakes are verbal", "Slips are action executed incorrectly; mistakes are wrong action chosen due to incorrect knowledge or judgement", "Slips are minor, mistakes are major", "Slips are by junior crew, mistakes are by senior crew"], correctAnswer: 1, explanation: "A slip is a skill-based error where an action is executed incorrectly (e.g., grabbing the wrong fire extinguisher). A mistake is a knowledge-based or rule-based error where the wrong action is chosen due to incorrect knowledge or judgement (e.g., applying the wrong procedure). Slips and lapses are managed through attention and checklists; mistakes are managed through training and SOPs." },
  ],

  // ============================================================================
  // CHAPTER 9 — STRESS, FATIGUE, WORKLOAD (crm-lesson-10-1 to 10-3, 11-1 to 11-3)
  // ============================================================================

  "crm-lesson-10-1": [
    { type: "heading", text: "Workload Management Zones", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents workload as a controllable resource that the cabin crew manages actively. Workload is not just 'how busy you are' — it is the cognitive, physical, and emotional demand placed on the crew at any moment. The manual identifies three workload zones: underload (low demand, leading to boredom, complacency, and reduced vigilance), optimal workload (moderate demand, producing peak performance — challenged but not overwhelmed), and overload (demand exceeds capacity, leading to task shedding, tunnel vision, and errors). Both underload and overload are dangerous. The goal of workload management is to keep the crew in the optimal zone — and to recognise and correct excursions to either extreme." },
    { type: "paragraph", text: "Signs of underload include yawning, mind wandering, distraction, missing things that should be obvious, and time passing slowly. Underload is common during long cruise phases, especially overnight flights when passengers are sleeping. The countermeasures include: active scanning (deliberately look for threats), crew conversation about the flight (keeps the mind engaged), task rotation (move to a different position), and brief physical activity (stretching, walking the cabin). Signs of overload include rushing, missing steps, looking stressed, communication breakdown, fixation on one task, and physical signs (sweating, rapid breathing). The countermeasures include: prioritise (safety-critical first), delegate (assign tasks to other crew), communicate (tell the SCCM you are overloaded), and use checklists (external memory support). The manual emphasises that reporting overload is not a sign of weakness — it is professional CRM behaviour." },
    { type: "callout", variant: "warning", title: "Overload and Underload Dangers", text: "Both overload and underload degrade performance. Overload leads to task shedding, tunnel vision, and errors. Underload leads to complacency, distraction, and slowed reaction when something does happen. The goal is the optimal zone — challenged but not overwhelmed. Reporting overload or underload is not weakness; it is professional CRM behaviour." },
    { type: "table", caption: "Workload Zones with Signs and Countermeasures", headers: ["Zone", "Signs", "Countermeasures"], rows: [
      ["Underload", "Yawning, mind wandering, distraction, missing obvious things", "Active scanning, crew conversation, task rotation, brief activity"],
      ["Optimal", "Engaged, focused, communicating, performing well", "Maintain, monitor for drift"],
      ["Overload", "Rushing, missing steps, stressed, communication breakdown, fixation", "Prioritise, delegate, communicate, use checklists"],
    ]},
    { type: "list", items: [
      "Prioritise — safety-critical tasks first (secure cabin, manage passengers)",
      "Delegate — assign tasks clearly, the SCCM should not do everything",
      "Communicate — tell the SCCM if you are overloaded or underloaded",
      "Cross-monitor — check on colleagues, offer to take a task",
      "Use checklists — they externalise memory and catch missed items",
      "Rotate tasks — move crew between positions to maintain alertness",
      "Take micro-breaks — even 30 seconds helps reset cognitive capacity",
      "Brief anticipated high-workload periods — preparation reduces overload",
    ]},
    { type: "knowledgeCheck", question: "What are the three workload management zones identified in the Academy INFOHAS manual?", options: ["Low, medium, high", "Underload, optimal, overload", "Resting, working, peak", "Complacent, normal, stressed"], correctAnswer: 1, explanation: "The three workload zones are underload (low demand, leading to boredom and complacency), optimal workload (moderate demand, peak performance — challenged but not overwhelmed), and overload (demand exceeds capacity, leading to task shedding and errors). Both underload and overload are dangerous; the goal is to maintain optimal workload." },
  ],

  "crm-lesson-10-2": [
    { type: "heading", text: "Stress and the Yerkes-Dodson Curve", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents stress as a physiological and psychological response to demands that can either enhance or impair performance. The manual distinguishes eustress (positive stress — arousal that motivates and focuses) from distress (negative stress — arousal that overwhelms and impairs). The Yerkes-Dodson Law, formulated in 1908, describes the relationship between arousal and performance as an inverted-U curve: performance is low at very low arousal (complacency, boredom), rises to a peak at moderate arousal (optimal performance), and declines at very high arousal (overload, panic). The peak of the curve is the optimal arousal level for performance — what athletes call 'the zone.' The optimal level varies by task: simple or well-practised tasks tolerate higher arousal; complex or novel tasks require lower arousal." },
    { type: "paragraph", text: "For cabin crew, the implications are significant. Normal cabin operations (boarding, service) are best performed at moderate arousal — alert and engaged but not stressed. Emergency operations (evacuation, fire fighting) require higher arousal — the adrenaline surge actually enhances physical performance for short periods. However, sustained high arousal is damaging — it impairs judgement, communication, and fine motor skills, and over time leads to burnout. The manual identifies specific stress symptoms across four categories: physical (sweating, increased heart rate, muscle tension, headache), cognitive (racing thoughts, difficulty concentrating, poor memory), emotional (anxiety, irritability, fear), and behavioural (changes in appetite, sleep, social withdrawal, substance use). Recognising these symptoms in oneself and others is the first step in stress management." },
    { type: "callout", variant: "info", title: "Optimal Arousal for Performance", text: "Performance is low at very low arousal (complacency), peaks at moderate arousal (the 'zone' — optimal), and declines at very high arousal (overload, panic). Different tasks have different optimal arousal levels — simple or well-practised tasks tolerate higher arousal; complex or novel tasks require lower arousal. Cabin crew should aim for moderate arousal in normal ops and harness the adrenaline surge appropriately in emergencies." },
    { type: "table", caption: "Stress Types and Effects on Cabin Crew Performance", headers: ["Stress Type", "Arousal Level", "Performance Effect", "Cabin Crew Example"], rows: [
      ["Eustress (positive)", "Moderate", "Enhanced focus, motivation, performance", "Pre-flight anticipation, busy boarding"],
      ["Optimal arousal", "Moderate", "Peak performance — 'the zone'", "Well-briefed crew executing service"],
      ["Distress (mild)", "High", "Reduced judgement, irritability", "Long delay, multiple passenger issues"],
      ["Distress (severe)", "Very high", "Panic, freezing, cognitive breakdown", "Untested crew in real emergency"],
      ["Chronic stress", "Sustained", "Burnout, fatigue, health damage", "Long-term roster pressure, personal issues"],
    ]},
    { type: "list", items: [
      "Physical symptoms — sweating, increased heart rate, muscle tension, headache",
      "Cognitive symptoms — racing thoughts, difficulty concentrating, poor memory",
      "Emotional symptoms — anxiety, irritability, fear, dread",
      "Behavioural symptoms — appetite changes, sleep changes, withdrawal, substance use",
      "Recognise symptoms early — in yourself and in colleagues",
      "Use stress management techniques — breathing, brief pause, peer support",
      "Report chronic stress — to peers, supervisor, employee assistance programme",
      "Sustained high arousal is damaging — recovery time is essential",
    ]},
    { type: "knowledgeCheck", question: "According to the Yerkes-Dodson Law, what is the relationship between arousal and performance?", options: ["Performance increases linearly with arousal", "Performance decreases linearly with arousal", "Performance follows an inverted-U — low at very low arousal, peaks at moderate arousal, declines at very high arousal", "There is no relationship between arousal and performance"], correctAnswer: 2, explanation: "The Yerkes-Dodson Law describes an inverted-U relationship: performance is low at very low arousal (complacency), peaks at moderate arousal (optimal performance), and declines at very high arousal (overload, panic). Different tasks have different optimal arousal levels — complex tasks require lower optimal arousal than simple or well-practised tasks." },
  ],

  "crm-lesson-10-3": [
    { type: "heading", text: "Circadian Rhythm and Stress Coping", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual introduces circadian rhythm as the body's internal 24-hour biological clock that regulates sleep, alertness, body temperature, hormone production, and many other physiological processes. The clock is set by light exposure and runs slightly longer than 24 hours in most people, requiring daily resetting by morning light. The circadian rhythm produces two natural alertness dips: a major dip in the early morning hours (around 3-5 am, the Window of Circadian Low or WOCL) and a minor dip in the early afternoon (around 3-5 pm, the post-lunch dip). During these dips, alertness, reaction time, and decision-making are all impaired. Cabin crew operating across time zones disrupt their circadian rhythm, leading to jet lag, fatigue, and degraded performance until the rhythm adjusts to the new time zone — a process that takes approximately one day per time zone crossed." },
    { type: "paragraph", text: "Coping strategies are the practical tools cabin crew use to manage stress and fatigue. The manual categorises coping strategies into immediate (used in the moment during operations) and long-term (used between flights to build resilience). Immediate coping: tactical breathing (4-second inhale, 4-second hold, 4-second exhale, 4-second hold — repeated), brief mental reset (close eyes for 30 seconds, focus on breath), peer support (talk to a colleague), task rotation (move to a different position), and strategic caffeine use (small doses, not within 6 hours of planned sleep). Long-term coping: regular sleep schedule when possible, exercise, healthy diet, hydration, mindfulness or meditation practice, social support, professional counselling when needed. Resilience — the capacity to recover from adversity — is built over time through these long-term practices and is a CRM competency that can be developed deliberately." },
    { type: "callout", variant: "tip", title: "Building Resilience", text: "Resilience is the capacity to recover from adversity. It is not an innate trait but a skill built through: regular sleep, exercise, healthy diet, mindfulness practice, social support, professional help when needed, deliberate reflection on experience, and continuous learning. Resilient crew perform better under stress, recover faster from difficult flights, and have longer, healthier careers. Building resilience is a CRM competency." },
    { type: "table", caption: "Coping Strategies — Immediate and Long-Term", headers: ["Strategy Type", "Examples", "When to Use"], rows: [
      ["Immediate", "Tactical breathing, mental reset, peer support, task rotation, strategic caffeine", "During operations, in the moment"],
      ["Daily", "Adequate sleep, healthy meals, hydration, exercise, social time", "Between flights, daily routine"],
      ["Long-term", "Regular sleep schedule, exercise routine, mindfulness practice, professional development", "Ongoing career practice"],
      ["Recovery", "Time off, vacation, counselling, peer support programmes", "After particularly stressful events"],
    ]},
    { type: "list", items: [
      "Aim for 7-9 hours of sleep per 24 hours — strategic naps if overnight sleep is short",
      "Maintain hydration — cabin air is very dry, dehydration impairs performance",
      "Eat regular, balanced meals — blood sugar stability supports alertness",
      "Exercise regularly — improves sleep quality, mood, and stress tolerance",
      "Practise mindfulness or meditation — even 5 minutes daily builds resilience",
      "Build a social support network — colleagues, friends, family",
      "Seek professional help early — employee assistance programmes are confidential",
      "Reflect on experience — what went well, what to improve, what to learn",
    ]},
    { type: "knowledgeCheck", question: "What is the Window of Circadian Low (WOCL), and when does it typically occur?", options: ["Period of peak alertness in the morning", "Period of lowest alertness, typically 3-5 am body clock time", "Period of lowest alertness in the early afternoon", "Period of peak alertness in the evening"], correctAnswer: 1, explanation: "The Window of Circadian Low (WOCL) is the period of lowest circadian-driven alertness, typically occurring between 3-5 am body clock time. During the WOCL, alertness, reaction time, and decision-making are all impaired. Cabin crew operating overnight flights or crossing time zones are particularly affected by WOCL timing." },
  ],

  "crm-lesson-11-1": [
    { type: "heading", text: "The Science of Fatigue", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual defines fatigue as 'a physiological state of reduced mental or physical performance capability resulting from sleep loss, extended wakefulness, circadian phase, or workload.' Fatigue is not simply feeling tired — it is a measurable impairment of cognitive and physical function that can be as severe as alcohol intoxication. Research cited in the manual shows that being awake for 17 hours impairs performance equivalent to a blood alcohol concentration (BAC) of 0.05%; after 24 hours awake, impairment is equivalent to 0.10% BAC — above the legal driving limit in most countries. This is why fatigue management is not optional — it is a safety-critical issue that the regulator and operator must manage systematically, and that cabin crew must report honestly." },
    { type: "paragraph", text: "The manual distinguishes acute fatigue (short-term, from a single night of poor sleep or a long duty period) from chronic fatigue (accumulated over days or weeks of inadequate recovery). Acute fatigue is resolved by a single night of adequate sleep. Chronic fatigue requires multiple recovery days and may indicate underlying issues — inadequate rostering, medical conditions, lifestyle factors, or developing burnout. Cabin crew are particularly susceptible to both types due to irregular schedules, long duty periods, multiple time zone crossings, disrupted circadian rhythms, and working in a low-oxygen cabin environment (cabin altitude is typically equivalent to 6,000-8,000 feet). The effects of fatigue compound over consecutive duty days, meaning a crew member on day 4 of a trip may be significantly more impaired than on day 1, even with the same sleep." },
    { type: "callout", variant: "danger", title: "Fatigue Equals Intoxication", text: "Research shows that being awake for 17 hours impairs performance equivalent to 0.05% BAC. After 24 hours awake, impairment is equivalent to 0.10% BAC — above the legal driving limit in most countries. No airline would allow an intoxicated crew member to work, yet fatigued crew operate regularly. CRM teaches crew to recognise fatigue in themselves and others, report it honestly, and use countermeasures." },
    { type: "table", caption: "Fatigue Effects on Crew Performance", headers: ["Cognitive Effect", "Behavioural Sign", "Safety Impact"], rows: [
      ["Slower reaction time", "Delayed response to interphone, passenger requests", "Critical in emergencies where seconds matter"],
      ["Reduced attention", "Missing items on checklists, not noticing behaviour", "Safety checks may be incomplete"],
      ["Poor decision-making", "Choosing familiar but wrong actions", "May not select best course of action"],
      ["Memory problems", "Forgetting briefings, instructions, task assignments", "Information not retained, tasks missed"],
      ["Reduced communication", "Less likely to speak up, share information", "CRM breakdown, errors not caught"],
      ["Microsleeps", "Brief sleep episodes (2-30 sec) without awareness", "Extremely dangerous during safety-critical tasks"],
      ["Mood changes", "Irritability, withdrawal, low motivation", "Team cohesion and morale impact"],
    ]},
    { type: "list", items: [
      "Yawning, head nodding, eye rubbing, heavy eyelids",
      "Difficulty concentrating, mind wandering",
      "Slow responses, delayed reactions",
      "Irritability, mood changes, withdrawal",
      "Missing items on checklists",
      "Forgetting recent information or instructions",
      "Reduced communication, less speaking up",
      "Microsleeps — brief sleep episodes without awareness",
    ]},
    { type: "knowledgeCheck", question: "According to research cited in the Academy INFOHAS manual, being awake for how many hours impairs performance equivalent to a blood alcohol concentration of 0.10% (above the legal driving limit in most countries)?", options: ["12 hours", "17 hours", "24 hours", "36 hours"], correctAnswer: 2, explanation: "After 24 hours awake, performance impairment is equivalent to a 0.10% BAC — above the legal driving limit in most countries. Being awake for 17 hours impairs performance equivalent to 0.05% BAC. These findings highlight why fatigue management is a safety-critical issue, not optional." },
  ],

  "crm-lesson-11-2": [
    { type: "heading", text: "WOCL, Jet Lag, and Circadian Disruption", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents the Window of Circadian Low (WOCL) as the most safety-critical period for cabin crew. The WOCL occurs between approximately 3:00 am and 5:00 am body clock time, with a smaller secondary dip between 3:00 pm and 5:00 pm. During the WOCL, alertness, reaction time, decision-making, and mood are all at their lowest. Performance during the WOCL is comparable to moderate fatigue. Crew operating overnight flights, early morning departures, or arriving in different time zones during their body-clock WOCL are at significantly elevated risk of error. The manual recommends that operators schedule critical tasks outside the WOCL wherever possible, and that crew apply specific countermeasures during WOCL periods (strategic caffeine, light exposure, task rotation, increased cross-monitoring)." },
    { type: "paragraph", text: "Jet lag occurs when crew cross multiple time zones faster than their circadian rhythm can adjust. The circadian rhythm adjusts at approximately one hour per day, so crossing six time zones requires about six days for full adjustment. Symptoms of jet lag include disturbed sleep (insomnia at destination night, sleepiness during destination day), digestive disturbances, reduced cognitive performance, irritability, and general malaise. Eastward travel (advancing the clock) is typically harder to adjust to than westward travel (delaying the clock) because the body's natural clock runs slightly longer than 24 hours, making delay easier than advance. The manual presents specific jet lag management techniques: pre-flight adjustment (gradually shift sleep/wake times before travel), light management (bright light in destination morning, avoid light in destination evening), strategic caffeine, melatonin under medical supervision, and adequate hydration." },
    { type: "callout", variant: "warning", title: "WOCL — Critical Period", text: "The Window of Circadian Low (3-5 am body clock time) is the most safety-critical period for cabin crew. Alertness, reaction time, and decision-making are all at their lowest. Performance during WOCL is comparable to moderate fatigue. Operators should schedule critical tasks outside WOCL wherever possible; crew should apply specific countermeasures (strategic caffeine, light exposure, task rotation, increased cross-monitoring) during WOCL periods." },
    { type: "table", caption: "WOCL Times and Impact on Crew", headers: ["Body Clock Time", "Circadian State", "Performance Impact"], rows: [
      ["3-5 am", "Primary WOCL — lowest alertness", "Comparable to moderate fatigue"],
      ["3-5 pm", "Secondary dip — moderate alertness reduction", "Mild impairment, manageable"],
      ["8-10 am", "Peak morning alertness", "Optimal performance"],
      ["6-8 pm", "Peak evening alertness", "Optimal performance"],
      ["10 pm-12 am", "Declining alertness, sleep onset approaching", "Reduced but functional"],
    ]},
    { type: "list", items: [
      "Pre-flight adjustment — gradually shift sleep/wake times before crossing time zones",
      "Light management — bright light in destination morning, avoid light in destination evening",
      "Strategic caffeine — small doses during WOCL, not within 6 hours of planned sleep",
      "Melatonin — under medical supervision, may help adjust circadian rhythm",
      "Hydration — cabin air is dry, dehydration worsens jet lag",
      "Strategic napping — short naps (20-30 min) help, long naps disrupt night sleep",
      "Avoid alcohol — disrupts sleep quality, worsens jet lag",
      "Adapt to destination time — eat, sleep, work on local time as soon as possible",
    ]},
    { type: "knowledgeCheck", question: "Why is eastward jet travel typically harder to adjust to than westward travel?", options: ["Eastward travel is faster", "The body's natural circadian clock runs slightly longer than 24 hours, making delay (westward) easier than advance (eastward)", "Eastward travel crosses more time zones", "Westward travel is during daylight"], correctAnswer: 1, explanation: "The body's natural circadian clock runs slightly longer than 24 hours (approximately 24.2 hours), making it easier to delay (stay up later, sleep later — westward travel) than to advance (go to sleep earlier, wake earlier — eastward travel). This is why eastward travel typically causes worse jet lag and takes longer to adjust to." },
  ],

  "crm-lesson-11-3": [
    { type: "heading", text: "Burnout Stages and FRMS", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents burnout as the endpoint of sustained, unmanaged stress and fatigue. Burnout is characterised by emotional exhaustion, depersonalisation (cynicism, detachment from work and people), and reduced sense of personal accomplishment. The manual describes four stages of burnout: Stage 1 (Honeymoon) — high engagement, high energy, but beginning to neglect self-care; Stage 2 (Awakening) — initial signs of fatigue, irritability, sleep disturbance, declining performance; Stage 3 (Chronic Stress) — sustained symptoms, physical health effects (headaches, digestive issues, frequent illness), increasing detachment from work; Stage 4 (Burnout) — full syndrome, inability to function effectively, requiring significant time off and professional intervention. The manual emphasises that burnout is preventable if recognised early (Stages 1-2) and addressed through workload reduction, self-care, and professional support." },
    { type: "paragraph", text: "A Fatigue Risk Management System (FRMS) is the manual's recommended organisational approach to managing fatigue systematically. FRMS is defined by ICAO as 'a data-driven means of continuously monitoring and managing fatigue-related safety risks, based on scientific principles and knowledge that ensures flight crew members are performing at adequate levels of alertness.' An FRMS has several components: a fatigue management policy, fatigue education and awareness training, fatigue reporting mechanisms, fatigue monitoring (using sleep data, performance data, and incident data), fatigue investigation processes, and continuous improvement. For cabin crew, the FRMS means: the operator has systems to monitor fatigue levels across the operation, crew have a non-punitive way to report fatigue, fatigue data is analysed to identify systemic issues, and rosters are designed to minimise fatigue. Crew responsibilities under FRMS include: reporting to work adequately rested, using off-duty time for recovery, reporting fatigue honestly, and not operating if unfit due to fatigue." },
    { type: "callout", variant: "info", title: "FRMS Components", text: "A Fatigue Risk Management System (FRMS) includes: (1) a fatigue management policy, (2) fatigue education and awareness training, (3) fatigue reporting mechanisms (non-punitive), (4) fatigue monitoring (sleep, performance, incident data), (5) fatigue investigation processes, and (6) continuous improvement. FRMS is the systematic, data-driven approach to managing fatigue across the operation." },
    { type: "table", caption: "Burnout Stages — Recognition and Action", headers: ["Stage", "Signs", "Action Required"], rows: [
      ["1. Honeymoon", "High engagement, high energy, neglecting self-care", "Maintain self-care, recognise the pattern"],
      ["2. Awakening", "Fatigue, irritability, sleep disturbance, declining performance", "Reduce workload, prioritise recovery, seek support"],
      ["3. Chronic Stress", "Sustained symptoms, physical health effects, detachment", "Significant workload reduction, professional support"],
      ["4. Burnout", "Full syndrome, inability to function effectively", "Time off, professional intervention, possible career change"],
    ]},
    { type: "list", items: [
      "Crew responsibilities — report to work adequately rested",
      "Crew responsibilities — use off-duty time for recovery",
      "Crew responsibilities — report fatigue honestly and without fear of punishment",
      "Crew responsibilities — do not operate if unfit due to fatigue",
      "Operator responsibilities — design rosters that minimise fatigue",
      "Operator responsibilities — provide non-punitive fatigue reporting",
      "Operator responsibilities — monitor fatigue data across the operation",
      "Operator responsibilities — investigate fatigue-related incidents",
      "Continuous improvement — adapt FRMS based on data and experience",
    ]},
    { type: "knowledgeCheck", question: "According to the Academy INFOHAS manual, what are the three characteristic features of burnout?", options: ["Anger, sadness, fear", "Emotional exhaustion, depersonalisation (cynicism/detachment), reduced sense of personal accomplishment", "Sleep problems, weight gain, headaches", "Boredom, frustration, dissatisfaction"], correctAnswer: 1, explanation: "Burnout is characterised by three features: emotional exhaustion (feeling drained, unable to recover), depersonalisation (cynicism, detachment from work and people), and reduced sense of personal accomplishment (feeling ineffective, questioning the value of the work). Burnout is the endpoint of sustained, unmanaged stress and fatigue, and is preventable if recognised early." },
  ],

  // ============================================================================
  // CHAPTER 10 — COCKPIT-CABIN COORDINATION (crm-lesson-14-1 to 14-3)
  // ============================================================================

  "crm-lesson-14-1": [
    { type: "heading", text: "The Cockpit-Cabin Team", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual insists that the flight deck and cabin are not separate departments — they are one crew with shared safety goals. The Commander has overall responsibility for the aircraft, but cabin crew have expertise and responsibilities that the flight deck relies on. The cabin crew are the Commander's eyes and ears in the cabin, reporting on passenger conditions, security concerns, abnormal sounds, smells, and any unusual situations. In return, the flight deck provides the cabin crew with information about flight conditions, timing, anticipated events, and any issues that may affect cabin operations. The manual emphasises that this information flow must be bidirectional and continuous — silence between flight deck and cabin is not 'no news is good news,' it is potentially missed information." },
    { type: "paragraph", text: "Coordination principles between flight deck and cabin include: structured briefings before each flight phase (pre-departure, top of descent, anticipated non-routine events); standardised communication formats (NITS for flight deck to cabin, structured call format for cabin to flight deck); clear escalation paths (when does cabin call the flight deck directly vs. when through SCCM?); and shared mental models (both teams need to understand the same situation). The manual describes specific coordination touchpoints: pre-flight crew briefing (flight deck briefs cabin on flight time, weather, anticipated events, security, NOTOC); cabin secure confirmation (cabin confirms secure for taxi and takeoff); cruise coordination (flight deck notifies cabin of turbulence, expected descent time, any abnormal situations); pre-landing coordination (cabin confirms secure for landing); and post-landing (debrief of any issues)." },
    { type: "callout", variant: "info", title: "One Crew Concept", text: "The flight deck and cabin are one crew with shared safety goals. The Commander has overall responsibility, but cabin crew are the Commander's eyes and ears in the cabin. Information flow must be bidirectional and continuous. Silence between flight deck and cabin is not 'no news is good news' — it is potentially missed information." },
    { type: "table", caption: "Coordination Touchpoints — Flight Phases", headers: ["Flight Phase", "Flight Deck to Cabin", "Cabin to Flight Deck"], rows: [
      ["Pre-flight briefing", "Flight time, weather, events, security, NOTOC", "Cabin crew status, special passengers, equipment issues"],
      ["Pre-departure", "Door close signal, taxi start", "Cabin secure confirmation for taxi/takeoff"],
      ["Cruise", "Turbulence expected, descent time, abnormal situations", "Cabin issues, passenger concerns, medical events"],
      ["Pre-landing", "Top of descent, expected landing time", "Cabin secure for landing confirmation"],
      ["Post-landing", "Parking, engine shutdown, disembarkation", "Cabin status, passenger issues, equipment problems"],
      ["Non-routine", "NITS briefing — Nature, Intentions, Time, Special instructions", "Cabin status reports, requests for information"],
    ]},
    { type: "list", items: [
      "Pre-flight crew briefing — flight deck briefs cabin on flight details",
      "Cabin secure confirmation — cabin confirms secure for taxi and takeoff",
      "Cruise coordination — flight deck notifies cabin of turbulence, descent time, abnormal situations",
      "Pre-landing coordination — cabin confirms secure for landing",
      "Post-landing coordination — debrief of any issues",
      "NITS briefing for non-routine situations — Nature, Intentions, Time, Special instructions",
      "Cabin to flight deck calls — identify yourself, state the issue, provide relevant details",
      "Sterile cockpit rule below 10,000 feet — only safety-critical communication",
    ]},
    { type: "knowledgeCheck", question: "Why does the Academy INFOHAS manual emphasise that information flow between flight deck and cabin must be bidirectional and continuous?", options: ["Because passengers want updates", "Because silence is not 'no news is good news' — it is potentially missed information, and both teams have critical information the other needs", "Because regulators require communication logs", "Because crew get bored"], correctAnswer: 1, explanation: "The manual emphasises bidirectional, continuous communication because silence between flight deck and cabin is not 'no news is good news' — it is potentially missed information. The flight deck relies on cabin crew as their eyes and ears in the cabin; the cabin crew rely on the flight deck for flight condition and timing information. Both teams have critical information the other needs for safe operations." },
  ],

  "crm-lesson-14-2": [
    { type: "heading", text: "The NITS Briefing Format", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents the NITS briefing format as the standardised structure for flight deck to cabin communication during non-routine situations. NITS stands for Nature, Intentions, Time, and Special instructions. Nature: what is the situation? (e.g., 'We have an engine indication abnormality on the right engine.') Intentions: what does the Commander plan to do? (e.g., 'We plan to divert to [airport] and conduct a precautionary disembarkation.') Time: how much time is available before action? (e.g., 'We expect landing in approximately 25 minutes. I need the cabin secured in 15.') Special instructions: what does the cabin crew need to do? (e.g., 'Complete a full cabin secure check. Brief passengers for precautionary disembarkation. Have cabin crew at their stations 10 minutes before landing.'). The NITS format ensures all critical information is communicated in a structured, memorable way." },
    { type: "paragraph", text: "NITS is appropriate for any non-routine situation that requires cabin preparation: anticipated emergency landing, diversion, precautionary disembarkation, security event, medical diversion, abnormal landing configuration (e.g., overweight landing, flap asymmetry). The SCCM receives the NITS briefing from the flight deck (typically via interphone), then re-briefs the cabin crew using the same NITS structure to ensure all crew have the same information. The SCCM should always confirm understanding by reading back the key elements of the NITS briefing — closed-loop communication applied at the briefing level. If any element of NITS is unclear or missing, the SCCM should request clarification before acting. The manual provides sample NITS briefings for various scenarios, and recommends that cabin crew practise receiving and re-briefing NITS during training." },
    { type: "callout", variant: "tip", title: "NITS Briefing Example", text: "N — Nature: 'We have a right engine oil pressure indication abnormality.' I — Intentions: 'We plan to divert to Geneva and conduct a normal landing, with emergency services on standby.' T — Time: 'Expect landing in 20 minutes; cabin secure in 12 minutes.' S — Special instructions: 'Full cabin secure, brief passengers for possible precautionary disembarkation after landing, crew at stations 8 minutes before landing.'" },
    { type: "table", caption: "NITS Components Explained", headers: ["Component", "Question", "Example"], rows: [
      ["N — Nature", "What is the situation?", "Engine indication abnormality, smell of smoke in flight deck, medical event, security concern"],
      ["I — Intentions", "What does the Commander plan to do?", "Divert to [airport], precautionary disembarkation, return to departure airport"],
      ["T — Time", "How much time is available?", "Landing in 20 minutes; cabin secure in 12; crew at stations in 8"],
      ["S — Special instructions", "What does the cabin crew need to do?", "Full cabin secure, brief passengers, prepare for evacuation, specific door operations"],
    ]},
    { type: "list", items: [
      "Receive NITS briefing from flight deck via interphone",
      "Confirm understanding by reading back key elements — closed-loop",
      "Request clarification if any element is unclear or missing",
      "Re-brief all cabin crew using the same NITS structure",
      "Assign specific tasks to each crew member based on Special instructions",
      "Confirm cabin crew readiness back to flight deck before critical phases",
      "Maintain NITS structure if situation evolves — re-brief with updates",
      "Debrief after the event — what worked, what could improve",
    ]},
    { type: "knowledgeCheck", question: "What does each letter of the NITS briefing format stand for?", options: ["Number, Identification, Time, Status", "Nature, Intentions, Time, Special instructions", "Name, Issue, Target, Solution", "Notice, Information, Task, Schedule"], correctAnswer: 1, explanation: "NITS stands for: N — Nature (what is the situation?), I — Intentions (what does the Commander plan to do?), T — Time (how much time is available?), S — Special instructions (what does the cabin crew need to do?). NITS is the standardised format for flight deck to cabin communication during non-routine situations." },
  ],

  "crm-lesson-14-3": [
    { type: "heading", text: "The Sterile Cockpit Rule", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents the Sterile Cockpit Rule as a critical safety regulation that restricts communication between cabin and flight deck during the most safety-critical phases of flight. The rule, codified in FAA FAR 121.542 (and equivalent in EASA and other regulators), requires that below 10,000 feet altitude (during climb and descent), only safety-critical communication is permitted between cabin and flight deck. Non-urgent calls during this phase can distract the flight crew during the most demanding phases of flight — takeoff, initial climb, approach, and landing — when their workload is highest and the aircraft is closest to terrain and other aircraft. The rule exists because accident investigation has repeatedly shown that flight crew distraction during critical phases has contributed to accidents." },
    { type: "paragraph", text: "The manual is explicit about what constitutes a safety-critical communication that justifies breaking sterile cockpit. Permitted communications include: safety issues (smoke, fire, unusual smell, abnormal noise, security concern), medical emergencies requiring immediate attention, abnormal situations affecting aircraft safety, and any situation where crew judgement indicates the flight deck needs to know. NOT permitted during sterile cockpit: routine service requests, passenger complaints, galley equipment issues, schedule information, non-urgent passenger needs. The cabin crew must use judgement — when in doubt, the rule of thumb is: would the flight deck's situational awareness be reduced if they did not know this? If yes, call. If no, wait until above 10,000 feet. The manual emphasises that the Sterile Cockpit Rule does not prevent safety-critical calls — it prevents non-critical calls. Crew should never hesitate to break sterile cockpit for a genuine safety concern." },
    { type: "callout", variant: "danger", title: "Sterile Cockpit Violations", text: "The Sterile Cockpit Rule (below 10,000 feet — climb and descent) restricts flight deck-cabin communication to safety-critical only. Non-urgent calls during this phase distract the flight crew during the most demanding phases of flight. Permitted: safety issues, medical emergencies, security concerns, abnormal situations. NOT permitted: routine service, passenger complaints, schedule questions. When in doubt, use judgement — would the flight deck's situational awareness be reduced if they did not know this?" },
    { type: "table", caption: "Sterile Cockpit Phases and Communication Rules", headers: ["Altitude / Phase", "Communication Permitted", "Communication Not Permitted"], rows: [
      ["Below 10,000 ft — climb", "Safety-critical only", "Routine service, passenger issues"],
      ["Below 10,000 ft — descent", "Safety-critical only", "Schedule, non-urgent questions"],
      ["Above 10,000 ft — cruise", "All communication", "None restricted"],
      ["Taxi", "Safety-critical + operational", "Personal conversation"],
      ["Parking", "All communication", "None restricted"],
    ]},
    { type: "list", items: [
      "Safety issues — smoke, fire, unusual smell, abnormal noise",
      "Medical emergencies requiring immediate flight deck awareness",
      "Security concerns — suspicious behaviour, threats, disturbances",
      "Abnormal situations affecting aircraft safety",
      "Any situation where crew judgement indicates the flight deck needs to know",
      "Use judgement: would the flight deck's situational awareness be reduced if they did not know this?",
      "When in doubt, call — never hesitate to break sterile cockpit for a genuine safety concern",
      "Document any sterile cockpit calls for post-flight debrief",
    ]},
    { type: "knowledgeCheck", question: "Below what altitude does the Sterile Cockpit Rule restrict flight deck-cabin communication to safety-critical only?", options: ["5,000 feet", "10,000 feet", "15,000 feet", "18,000 feet"], correctAnswer: 1, explanation: "The Sterile Cockpit Rule (FAA FAR 121.542 and EASA equivalent) restricts flight deck-cabin communication to safety-critical only below 10,000 feet altitude, during climb and descent. This is because these phases (takeoff, initial climb, approach, landing) are the most demanding for the flight crew, and distraction during these phases has been a contributing factor in many accidents." },
  ],

  // ============================================================================
  // CHAPTER 10 — EMERGENCY COMMUNICATION (crm-lesson-16-1 to 16-3)
  // ============================================================================

  "crm-lesson-16-1": [
    { type: "heading", text: "Emergency Communication Principles", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual treats emergency communication as a distinct discipline from routine communication. Emergency communication must be: brief (seconds count, not minutes), directive (tell passengers exactly what to do), repetitive (passengers under stress do not absorb information first time), paced (slow enough to understand, fast enough to act), and authoritative (use command voice, not request voice). The manual contrasts normal announcement style ('Ladies and gentlemen, we will be beginning our descent shortly...') with emergency announcement style ('Heads down! Stay down!'). The differences are deliberate — emergency communication is engineered to produce immediate action, not to inform or entertain. Cabin crew must practise both styles and switch between them instantly as situations change." },
    { type: "paragraph", text: "The command voice technique is the manual's recommended vocal approach for emergency announcements. Command voice is: loud (above cabin noise), low-pitched (carries further, sounds authoritative), slow (passengers under stress process slowly), with emphasis on action verbs ('Jump!', 'Stay!', 'Move!'). The manual warns against 'up-talk' (rising intonation at end of sentence, which sounds like a question) and against hedging language ('please', 'if you could', 'we would like you to'). Emergency commands are not requests — they are instructions that passengers must follow for their own safety. Crew must also use physical commands: pointing at exits, gesturing for brace position, physically directing passengers. Verbal and physical commands reinforce each other and are more effective together than either alone." },
    { type: "callout", variant: "danger", title: "Emergency PA Timing", text: "Emergency announcements must be timed correctly. Too early — passengers may not take it seriously or may panic unnecessarily. Too late — passengers have insufficient time to prepare. The general rule is: announce as soon as the situation is confirmed and crew know what passengers need to do. Coordinate timing with the flight deck — they will indicate when cabin preparation should begin. Always confirm the PA is working before making emergency announcements; have backup (shouted commands) ready if PA fails." },
    { type: "table", caption: "Emergency Announcement Types and Structure", headers: ["Type", "Purpose", "Example Structure"], rows: [
      ["Brace announcement", "Prepare passengers for impact", "Brace, brace! Heads down! Stay down!"],
      ["Evacuation announcement", "Direct evacuation", "Evacuate! Evacuate! Leave everything! Come this way!"],
      ["Turbulence announcement", "Secure passengers and cabin", "Cabin crew, take your seats immediately. Passengers fasten seatbelts."],
      ["Diversion announcement", "Inform passengers of plan", "Ladies and gentlemen, we are diverting to [airport] due to [reason]. Please remain seated."],
      ["Medical announcement", "Request medical assistance", "If there is a medical professional on board, please identify yourself to a crew member."],
    ]},
    { type: "list", items: [
      "Brief — seconds count, not minutes",
      "Directive — tell passengers exactly what to do",
      "Repetitive — passengers under stress do not absorb information first time",
      "Paced — slow enough to understand, fast enough to act",
      "Authoritative — command voice, not request voice",
      "Loud, low-pitched, slow, with emphasis on action verbs",
      "No 'up-talk' (rising intonation) or hedging ('please', 'if you could')",
      "Combine verbal and physical commands — point, gesture, direct",
    ]},
    { type: "knowledgeCheck", question: "What is 'command voice' technique as described in the Academy INFOHAS manual?", options: ["Speaking quietly to avoid panic", "Loud, low-pitched, slow, with emphasis on action verbs", "Speaking rapidly to convey urgency", "Speaking in the local language"], correctAnswer: 1, explanation: "Command voice is loud (above cabin noise), low-pitched (carries further, sounds authoritative), slow (passengers under stress process slowly), with emphasis on action verbs ('Jump!', 'Stay!', 'Move!'). Emergency commands are not requests — they are instructions passengers must follow for their own safety. Command voice contrasts with 'up-talk' and hedging language." },
  ],

  "crm-lesson-16-2": [
    { type: "heading", text: "Evacuation Commands and Crowd Control", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents evacuation commands as engineered communication — every word is chosen for maximum effectiveness under extreme stress. The standard evacuation commands are: 'Unfasten seatbelts!' (the first command, because seatbelts are the most common reason passengers cannot move); 'Come this way!' (directs passengers to a usable exit); 'Leave everything!' (passengers trying to take belongings slows evacuation dangerously and has contributed to evacuation failures); 'Jump! Slide!' (at the exit, directs passengers onto the slide); 'Keep moving!' (prevents passengers from stopping at the bottom of the slide); 'Move away from the aircraft!' (prevents passengers clustering near the aircraft, which is dangerous if fire spreads or explosion occurs). Commands are short, directive, and shouted continuously — repetition ensures passengers hear and act." },
    { type: "paragraph", text: "Crowd control during evacuation is a CRM skill as much as a procedural one. The FAA requires that an evacuation be completable within 90 seconds using only half the available exits — meaning crew have approximately 90 seconds to manage hundreds of passengers, direct them to usable exits, prevent crushing at doorways, and ensure no one is left behind. CRM is the difference between a successful 90-second evacuation and a tragedy. If an assigned exit is unusable (fire outside, slide not deployed, debris blocking), the crew member must immediately redirect passengers to another exit: shout 'This exit blocked! Go that way!' and point to an alternative. Coordinate with the crew member at the other exit to expect additional passengers. This real-time coordination is CRM in its most critical form." },
    { type: "callout", variant: "warning", title: "Exit Blocked Procedures", text: "If your assigned exit is unusable (fire outside, slide not deployed, debris blocking), you must immediately redirect passengers to another exit. Shout 'This exit blocked! Go that way!' and point to an alternative. Coordinate with the crew member at the other exit to expect additional passengers. This real-time coordination is CRM in its most critical form — every second counts." },
    { type: "table", caption: "Evacuation Commands and Purposes", headers: ["Command", "Purpose", "When to Use"], rows: [
      ["Unfasten seatbelts!", "Free passengers to move", "First command at start of evacuation"],
      ["Come this way!", "Direct to usable exit", "Continuously during evacuation"],
      ["Leave everything!", "Prevent delays from belongings", "Continuously during evacuation"],
      ["Jump! Slide!", "Direct onto slide", "At exit, for each passenger"],
      ["Keep moving!", "Prevent stopping at bottom", "Bottom of slide"],
      ["Move away from aircraft!", "Prevent clustering near danger", "Away from aircraft"],
      ["This exit blocked! Go that way!", "Redirect to alternate", "If exit is unusable"],
      ["Stay back!", "Prevent passenger surge", "Crew at blocked exit"],
    ]},
    { type: "list", items: [
      "Cabin crew at exits — shout commands continuously, manage flow rate, prevent pile-ups",
      "CSD/CS — coordinate overall evacuation, check all exits are manned, communicate with flight deck",
      "Cabin crew in cabin — direct passengers to exits, assist mobility-impaired, check lavatories and galleys",
      "All crew — assess exit usability before opening, prevent passengers from taking belongings",
      "Post-evacuation — assemble passengers at safe distance, conduct headcount, assist injured",
      "If exit blocked — redirect immediately to alternate, coordinate with crew at alternate",
      "If crew incapacitated — nearest crew takes over their position",
      "Continuous commands — repetition ensures passengers hear and act under stress",
    ]},
    { type: "knowledgeCheck", question: "Why is 'Unfasten seatbelts!' typically the first evacuation command?", options: ["Because seatbelts are uncomfortable", "Because seatbelts are the most common reason passengers cannot move at the start of an evacuation", "Because regulations require it first", "Because the flight deck requests it"], correctAnswer: 1, explanation: "'Unfasten seatbelts!' is typically the first evacuation command because seatbelts are the most common reason passengers cannot move at the start of an evacuation. Passengers may be disoriented or stunned after an incident and not realise their seatbelt is still fastened. Reminding them to unfasten is the first step to enabling movement to exits." },
  ],

  "crm-lesson-16-3": [
    { type: "heading", text: "Reassuring Passengers in Crisis", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual addresses passenger reassurance as a critical CRM skill during emergencies. Passengers under stress exhibit predictable behaviours: some freeze (unable to act), some panic (irrational, possibly dangerous actions), some become dependent (need constant direction), some remain calm and helpful, and some take charge (sometimes helpfully, sometimes disruptively). Cabin crew must recognise these behaviour types and respond appropriately — freeze passengers need clear, direct instructions repeated; panic passengers need calm, authoritative direction and physical guidance if necessary; dependent passengers need explicit task assignment; calm passengers can be enlisted to help; would-be leaders need to be co-opted as helpers, not challenged. The manual emphasises that crew demeanour sets the tone — calm, confident crew produce calmer passengers; panicked crew produce panicked passengers." },
    { type: "paragraph", text: "The brace position communication is a specific case of emergency communication that requires careful instruction. Passengers must adopt the correct brace position before impact, and the position varies depending on the seat configuration (forward-facing vs. aft-facing), the presence of a seat in front (lean forward against it), and passenger characteristics (children, pregnant passengers, passengers with disabilities). Crew must be able to demonstrate and explain the brace position clearly and quickly. The standard brace announcement is: 'Brace, brace! Heads down! Stay down!' repeated until impact and continued after impact until instructed otherwise. The manual stresses that 'Stay down!' must continue to be shouted after impact because passengers may try to rise prematurely. Brace commands should be timed to begin approximately 30 seconds before impact (or as briefed by the flight deck)." },
    { type: "callout", variant: "tip", title: "Reassurance Techniques", text: "Calm, confident crew demeanour produces calmer passengers. Use simple, directive language. Acknowledge fear without amplifying it ('I know this is frightening; follow my instructions and we will get through this together'). Provide clear, repeated instructions. Use physical guidance for passengers who cannot act alone. Enlist calm passengers as helpers. Co-opt would-be leaders as assistants, not challenges. Continuous communication prevents panic from filling silence." },
    { type: "table", caption: "Passenger Behaviour Types and Crew Response", headers: ["Type", "Behaviour", "Crew Response"], rows: [
      ["Freeze", "Unable to act, motionless", "Clear, direct instructions repeated; physical guidance"],
      ["Panic", "Irrational, possibly dangerous", "Calm, authoritative direction; physical control if necessary"],
      ["Dependent", "Needs constant direction", "Explicit task assignment; continuous reassurance"],
      ["Calm", "Composed, helpful", "Enlist as helpers; assign specific tasks"],
      ["Would-be leader", "Tries to take charge", "Co-opt as assistant; assign specific helpful role"],
    ]},
    { type: "list", items: [
      "'Brace, brace! Heads down! Stay down!' — repeated until and after impact",
      "'I know this is frightening; follow my instructions and we will get through this together'",
      "'Stay calm. Help is on the way.'",
      "'Follow me. Come this way.'",
      "'Leave everything. Your life is more important than your belongings.'",
      "'Help the person next to you.'",
      "'Stay seated until I tell you to move.'",
      "Acknowledge fear without amplifying it; provide clear, repeated direction",
    ]},
    { type: "knowledgeCheck", question: "Why must the 'Stay down!' command continue to be shouted after impact during an emergency landing?", options: ["Because passengers may be injured", "Because passengers may try to rise prematurely before the aircraft has stopped or the evacuation command is given", "Because the flight deck requests it", "To keep passengers quiet"], correctAnswer: 1, explanation: "The 'Stay down!' command must continue after impact because passengers may try to rise prematurely — before the aircraft has come to a complete stop, before the evacuation command is given, or before crew have assessed the situation. Premature rising could lead to injury from continuing impact forces, debris, or from being unbraced for secondary impacts. Crew must maintain the brace command until instructed otherwise." },
  ],

  // ============================================================================
  // CHAPTER 10 — CRM IN EMERGENCIES (crm-lesson-20-1 to 20-3)
  // ============================================================================

  "crm-lesson-20-1": [
    { type: "heading", text: "CRM Under Extreme Stress", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual addresses CRM under extreme stress as a distinct discipline. Emergencies create the most challenging environment for CRM. The physiological effects of stress — adrenaline release, tunnel vision, auditory exclusion, time distortion, fine motor skill degradation — directly attack the very CRM skills that are most needed. Crew may stop communicating, fixate on one aspect of the problem, or freeze entirely. CRM training is specifically designed to create automatic responses that function even under extreme stress. The manual emphasises that the brain under stress falls back on trained patterns — if those patterns include CRM behaviours (communicating, coordinating, checking), they will be performed even when conscious thought is impaired." },
    { type: "paragraph", text: "The key to emergency CRM is preparation. Crew who have practised emergency procedures repeatedly in training will default to those procedures under stress. This is why airlines conduct recurrent SEP (Safety and Emergency Procedures) training — the goal is not just knowledge but automaticity. When the brain is stressed, it falls back on trained patterns. If those patterns include CRM behaviours, they will be performed even when conscious thought is impaired. The manual presents the '90-second rule' as a critical concept: in many cabin emergencies, the first 90 seconds determine the outcome. CRM must be automatic in those 90 seconds — there is no time for discussion or deliberation. This is why CRM training emphasises practice, simulation, and repetition — the goal is to make CRM behaviours as automatic as breathing. Crew who hesitate to apply CRM in the first 90 seconds may lose the window for effective action." },
    { type: "callout", variant: "danger", title: "The 90-Second Rule", text: "In many cabin emergencies, the first 90 seconds determine the outcome. CRM must be automatic in those 90 seconds — there is no time for discussion or deliberation. This is why CRM training emphasises practice, simulation, and repetition — the goal is to make CRM behaviours as automatic as breathing. Crew who hesitate to apply CRM in the first 90 seconds may lose the window for effective action." },
    { type: "table", caption: "Stress Effects on CRM and Countermeasures", headers: ["Stress Effect", "Impact on CRM", "Training Countermeasure"], rows: [
      ["Tunnel vision", "Focuses on one thing, misses other threats", "SOPs require checking all areas; crew cross-monitoring"],
      ["Auditory exclusion", "Doesn't hear calls or alarms", "Closed-loop communication; physical touch to get attention"],
      ["Time distortion", "Time feels slower/faster than reality", "Standard time references; communicate timing explicitly"],
      ["Freezing", "Unable to act or decide", "Command voice from leader; clear task assignment; physical direction"],
      ["Memory impairment", "Forgets trained procedures", "Checklists; procedural cards; crew cross-checking"],
      ["Fine motor degradation", "Cannot operate small controls", "Practise with gloves; use gross motor alternatives"],
    ]},
    { type: "list", items: [
      "Preparation is the key — train until procedures are automatic",
      "Recurrent SEP training builds the automaticity that works under stress",
      "The brain under stress falls back on trained patterns",
      "If trained patterns include CRM, CRM will be performed",
      "The first 90 seconds determine outcome — CRM must be automatic",
      "Practise, simulate, repeat — make CRM as automatic as breathing",
      "Crew cross-monitoring compensates for individual stress effects",
      "Command voice from leader breaks freezing and re-engages action",
    ]},
    { type: "knowledgeCheck", question: "According to the '90-second rule' presented in the Academy INFOHAS manual, what determines the outcome in many cabin emergencies?", options: ["The quality of the aircraft", "The first 90 seconds of the response", "The number of crew available", "The weather conditions"], correctAnswer: 1, explanation: "According to the 90-second rule, in many cabin emergencies, the first 90 seconds determine the outcome. CRM must be automatic in those 90 seconds — there is no time for discussion or deliberation. This is why CRM training emphasises practice, simulation, and repetition, building automaticity that functions even when conscious thought is impaired by stress." },
  ],

  "crm-lesson-20-2": [
    { type: "heading", text: "Smoke, Fire, and Evacuation CRM", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual treats in-flight fire as the most time-critical cabin emergency — fire can become non-survivable in as little as 2-3 minutes if not controlled. CRM for fire response is highly structured: the crew member who detects the fire immediately notifies the SCCM (location, type, size); the SCCM assigns roles (firefighter, communicator, crowd manager, equipment retriever); the firefighter applies the appropriate extinguisher (water for paper/wood, BCF/Halon for electrical and flammable liquids, water for fabric but careful of electrical); the communicator notifies the flight deck with NITS briefing format; the crowd manager moves passengers away from the area and prepares for possible evacuation; the equipment retriever gets backup extinguishers, PBE (protective breathing equipment), and crash axes. Coordination is critical — the firefighter cannot fight the fire and communicate simultaneously, so roles must be divided." },
    { type: "paragraph", text: "Smoke and fume management is closely related. Smoke reduces visibility, irritates eyes and lungs, and can cause incapacitation within minutes. Crew must don PBE before entering smoke-filled areas — PBE provides approximately 15 minutes of breathable air. Passengers should be given wet towels (if available) to hold over nose and mouth. The flight deck must be notified immediately because smoke in the cabin may indicate a more serious problem (cargo fire, electrical fire, engine fire) and may require immediate descent and diversion. The manual emphasises the principle that 'fire is fast, smoke is faster' — smoke can fill a cabin in under 90 seconds, and smoke inhalation is a leading cause of evacuation failure. Crew must move quickly to identify source, isolate power if electrical, apply extinguisher, and prepare cabin for possible evacuation. Coordination with the flight deck throughout is critical — the Commander makes the evacuation decision based on cabin crew reports." },
    { type: "callout", variant: "danger", title: "Fire Fighting CRM", text: "Fire can become non-survivable in as little as 2-3 minutes. CRM for fire response: detector notifies SCCM; SCCM assigns roles (firefighter, communicator, crowd manager, equipment retriever); firefighter applies appropriate extinguisher; communicator notifies flight deck with NITS; crowd manager moves passengers; equipment retriever gets backup. Coordination is critical — the firefighter cannot fight fire and communicate simultaneously. 'Fire is fast, smoke is faster.' Smoke can fill a cabin in under 90 seconds." },
    { type: "table", caption: "Fire Fighting Roles in Cabin Crew", headers: ["Role", "Responsibility", "Key Actions"], rows: [
      ["Detector", "First crew to detect fire", "Notify SCCM with location, type, size; assess"],
      ["Firefighter", "Apply extinguisher", "Don PBE; select correct extinguisher; apply; isolate power if electrical"],
      ["Communicator", "Notify flight deck and crew", "Call flight deck with NITS; brief other crew; PA passengers if needed"],
      ["Crowd manager", "Move passengers, prepare cabin", "Move passengers away from area; prepare for possible evacuation"],
      ["Equipment retriever", "Get backup equipment", "Backup extinguishers; PBE; crash axe; flashlight"],
      ["SCCM", "Coordinate overall response", "Assign roles; coordinate with flight deck; decide on evacuation"],
    ]},
    { type: "list", items: [
      "Identify the source of smoke/fire — investigate quickly",
      "Isolate power if electrical — switch off affected system",
      "Select correct extinguisher — water for paper/wood, BCF/Halon for electrical/flammable liquids",
      "Don PBE before entering smoke-filled areas — 15 minutes breathable air",
      "Notify flight deck immediately with NITS — Nature, Intentions, Time, Special instructions",
      "Move passengers away from affected area",
      "Prepare cabin for possible evacuation — brief passengers, crew at stations",
      "Coordinate throughout — Commander makes evacuation decision based on cabin reports",
    ]},
    { type: "knowledgeCheck", question: "How quickly can a cabin fire become non-survivable if not controlled, according to the Academy INFOHAS manual?", options: ["10-15 minutes", "5-7 minutes", "2-3 minutes", "30 minutes"], correctAnswer: 2, explanation: "According to the Academy INFOHAS manual, a cabin fire can become non-survivable in as little as 2-3 minutes if not controlled. This is why fire response CRM is so highly structured and time-critical — every second counts. 'Fire is fast, smoke is faster' — smoke can fill a cabin in under 90 seconds, and smoke inhalation is a leading cause of evacuation failure." },
  ],

  "crm-lesson-20-3": [
    { type: "heading", text: "Post-Incident Debrief and Lessons Learned", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual treats the post-incident debrief as a critical CRM activity — the moment when crew turn experience into organisational learning. The debrief should occur as soon as practical after the incident, while memories are fresh and before the crew disperse. The structure recommended is: What was supposed to happen? What actually happened? Why was there a difference? What did we learn? What will we do differently? The debrief should be blame-free — the goal is learning, not assigning fault. In a Just Culture, honest errors are distinguished from reckless behaviour, and crew who report honestly are protected from punishment. The SCCM facilitates the debrief, ensuring all crew have the opportunity to speak, that observations are specific and behavioural (not personal), and that lessons are captured for follow-up." },
    { type: "paragraph", text: "The lessons learned process extends beyond the immediate crew. Significant incidents should be reported through the operator's safety reporting system (ASR — Air Safety Report, or equivalent), investigated by the safety department, and the lessons shared across the operation through safety bulletins, training updates, and procedure revisions. The manual emphasises that CRM is a learning system — every incident, near-miss, and observation is a data point that improves the system. Crew who do not report deprive the system of learning. Crew who report dishonestly (covering up their own errors) deprive the system of accurate data. The manual explicitly rejects 'blame and punish' cultures in favour of 'learn and improve' cultures, citing extensive research showing that blame cultures suppress reporting and increase accident rates, while Just Cultures increase reporting and reduce accident rates over time." },
    { type: "callout", variant: "tip", title: "Just Culture Debrief", text: "The post-incident debrief should be blame-free — the goal is learning, not assigning fault. In a Just Culture, honest errors are distinguished from reckless behaviour, and crew who report honestly are protected from punishment. Structure: What was supposed to happen? What actually happened? Why the difference? What did we learn? What will we do differently? The SCCM facilitates; all crew contribute; lessons are captured for follow-up." },
    { type: "table", caption: "Post-Incident Debrief Framework", headers: ["Step", "Question", "Output"], rows: [
      ["1", "What was supposed to happen?", "Shared understanding of expected procedure"],
      ["2", "What actually happened?", "Factual account of events"],
      ["3", "Why was there a difference?", "Root cause analysis — system, human, organisational"],
      ["4", "What did we learn?", "Specific lessons identified"],
      ["5", "What will we do differently?", "Action items — procedures, training, equipment"],
      ["6", "Report through safety system", "ASR submission; investigation if warranted"],
    ]},
    { type: "list", items: [
      "What was supposed to happen — shared understanding of expected procedure",
      "What actually happened — factual account of events, not interpretation",
      "Why was there a difference — root cause analysis, not blame",
      "What did we learn — specific, actionable lessons",
      "What will we do differently — concrete action items",
      "Report through safety reporting system — ASR or equivalent",
      "Significant incidents trigger formal investigation by safety department",
      "Lessons shared across the operation through bulletins, training, procedure updates",
    ]},
    { type: "knowledgeCheck", question: "What is the recommended structure for a post-incident debrief according to the Academy INFOHAS manual?", options: ["Who is responsible? What is the punishment?", "What was supposed to happen? What actually happened? Why the difference? What did we learn? What will we do differently?", "What is the cost? Who will pay?", "What is the regulatory requirement? What is the legal liability?"], correctAnswer: 1, explanation: "The recommended post-incident debrief structure is: (1) What was supposed to happen? (2) What actually happened? (3) Why was there a difference? (4) What did we learn? (5) What will we do differently? This blame-free structure is designed for learning, not assigning fault, and is a cornerstone of a Just Culture." },
  ],

  // ============================================================================
  // CASE STUDIES (crm-lesson-21-1 to 21-3)
  // ============================================================================

  "crm-lesson-21-1": [
    { type: "heading", text: "Tenerife 1977 — Detailed Case Study", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents Tenerife as the foundational CRM case study — the accident that gave birth to the discipline. On 27 March 1977, Los Rodeos Airport on Tenerife was operating at capacity after a bomb explosion at Gran Canaria Airport had diverted traffic there. Two Boeing 747s — KLM Flight 4805 (Captain Jacob Veldhuyzen van Zanten) and Pan Am Flight 1736 (Captain Victor Grubbs) — were among the diverted aircraft. Dense fog reduced visibility to a few hundred metres. After Gran Canaria reopened, both aircraft taxied for departure. There was no ground radar, and ATC communicated with the aircraft via radio, with significant language barriers and non-standard phraseology. The KLM aircraft was taxiing on the active runway for takeoff; the Pan Am aircraft was taxiing on the same runway in the opposite direction, intending to exit at a taxiway. They could not see each other due to fog." },
    { type: "paragraph", text: "The KLM captain, impatient after a long delay and concerned about crew duty time limits, began his takeoff roll without explicit ATC clearance. He had heard the ATC clearance routing but misinterpreted it as takeoff clearance. The KLM first officer transmitted 'we are now at takeoff' — ambiguous phrasing that ATC interpreted as 'we are now at the takeoff position' rather than 'we are now taking off.' The Pan Am crew, hearing this, were concerned but their communication to ATC was masked by simultaneous transmission. Seconds later, the KLM aircraft collided with the Pan Am aircraft on the runway. The KLM aircraft had reached approximately 160 knots; the Pan Am aircraft was attempting to turn off the runway. 583 people died. The investigation identified multiple CRM failures: a steep authority gradient that prevented the KLM first officer from challenging the captain; ambiguous communication; time pressure bias; confirmation bias; and lack of structured cross-checking. Every one of these failure modes is now addressed directly by CRM training." },
    { type: "callout", variant: "danger", title: "Key Lessons from Tenerife Applied Today", text: "Tenerife directly produced: (1) closed-loop communication requirements — readback and confirmation; (2) flattened authority gradients — first officers must challenge captains; (3) standard phraseology — no ambiguous expressions like 'at takeoff'; (4) threat and error management — recognising time pressure as a threat; (5) cross-monitoring — first officers actively monitoring captain's actions; (6) fatigue and duty time awareness; (7) Just Culture — reporting biases without punishment. Every CRM principle taught today can be traced to a lesson from Tenerife." },
    { type: "table", caption: "Tenerife CRM Failure Analysis", headers: ["Failure", "What Happened", "CRM Lesson"], rows: [
      ["Authority gradient", "First officer didn't challenge captain's premature takeoff", "Flatten gradient; PACE model; first officer responsibility to challenge"],
      ["Ambiguous communication", "'We are now at takeoff' misinterpreted by ATC", "Standard phraseology; closed-loop communication"],
      ["Time pressure", "Captain's impatience biased toward action", "Recognise time pressure as a threat; TEM framework"],
      ["Confirmation bias", "Captain heard what he expected, not what was said", "Active disconfirmation; cross-checking"],
      ["Lack of cross-checking", "First officer didn't independently verify clearance", "Crew cross-monitoring; explicit verification"],
      ["Fatigue/duty time", "Captain concerned about duty time limits", "Fatigue management; FRMS; duty time regulations"],
    ]},
    { type: "list", items: [
      "Closed-loop communication — readback and confirmation are mandatory",
      "Flattened authority gradients — first officers must challenge captains",
      "Standard phraseology — no ambiguous expressions",
      "Threat and Error Management — recognise time pressure as a threat",
      "Cross-monitoring — first officers actively monitor captain's actions",
      "Fatigue and duty time awareness — FRMS, regulated limits",
      "Just Culture — reporting biases without punishment",
      "Crew coordination — every crew member contributes to safety",
    ]},
    { type: "knowledgeCheck", question: "What was the primary CRM failure identified in the Tenerife disaster that directly led to the development of authority gradient management in CRM training?", options: ["ATC error", "Mechanical failure", "The KLM first officer did not challenge the captain's premature takeoff decision due to a steep authority gradient", "Weather conditions"], correctAnswer: 2, explanation: "The primary CRM failure was that the KLM first officer did not challenge the captain's premature takeoff decision due to a steep authority gradient. The captain's authoritative leadership style and the first officer's reluctance to question the senior crew member directly caused the takeoff without clearance. This led to CRM training specifically designed to flatten authority gradients and empower junior crew to speak up, including the PACE model and Just Culture." },
  ],

  "crm-lesson-21-2": [
    { type: "heading", text: "United 232 and Air Canada 797 — CRM in Catastrophic Failures", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents United Airlines Flight 232 (Sioux City, 19 July 1989) as a CRM triumph under catastrophic conditions. A DC-10 suffered uncontained engine failure that severed all three hydraulic systems, leaving the aircraft with no flight controls. Captain Al Haynes, First Officer William Records, and Second Officer Dudley Dvorak were joined off-duty Instructor Captain Denny Fitch. Together, they improvised control of the aircraft using differential engine thrust — a technique never trained and never successfully accomplished before in a DC-10. The crew coordinated continuously, with each member contributing: Haynes on throttles, Fitch on throttle fine control, Records managing the limited control available, Dvorak running checklists and managing systems. They reached Sioux City airport and crashed on landing, but 185 of the 296 people on board survived. The NTSB credited CRM as the primary reason anyone survived at all." },
    { type: "paragraph", text: "Air Canada Flight 797 (June 1983) is presented as a contrasting case with both successes and failures. A DC-9 developed an in-flight fire in the rear lavatory. The flight deck initially received a circuit breaker pop and a 'lavatory' light; the captain dispatched the first officer to investigate, but the first officer did not initially find the fire. Smoke began to fill the cabin; the cabin crew attempted to fight the fire but the extinguishers were insufficient. The captain diverted to Cincinnati and made a successful emergency landing. However, when the doors were opened on the ground, the influx of oxygen caused the fire to flash over — 23 of the 46 people on board died from smoke inhalation and burns, including musician Stan Rogers. The CRM lessons: rapid identification of fire source is critical; cabin crew communication to flight deck must be prompt and accurate; the decision to evacuate immediately on landing must be made before the oxygen-induced flashover; cabin crew must train for smoke-filled cabin operations." },
    { type: "callout", variant: "info", title: "CRM Successes in Catastrophic Situations", text: "United 232 demonstrated that CRM enables extraordinary performance under catastrophic failure — the crew used every available resource, communicated continuously, and improvised a solution to a problem never trained for. Air Canada 797 demonstrated both CRM strengths (rapid diversion, emergency landing) and weaknesses (delayed fire identification, evacuation timing). Both cases are now standard CRM training material worldwide." },
    { type: "table", caption: "United 232 vs Air Canada 797 — CRM Comparison", headers: ["Aspect", "United 232 (1989)", "Air Canada 797 (1983)"], rows: [
      ["Situation", "Total loss of flight controls (all hydraulics)", "In-flight lavatory fire"],
      ["Crew response", "Improvised thrust-only control", "Diversion and emergency landing"],
      ["CRM strength", "Continuous coordination, resource use, improvisation", "Rapid diversion, cabin preparation"],
      ["CRM weakness", "None identified — exemplary", "Delayed fire identification, evacuation timing"],
      ["Outcome", "185 of 296 survived", "23 of 46 died (smoke, flashover)"],
      ["CRM lesson", "CRM enables performance beyond trained procedures", "Fire response requires immediate identification and rapid evacuation"],
    ]},
    { type: "list", items: [
      "United 232 — CRM enabled survival in a previously unsurvivable situation",
      "United 232 — every available resource used, including off-duty instructor captain",
      "United 232 — continuous communication and crew coordination throughout",
      "United 232 — improvisation within CRM framework, not abandoning CRM",
      "Air Canada 797 — fire identification delay was critical",
      "Air Canada 797 — cabin crew communication to flight deck needed to be faster",
      "Air Canada 797 — oxygen-induced flashover on door opening killed many",
      "Air Canada 797 — evacuation timing must consider flashover risk",
    ]},
    { type: "knowledgeCheck", question: "Why is United Airlines Flight 232 considered a CRM triumph despite the crash landing?", options: ["Because the aircraft did not catch fire", "Because CRM enabled the crew to improvise control using differential thrust, and 185 of 296 people survived what should have been unsurvivable", "Because the aircraft landed without damage", "Because ATC handled it well"], correctAnswer: 1, explanation: "United 232 is a CRM triumph because the crew, facing total loss of flight controls (a previously unsurvivable situation), used every available resource — including an off-duty instructor captain — improvised control using differential engine thrust (never trained), coordinated continuously, and saved 185 of 296 lives. The NTSB credited CRM as the primary reason anyone survived at all. It is now standard CRM training material worldwide." },
  ],

  "crm-lesson-21-3": [
    { type: "heading", text: "US Airways 1549 — Miracle on the Hudson", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual presents US Airways Flight 1549 (15 January 2009) as the modern exemplar of CRM — every CRM principle applied perfectly, producing a survival outcome in a situation that should have killed everyone on board. An Airbus A320 departing LaGuardia Airport struck a flock of Canada geese at approximately 3,200 feet, causing simultaneous loss of thrust in both engines. Captain Chesley 'Sully' Sullenberger and First Officer Jeffrey Skiles had approximately three minutes from bird strike to ditching. Sullenberger took control of the aircraft; Skiles immediately began the dual-engine failure checklist. They could not return to LaGuardia, could not reach Teterboro, and Sullenberger made the decision to ditch in the Hudson River — a decision that was his alone to make and was made with very limited information. The ditching was executed perfectly — the aircraft remained intact on the water." },
    { type: "paragraph", text: "The cabin crew response was equally exemplary and is the focus of the manual's analysis. Senior flight attendant Doreen Welsh, flight attendant Sheila Dail, and flight attendant Donna Dent had approximately 90 seconds from impact announcement to water impact. They shouted 'Brace! Brace! Brace! Heads down! Stay down!' continuously. After impact, they immediately initiated evacuation through the four door exits and overwing exits. The cabin crew managed passengers calmly, kept them moving, prevented pile-ups at exits, got passengers onto the wings and into the slide-rafts. All 150 passengers and 5 crew survived — the first successful commercial airliner ditching in modern aviation history with no fatalities. The CRM lessons: clear role assignment (Captain flying, First Officer on checklist, cabin crew on brace and evacuation); continuous communication; rapid decision-making under time pressure (RPD); flawless execution of trained procedures; coordination between flight deck and cabin (NITS not formally used, but information flow was clear); and the value of recurrent training that made responses automatic." },
    { type: "callout", variant: "tip", title: "What Crew Did Right — US Airways 1549", text: "Flight deck: Captain took control, First Officer ran checklist, rapid decision to ditch, perfect execution. Cabin crew: continuous brace commands, immediate evacuation initiation, calm passenger management, prevention of pile-ups, multiple exits used, passengers onto wings and rafts. All 155 people survived. CRM was applied perfectly — clear roles, continuous communication, rapid decision-making, flawless execution, coordination between flight deck and cabin. Every CRM principle worked." },
    { type: "table", caption: "US Airways 1549 — CRM Analysis", headers: ["CRM Element", "What Happened", "CRM Principle Demonstrated"], rows: [
      ["Role assignment", "Captain flying, FO on checklist, cabin crew on brace/evac", "Clear roles enable parallel task execution"],
      ["Communication", "Continuous brace commands; flight deck-cabin coordination", "Communication under extreme time pressure"],
      ["Decision-making", "Captain made rapid decision to ditch — no time for FOR-DEC", "RPD (Recognition-Primed Decision) for time-critical"],
      ["Execution", "Perfect ditching technique; immediate evacuation", "Training automaticity under stress"],
      ["Coordination", "Flight deck landed aircraft; cabin crew evacuated passengers", "One crew, shared goal, coordinated action"],
      ["Cabin crew", "Continuous commands, multiple exits, calm management", "Trained procedures performed automatically"],
    ]},
    { type: "list", items: [
      "Clear role assignment — Captain flying, First Officer on checklist, cabin crew on brace/evacuation",
      "Continuous communication — brace commands throughout, flight deck-cabin coordination",
      "Rapid decision-making — Captain used RPD (Recognition-Primed Decision) for time-critical decision",
      "Flawless execution — ditching technique and evacuation performed automatically from training",
      "Coordination between flight deck and cabin — one crew, shared goal",
      "Recurrent training made responses automatic — no time for conscious thought",
      "Cabin crew continuous commands prevented panic and ensured action",
      "All 155 people survived — every CRM principle worked as designed",
    ]},
    { type: "knowledgeCheck", question: "Why does the Academy INFOHAS manual describe US Airways 1549 as 'every CRM principle applied perfectly'?", options: ["Because no passengers were injured", "Because every CRM element — role assignment, communication, rapid decision-making, flawless execution, and coordination — worked as designed, producing a survival outcome in an unsurvivable situation", "Because the captain was famous", "Because ATC handled it well"], correctAnswer: 1, explanation: "US Airways 1549 is described as every CRM principle applied perfectly because every CRM element worked: clear role assignment (Captain flying, FO on checklist), continuous communication (brace commands, flight deck-cabin coordination), rapid decision-making (Captain's RPD decision to ditch), flawless execution (perfect ditching, immediate evacuation), and coordination (one crew, shared goal). The result — all 155 people survived what should have been unsurvivable — is the CRM success story of the modern era." },
  ],

  // ============================================================================
  // FINAL REVISION (crm-lesson-22-1 to 22-3)
  // ============================================================================

  "crm-lesson-22-1": [
    { type: "heading", text: "Communication and Teamwork Revision", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual's final revision section consolidates the key concepts across all chapters. For communication, the essential concepts are: the communication cycle (sender, message, channel, receiver, feedback); closed-loop communication (transmit, readback, confirm) as the standard for safety-critical information; the PACE model (Probe, Alert, Challenge, Emergency) for assertive communication; barriers in the cabin environment (noise, distance, time pressure, stress, culture); and active listening skills (full attention, suspend judgement, reflect, clarify, respond). For teamwork, the essential concepts are: the Teamwork Pyramid (Goals, Roles, Processes, Relationships); Tuckman's team development stages (Forming, Storming, Norming, Performing, Adjourning); Belbin's team roles; trust as the foundation; mutual support behaviours; and conflict resolution using the Thomas-Kilmann modes (Competing, Collaborating, Compromising, Avoiding, Accommodating)." },
    { type: "paragraph", text: "The manual recommends that crew preparing for CRM assessment or examination focus on these key areas: be able to define and apply each communication concept with a cabin example; be able to explain how closed-loop communication works and why it is standard; be able to use the PACE model with a worked example; be able to describe each level of the Teamwork Pyramid and how to diagnose team problems; be able to list Tuckman's stages and explain how the pre-flight briefing accelerates forming and norming; be able to describe trust-building behaviours and mutual support techniques; and be able to apply the Thomas-Kilmann conflict modes to cabin scenarios. The manual also recommends practising with sample questions and scenarios, and discussing concepts with peers to consolidate understanding." },
    { type: "callout", variant: "info", title: "Top 5 Communication and Teamwork Concepts", text: "1. Closed-loop communication (transmit, readback, confirm) — standard for safety-critical information. 2. PACE model (Probe, Alert, Challenge, Emergency) — assertive communication up the hierarchy. 3. The Teamwork Pyramid (Goals, Roles, Processes, Relationships) — diagnosing team problems. 4. Tuckman's stages (Forming, Storming, Norming, Performing, Adjourning) — team development within a duty period. 5. Trust as the foundation of teamwork — built through consistent behaviour, competence, and open communication." },
    { type: "table", caption: "Communication and Teamwork — Key Points Summary", headers: ["Concept", "Key Point", "Application"], rows: [
      ["Communication cycle", "Sender, message, channel, receiver, feedback", "Understand each element as a potential failure point"],
      ["Closed-loop communication", "Transmit, readback, confirm", "Standard for ALL safety-critical information"],
      ["PACE model", "Probe, Alert, Challenge, Emergency", "Assertive communication up the hierarchy"],
      ["Active listening", "Full attention, suspend judgement, reflect, clarify", "Counteracts rehearsal, filtering, advising"],
      ["Teamwork Pyramid", "Goals, Roles, Processes, Relationships", "Diagnose team problems from apex down"],
      ["Tuckman's stages", "Forming, Storming, Norming, Performing, Adjourning", "Cabin crews pass through all stages per duty"],
      ["Belbin team roles", "9 natural team roles", "Balance crew for strengths"],
      ["Thomas-Kilmann modes", "Competing, Collaborating, Compromising, Avoiding, Accommodating", "Match mode to situation"],
    ]},
    { type: "list", items: [
      "Communication cycle — sender, message, channel, receiver, feedback",
      "Closed-loop communication — transmit, readback, confirm",
      "PACE model — Probe, Alert, Challenge, Emergency",
      "Active listening — full attention, suspend judgement, reflect, clarify",
      "Teamwork Pyramid — Goals, Roles, Processes, Relationships",
      "Tuckman's stages — Forming, Storming, Norming, Performing, Adjourning",
      "Trust as foundation of teamwork",
      "Mutual support behaviours and conflict resolution modes",
    ]},
    { type: "knowledgeCheck", question: "What are the five steps of closed-loop communication as taught in the Academy INFOHAS manual?", options: ["Speak, listen, repeat", "Sender transmits, receiver acknowledges by readback, sender confirms; if no readback, repeat; if readback incorrect, correct", "Send, receive, reply", "Encode, transmit, decode, respond"], correctAnswer: 1, explanation: "Closed-loop communication is: (1) Sender transmits a clear, concise message using standard phraseology; (2) Receiver acknowledges by reading back the message in full; (3) Sender confirms the readback was correct, or corrects it. If no readback is received, repeat the message; if the readback is incorrect, correct immediately. This three-step process catches approximately 95% of communication errors." },
  ],

  "crm-lesson-22-2": [
    { type: "heading", text: "Situational Awareness, Decision Making, and TEM Revision", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual's revision of situational awareness, decision making, and TEM consolidates these interrelated concepts. For situational awareness: Endsley's three levels (Perception, Comprehension, Projection) are sequential and failure at any level compromises the entire process; the SA cycle (Gather, Interpret, Anticipate, Act) is continuous; common SA traps include fixation, ambiguity, confusion, and SOP deviation; recovery technique is STOP-THINK-ACT. For decision making: the five-step process (Define, Gather, Evaluate, Decide, Review) for time-available decisions; FOR-DEC (Facts, Options, Risks, Decision, Execution, Check) for team decisions; RPD (Recognition-Primed Decision) for time-critical decisions; common biases include confirmation, anchoring, availability, sunk cost, and plan continuation; risk assessment uses probability × severity matrix." },
    { type: "paragraph", text: "For TEM: the components are Threats (events beyond crew influence requiring management), Errors (crew actions/inactions leading to deviation), Undesired States (compromised safety margins), and Countermeasures (crew actions that detect, trap, or mitigate); threats are environmental, operational, or human, and either latent or active; errors are slips, lapses, or mistakes; safety barriers are the defensive layers in the Swiss Cheese Model; the error chain means breaking any link prevents the accident. The manual emphasises that SA, decision making, and TEM are interdependent: SA enables decision making, decision making manages threats and errors, TEM relies on SA for threat identification. The exam may include scenario-based questions that require applying all three frameworks together — for example, 'identify the SA failure, the decision error, and the TEM mismanagement' in a given scenario." },
    { type: "callout", variant: "warning", title: "Common Exam Points — SA, Decision Making, TEM", text: "Be able to: identify the three levels of SA with cabin examples; describe the SA cycle and recovery technique; explain the five-step decision process and FOR-DEC; differentiate time-critical (RPD) from time-available (FOR-DEC) decisions; identify cognitive biases; apply the risk matrix; define TEM components; classify threats (environmental/operational/human, latent/active); classify errors (slips/lapses/mistakes); explain the Swiss Cheese Model and error chain. Scenario-based questions may require applying all three frameworks together." },
    { type: "table", caption: "SA, Decision Making, TEM — Summary", headers: ["Framework", "Key Components", "Application"], rows: [
      ["Situational Awareness (Endsley)", "Perception, Comprehension, Projection", "Continuous monitoring of cabin"],
      ["SA Cycle", "Gather, Interpret, Anticipate, Act", "Continuous process"],
      ["SA Recovery", "STOP-THINK-ACT", "When SA loss recognised"],
      ["Decision — 5-step", "Define, Gather, Evaluate, Decide, Review", "Time-available decisions"],
      ["Decision — FOR-DEC", "Facts, Options, Risks, Decision, Execution, Check", "Team decisions"],
      ["Decision — RPD", "Recognise pattern, act on first workable option", "Time-critical decisions"],
      ["TEM Components", "Threats, Errors, Undesired States, Countermeasures", "Operational risk management"],
      ["TEM Error types", "Slips, Lapses, Mistakes", "Error classification"],
      ["Swiss Cheese Model", "Multiple defensive layers with holes", "Why single errors don't cause accidents"],
    ]},
    { type: "list", items: [
      "SA — Endsley's three levels: Perception, Comprehension, Projection",
      "SA cycle — Gather, Interpret, Anticipate, Act",
      "SA recovery — STOP-THINK-ACT",
      "Decision — five-step process for time-available; RPD for time-critical",
      "FOR-DEC — Facts, Options, Risks, Decision, Execution, Check",
      "Common biases — confirmation, anchoring, availability, sunk cost, plan continuation",
      "Risk matrix — probability × severity",
      "TEM — Threats, Errors, Undesired States, Countermeasures",
      "Error types — slips (action error), lapses (memory error), mistakes (judgement error)",
      "Swiss Cheese Model — multiple defensive layers; break any link to prevent accident",
    ]},
    { type: "knowledgeCheck", question: "What are the four components of the TEM model, and how do they relate to each other?", options: ["Threats, Errors, Outcomes, Actions", "Threats (events beyond crew influence), Errors (crew actions/inactions leading to deviation), Undesired States (compromised safety margins), Countermeasures (crew actions that detect, trap, or mitigate). Threats can lead to errors if mismanaged; errors can lead to undesired states if mismanaged; countermeasures break the chain at each stage", "Threats, Equipment, Manuals, Systems", "Time, Energy, Money, Crew"], correctAnswer: 1, explanation: "TEM components are: (1) Threats — events or conditions beyond the crew's influence that require management; (2) Errors — actions or inactions by crew that lead to deviation from intentions; (3) Undesired States — conditions where safety margins have been compromised; (4) Countermeasures — crew actions that detect, trap, or mitigate threats and errors. Threats can lead to errors if mismanaged; errors to undesired states; countermeasures break the chain at each stage." },
  ],

  "crm-lesson-22-3": [
    { type: "heading", text: "Leadership, Fatigue, and Safety Culture Revision", level: 3 },
    { type: "paragraph", text: "The Academy INFOHAS manual's revision of leadership, fatigue, and safety culture consolidates these final CRM concepts. For leadership: the distinction between leadership (people, vision, motivation) and management (processes, planning, control); Goleman's six leadership styles (Visionary, Coaching, Affiliative, Democratic, Pacesetting, Commanding) and when to use each; the Leadership Pyramid (Lead Self, Lead Others, Lead Teams, Lead Organisation); the SCCM's responsibilities (briefing, coordination, decision-making, monitoring, debriefing); authority gradient (steep suppresses communication, optimal is moderate, flat blurs decisions); and followership as an active skill (exemplary follower, not passive). For fatigue: the science (17 hours = 0.05% BAC equivalent, 24 hours = 0.10%); acute vs chronic fatigue; circadian rhythm and WOCL (3-5 am); jet lag and management techniques; burnout stages (Honeymoon, Awakening, Chronic Stress, Burnout); and FRMS as the organisational approach." },
    { type: "paragraph", text: "For safety culture: the components (reporting culture, just culture, flexible culture, learning culture, informed culture); the difference between blame culture and just culture; the importance of non-punitive error reporting; the role of the SCCM in setting team culture; and the crew member's responsibility to contribute to culture through daily behaviour. The manual's final exam preparation guidance recommends: focus on understanding, not memorisation; practise with sample questions; discuss concepts with peers; apply concepts to your own operation; and use the case studies (Tenerife, United 232, Air Canada 797, US Airways 1549) as anchors for understanding how CRM principles work in practice. The final examination includes 50 MCQs, 20 True/False, 10 short answer, 10 scenario-based questions, and 5 practical exercises — covering all chapters and integrating concepts across them." },
    { type: "callout", variant: "tip", title: "Final Exam Preparation Tips", text: "Focus on understanding, not memorisation. Practise with sample questions. Discuss concepts with peers. Apply concepts to your own operation. Use the case studies (Tenerife, United 232, Air Canada 797, US Airways 1549) as anchors for understanding. The exam covers all chapters and integrates concepts — be prepared to apply multiple frameworks together. The final examination includes 50 MCQs, 20 True/False, 10 short answer, 10 scenario-based, and 5 practical exercises." },
    { type: "table", caption: "Leadership, Fatigue, Culture — Summary", headers: ["Topic", "Key Points", "Exam Focus"], rows: [
      ["Leadership vs Management", "Leadership = people; Management = processes", "Distinguish the two"],
      ["Goleman's 6 styles", "Visionary, Coaching, Affiliative, Democratic, Pacesetting, Commanding", "When to use each"],
      ["Authority gradient", "Steep suppresses communication; moderate is optimal; flat blurs decisions", "Identify optimal gradient"],
      ["Followership", "Exemplary follower = high engagement + high critical thinking", "Identify ideal style"],
      ["Fatigue science", "17 hr awake = 0.05% BAC; 24 hr = 0.10%", "Quantitative fatigue"],
      ["WOCL", "3-5 am body clock time — lowest alertness", "Apply to rostering"],
      ["Burnout stages", "Honeymoon, Awakening, Chronic Stress, Burnout", "Identify stage and action"],
      ["FRMS components", "Policy, training, reporting, monitoring, investigation, improvement", "Organisational approach"],
      ["Safety culture", "Reporting, Just, Flexible, Learning, Informed", "Distinguish blame vs just culture"],
    ]},
    { type: "list", items: [
      "Leadership vs Management — leadership is about people, management about processes",
      "Goleman's six leadership styles — match style to situation",
      "Authority gradient — moderate is optimal; SCCM sets it through behaviour",
      "Followership — exemplary follower (high engagement + high critical thinking) is ideal",
      "Fatigue science — 17 hr awake = 0.05% BAC equivalent; 24 hr = 0.10%",
      "WOCL — 3-5 am body clock time is lowest alertness period",
      "Burnout stages — Honeymoon, Awakening, Chronic Stress, Burnout",
      "FRMS — systematic, data-driven fatigue management at organisational level",
      "Safety culture — Reporting, Just, Flexible, Learning, Informed",
      "Just Culture vs Blame Culture — just culture increases reporting, reduces accidents",
      "Case studies — Tenerife, United 232, Air Canada 797, US Airways 1549 — anchors for understanding",
    ]},
    { type: "knowledgeCheck", question: "What are the five components of a safety culture as identified in the Academy INFOHAS manual?", options: ["Management, staff, procedures, equipment, training", "Reporting culture, Just culture, Flexible culture, Learning culture, Informed culture", "Policy, training, audits, investigations, sanctions", "Communication, teamwork, leadership, decision-making, situational awareness"], correctAnswer: 1, explanation: "The five components of safety culture are: (1) Reporting culture — crew feel able to report errors and near-misses without fear; (2) Just culture — fair treatment distinguishing honest errors from reckless behaviour; (3) Flexible culture — the organisation can adapt to changing conditions; (4) Learning culture — the organisation learns from reports and changes; (5) Informed culture — the organisation knows what is happening in its operations. Together these produce a culture where safety is genuinely prioritised." },
  ],
};

export function getCRMManualExpansion(lessonId: string): any[] {
  return crmManualExpansion[lessonId] || [];
}

export function getCRMManualExpansionLessonCount(): number {
  return Object.keys(crmManualExpansion).length;
}

export function getCRMManualExpansionLessonIds(): string[] {
  return Object.keys(crmManualExpansion);
}
