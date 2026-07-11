// Interactive content enhancements for CRM lessons
// Adds images, knowledge checks, and interactive components

export const crmLessonEnhancements: Record<string, any[]> = {
  "crm-lesson-1-1": [
    { type: "image", src: "/images/crm/cabin-crew-briefing.jpg", caption: "Cabin crew briefing — CRM begins with effective pre-flight coordination between all crew members", alt: "Cabin crew pre-flight briefing" },
    { type: "knowledgeCheck", question: "What does CRM stand for?", options: ["Crew Resource Management", "Cabin Risk Management", "Crew Response Method", "Cabin Resource Methodology"], correctAnswer: 0, explanation: "CRM stands for Crew Resource Management — the effective use of all available resources to achieve safe and efficient flight operations." },
  ],
  "crm-lesson-1-2": [
    { type: "knowledgeCheck", question: "What are the primary goals of CRM?", options: ["Improve communication, teamwork, and decision-making", "Reduce costs and increase profits", "Eliminate all human error permanently", "Replace SOPs with personal judgment"], correctAnswer: 0, explanation: "CRM aims to improve communication, teamwork, decision-making, situational awareness, and reduce human error through better resource utilization." },
  ],
  "crm-lesson-2-1": [
    { type: "image", src: "/images/crm/aviation-safety.jpg", caption: "The Tenerife disaster (1977) was a catalyst for CRM development — communication failures led to catastrophic consequences", alt: "Aviation safety and CRM history" },
    { type: "knowledgeCheck", question: "What event was a major catalyst for the development of CRM?", options: ["Tenerife disaster (1977)", "First flight of the A380", "Introduction of jet engines", "Deregulation of airlines"], correctAnswer: 0, explanation: "The Tenerife disaster in 1977, where communication failures led to two 747s colliding, was a primary catalyst for CRM development." },
  ],
  "crm-lesson-3-1": [
    { type: "image", src: "/images/crm/crew-stress.jpg", caption: "Human factors affect all crew members — understanding physical, cognitive, and psychological limitations is essential", alt: "Human factors in aviation" },
    { type: "knowledgeCheck", question: "What does the SHELL model stand for?", options: ["Software, Hardware, Environment, Liveware, Liveware", "Safety, Health, Equipment, Logistics, Leadership", "System, Human, Error, Learning, Logic", "Safety, Hardware, Environment, Limitation, Learning"], correctAnswer: 0, explanation: "SHELL stands for Software, Hardware, Environment, Liveware (human), and Liveware (other humans) — a framework for understanding human factors interactions." },
  ],
  "crm-lesson-4-1": [
    { type: "image", src: "/images/crm/communication-flow.jpg", caption: "Effective communication is the foundation of CRM — sender, message, channel, receiver, feedback", alt: "Communication process diagram" },
    { type: "knowledgeCheck", question: "What is closed-loop communication?", options: ["The sender says something and the receiver reads it back to confirm", "Communication that happens in a circle", "Communication that goes through a closed door", "Communication using hand signals only"], correctAnswer: 0, explanation: "Closed-loop communication means the receiver reads back the message to confirm understanding — this is critical for safety in aviation." },
  ],
  "crm-lesson-4-2": [
    { type: "knowledgeCheck", question: "What does the PACE model stand for?", options: ["Probe, Alert, Challenge, Emergency", "Plan, Act, Check, Execute", "Prepare, Approach, Communicate, Evaluate", "Priority, Action, Communication, Emergency"], correctAnswer: 0, explanation: "PACE: Probe (ask about concern), Alert (state concern clearly), Challenge (state firmly), Emergency (take action). It's an assertiveness escalation model." },
    { type: "clickToReveal", title: "Why is active listening important?", content: "Active listening ensures you fully understand the message before responding. It prevents miscommunication that could lead to safety issues. Techniques include: maintaining eye contact, paraphrasing, asking clarifying questions, and not interrupting.", variant: "info" },
  ],
  "crm-lesson-5-1": [
    { type: "image", src: "/images/crm/cabin-crew-team.jpg", caption: "Cabin crew operate as a coordinated team — CSD/CS leads, but every member plays a critical role", alt: "Cabin crew teamwork" },
    { type: "knowledgeCheck", question: "What are the stages of team development?", options: ["Forming, Storming, Norming, Performing", "Planning, Starting, Working, Finishing", "Beginning, Middle, End, Review", "Initiation, Conflict, Resolution, Success"], correctAnswer: 0, explanation: "The four stages are: Forming (getting to know each other), Storming (conflict emergence), Norming (establishing norms), Performing (effective collaboration)." },
  ],
  "crm-lesson-6-1": [
    { type: "image", src: "/images/crm/leadership-aviation.jpg", caption: "The CSD/CS is the cabin team leader — effective leadership sets the tone for the entire crew", alt: "Aviation leadership" },
    { type: "knowledgeCheck", question: "What is an authority gradient?", options: ["The perceived difference in power between crew members", "The slope of the aircraft during climb", "The rate of change in altitude", "The hierarchy of passenger seating"], correctAnswer: 0, explanation: "Authority gradient is the perceived power difference between crew members. A steep gradient can prevent junior crew from speaking up about safety concerns." },
  ],
  "crm-lesson-7-1": [
    { type: "knowledgeCheck", question: "What are the three levels of situational awareness?", options: ["Perception, Comprehension, Projection", "Seeing, Hearing, Feeling", "Looking, Thinking, Acting", "Noticing, Understanding, Remembering"], correctAnswer: 0, explanation: "Endsley's model: Level 1 (Perception - what's happening), Level 2 (Comprehension - what does it mean), Level 3 (Projection - what will happen next)." },
    { type: "clickToReveal", title: "What are signs of SA loss?", content: "Signs include: fixation on one thing, ambiguity about the situation, confusion, not communicating with crew, violating SOPs, and using outdated information. If you notice these signs, use STOP-THINK-ACT to recover.", variant: "warning" },
  ],
  "crm-lesson-8-1": [
    { type: "knowledgeCheck", question: "What does the FOR-DEC decision-making model stand for?", options: ["Facts, Options, Risks, Decision, Execution, Check", "Find, Organize, React, Decide, Execute, Confirm", "Focus, Observe, Respond, Decide, Engage, Complete", "Forecast, Options, Review, Decide, Execute, Control"], correctAnswer: 0, explanation: "FOR-DEC: Gather Facts, consider Options, assess Risks, make Decision, Execute the decision, Check the results. Used for structured team decision-making." },
  ],
  "crm-lesson-9-1": [
    { type: "image", src: "/images/crm/crisis-management.jpg", caption: "Threat and Error Management (TEM) — identifying threats before they become incidents", alt: "TEM framework" },
    { type: "knowledgeCheck", question: "What are the three categories of threats in the TEM framework?", options: ["Environmental, Operational, Latent", "Weather, Equipment, People", "External, Internal, Hidden", "Natural, Mechanical, Human"], correctAnswer: 0, explanation: "TEM categorizes threats as: Environmental (weather, terrain), Operational (ATC, equipment), and Latent (organizational design, training gaps)." },
  ],
  "crm-lesson-9-3": [
    { type: "knowledgeCheck", question: "What is the error chain?", options: ["A series of linked errors that lead to an incident", "A chain used to secure equipment", "A procedure for error reporting", "A type of communication protocol"], correctAnswer: 0, explanation: "The error chain is a sequence of linked errors where each one enables the next. Breaking any link in the chain can prevent the incident." },
    { type: "clickToReveal", title: "How do you break the error chain?", content: "Break the error chain by: detecting errors early, using SOPs and checklists, cross-monitoring crew actions, conducting thorough briefings, speaking up about concerns, and using closed-loop communication.", variant: "tip" },
  ],
  "crm-lesson-10-1": [
    { type: "image", src: "/images/crm/cabin-crew-training.jpg", caption: "Workload management — balancing tasks during boarding, service, and emergencies", alt: "Cabin crew workload management" },
    { type: "knowledgeCheck", question: "What are the two types of problematic workload?", options: ["Overload and underload (complacency)", "Heavy and light", "Fast and slow", "Manual and automated"], correctAnswer: 0, explanation: "Both overload (too much to do) and underload (too little, leading to complacency) are dangerous. CRM teaches strategies for managing both extremes." },
  ],
  "crm-lesson-11-1": [
    { type: "image", src: "/images/crm/crew-stress.jpg", caption: "Fatigue awareness — recognizing the signs in yourself and fellow crew members", alt: "Crew fatigue awareness" },
    { type: "knowledgeCheck", question: "What is the difference between fatigue and tiredness?", options: ["Fatigue is a physiological state requiring rest; tiredness is temporary", "They are the same thing", "Tiredness is more serious than fatigue", "Fatigue only affects pilots, not cabin crew"], correctAnswer: 0, explanation: "Fatigue is a physiological state of reduced mental/physical performance capability that cannot be overcome by willpower alone. Tiredness is a temporary feeling that rest can resolve." },
  ],
  "crm-lesson-13-1": [
    { type: "knowledgeCheck", question: "What is the difference between assertiveness and aggression?", options: ["Assertiveness is expressing views clearly and respectfully; aggression imposes views on others", "They are the same thing", "Assertiveness is louder than aggression", "Aggression is more effective in emergencies"], correctAnswer: 0, explanation: "Assertiveness respects both your own rights and others' rights. Aggression violates others' rights. In aviation, assertiveness is essential for safety — speaking up about concerns." },
  ],
  "crm-lesson-14-1": [
    { type: "image", src: "/images/crm/flight-deck-coordination.jpg", caption: "Cabin and flight deck coordination — one team, shared goals, clear communication", alt: "Cockpit-cabin coordination" },
    { type: "knowledgeCheck", question: "What is the sterile cockpit rule?", options: ["No non-essential communication below 10,000 feet", "No talking in the cockpit at all", "Cockpit must be physically sterilized", "No passengers allowed in cockpit"], correctAnswer: 0, explanation: "The sterile cockpit rule prohibits non-essential communication between cabin and flight deck during critical phases of flight (below 10,000 feet) to prevent distraction." },
  ],
  "crm-lesson-14-2": [
    { type: "knowledgeCheck", question: "What does NITS stand for in a briefing?", options: ["Nature, Intentions, Time, Special instructions", "Name, Identity, Title, Status", "Number, Items, Time, Sequence", "Notice, Information, Task, Schedule"], correctAnswer: 0, explanation: "NITS briefing: Nature of the situation, Intentions of the Commander, Time available, Special instructions for cabin crew. Used for emergency coordination." },
  ],
  "crm-lesson-16-2": [
    { type: "image", src: "/images/crm/cabin-crew-evacuation.jpg", caption: "Evacuation commands must be clear, loud, and authoritative — every second counts", alt: "Cabin evacuation" },
    { type: "knowledgeCheck", question: "What are the standard evacuation commands?", options: ["Unfasten seatbelts! Come this way! Leave everything! Jump! Slide!", "Please exit the aircraft calmly", "Emergency, emergency, everyone out", "Evacuate now, follow the lights"], correctAnswer: 0, explanation: "Standard evacuation commands: 'Unfasten seatbelts! Come this way! Leave everything! Jump! Slide!' These are short, clear, and directive." },
  ],
  "crm-lesson-17-2": [
    { type: "knowledgeCheck", question: "What does the VERB model stand for?", options: ["Verify, Explain, Redirect, Boundary", "Voice, Engage, Respond, Behave", "Verify, Evaluate, React, Brief", "Voice, Explain, Redirect, Boundary"], correctAnswer: 0, explanation: "VERB: Verify the behavior, Explain why it's a problem, Redirect to acceptable behavior, set clear Boundary/consequence if behavior continues." },
  ],
  "crm-lesson-19-2": [
    { type: "knowledgeCheck", question: "What is a 'just culture' in aviation?", options: ["Fair treatment where honest mistakes are distinguished from willful violations", "A culture where everyone is always nice", "A culture where no one is ever punished", "A culture where only managers make decisions"], correctAnswer: 0, explanation: "Just culture distinguishes between honest mistakes (which should be learning opportunities) and willful violations or recklessness (which warrant discipline). It encourages reporting without fear of unfair punishment." },
  ],
  "crm-lesson-20-1": [
    { type: "image", src: "/images/crm/cabin-emergency.jpg", caption: "CRM in emergencies — team coordination, clear communication, and decisive leadership under extreme stress", alt: "Emergency CRM in cabin" },
    { type: "knowledgeCheck", question: "How does CRM apply during emergencies?", options: ["CRM principles become even more critical under stress — communication, teamwork, and leadership are essential", "CRM is suspended during emergencies", "Only the Commander uses CRM during emergencies", "CRM is replaced by SOPs during emergencies"], correctAnswer: 0, explanation: "CRM principles are MOST critical during emergencies. The stress of emergencies makes human factors vulnerabilities worse, so CRM skills (communication, teamwork, SA, leadership) become vital." },
  ],
  "crm-lesson-21-1": [
    { type: "image", src: "/images/crm/crew-debrief.jpg", caption: "Case study analysis — learning from past incidents to prevent future ones", alt: "Crew debrief and case study" },
    { type: "knowledgeCheck", question: "What was the key CRM lesson from the Tenerife disaster (1977)?", options: ["Communication failure and authority gradient prevented crew from questioning the Captain's decision", "The aircraft was mechanically unsound", "The weather was too severe to fly", "The runway was too short"], correctAnswer: 0, explanation: "The Tenerife disaster highlighted how steep authority gradients and communication failures can prevent crew from questioning unsafe decisions. This led directly to CRM training development." },
  ],
  "crm-lesson-22-1": [
    { type: "knowledgeCheck", question: "What is the most important CRM principle to remember?", options: ["CRM is about using ALL available resources effectively for safety", "CRM only applies during emergencies", "CRM is only for the Captain", "CRM replaces standard operating procedures"], correctAnswer: 0, explanation: "CRM is about effectively using ALL available resources — human (crew, passengers, ATC, medical professionals), equipment, and information — to achieve safe and efficient operations." },
  ],
};

export function getCRMEnhancedContent(lessonId: string): any[] {
  return crmLessonEnhancements[lessonId] || [];
}
