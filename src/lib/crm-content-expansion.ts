// Deep content expansion for CRM lessons
// This file adds substantial additional content to each CRM lesson
// Content is merged with the base lesson content at runtime

export const crmContentExpansion: Record<string, any[]> = {
  "crm-lesson-1-1": [
    { type: "heading", text: "Why CRM Matters for Cabin Crew", level: 3 },
    { type: "paragraph", text: "Cabin crew are often the first responders to any in-flight incident. Whether it is a medical emergency, a fire in the cabin, a disruptive passenger, or an unplanned evacuation, the cabin crew's ability to work together effectively can mean the difference between life and death. CRM provides the framework for making that teamwork happen under pressure." },
    { type: "paragraph", text: "Consider a typical long-haul flight with 300 passengers and 12 cabin crew members. During a medical emergency, one crew member assesses the patient, another retrieves the medical kit, a third communicates with the flight deck, and a fourth manages surrounding passengers. This coordination does not happen by chance — it is the product of CRM training, clear role assignments, and practiced communication protocols." },
    { type: "callout", variant: "info", title: "ICAO Definition", text: "ICAO Annex 6 defines CRM as 'the effective utilization of all resources by flight crew and cabin crew to achieve safe and efficient operations.' Note the emphasis on ALL resources — not just human, but also equipment, procedures, information, and time." },
    { type: "heading", text: "Resources Available to Cabin Crew", level: 3 },
    { type: "table", caption: "CRM Resources in Cabin Operations", headers: ["Resource Type", "Examples", "How CRM Optimizes"], rows: [
      ["Human", "CSD/CS, fellow crew, flight deck, passengers, medical professionals on board", "Clear role assignment, open communication, leveraging passenger expertise"],
      ["Equipment", "Medical kits, fire extinguishers, oxygen, PA system, interphone, defibrillator", "Knowing location, condition, and proper use; sharing information about availability"],
      ["Information", "NOTOC, passenger manifest, weather info, flight time, SOPs, checklists", "Briefings, shared mental models, cross-checking critical information"],
      ["Time", "Time available before landing, time to prepare cabin, decision time", "Prioritization, task management, not rushing critical procedures"],
    ]},
    { type: "paragraph", text: "CRM is not just about being nice to each other — it is a structured approach to identifying and using every available resource to prevent errors, manage threats, and respond effectively to emergencies. Every cabin crew member, regardless of seniority, has a role to play in the CRM process." },
    { type: "callout", variant: "warning", title: "Key Principle", text: "CRM is EVERYONE's responsibility. The most junior crew member may notice something the most senior missed. CRM creates an environment where speaking up is expected and valued, regardless of rank or experience." },
  ],
  "crm-lesson-1-2": [
    { type: "heading", text: "The Scope of CRM in Daily Operations", level: 3 },
    { type: "paragraph", text: "CRM applies to every phase of flight — from the pre-flight briefing to post-landing debrief. During boarding, CRM helps crew manage time pressure, coordinate passenger assistance, and identify potential issues early. During cruise, CRM maintains vigilance, manages service quality, and prepares for potential emergencies. During approach and landing, CRM ensures the cabin is secured and crew are positioned correctly." },
    { type: "paragraph", text: "CRM is not only for emergencies. In fact, the CRM skills practiced during normal operations — communication, coordination, situational awareness — are exactly what crew will rely on when an emergency occurs. An crew that communicates well during meal service will communicate well during an evacuation. An crew that lacks coordination during boarding will lack coordination during a decompression." },
    { type: "callout", variant: "tip", title: "CRM in Normal Operations", text: "Every interaction between crew members is a CRM opportunity. Use normal operations to practice: closed-loop communication on the interphone, clear handovers during service, briefings before tasks, and debriefings after challenging situations." },
    { type: "heading", text: "How CRM Integrates with Other Training", level: 3 },
    { type: "paragraph", text: "CRM is not a standalone subject — it integrates with every other area of cabin crew training. Safety and Emergency Procedures (SEP) training teaches WHAT to do; CRM teaches HOW to do it effectively as a team. First Aid training teaches medical procedures; CRM ensures the right crew member is assigned the right task during a medical emergency. Dangerous Goods training teaches identification and handling; CRM ensures crew communicate effectively about DG incidents." },
    { type: "table", caption: "CRM Integration with Other Training", headers: ["Training Area", "What It Teaches", "How CRM Enhances It"], rows: [
      ["SEP", "Evacuation procedures, fire fighting, ditching", "Crew coordination, role assignment, communication under stress"],
      ["First Aid", "Medical procedures, CPR, AED use", "Task allocation, resource management, passenger crowd control"],
      ["Dangerous Goods", "Identification, handling, reporting", "Communication with flight deck, passenger management, incident response"],
      ["Aviation Security", "Threat assessment, restraint procedures", "Team coordination, decision-making, assertiveness"],
    ]},
  ],
  "crm-lesson-2-1": [
    { type: "heading", text: "The Tenerife Disaster — A Turning Point", level: 3 },
    { type: "paragraph", text: "On March 27, 1977, two Boeing 747 aircraft collided on the runway at Los Rodeos Airport in Tenerife, Canary Islands, killing 583 people. The investigation revealed critical communication failures: the First Officer of the KLM aircraft did not challenge the Captain's premature takeoff decision, despite having concerns. The Captain's authoritative leadership style created a steep authority gradient that prevented crew members from speaking up." },
    { type: "paragraph", text: "This disaster became the catalyst for CRM development. NASA convened a workshop in 1979 titled 'Resource Management on the Flightdeck' which brought together aviation psychologists, pilots, and airline training departments. The workshop concluded that many aviation accidents were not caused by technical failures but by breakdowns in communication, leadership, and teamwork — human factors that could be addressed through training." },
    { type: "callout", variant: "danger", title: "Key Lesson from Tenerife", text: "A steep authority gradient — where junior crew feel unable to question senior crew decisions — can have catastrophic consequences. CRM training was specifically designed to flatten authority gradients and create a culture where every crew member feels empowered to speak up about safety concerns." },
    { type: "paragraph", text: "United Airlines became the first airline to implement CRM training in 1981. Initially called 'Cockpit Resource Management,' the focus was exclusively on flight deck crew. Over time, the concept expanded to include cabin crew, maintenance personnel, dispatchers, and air traffic controllers — becoming 'Crew Resource Management' to reflect the broader team approach." },
  ],
  "crm-lesson-3-1": [
    { type: "heading", text: "The SHELL Model in Cabin Operations", level: 3 },
    { type: "paragraph", text: "The SHELL model, developed by Edwards (1972) and modified by Hawkins (1987), is a conceptual framework for understanding human factors in aviation. Each letter represents a component that interacts with the central Liveware (the human):" },
    { type: "table", caption: "SHELL Model Applied to Cabin Crew", headers: ["Component", "Description", "Cabin Crew Example"], rows: [
      ["Software (S)", "Procedures, manuals, checklists, SOPs", "Emergency evacuation checklist, boarding procedures, service flow"],
      ["Hardware (H)", "Equipment, aircraft systems, tools", "Interphone, PA system, galley equipment, emergency exits, oxygen masks"],
      ["Environment (E)", "Physical and operational environment", "Cabin pressure, temperature, noise, turbulence, lighting, confined space"],
      ["Liveware (L) - Self", "The individual crew member", "Physical condition, fatigue level, stress, training, experience"],
      ["Liveware (L) - Others", "Other people in the system", "Fellow crew, passengers, flight deck, ground staff, medical professionals"],
    ]},
    { type: "paragraph", text: "The interfaces between these components are where human factors problems occur. For example, the interface between Liveware (crew) and Software (procedures) may fail if a procedure is unclear or poorly designed. The interface between Liveware (crew) and Environment may fail if noise prevents hearing an announcement, or if turbulence makes it difficult to perform a task." },
    { type: "callout", variant: "warning", title: "Human Limitations", text: "Cabin crew must understand their own limitations: vision degrades in low light, hearing can be masked by cabin noise, attention is limited (we can only focus on a few things at once), and memory is unreliable under stress. CRM provides strategies to work around these limitations through teamwork and procedural support." },
  ],
  "crm-lesson-4-1": [
    { type: "heading", text: "Communication Barriers in the Cabin", level: 3 },
    { type: "paragraph", text: "The cabin environment creates unique communication challenges that crew must overcome. Cabin noise levels during flight can reach 80-90 decibels, making it difficult to hear spoken communication. The physical layout of the cabin means crew may be separated by significant distances. Time pressure during boarding or emergencies can lead to rushed, incomplete communication. Cultural and language differences among both crew and passengers add further complexity." },
    { type: "table", caption: "Communication Barriers and CRM Countermeasures", headers: ["Barrier", "Effect on Communication", "CRM Countermeasure"], rows: [
      ["Cabin noise (80-90 dB)", "Messages not heard or misheard", "Closed-loop communication, speak clearly, use interphone"],
      ["Physical distance", "Cannot see or hear fellow crew", "Interphone checks, PA announcements, position reports"],
      ["Time pressure", "Rushed communication, missing information", "Briefings, standard phraseology, prioritize critical info"],
      ["Stress/emergency", "Tunnel vision, auditory exclusion", "Training, SOPs, checklists, designated roles"],
      ["Cultural differences", "Misunderstandings, offense", "Standard phraseology, cultural awareness training"],
      ["Hierarchy/authority gradient", "Junior crew don't speak up", "PACE model, just culture, flatten gradient"],
    ]},
    { type: "paragraph", text: "Closed-loop communication is the single most powerful CRM communication tool. It works like this: the sender transmits a message ('Cabin secure for takeoff'), the receiver acknowledges by reading back the message ('Cabin secure, confirmed'), and the sender confirms the readback was correct. This three-step process catches 95% of communication errors before they can affect safety." },
    { type: "callout", variant: "danger", title: "Communication Failure Example", text: "In the 1989 Kegworth Air Disaster, the flight crew shut down the wrong engine after a fan blade failure. The cabin crew noticed smoke and fire from the LEFT engine, but this information was not effectively communicated to the flight deck. Better cockpit-cabin communication — a core CRM skill — could have prevented this tragedy." },
  ],
  "crm-lesson-7-1": [
    { type: "heading", text: "Endsley's Three Levels of Situational Awareness", level: 3 },
    { type: "paragraph", text: "Dr. Mica Endsley's model of situational awareness is the most widely used framework in aviation. It describes three sequential levels that build upon each other. Failure at any level compromises the entire SA process." },
    { type: "table", caption: "Endsley's Situational Awareness Model in Cabin Operations", headers: ["Level", "Name", "What It Means", "Cabin Crew Example"], rows: [
      ["1", "Perception", "Detecting and sensing what is happening in the environment", "Smelling smoke, hearing an unusual noise, seeing a passenger in distress"],
      ["2", "Comprehension", "Understanding what the perceived information means", "Recognizing the smell is an electrical fire, the noise is engine-related, the passenger is having a heart attack"],
      ["3", "Projection", "Anticipating what will happen next and planning accordingly", "Anticipating the fire will spread, preparing extinguisher; anticipating diversion, preparing cabin for landing"],
    ]},
    { type: "paragraph", text: "Level 1 (Perception) failures occur when crew don't notice critical information. This can happen due to distraction, fatigue, or sensory limitations. Level 2 (Comprehension) failures occur when crew notice something but misinterpret it — for example, mistaking condensation for smoke. Level 3 (Projection) failures occur when crew understand the current situation but don't anticipate how it will develop — for example, not realizing that a small galley fire could spread to the cabin if not addressed immediately." },
    { type: "callout", variant: "warning", title: "Common SA Traps", text: "Fixation (focusing on one thing and missing others), Ambiguity (unclear situation but not seeking clarification), Confusion (losing track of what's happening), and SOP deviations (doing something different without communicating). If you notice any of these in yourself or a colleague, use the STOP-THINK-ACT technique to recover situational awareness." },
  ],
  "crm-lesson-9-1": [
    { type: "heading", text: "The ICAO TEM Framework in Detail", level: 3 },
    { type: "paragraph", text: "Threat and Error Management (TEM) was developed by ICAO and the University of Texas. It provides a practical framework for understanding how threats and errors develop into incidents, and how crew can manage them before they become accidents. The model is not theoretical — it is a operational tool used daily by flight crews worldwide." },
    { type: "paragraph", text: "The TEM process flow is: THREAT → (crew management) → safe outcome, OR THREAT → (mismanaged) → ERROR → (crew management) → safe outcome, OR THREAT → (mismanaged) → ERROR → (mismanaged) → UNDESIRED STATE → (crew management) → safe outcome, OR ... → INCIDENT/ACCIDENT. The key insight is that there are multiple opportunities to break the chain — at each stage, crew intervention can prevent escalation." },
    { type: "table", caption: "TEM Components in Cabin Operations", headers: ["Component", "Definition", "Cabin Examples"], rows: [
      ["Threat", "An event or condition that occurs beyond the crew's influence but requires management", "Severe turbulence, unruly passenger, galley fire, medical emergency, system malfunction"],
      ["Error", "An action or inaction by crew that leads to a deviation from intentions or expectations", "Missing an item on the cabin secure check, miscommunicating with flight deck, using wrong extinguisher type"],
      ["Undesired State", "A condition where safety margins have been compromised", "Unsecured galley during turbulence, passenger near an exit during emergency, incorrect cabin pressure awareness"],
      ["Countermeasure", "Crew actions that detect, trap, or mitigate threats and errors", "Checklists, briefings, cross-monitoring, SOPs, communication, calling for help"],
    ]},
    { type: "callout", variant: "danger", title: "The Error Chain", text: "Aviation accidents rarely result from a single error. They typically involve a chain of errors where each one enables the next. Breaking ANY link in the chain prevents the accident. This is why CRM emphasizes detection and trapping of errors at every stage — you don't need to prevent every error, you just need to catch them before they cascade." },
  ],
  "crm-lesson-8-1": [
    { type: "heading", text: "Decision-Making Models Compared", level: 3 },
    { type: "paragraph", text: "Different decision-making models are appropriate for different situations. The key is knowing WHICH model to use WHEN. In time-critical emergencies, you cannot gather a team for a discussion — you need to act immediately based on recognition of the situation. In non-time-critical situations, a structured team approach produces better decisions." },
    { type: "table", caption: "Decision-Making Models for Cabin Crew", headers: ["Model", "When to Use", "Process", "Best For"], rows: [
      ["RPD (Recognition-Primed Decision)", "Time-critical, experienced crew", "Recognize pattern → act on first workable option", "Evacuation decision, fire response"],
      ["FOR-DEC", "Team decision, moderate time available", "Facts → Options → Risks → Decision → Execution → Check", "Diversion decision, medical landing"],
      ["OODA Loop", "Rapidly changing situation", "Observe → Orient → Decide → Act → repeat", "Turbulence management, security situation"],
      ["STOP-THINK-ACT", "SA recovery, individual", "Stop → Think about situation → Act deliberately", "SA loss recovery, error correction"],
    ]},
    { type: "paragraph", text: "The FOR-DEC model is particularly useful for cabin crew because it structures team decision-making. The CSD/CS gathers Facts (what do we know?), considers Options (what can we do?), assesses Risks (what are the consequences of each option?), makes a Decision, Executes it, and then Checks whether it worked. This process can be completed in 2-5 minutes for most cabin decisions and ensures all crew input is considered." },
    { type: "callout", variant: "tip", title: "When to Deviate from SOPs", text: "SOPs cover most situations, but occasionally a situation arises that no SOP anticipated. In these cases, use FOR-DEC or OODA to make a team decision. Document the deviation and the reasoning. The Commander always has final authority, but crew input should be actively sought and considered." },
  ],
  "crm-lesson-10-1": [
    { type: "heading", text: "Workload Management in Practice", level: 3 },
    { type: "paragraph", text: "Effective workload management is a critical CRM skill. Both overload and underload are dangerous. Overload leads to task shedding (dropping important tasks), tunnel vision, and errors. Underload leads to complacency, distraction, and slowed reaction times when something does happen. The goal is to maintain an optimal workload level — challenged but not overwhelmed." },
    { type: "table", caption: "Cabin Workload by Flight Phase", headers: ["Flight Phase", "Workload Level", "Key Tasks", "CRM Strategies"], rows: [
      ["Pre-boarding", "Moderate", "Briefing, galley check, equipment check", "Team briefing, role assignment, contingency planning"],
      ["Boarding", "High", "Passenger assistance, baggage, delays, special needs", "Prioritization, delegation, communication"],
      ["Pre-departure", "High", "Cabin secure, door close, demo, safety check", "Checklists, cross-checking, position reports"],
      ["Cruise (service)", "Moderate", "Meal service, duty-free, passenger requests", "Task sharing, rotation, vigilance monitoring"],
      ["Turbulence", "High", "Secure cabin, passenger safety, galley shutdown", "PA announcements, task prioritization, safety first"],
      ["Pre-landing", "Moderate", "Cabin secure, landing checks, position", "Checklist, verification, crew communication"],
      ["Emergency", "Extreme", "Evacuation, fire fighting, medical, passenger management", "Role execution, clear commands, task delegation"],
    ]},
    { type: "paragraph", text: "During high workload periods, CRM teaches crew to prioritize: safety-critical tasks first (secure cabin, manage passengers), then operational tasks (service items, galley), then non-essential tasks. Delegation is key — the CSD/CS should assign tasks clearly and avoid doing everything themselves. Cross-monitoring ensures tasks are not missed when workload is high." },
    { type: "callout", variant: "warning", title: "Signs of Overload", text: "If you notice a crew member showing signs of overload — rushing, missing steps, looking stressed, not communicating — intervene. Offer to take a task, communicate with the CSD/CS, or suggest a brief pause to reorganize. Overload is a CRM issue, not a personal failure." },
  ],
  "crm-lesson-11-1": [
    { type: "heading", text: "The Science of Fatigue", level: 3 },
    { type: "paragraph", text: "Fatigue is not simply feeling tired — it is a physiological state that impairs performance similarly to alcohol impairment. Research shows that being awake for 17 hours impairs performance equivalent to a blood alcohol concentration (BAC) of 0.05%. After 24 hours awake, impairment is equivalent to 0.10% BAC — above the legal driving limit in most countries. This is why fatigue management is not optional — it is a safety-critical issue." },
    { type: "paragraph", text: "Cabin crew are particularly susceptible to fatigue due to irregular schedules, long duty periods, crossing multiple time zones, disrupted circadian rhythms, and working in a low-oxygen cabin environment (8,000 ft cabin altitude). The effects compound over consecutive duty days, meaning a crew member on day 4 of a trip may be significantly more fatigued than on day 1, even with the same sleep." },
    { type: "table", caption: "Fatigue Effects on Crew Performance", headers: ["Cognitive Effect", "Behavioral Sign", "Safety Impact"], rows: [
      ["Slower reaction time", "Delayed response to interphone calls, passenger requests", "Critical in emergencies where seconds matter"],
      ["Reduced attention", "Missing items on checklists, not noticing passenger behavior", "Safety checks may be incomplete"],
      ["Poor decision-making", "Choosing familiar but wrong actions, not considering options", "May not select best course of action"],
      ["Memory problems", "Forgetting briefings, instructions, task assignments", "Information not retained, tasks not completed"],
      ["Reduced communication", "Less likely to speak up, share information, or challenge", "CRM breakdown, errors not caught"],
      ["Microsleeps", "Brief sleep episodes (2-30 seconds) without awareness", "Extremely dangerous during safety-critical tasks"],
    ]},
    { type: "callout", variant: "danger", title: "Fatigue is Like Intoxication", text: "A crew member awake for 20+ hours performs as if legally intoxicated. No airline would allow an intoxicated crew member to work, yet fatigued crew operate regularly. CRM teaches crew to recognize fatigue in themselves and others, report it honestly, and use countermeasures (strategic napping, caffeine, task rotation) to manage it." },
  ],
  "crm-lesson-14-1": [
    { type: "heading", text: "The Cockpit-Cabin Team", level: 3 },
    { type: "paragraph", text: "The flight deck and cabin are not separate departments — they are one crew with shared goals. The Commander has overall responsibility for the aircraft, but cabin crew have expertise and responsibilities that the flight deck relies on. The cabin crew are the Commander's eyes and ears in the cabin, reporting on passenger conditions, security concerns, and any abnormal situations. In return, the flight deck provides the cabin crew with information about flight conditions, timing, and any issues that may affect cabin operations." },
    { type: "paragraph", text: "This information flow must be bidirectional and continuous. The NITS briefing (Nature, Intentions, Time, Special instructions) is the standard format for flight deck to cabin communication during non-routine situations. When cabin crew need to contact the flight deck, they should use the interphone with a clear, concise format: identify themselves, state the issue, and provide relevant details." },
    { type: "callout", variant: "info", title: "NITS Briefing Format", text: "N: Nature of the situation (what's happening) | I: Intentions of the Commander (what we plan to do) | T: Time available (how long before action needed) | S: Special instructions for cabin crew (what you need to do). The CSD/CS should brief all cabin crew using NITS after receiving information from the flight deck." },
    { type: "callout", variant: "warning", title: "Sterile Cockpit Rule", text: "Below 10,000 feet (climb and descent), only safety-critical communication is permitted between cabin and flight deck. This is the 'sterile cockpit' rule (FAA FAR 121.542, EASA equivalent). Non-urgent calls during this phase can distract the flight crew during the most critical phases of flight. Exceptions: safety issues, medical emergencies, security threats, abnormal sounds/smells." },
  ],
  "crm-lesson-16-2": [
    { type: "heading", text: "Evacuation Command and Coordination", level: 3 },
    { type: "paragraph", text: "During an evacuation, the cabin crew's primary job is to get passengers out of the aircraft as quickly and safely as possible. The FAA requires that an evacuation be completable within 90 seconds using only half the available exits. This means crew have approximately 90 seconds to manage hundreds of passengers, direct them to usable exits, prevent crushing at doorways, and ensure no one is left behind. CRM is the difference between a successful 90-second evacuation and a tragedy." },
    { type: "paragraph", text: "The standard evacuation commands are designed to be short, directive, and unambiguous. 'Unfasten seatbelts!' — the first command, because seatbelts are the most common reason passengers can't move. 'Come this way!' — directs passengers to a usable exit. 'Leave everything!' — passengers trying to take belongings slows evacuation dangerously. 'Jump! Slide!' — at the exit, directs passengers onto the slide." },
    { type: "callout", variant: "danger", title: "Critical Evacuation CRM", text: "If your assigned exit is unusable (fire outside, slide not deployed, debris blocking), you must immediately redirect passengers to another exit. Shout 'This exit blocked! Go that way!' and point to an alternative. Coordinate with the crew member at the other exit to expect additional passengers. This real-time coordination is CRM in its most critical form." },
    { type: "list", items: [
      "Cabin crew at exits: shout commands continuously, manage flow rate, prevent pile-ups",
      "CSD/CS: coordinate overall evacuation, check all exits are manned, communicate with flight deck",
      "Cabin crew in cabin: direct passengers to exits, assist mobility-impaired, check lavatories and galley areas",
      "All crew: assess exit usability before opening, prevent passengers from taking belongings",
      "Post-evacuation: assemble passengers at safe distance, conduct headcount, assist injured",
    ]},
  ],
  "crm-lesson-20-1": [
    { type: "heading", text: "CRM Under Extreme Stress", level: 3 },
    { type: "paragraph", text: "Emergencies create the most challenging environment for CRM. The physiological effects of stress — adrenaline release, tunnel vision, auditory exclusion, time distortion, fine motor skill degradation — directly attack the very CRM skills that are most needed. Crew may stop communicating, fixate on one aspect of the problem, or freeze entirely. CRM training is specifically designed to create automatic responses that function even under extreme stress." },
    { type: "paragraph", text: "The key to emergency CRM is preparation. Crew who have practiced emergency procedures repeatedly in training will default to those procedures under stress. This is why airlines conduct recurrent SEP (Safety and Emergency Procedures) training — the goal is not just knowledge but automaticity. When the brain is stressed, it falls back on trained patterns. If those patterns include CRM behaviors (communicating, coordinating, checking), they will be performed even when conscious thought is impaired." },
    { type: "table", caption: "Stress Effects on CRM and Countermeasures", headers: ["Stress Effect", "Impact on CRM", "Training Countermeasure"], rows: [
      ["Tunnel vision", "Crew focuses on one thing, misses other threats", "SOPs require checking all areas, crew cross-monitoring"],
      ["Auditory exclusion", "Crew doesn't hear important calls or alarms", "Closed-loop communication, physical touch to get attention"],
      ["Time distortion", "Time feels slower/faster than reality", "Use standard time references, communicate timing explicitly"],
      ["Freezing", "Crew unable to act or decide", "Command voice from leader, clear task assignment, physical direction"],
      ["Memory impairment", "Crew forgets trained procedures", "Checklists, procedural cards, crew cross-checking"],
    ]},
    { type: "callout", variant: "danger", title: "The 90-Second Rule", text: "In many cabin emergencies, the first 90 seconds determine the outcome. CRM must be automatic in those 90 seconds — there is no time for discussion or deliberation. This is why CRM training emphasizes practice, simulation, and repetition. The goal is to make CRM behaviors as automatic as breathing." },
  ],
};

export function getCRMContentExpansion(lessonId: string): any[] {
  return crmContentExpansion[lessonId] || [];
}
