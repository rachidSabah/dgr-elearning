// CRM Manual Images — maps the 27 extracted PDF images from the 169-page
// Academy INFOHAS CRM training manual to CRM lessons.
// Source: /public/images/crm-manual/crm-img-XXX-YYY.png where XXX is the page number.
//
// Image-to-topic mapping (based on PDF page extraction):
//   Page 13  — CRM overview / team photo                     → Ch.1 Introduction
//   Page 16  — Cabin crew coordination network diagram       → Ch.1 / Ch.10
//   Page 27  — Swiss Cheese Model diagram (James Reason)     → Ch.2 Human Factors
//   Page 28  — SHELL Model diagram (Frank Hawkins)           → Ch.2 Human Factors
//   Page 29  — Dirty Dozen diagram (Gordon Dupont)           → Ch.2 Human Factors
//   Page 30  — PEAR Model diagram                            → Ch.2 Human Factors
//   Page 31  — Human Error Chain diagram                     → Ch.2 Human Factors
//   Page 39  — Communication cycle diagram                   → Ch.3 Communication
//   Page 40  — Closed-loop communication diagram             → Ch.3 Communication
//   Page 42  — Communication barriers diagram                → Ch.3 Communication
//   Page 52  — Teamwork pyramid diagram                      → Ch.4 Teamwork
//   Page 54  — Team roles diagram                            → Ch.4 Teamwork
//   Page 55  — Mutual support diagram                        → Ch.4 Teamwork
//   Page 64  — Authority gradient diagram                    → Ch.5 Leadership
//   Page 67  — Leadership styles diagram                     → Ch.5 Leadership
//   Page 76  — Situational Awareness three levels diagram    → Ch.6 SA
//   Page 77  — SA cycle diagram                              → Ch.6 SA
//   Page 89  — FOR-DEC decision model diagram                → Ch.7 Decision Making
//   Page 101 — TEM model diagram                             → Ch.8 TEM
//   Page 102 — Safety barriers diagram (Swiss Cheese)        → Ch.8 TEM
//   Page 112 — Stress-performance curve (Yerkes-Dodson)      → Ch.9 Stress
//   Page 113 — Circadian rhythm diagram                      → Ch.9 Stress/Fatigue
//   Page 114 — Workload zones diagram                        → Ch.9 Workload
//   Page 115 — Burnout stages diagram                        → Ch.9 Fatigue
//   Page 117 — Fatigue management diagram                    → Ch.9 Fatigue
//   Page 125 — CRM across flight phases diagram              → Ch.10 Professional CRM
//   Page 128 — Evacuation decision tree                      → Ch.10 Emergencies

export const crmManualImages: Record<string, { src: string; caption: string }[]> = {
  // ============================================================================
  // CHAPTER 1 — Introduction to CRM (crm-lesson-1-1 to 2-3)
  // ============================================================================
  "crm-lesson-1-1": [
    {
      src: "/images/crm-manual/crm-img-013-000.png",
      caption: "CRM overview — the integrated crew concept from the Academy INFOHAS CRM training manual (page 13). Shows the cabin crew as a coordinated team operating within the wider aircraft system, with all crew members contributing to safety.",
    },
  ],
  "crm-lesson-1-2": [
    {
      src: "/images/crm-manual/crm-img-013-000.png",
      caption: "CRM overview — the shared responsibility model. Every cabin crew member is a safety-critical contributor; CRM provides the framework for maximising each crew member's effectiveness within the team (Academy INFOHAS manual, page 13).",
    },
  ],
  "crm-lesson-1-3": [
    {
      src: "/images/crm-manual/crm-img-016-002.png",
      caption: "Cabin crew coordination network — the formal communication and authority structure within the cabin crew team, showing the SCCM at the focal point and the flow of information between positions (Academy INFOHAS manual, page 16).",
    },
  ],
  "crm-lesson-2-1": [
    {
      src: "/images/crm-manual/crm-img-013-000.png",
      caption: "CRM origins — the Tenerife disaster (1977) led directly to the NASA workshop (1979) that founded CRM. This overview figure from the Academy INFOHAS manual (page 13) shows how CRM evolved as a discipline to prevent similar crew coordination failures.",
    },
  ],
  "crm-lesson-2-2": [
    {
      src: "/images/crm-manual/crm-img-016-002.png",
      caption: "Cabin crew coordination network diagram — illustrates the modern crew coordination structure that evolved through the six generations of CRM, showing how every crew position is linked through structured communication channels (Academy INFOHAS manual, page 16).",
    },
  ],
  "crm-lesson-2-3": [
    {
      src: "/images/crm-manual/crm-img-013-000.png",
      caption: "Modern CRM overview — the integrated crew concept that anchors today's 6th generation CRM. The Academy INFOHAS manual (page 13) presents this as the foundation of regulatory compliance under ICAO Annex 6 and EASA Regulation (EU) No 965/2012.",
    },
  ],

  // ============================================================================
  // CHAPTER 2 — Human Factors (crm-lesson-3-1 to 3-3)
  // ============================================================================
  "crm-lesson-3-1": [
    {
      src: "/images/crm-manual/crm-img-027-004.png",
      caption: "Swiss Cheese Model by James Reason — the foundational Human Factors framework showing how defensive layers (cheese slices) with holes (weaknesses) align to allow a hazard to pass through and cause an accident. Breaking any link prevents the accident (Academy INFOHAS manual, page 27).",
    },
    {
      src: "/images/crm-manual/crm-img-028-006.png",
      caption: "SHELL Model by Frank Hawkins — the central Human Factors framework placing the human (Liveware) at the centre, surrounded by Software, Hardware, Environment, and other Liveware. Interface failures are where Human Factors problems occur (Academy INFOHAS manual, page 28).",
    },
  ],
  "crm-lesson-3-2": [
    {
      src: "/images/crm-manual/crm-img-028-006.png",
      caption: "SHELL Model diagram — detailed view of the four interfaces (L-S, L-H, L-E, L-L) where Human Factors problems occur in cabin operations. Each interface has specific failure modes and CRM countermeasures (Academy INFOHAS manual, page 28).",
    },
    {
      src: "/images/crm-manual/crm-img-030-010.png",
      caption: "PEAR Model diagram — the complementary framework for analysing Human Factors in specific operational situations: People, Environment, Actions, Resources. Use SHELL for structural analysis; use PEAR for real-time operational assessment (Academy INFOHAS manual, page 30).",
    },
  ],
  "crm-lesson-3-3": [
    {
      src: "/images/crm-manual/crm-img-029-008.png",
      caption: "The Dirty Dozen by Gordon Dupont — twelve conditions that predispose humans to make errors: lack of communication, complacency, lack of knowledge, distraction, lack of teamwork, fatigue, lack of resources, pressure, lack of assertiveness, stress, lack of awareness, and norms (Academy INFOHAS manual, page 29).",
    },
    {
      src: "/images/crm-manual/crm-img-031-012.png",
      caption: "Human Error Chain diagram — errors typically cascade, and breaking ANY link in the chain prevents the accident. This diagram from the Academy INFOHAS manual (page 31) shows how cabin crew serve as one of the defensive layers that can break the error chain before an accident occurs.",
    },
    {
      src: "/images/crm-manual/crm-img-027-004.png",
      caption: "Swiss Cheese Model applied to cabin crew Human Factors — each defensive layer (SOPs, checklists, cross-monitoring, training, reporting culture) has weaknesses, but no single layer is expected to be perfect. The system relies on multiple layers so any one catching the hazard prevents the accident (Academy INFOHAS manual, page 27).",
    },
  ],

  // ============================================================================
  // CHAPTER 3 — Communication (crm-lesson-4-1 to 4-3)
  // ============================================================================
  "crm-lesson-4-1": [
    {
      src: "/images/crm-manual/crm-img-039-014.png",
      caption: "Communication cycle diagram — the five elements (sender, message, channel, receiver, feedback) and the potential failure point at each. Communication is only complete when the receiver's understanding matches the sender's intent, verified through feedback (Academy INFOHAS manual, page 39).",
    },
    {
      src: "/images/crm-manual/crm-img-042-018.png",
      caption: "Communication barriers diagram — the cabin environment creates unique barriers (noise 80-90 dB, physical distance, time pressure, stress, cultural differences, authority gradient) and their CRM countermeasures (closed-loop communication, standard phraseology, PACE, Just Culture) (Academy INFOHAS manual, page 42).",
    },
  ],
  "crm-lesson-4-2": [
    {
      src: "/images/crm-manual/crm-img-040-016.png",
      caption: "Closed-loop communication diagram — the three-step process (transmit, readback, confirm) that catches approximately 95% of communication errors before they can affect safety. This is the standard for ALL safety-critical information in cabin operations (Academy INFOHAS manual, page 40).",
    },
    {
      src: "/images/crm-manual/crm-img-042-018.png",
      caption: "Communication barriers and the PACE model — the PACE model (Probe, Alert, Challenge, Emergency) provides escalating assertiveness for communication up the authority gradient when initial communication has not been effective (Academy INFOHAS manual, page 42).",
    },
  ],
  "crm-lesson-4-3": [
    {
      src: "/images/crm-manual/crm-img-039-014.png",
      caption: "Communication cycle applied to cross-cultural communication — the sender, message, channel, receiver, feedback elements are influenced by cultural dimensions (Hofstede: power distance, individualism, uncertainty avoidance). Standard phraseology provides a common communication baseline (Academy INFOHAS manual, page 39).",
    },
    {
      src: "/images/crm-manual/crm-img-040-016.png",
      caption: "Closed-loop communication across cultures — readback and confirmation are especially important when crew have different native languages and communication norms. The closed-loop catches misunderstandings that would otherwise cascade (Academy INFOHAS manual, page 40).",
    },
  ],

  // ============================================================================
  // CHAPTER 4 — Teamwork (crm-lesson-5-1 to 5-3)
  // ============================================================================
  "crm-lesson-5-1": [
    {
      src: "/images/crm-manual/crm-img-052-020.png",
      caption: "Teamwork Pyramid diagram — the four levels (Goals at the base, Roles, Processes, Relationships at the apex) that must be built in order. Diagnose team problems by working down from the apex: relationships strained? Check processes. Processes failing? Check roles. Roles unclear? Check goals (Academy INFOHAS manual, page 52).",
    },
  ],
  "crm-lesson-5-2": [
    {
      src: "/images/crm-manual/crm-img-054-022.png",
      caption: "Cabin crew team roles diagram — the structured hierarchy (SCCM, Senior/Purser, Cabin Crew Member, Galley Operator, Door Crew) with each role's primary responsibility, reporting line, and key CRM behaviours. Role clarity is essential for effective team performance (Academy INFOHAS manual, page 54).",
    },
  ],
  "crm-lesson-5-3": [
    {
      src: "/images/crm-manual/crm-img-055-024.png",
      caption: "Mutual support diagram — the operational expression of trust in cabin crew teams: monitoring colleagues for overload, offering to take tasks, providing backup on safety-critical tasks, sharing information, and offering constructive feedback. Mutual support is what makes a team more than a collection of individuals (Academy INFOHAS manual, page 55).",
    },
  ],

  // ============================================================================
  // CHAPTER 5 — Leadership (crm-lesson-6-1 to 6-3)
  // ============================================================================
  "crm-lesson-6-1": [
    {
      src: "/images/crm-manual/crm-img-067-028.png",
      caption: "Six leadership styles diagram (Goleman) — Visionary, Coaching, Affiliative, Democratic, Pacesetting, Commanding. Each style is appropriate for different situations; effective leaders fluidly switch styles as situations change. The SCCM must read the situation, team, and task, then apply the appropriate style (Academy INFOHAS manual, page 67).",
    },
  ],
  "crm-lesson-6-2": [
    {
      src: "/images/crm-manual/crm-img-064-026.png",
      caption: "Authority gradient diagram — steep gradient (Tenerife risk: juniors don't speak up), moderate gradient (optimal: clear leadership + invitation for input), flat gradient (decisions slow, role clarity blurs). The SCCM sets the gradient through behaviour: invite input, acknowledge challenges, never punish honest dissent (Academy INFOHAS manual, page 64).",
    },
  ],
  "crm-lesson-6-3": [
    {
      src: "/images/crm-manual/crm-img-064-026.png",
      caption: "Authority gradient and followership — the optimal moderate authority gradient enables exemplary followership (high engagement + high critical thinking). Steep gradients produce 'yes-person' followers; flat gradients produce slow decisions. The SCCM's behaviour determines both the gradient and the followership style that emerges (Academy INFOHAS manual, page 64).",
    },
  ],

  // ============================================================================
  // CHAPTER 6 — Situational Awareness (crm-lesson-7-1 to 7-3)
  // ============================================================================
  "crm-lesson-7-1": [
    {
      src: "/images/crm-manual/crm-img-076-030.png",
      caption: "Endsley's three levels of Situational Awareness diagram — Level 1 Perception (detecting what is happening), Level 2 Comprehension (understanding what it means), Level 3 Projection (anticipating what will happen next). The levels are sequential: failure at any level compromises the entire SA process (Academy INFOHAS manual, page 76).",
    },
  ],
  "crm-lesson-7-2": [
    {
      src: "/images/crm-manual/crm-img-077-032.png",
      caption: "SA cycle diagram — the continuous four-step process: Gather (collect information), Interpret (make sense of it), Anticipate (project what will happen), Act (take action). The cycle repeats as actions change the situation. The cycle breaks down at any step due to fatigue, distraction, complacency, workload, stress, or poor communication (Academy INFOHAS manual, page 77).",
    },
  ],
  "crm-lesson-7-3": [
    {
      src: "/images/crm-manual/crm-img-077-032.png",
      caption: "SA cycle and recovery — when SA loss is recognised (confusion, fixation, missed information, gut feeling), the recovery technique is STOP-THINK-ACT: Stop (pause, breathe), Think (what is happening? what should be? what is the gap?), Act (one clear action, then reassess). The diagram shows where in the SA cycle recovery can be applied (Academy INFOHAS manual, page 77).",
    },
  ],

  // ============================================================================
  // CHAPTER 7 — Decision Making (crm-lesson-8-1 to 8-3)
  // ============================================================================
  "crm-lesson-8-1": [
    {
      src: "/images/crm-manual/crm-img-089-034.png",
      caption: "FOR-DEC decision model diagram — Facts, Options, Risks, Decision, Execution, Check. The structured team decision-making tool developed by Lufthansa and adopted across European aviation. The SCCM gathers facts from all crew, considers options with the team, assesses risks collectively, makes the decision, assigns execution, and checks the outcome (Academy INFOHAS manual, page 89).",
    },
  ],
  "crm-lesson-8-2": [
    {
      src: "/images/crm-manual/crm-img-089-034.png",
      caption: "FOR-DEC and decision errors — the FOR-DEC structure is specifically designed to counter cognitive biases (confirmation, anchoring, sunk cost, plan continuation). The explicit Facts and Options steps force consideration of disconfirming evidence; the Risks step forces explicit risk assessment before deciding (Academy INFOHAS manual, page 89).",
    },
  ],
  "crm-lesson-8-3": [
    {
      src: "/images/crm-manual/crm-img-089-034.png",
      caption: "FOR-DEC under time pressure — the model adapts to time-critical situations by compressing the Facts/Options/Risks analysis into seconds when needed, or by being replaced entirely by Recognition-Primed Decision (RPD) for emergencies where seconds are not available for team consultation (Academy INFOHAS manual, page 89).",
    },
  ],

  // ============================================================================
  // CHAPTER 8 — Threat and Error Management (crm-lesson-9-1 to 9-3)
  // ============================================================================
  "crm-lesson-9-1": [
    {
      src: "/images/crm-manual/crm-img-101-036.png",
      caption: "TEM model diagram — the ICAO/University of Texas framework showing how Threats develop into Errors, Errors into Undesired States, and Undesired States into Incidents/Accidents. At each stage, crew countermeasures can break the chain. The model reframes CRM from 'preventing all errors' (impossible) to 'detecting and trapping errors before they cascade' (achievable) (Academy INFOHAS manual, page 101).",
    },
  ],
  "crm-lesson-9-2": [
    {
      src: "/images/crm-manual/crm-img-101-036.png",
      caption: "Threats in the TEM model — environmental (weather, turbulence, contamination), operational (malfunctions, equipment failures, ATC delays), and human (unruly passengers, medical events, fatigue, cultural misunderstandings). Latent threats exist in the system; active threats are present in the current operation (Academy INFOHAS manual, page 101).",
    },
  ],
  "crm-lesson-9-3": [
    {
      src: "/images/crm-manual/crm-img-102-038.png",
      caption: "Safety barriers diagram (Swiss Cheese applied to TEM) — multiple defensive layers (SOPs, checklists, cross-monitoring, aircraft systems, training, reporting culture) each have weaknesses (holes), but no single layer is expected to be perfect. The system relies on multiple barriers so that any one catching the hazard prevents the accident (Academy INFOHAS manual, page 102).",
    },
  ],

  // ============================================================================
  // CHAPTER 9 — Stress, Fatigue, Workload (crm-lesson-10-1 to 10-3, 11-1 to 11-3)
  // ============================================================================
  "crm-lesson-10-1": [
    {
      src: "/images/crm-manual/crm-img-114-044.png",
      caption: "Workload zones diagram — the three zones: underload (low demand, boredom, complacency, reduced vigilance), optimal workload (moderate demand, peak performance — challenged but not overwhelmed), and overload (demand exceeds capacity, task shedding, tunnel vision, errors). Both underload and overload are dangerous; the goal is the optimal zone (Academy INFOHAS manual, page 114).",
    },
  ],
  "crm-lesson-10-2": [
    {
      src: "/images/crm-manual/crm-img-112-040.png",
      caption: "Yerkes-Dodson stress-performance curve — the inverted-U relationship between arousal and performance. Performance is low at very low arousal (complacency), peaks at moderate arousal (the 'zone' — optimal), and declines at very high arousal (overload, panic). Eustress (positive stress) enhances; distress (negative stress) impairs. Different tasks have different optimal arousal levels (Academy INFOHAS manual, page 112).",
    },
  ],
  "crm-lesson-10-3": [
    {
      src: "/images/crm-manual/crm-img-113-042.png",
      caption: "Circadian rhythm diagram — the body's internal 24-hour biological clock showing the two natural alertness dips: the major dip in early morning hours (3-5 am body clock time, the Window of Circadian Low or WOCL) and the minor dip in early afternoon (3-5 pm post-lunch dip). Alertness, reaction time, and decision-making are impaired during these dips (Academy INFOHAS manual, page 113).",
    },
  ],
  "crm-lesson-11-1": [
    {
      src: "/images/crm-manual/crm-img-117-048.png",
      caption: "Fatigue management diagram — the physiological and operational factors that contribute to fatigue in cabin crew: sleep loss, extended wakefulness, circadian phase disruption, workload, and cabin environment (8,000 ft cabin altitude, dry air, noise). Fatigue impairs performance comparably to alcohol intoxication (17 hr awake = 0.05% BAC; 24 hr = 0.10%) (Academy INFOHAS manual, page 117).",
    },
  ],
  "crm-lesson-11-2": [
    {
      src: "/images/crm-manual/crm-img-113-042.png",
      caption: "Circadian rhythm and WOCL — the Window of Circadian Low (3-5 am body clock time) is the most safety-critical period for cabin crew. Eastward travel (advancing the clock) is harder to adjust to than westward because the body's natural clock runs slightly longer than 24 hours. Adjustment takes approximately one day per time zone crossed (Academy INFOHAS manual, page 113).",
    },
  ],
  "crm-lesson-11-3": [
    {
      src: "/images/crm-manual/crm-img-115-046.png",
      caption: "Burnout stages diagram — the four stages: Stage 1 Honeymoon (high engagement, neglecting self-care), Stage 2 Awakening (fatigue, irritability, sleep disturbance), Stage 3 Chronic Stress (sustained symptoms, physical health effects, detachment), Stage 4 Burnout (full syndrome, inability to function). Burnout is preventable if recognised early (Academy INFOHAS manual, page 115).",
    },
    {
      src: "/images/crm-manual/crm-img-117-048.png",
      caption: "Fatigue Risk Management System (FRMS) diagram — the organisational approach to managing fatigue systematically: fatigue management policy, fatigue education and awareness training, fatigue reporting mechanisms (non-punitive), fatigue monitoring, fatigue investigation, and continuous improvement. FRMS is data-driven and based on scientific principles (Academy INFOHAS manual, page 117).",
    },
  ],

  // ============================================================================
  // CHAPTER 10 — Cockpit-Cabin Coordination (crm-lesson-14-1 to 14-3)
  // ============================================================================
  "crm-lesson-14-1": [
    {
      src: "/images/crm-manual/crm-img-016-002.png",
      caption: "Cabin crew coordination network diagram — the formal communication and authority structure within the cabin crew team, with the SCCM at the focal point coordinating with both the cabin crew positions and the flight deck. This is the operational expression of the 'one crew concept' (Academy INFOHAS manual, page 16).",
    },
    {
      src: "/images/crm-manual/crm-img-125-050.png",
      caption: "CRM across flight phases diagram — how cockpit-cabin coordination touchpoints map to each phase of flight: pre-flight briefing, pre-departure, cruise, pre-landing, post-landing, and non-routine. Each touchpoint has specific flight deck-to-cabin and cabin-to-flight-deck communication requirements (Academy INFOHAS manual, page 125).",
    },
  ],
  "crm-lesson-14-2": [
    {
      src: "/images/crm-manual/crm-img-125-050.png",
      caption: "CRM across flight phases — the NITS briefing (Nature, Intentions, Time, Special instructions) is the standardised format for flight deck to cabin communication during non-routine situations. This diagram shows where in the flight phases NITS briefings are most commonly applied (Academy INFOHAS manual, page 125).",
    },
  ],
  "crm-lesson-14-3": [
    {
      src: "/images/crm-manual/crm-img-125-050.png",
      caption: "CRM across flight phases — the Sterile Cockpit Rule (below 10,000 feet, climb and descent) restricts flight deck-cabin communication to safety-critical only. This diagram shows the flight phases where sterile cockpit applies and the permitted versus non-permitted communications (Academy INFOHAS manual, page 125).",
    },
  ],

  // ============================================================================
  // CHAPTER 10 — Emergency Communication (crm-lesson-16-1 to 16-3)
  // ============================================================================
  "crm-lesson-16-1": [
    {
      src: "/images/crm-manual/crm-img-125-050.png",
      caption: "CRM across flight phases — emergency communication principles applied during non-routine and emergency phases. Brief, directive, repetitive, paced, and authoritative communication using command voice. The diagram shows how emergency communication integrates with the overall flight phase structure (Academy INFOHAS manual, page 125).",
    },
  ],
  "crm-lesson-16-2": [
    {
      src: "/images/crm-manual/crm-img-128-052.png",
      caption: "Evacuation decision tree — the structured decision framework used during evacuation: assess exit usability, redirect if blocked, coordinate with crew at alternate exits, manage passenger flow, and complete headcount post-evacuation. Every second counts in the 90-second evacuation window (Academy INFOHAS manual, page 128).",
    },
  ],
  "crm-lesson-16-3": [
    {
      src: "/images/crm-manual/crm-img-128-052.png",
      caption: "Evacuation decision tree applied to passenger reassurance — the diagram shows how crew apply continuous brace commands, manage different passenger behaviour types (freeze, panic, dependent, calm, would-be leader), and direct evacuation based on real-time assessment of exit usability and passenger flow (Academy INFOHAS manual, page 128).",
    },
  ],

  // ============================================================================
  // CHAPTER 10 — CRM in Emergencies (crm-lesson-20-1 to 20-3)
  // ============================================================================
  "crm-lesson-20-1": [
    {
      src: "/images/crm-manual/crm-img-125-050.png",
      caption: "CRM across flight phases — emergency CRM application. The diagram shows how the structured CRM touchpoints (briefing, coordination, communication, debrief) apply during emergency operations, with the 90-second rule emphasising that CRM must be automatic in the first 90 seconds of any cabin emergency (Academy INFOHAS manual, page 125).",
    },
  ],
  "crm-lesson-20-2": [
    {
      src: "/images/crm-manual/crm-img-128-052.png",
      caption: "Evacuation decision tree — applied to smoke, fire, and evacuation CRM. The decision tree shows the structured flow: detect fire/smoke → assign roles (firefighter, communicator, crowd manager, equipment retriever) → apply extinguisher → notify flight deck with NITS → prepare cabin → Commander makes evacuation decision → execute evacuation with continuous commands (Academy INFOHAS manual, page 128).",
    },
  ],
  "crm-lesson-20-3": [
    {
      src: "/images/crm-manual/crm-img-125-050.png",
      caption: "CRM across flight phases — post-incident debrief integration. The diagram shows where debriefing fits in the overall flight phase structure, emphasising the blame-free, learning-focused debrief as the moment when crew turn experience into organisational learning (Academy INFOHAS manual, page 125).",
    },
  ],

  // ============================================================================
  // CASE STUDIES (crm-lesson-21-1 to 21-3)
  // ============================================================================
  "crm-lesson-21-1": [
    {
      src: "/images/crm-manual/crm-img-013-000.png",
      caption: "CRM overview — the Tenerife disaster (1977) gave birth to the CRM discipline. Every CRM principle taught today can be traced to a lesson from Tenerife: closed-loop communication, flattened authority gradients, standard phraseology, threat and error management, and Just Culture (Academy INFOHAS manual, page 13).",
    },
    {
      src: "/images/crm-manual/crm-img-064-026.png",
      caption: "Authority gradient diagram — the Tenerife case study is the textbook example of a steep authority gradient with catastrophic consequences. The KLM first officer did not challenge the captain's premature takeoff decision. Modern CRM training is designed to flatten authority gradients and empower junior crew to speak up (Academy INFOHAS manual, page 64).",
    },
  ],
  "crm-lesson-21-2": [
    {
      src: "/images/crm-manual/crm-img-027-004.png",
      caption: "Swiss Cheese Model applied to United 232 and Air Canada 797 — United 232 demonstrated CRM as the defensive layer that enabled survival in a catastrophic failure (multiple holes aligned, but crew coordination caught the hazard). Air Canada 797 demonstrated where the defensive layers failed (delayed fire identification, evacuation timing) (Academy INFOHAS manual, page 27).",
    },
    {
      src: "/images/crm-manual/crm-img-128-052.png",
      caption: "Evacuation decision tree — the Air Canada 797 case study directly informs this decision tree: the oxygen-induced flashover on door opening killed many passengers. The decision tree now incorporates flashover risk assessment into the evacuation decision-making process (Academy INFOHAS manual, page 128).",
    },
  ],
  "crm-lesson-21-3": [
    {
      src: "/images/crm-manual/crm-img-125-050.png",
      caption: "CRM across flight phases — US Airways 1549 (Miracle on the Hudson) is the modern exemplar of CRM applied across all flight phases: pre-flight crew briefing enabled rapid role assignment; the bird strike at 3,200 feet triggered immediate crew coordination; brace commands during descent; perfect ditching; immediate evacuation. All 155 people survived (Academy INFOHAS manual, page 125).",
    },
    {
      src: "/images/crm-manual/crm-img-016-002.png",
      caption: "Cabin crew coordination network — the US Airways 1549 cabin crew (Doreen Welsh, Sheila Dail, Donna Dent) executed the coordination network perfectly: continuous brace commands, immediate evacuation initiation through four door exits and overwing exits, calm passenger management, prevention of pile-ups. This is the coordination network in its ideal operational form (Academy INFOHAS manual, page 16).",
    },
  ],

  // ============================================================================
  // FINAL REVISION (crm-lesson-22-1 to 22-3)
  // ============================================================================
  "crm-lesson-22-1": [
    {
      src: "/images/crm-manual/crm-img-039-014.png",
      caption: "Communication cycle — revision. The five elements (sender, message, channel, receiver, feedback) and the potential failure point at each. Communication is only complete when the receiver's understanding matches the sender's intent (Academy INFOHAS manual, page 39).",
    },
    {
      src: "/images/crm-manual/crm-img-052-020.png",
      caption: "Teamwork Pyramid — revision. The four levels (Goals, Roles, Processes, Relationships) built from the base up. Diagnose team problems by working down from the apex. Cabin crews pass through Tuckman's stages (Forming, Storming, Norming, Performing, Adjourning) within a single duty period (Academy INFOHAS manual, page 52).",
    },
  ],
  "crm-lesson-22-2": [
    {
      src: "/images/crm-manual/crm-img-076-030.png",
      caption: "Endsley's three levels of SA — revision. Level 1 Perception (detect), Level 2 Comprehension (understand), Level 3 Projection (anticipate). Sequential: failure at any level compromises the entire process. Recovery technique: STOP-THINK-ACT (Academy INFOHAS manual, page 76).",
    },
    {
      src: "/images/crm-manual/crm-img-089-034.png",
      caption: "FOR-DEC decision model — revision. Facts, Options, Risks, Decision, Execution, Check. For team decisions with time available. For time-critical decisions, use RPD (Recognition-Primed Decision). Watch for cognitive biases: confirmation, anchoring, availability, sunk cost, plan continuation (Academy INFOHAS manual, page 89).",
    },
    {
      src: "/images/crm-manual/crm-img-101-036.png",
      caption: "TEM model — revision. Threats (beyond crew influence) → Errors (crew actions/inactions) → Undesired States (compromised margins) → Incidents/Accidents. Countermeasures break the chain at each stage. Errors are slips (action error), lapses (memory error), or mistakes (judgement error) (Academy INFOHAS manual, page 101).",
    },
  ],
  "crm-lesson-22-3": [
    {
      src: "/images/crm-manual/crm-img-067-028.png",
      caption: "Leadership styles — revision. Goleman's six styles (Visionary, Coaching, Affiliative, Democratic, Pacesetting, Commanding). Match style to situation. Authority gradient: steep suppresses communication, moderate is optimal, flat blurs decisions. Followership: exemplary follower (high engagement + high critical thinking) is ideal (Academy INFOHAS manual, page 67).",
    },
    {
      src: "/images/crm-manual/crm-img-115-046.png",
      caption: "Burnout stages — revision. Stage 1 Honeymoon, Stage 2 Awakening, Stage 3 Chronic Stress, Stage 4 Burnout. Preventable if recognised early. Fatigue science: 17 hr awake = 0.05% BAC equivalent; 24 hr = 0.10%. WOCL: 3-5 am body clock time is lowest alertness (Academy INFOHAS manual, page 115).",
    },
    {
      src: "/images/crm-manual/crm-img-013-000.png",
      caption: "CRM overview — final synthesis. Every CRM principle (communication, teamwork, leadership, SA, decision making, TEM, workload, stress, fatigue, culture) is interdependent. The case studies (Tenerife, United 232, Air Canada 797, US Airways 1549) anchor understanding. The final examination covers all chapters and integrates concepts across them (Academy INFOHAS manual, page 13).",
    },
  ],
};

export function getCRMManualImages(lessonId: string): any[] {
  const images = crmManualImages[lessonId];
  if (!images) return [];

  return images.map(({ src, caption }) => ({
    type: "image" as const,
    src,
    caption,
    alt: `Academy INFOHAS CRM Training Manual illustration: ${caption}`,
  }));
}

export function getCRMManualImageCount(): number {
  return Object.keys(crmManualImages).length;
}

export function getCRMManualImageLessonIds(): string[] {
  return Object.keys(crmManualImages);
}

// Total count of unique image references across all lessons
export function getCRMManualImageTotalReferences(): number {
  return Object.values(crmManualImages).reduce(
    (total, images) => total + images.length,
    0,
  );
}
