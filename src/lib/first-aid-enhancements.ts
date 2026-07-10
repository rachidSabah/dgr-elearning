// Interactive content enhancements for First Aid lessons
// Uses high-resolution images from NotebookLM artifacts + web-searched images
// Images are mapped to lessons based on VLM analysis of their content

export const firstAidLessonEnhancements: Record<string, any[]> = {
  "fa-lesson-1-1": [
    { type: "image", src: "/images/fa-nblm/artifact4-img01.jpg", caption: "First aid fundamentals — the Assessor, Collector, and Teller roles in medical emergencies", alt: "First aid fundamentals and crew roles" },
    { type: "image", src: "/images/fa-nblm/artifact4-img15.jpg", caption: "Cabin crew first aid response protocol — coordinated crew action saves lives", alt: "Cabin crew first aid protocol" },
    { type: "image", src: "/images/first-aid/medical-equipment.jpg", caption: "Medical equipment ready for in-flight emergency response", alt: "Medical equipment for in-flight emergencies" },
  ],
  "fa-lesson-1-2": [
    { type: "image", src: "/images/fa-nblm/artifact4-img03.jpg", caption: "Principles of first aid: Preserve life, Prevent worsening, Promote recovery", alt: "First aid principles" },
    { type: "image", src: "/images/first-aid/first-aid-kit.jpg", caption: "A well-stocked first aid kit is essential for providing immediate assistance", alt: "First aid kit contents" },
    { type: "knowledgeCheck", question: "What are the three fundamentals of first aid?", options: ["Protect, Prevent, Provide", "Preserve, Prevent, Promote", "Assess, Act, Arrange", "Check, Call, Care"], correctAnswer: 1, explanation: "The three fundamentals are: Preserve life, Prevent condition worsening, and Promote casualty's recovery." },
  ],
  "fa-lesson-1-3": [
    { type: "image", src: "/images/fa-nblm/artifact4-img10.jpg", caption: "Medical Assistance Protocol — the 3-pillar framework for crew response", alt: "Medical assistance protocol framework" },
    { type: "knowledgeCheck", question: "What does DRABC stand for?", options: ["Danger, Response, Airway, Breathing, Circulation", "Diagnosis, Response, Airway, Blood, Care", "Danger, Rescue, Airway, Breathing, CPR", "Damage, Response, Assessment, Breathing, Circulation"], correctAnswer: 0, explanation: "DRABC: Danger, Response, Airway, Breathing, Circulation - the assessment procedure." },
    { type: "knowledgeCheck", question: "What does AMEGA stand for?", options: ["Assess, Move, Examine, Get help, Aftermath", "Airway, Move, Examine, Get help, Assess", "Assess, Make safe, Examine/Emergency, Get help, Aftermath", "Assess, Move, Emergency, Get help, After"], correctAnswer: 2, explanation: "AMEGA: Assess, Make Area Safe, Examine and give Emergency treatment, Get Help, Aftermath." },
    { type: "clickToReveal", title: "What information should you collect during assessment?", content: "History (illness/accident background), Symptoms (what the passenger complains of), Signs (abnormalities you observe), Diagnosis, First Aid Treatment, Disposal (medical assistance request).", variant: "info" },
  ],
  "fa-lesson-2-1": [
    { type: "image", src: "/images/fa-nblm/artifact4-img05.jpg", caption: "Food poisoning prevention — proper food handling and hygiene protocols", alt: "Food poisoning prevention and hygiene" },
    { type: "knowledgeCheck", question: "What are the four conditions for bacterial growth?", options: ["Time, temperature, moisture, food", "Light, air, water, sugar", "Heat, cold, dry, dark", "Oxygen, time, space, nutrients"], correctAnswer: 0, explanation: "Bacteria grow best with: Time, Medium temperature, Moisture, and Suitable food." },
  ],
  "fa-lesson-2-2": [
    { type: "image", src: "/images/fa-nblm/artifact1-img03.jpg", caption: "Immunisation procedures for crew — protection against travel-related diseases", alt: "Immunisation and disease prevention" },
    { type: "knowledgeCheck", question: "How long is typhoid inoculation valid?", options: ["3 years", "5 years", "10 years", "Lifetime"], correctAnswer: 1, explanation: "Typhoid inoculation is valid for 5 years." },
    { type: "knowledgeCheck", question: "How is malaria transmitted?", options: ["Contaminated food", "Mosquitoes", "Open wounds", "Airborne"], correctAnswer: 1, explanation: "Malaria is transmitted by mosquitoes carrying malarial parasites." },
  ],
  "fa-lesson-3-1": [
    { type: "svg", src: "/images/fa-svg/vital-signs-table.svg", caption: "Normal Vital Signs by Age Group - pulse and breathing rates for adults, children, and infants" },
    { type: "image", src: "/images/first-aid/pulse-checking.jpg", caption: "Checking the radial pulse at the wrist — place 2-3 fingers above the wrist creases at the base of the thumb", alt: "Checking radial pulse at wrist" },
    { type: "image", src: "/images/first-aid/blood-pressure.jpg", caption: "Blood pressure and vital signs assessment equipment", alt: "Blood pressure measurement" },
    { type: "image", src: "/images/fa-nblm/artifact2-img01.jpg", caption: "Vital signs assessment — pulse, breathing rates, and neurological checks", alt: "Vital signs and stroke assessment" },
    { type: "knowledgeCheck", question: "What is the normal resting pulse rate for an adult?", options: ["40-60", "60-80", "80-100", "100-120"], correctAnswer: 1, explanation: "Adult: 60-80 per minute. Child: 80-100. Infant: 100-120." },
    { type: "knowledgeCheck", question: "What is the normal breathing rate for an infant?", options: ["12-16", "16-20", "20-24", "24-28"], correctAnswer: 3, explanation: "Infant breathing rate: 24-28 per minute." },
  ],
  "fa-lesson-4-1": [
    { type: "image", src: "/images/fa-nblm/artifact4-img20.jpg", caption: "Minor in-flight emergencies — dental issues, sharp objects, and gastrointestinal discomforts", alt: "Minor in-flight medical emergencies" },
  ],
  "fa-lesson-4-2": [
    { type: "image", src: "/images/fa-nblm/artifact4-img20.jpg", caption: "Treatment of minor emergencies — dental, sharp objects, hysteria, and motion sickness", alt: "Minor emergencies treatment" },
    { type: "knowledgeCheck", question: "What is the Valsalva Manoeuvre used for?", options: ["Treating nose bleeds", "Equalising ear pressure", "Removing foreign objects", "Treating toothache"], correctAnswer: 1, explanation: "The Valsalva Manoeuvre (pinch nose, blow gently, swallow) equalises ear pressure during descent." },
    { type: "clickToReveal", title: "Can anti-sickness medication be given to pregnant passengers?", content: "NO. Anti-sickness medication may cause drowsiness and should NOT be given to pregnant passengers.", variant: "danger" },
  ],
  "fa-lesson-5-1": [
    { type: "image", src: "/images/fa-nblm/artifact4-img05.jpg", caption: "Poisoning and food poisoning — causes, symptoms, and treatment protocols", alt: "Food poisoning treatment" },
    { type: "knowledgeCheck", question: "Should you induce vomiting if someone has swallowed poison?", options: ["Yes, always", "No, never induce vomiting", "Only if conscious", "Only if it's food poisoning"], correctAnswer: 1, explanation: "NEVER induce vomiting. Call for Dr/nurse, place in recovery position if unconscious, CPR if no breathing." },
  ],
  "fa-lesson-5-2": [
    { type: "image", src: "/images/fa-nblm/artifact3-img05.jpg", caption: "Chemical emergency treatment — eye splash flushing and corrosive liquid protocols", alt: "Chemical emergency treatment" },
    { type: "knowledgeCheck", question: "How long should you flush a chemical eye splash with water?", options: ["2 minutes", "5 minutes", "10 minutes", "20 minutes"], correctAnswer: 2, explanation: "Flush the eye with water for approximately 10 minutes, rinsing away from the unaffected eye." },
  ],
  "fa-lesson-5-3": [
    { type: "image", src: "/images/fa-nblm/artifact3-img05.jpg", caption: "Eye injury management — foreign body removal and chemical splash treatment", alt: "Eye injury first aid" },
  ],
  "fa-lesson-6-1": [
    { type: "image", src: "/images/fa-nblm/artifact3-img01.jpg", caption: "Respiratory conditions — asthma and hyperventilation management onboard", alt: "Respiratory emergency treatment" },
    { type: "knowledgeCheck", question: "What medication does an asthma passenger typically use?", options: ["Insulin", "Ventolin inhaler", "Nitroglycerin", "Aspirin"], correctAnswer: 1, explanation: "Asthma passengers typically use a Ventolin (salbutamol) inhaler to treat their condition." },
  ],
  "fa-lesson-6-2": [
    { type: "svg", src: "/images/fa-svg/heimlich-steps.svg", caption: "Heimlich Manoeuvre - 4-step sequence: encourage cough, back slaps, abdominal thrusts, alternate" },
    { type: "image", src: "/images/first-aid/heimlich-maneuver.jpg", caption: "The Heimlich manoeuvre — stand behind, interlock fingers around waist, fist above navel, pull sharply inwards and upwards", alt: "Heimlich manoeuvre demonstration" },
    { type: "image", src: "/images/first-aid/choking-first-aid.jpg", caption: "Choking response sequence: encourage cough, back slaps, then Heimlich manoeuvre", alt: "Choking first aid procedure" },
    { type: "image", src: "/images/first-aid/choking-infant.jpg", caption: "Infant choking treatment — lay baby along forearm, 5 back slaps + 5 chest thrusts", alt: "Infant choking treatment" },
    { type: "image", src: "/images/fa-nblm/artifact3-img10.jpg", caption: "Choking and respiratory emergency response — adult, child, and infant procedures", alt: "Choking emergency response" },
    { type: "knowledgeCheck", question: "What is the FIRST thing you should do for a conscious choking adult?", options: ["Perform Heimlich manoeuvre", "Give 5 back slaps", "Encourage coughing", "Start CPR"], correctAnswer: 2, explanation: "First encourage the passenger to cough, then bend forward and give 5 back slaps." },
    { type: "knowledgeCheck", question: "How many back slaps should be given to a choking adult?", options: ["3", "5", "7", "10"], correctAnswer: 1, explanation: "Give 5 sharp slaps to the back between the shoulder blades." },
    { type: "clickToReveal", title: "What is the Heimlich Manoeuvre?", content: "Stand behind the person. Interlock fingers around their waist. Place flat hand over your fist, thumb facing inwards. Place above navel and pull sharply inwards and upwards. Do up to 5 times, then alternate with 5 backslaps.", variant: "info" },
  ],
  "fa-lesson-7-1": [
    { type: "image", src: "/images/fa-nblm/artifact3-img10.jpg", caption: "Fainting and loss of consciousness — assessment and recovery procedures", alt: "Fainting and unconsciousness assessment" },
    { type: "knowledgeCheck", question: "What should you do if a fainting passenger doesn't regain consciousness quickly?", options: ["Give them water", "Open airway, check breathing, recovery position", "Shake them vigorously", "Stand them up"], correctAnswer: 1, explanation: "If not recovering quickly: open the airway, check breathing and pulse, be ready to resuscitate, place in recovery position." },
  ],
  "fa-lesson-7-2": [
    { type: "svg", src: "/images/fa-svg/drabc-flowchart.svg", caption: "DRABC Emergency Assessment Flowchart - step-by-step decision tree" },
    { type: "image", src: "/images/first-aid/cpr-training.jpg", caption: "CPR training — chest compressions and rescue breaths can save lives", alt: "CPR training" },
    { type: "image", src: "/images/fa-nblm/artifact4-img03.jpg", caption: "DRABC emergency resuscitation procedure — step-by-step assessment", alt: "DRABC resuscitation procedure" },
    { type: "knowledgeCheck", question: "How long should you check for breathing?", options: ["5 seconds", "10 seconds", "15 seconds", "20 seconds"], correctAnswer: 1, explanation: "Check for breathing for approximately 10 seconds using Look, Listen, Feel." },
  ],
  "fa-lesson-7-3": [
    { type: "image", src: "/images/fa-nblm/artifact4-img03.jpg", caption: "ABC assessment — Airway opening methods, Breathing check, Circulation evaluation", alt: "ABC airway breathing circulation" },
    { type: "knowledgeCheck", question: "Which airway opening method is used for suspected spinal injuries?", options: ["Neck-lift, head tilt", "Chin-lift, head tilt", "Modified jaw thrust", "Finger sweep"], correctAnswer: 2, explanation: "The Modified Jaw Thrust is used when neck/spinal injuries are suspected to minimise further injury." },
    { type: "knowledgeCheck", question: "How long without oxygen can cause permanent brain damage?", options: ["1-2 minutes", "3-4 minutes", "5-7 minutes", "10 minutes"], correctAnswer: 1, explanation: "3-4 minutes without breathing may cause permanent brain damage." },
  ],
  "fa-lesson-7-4": [
    { type: "svg", src: "/images/fa-svg/cpr-comparison.svg", caption: "CPR Technique Comparison - Adult vs Child vs Infant hand positions, ratios, and depths" },
    { type: "image", src: "/images/first-aid/cpr-chest-compressions.jpg", caption: "Correct hand placement for adult chest compressions — heel of hand on breastbone", alt: "CPR chest compressions" },
    { type: "image", src: "/images/first-aid/cpr-infant.jpg", caption: "Infant CPR uses two fingers only, with gentle pressure on the chest", alt: "Infant CPR technique" },
    { type: "image", src: "/images/fa-nblm/artifact1-img09.jpg", caption: "CPR procedure — compression ratios for adults, children, and infants", alt: "CPR compression ratios" },
    { type: "svg", src: "/images/fa-svg/chain-of-survival.svg", caption: "Chain of Survival - Early Access, Early CPR, Early Defibrillation, Early Advanced Care" },
    { type: "image", src: "/images/fa-nblm/artifact3-img10.jpg", caption: "Chain of Survival — Early Access, Early CPR, Early Defibrillation, Early Advanced Care", alt: "Chain of survival" },
    { type: "knowledgeCheck", question: "What is the correct CPR ratio for adults?", options: ["15:2", "30:2", "5:1", "20:2"], correctAnswer: 1, explanation: "Adult CPR: 30 chest compressions followed by 2 breaths." },
    { type: "knowledgeCheck", question: "For child/infant CPR, what do you start with?", options: ["30 compressions", "5 rescue breaths", "2 breaths", "10 compressions"], correctAnswer: 1, explanation: "For children and infants: 5 rescue breaths first, then 30 compressions and 2 breaths." },
    { type: "clickToReveal", title: "What is the Chain of Survival?", content: "The Chain of Survival: Early Access → Early CPR → Early Defibrillation → Early Advanced Care. The passenger has the best chance of survival when all links are present.", variant: "tip" },
    { type: "matching", title: "Match CPR technique to age group", left: ["Adult (over 8yr)", "Child (1-7yr)", "Infant (under 1yr)"], right: ["Heel of both hands, 30:2", "Heel of one hand, 5 breaths then 30:2", "Two fingers, 5 breaths then 30:2"] },
  ],
  "fa-lesson-8-1": [
    { type: "image", src: "/images/first-aid/unconscious-patient.jpg", caption: "Unconscious passenger assessment — check breathing, pulse, and airway", alt: "Unconscious patient assessment" },
    { type: "image", src: "/images/fa-nblm/artifact3-img10.jpg", caption: "Unconsciousness causes and treatment — maintaining airway priority", alt: "Unconsciousness treatment" },
    { type: "knowledgeCheck", question: "Should you give an unconscious passenger anything by mouth?", options: ["Yes, water", "Yes, medication", "No, nothing by mouth", "Only if they ask"], correctAnswer: 2, explanation: "Never give an unconscious passenger anything by mouth. Maintain airway and place in recovery position." },
  ],
  "fa-lesson-8-2": [
    { type: "svg", src: "/images/fa-svg/recovery-position-stages.svg", caption: "Recovery Position - 5 detailed stages with step-by-step instructions" },
    { type: "image", src: "/images/first-aid/recovery-position.jpg", caption: "The recovery position maintains an open airway and allows fluids to drain from the mouth", alt: "Recovery position demonstration" },
    { type: "image", src: "/images/fa-nblm/artifact3-img10.jpg", caption: "Recovery position stages — protecting the airway in unconscious patients", alt: "Recovery position stages" },
    { type: "knowledgeCheck", question: "Why is the recovery position the safest for unconscious casualties?", options: ["It keeps them warm", "It maintains an open airway and allows fluid drainage", "It prevents fractures", "It helps circulation"], correctAnswer: 1, explanation: "The recovery position keeps the airway open, allows fluids to drain, and keeps the body stable." },
    { type: "sequence", title: "Order the 5 stages of the recovery position", steps: ["Remove spectacles and bulky objects, straighten legs, place arm at right angle", "Bring other arm across chest, hand against cheek", "Grasp leg above knee, lift and bend", "Pull thigh towards you, control rolling", "Adjust upper leg, draw chin forward for airway"], correctOrder: [0, 1, 2, 3, 4] },
    { type: "clickToReveal", title: "What is the priority when considering the recovery position?", content: "THE AIRWAY IS ALWAYS THE PRIORITY. If major injuries are apparent, this may affect WHEN and HOW you turn the casualty, but the airway must always be maintained.", variant: "danger" },
  ],
  "fa-lesson-9-1": [
    { type: "image", src: "/images/fa-nblm/artifact3-img10.jpg", caption: "Shock management — recognising signs and applying correct treatment protocols", alt: "Systemic shock management" },
    { type: "knowledgeCheck", question: "Which is NOT a sign of shock?", options: ["Pale, cold, clammy skin", "Rapid shallow breathing", "Slow, strong pulse", "Thirst"], correctAnswer: 2, explanation: "In shock, the pulse is weak and rapid, not slow and strong." },
    { type: "clickToReveal", title: "When should you NOT raise the legs for shock?", content: "Do NOT raise legs for: heart attack, chest injury, or head injury. In these cases, recline the passenger in their seat. For fractures, keep in the position found.", variant: "warning" },
  ],
  "fa-lesson-9-2": [
    { type: "image", src: "/images/fa-nblm/artifact2-img01.jpg", caption: "Heart attack and stroke recognition — critical cardiac emergency response", alt: "Heart attack and stroke" },
    { type: "knowledgeCheck", question: "What is the difference between a heart attack and angina?", options: ["Heart attack is less serious", "Angina involves blocked arteries, heart attack is narrowed arteries", "Heart attack involves blocked artery, angina is narrowed arteries", "They are the same condition"], correctAnswer: 2, explanation: "Heart attack: artery blocked, heart muscle dies. Angina: narrowed arteries, pain from exercise/stress." },
    { type: "clickToReveal", title: "What medication does an angina passenger have?", content: "Angina passengers normally carry their own medication (typically nitroglycerin spray or tablets). Assist them with the administration of their own medication.", variant: "info" },
  ],
  "fa-lesson-10-1": [
    { type: "image", src: "/images/first-aid/burn-treatment.jpg", caption: "Burn treatment — cool the burn under cold water for at least 10 minutes", alt: "Burn first aid treatment" },
    { type: "image", src: "/images/first-aid/burn-cooling.jpg", caption: "Cooling a burn with running water — the most important first aid step", alt: "Cooling burn with water" },
    { type: "image", src: "/images/fa-nblm/artifact3-img01.jpg", caption: "Burn types and treatment — dry, scalds, chemical, electrical, and radiation burns", alt: "Burn types and treatment" },
    { type: "image", src: "/images/fa-nblm/artifact3-img20.jpg", caption: "Burn first aid — cooling, dressing, and shock management procedures", alt: "Burn first aid procedure" },
    { type: "knowledgeCheck", question: "What is the recommended treatment for minor burns?", options: ["Apply ointment immediately", "Burst any blisters", "Place under cold water for at least 10 minutes", "Wrap tightly in bandages"], correctAnswer: 2, explanation: "Place the burned area under cold water for at least ten minutes, then apply dry sterile dressing." },
    { type: "clickToReveal", title: "What should you NOT do when treating a burn?", content: "Do NOT: burst blisters, touch the burn, remove charred clothing, or apply ointments or creams. These actions risk infection.", variant: "danger" },
  ],
  "fa-lesson-10-2": [
    { type: "image", src: "/images/first-aid/bandage-wound.jpg", caption: "Applying direct pressure with a sterile dressing to control external bleeding", alt: "Wound bandaging and direct pressure" },
    { type: "image", src: "/images/first-aid/wound-dressing.jpg", caption: "Sterile wound dressing application for bleeding control", alt: "Wound dressing technique" },
    { type: "image", src: "/images/fa-nblm/artifact3-img05.jpg", caption: "External bleeding control — direct pressure, elevation, and dressing techniques", alt: "External bleeding control" },
    { type: "knowledgeCheck", question: "What is the first step in treating external bleeding?", options: ["Elevate the wound", "Apply a tourniquet", "Apply direct pressure on the wound", "Give pain medication"], correctAnswer: 2, explanation: "Apply direct pressure on the wound using a dry sterile dressing, then elevate." },
    { type: "clickToReveal", title: "What is the maximum number of dressings?", content: "You can apply maximum 2 dry sterile dressings. When both are soaked with blood, change with fresh dressings.", variant: "warning" },
  ],
  "fa-lesson-11-1": [
    { type: "image", src: "/images/first-aid/fracture-splint.jpg", caption: "Fracture immobilisation using a splint — prevent movement and further injury", alt: "Fracture splinting" },
    { type: "image", src: "/images/fa-nblm/artifact3-img15.jpg", caption: "Fracture types and splinting techniques — closed, open, and complicated fractures", alt: "Fracture types and treatment" },
    { type: "knowledgeCheck", question: "How should you treat a suspected fracture?", options: ["Attempt to realign the bone", "Immobilize the injured part", "Apply heat to reduce swelling", "Massage the area gently"], correctAnswer: 1, explanation: "Immobilise the injured part to reduce pain and prevent further injury." },
  ],
  "fa-lesson-11-2": [
    { type: "image", src: "/images/fa-nblm/artifact3-img15.jpg", caption: "Slings and special fractures — elevation sling, arm sling, skull and spine injuries", alt: "Slings and special fracture treatment" },
    { type: "knowledgeCheck", question: "When is an elevation sling used?", options: ["For leg fractures", "For collar bone, finger/hand, rib injuries", "For head injuries", "For spinal injuries"], correctAnswer: 1, explanation: "Elevation sling: fractured collar bone, finger and hand injuries, fractured ribs." },
    { type: "clickToReveal", title: "How should you treat neck or spine injuries?", content: "Do NOT move the passenger unless absolutely essential. Pad around with pillows and blankets and stay with the passenger. Do not give medication. Seek medical aid as soon as possible.", variant: "danger" },
  ],
  "fa-lesson-11-3": [
    { type: "svg", src: "/images/fa-svg/rice-treatment.svg", caption: "RICE Treatment - Rest, Ice, Compress, Elevate for strains and sprains" },
    { type: "image", src: "/images/fa-nblm/artifact3-img15.jpg", caption: "Strains and sprains — RICE treatment (Rest, Ice, Compress, Elevate)", alt: "RICE treatment for strains and sprains" },
    { type: "knowledgeCheck", question: "What does RICE stand for?", options: ["Rest, Ice, Compress, Elevate", "Relax, Immobilize, Cover, Examine", "Rest, Investigate, Clean, Evaluate", "Recovery, Ice, Care, Exercise"], correctAnswer: 0, explanation: "RICE: Rest, Ice (10-15 min), Compress, Elevate - for strains and sprains." },
  ],
  "fa-lesson-12-1": [
    { type: "image", src: "/images/fa-nblm/artifact2-img01.jpg", caption: "Stroke identification and management — recognising signs and immediate response", alt: "Stroke identification and management" },
    { type: "knowledgeCheck", question: "What causes a stroke?", options: ["Heart failure", "Bleeding in brain or clot", "Low blood sugar", "Severe bleeding"], correctAnswer: 1, explanation: "Stroke is caused by bleeding within the brain (Cerebral Hemorrhage) or a clot (Cerebral Thrombosis)." },
  ],
  "fa-lesson-12-2": [
    { type: "image", src: "/images/fa-nblm/artifact2-img05.jpg", caption: "Epilepsy management — stages of seizure and crew response procedures", alt: "Epilepsy seizure management" },
    { type: "knowledgeCheck", question: "How many stages are there in an epileptic fit?", options: ["2", "3", "4", "5"], correctAnswer: 2, explanation: "Four stages: 1) Aura (warning), 2) Cry/rigid, 3) Convulse/froth, 4) Limp/sleep." },
    { type: "clickToReveal", title: "Should you restrict movements during a seizure?", content: "NO. Do not restrict the passenger's movements. Pad around with pillows, loosen tight clothing, and prevent injury. Time the length of the fit.", variant: "warning" },
  ],
  "fa-lesson-12-3": [
    { type: "image", src: "/images/fa-nblm/artifact2-img15.jpg", caption: "Diabetes management — hypoglycemia vs hyperglycemia recognition and treatment", alt: "Diabetes blood sugar management" },
    { type: "knowledgeCheck", question: "What is the immediate treatment for hypoglycemia?", options: ["Give insulin", "Give two tablespoons of sugar in water", "Make patient lie down", "Apply cold compress"], correctAnswer: 1, explanation: "Immediately give two tablespoons of sugar in a glass of water. If in doubt, treat as hypoglycemia." },
    { type: "clickToReveal", title: "Can cabin crew administer insulin?", content: "NO. Cabin crew must NEVER administer an insulin injection. If the diabetic passenger becomes unconscious, place in recovery position, PA for Doctor/Nurse, give nothing by mouth.", variant: "danger" },
  ],
  "fa-lesson-12-4": [
    { type: "image", src: "/images/fa-nblm/artifact3-img10.jpg", caption: "Dehydration and renal colic — fluid management and pain relief protocols", alt: "Dehydration and renal colic treatment" },
    { type: "knowledgeCheck", question: "How much water should cabin crew drink per hour in flight?", options: ["Half a glass", "One glass", "Two glasses", "Three glasses"], correctAnswer: 1, explanation: "Cabin crew should drink a glass of water at least every hour. The body requires up to 5 pints per 24 hours." },
  ],
  "fa-lesson-13-1": [
    { type: "image", src: "/images/fa-nblm/artifact2-img05.jpg", caption: "Emergency childbirth — pregnancy stages and crew preparation", alt: "Emergency childbirth preparation" },
    { type: "image", src: "/images/fa-nblm/artifact2-img20.jpg", caption: "Stages of labour and miscarriage — recognition and management protocols", alt: "Labour stages and miscarriage" },
    { type: "knowledgeCheck", question: "What is the normal full term of pregnancy?", options: ["28 weeks", "37 weeks", "40 weeks", "42 weeks"], correctAnswer: 2, explanation: "Full term pregnancy is approximately 40 weeks after the last menstrual period." },
    { type: "knowledgeCheck", question: "What does ACTS stand for in emergency childbirth?", options: ["Assess, Call, Treat, Support", "Assessor, Collector, Teller, Supporter", "Airway, Circulation, Temperature, Safety", "Assess, Check, Transport, Support"], correctAnswer: 1, explanation: "ACTS: Assessor, Collector, Teller, Supporter - the crew roles for emergency childbirth." },
  ],
  "fa-lesson-13-2": [
    { type: "image", src: "/images/first-aid/childbirth-emergency.jpg", caption: "Emergency childbirth management requires calm, coordinated crew action", alt: "Emergency childbirth" },
    { type: "image", src: "/images/fa-nblm/artifact2-img10.jpg", caption: "First stage of labour — contractions, cervical dilation, and crew preparation", alt: "First stage of labour" },
    { type: "image", src: "/images/fa-nblm/artifact2-img05.jpg", caption: "Delivery procedure — managing the birth and caring for the newborn", alt: "Delivery and newborn care" },
    { type: "knowledgeCheck", question: "How long after birth is the placenta normally delivered?", options: ["Immediately", "5-10 minutes", "15-30 minutes", "1-2 hours"], correctAnswer: 2, explanation: "The placenta is normally delivered within 15-30 minutes after birth." },
    { type: "clickToReveal", title: "What should you do if severe bleeding continues after childbirth?", content: "Put the baby to feed on the mother's breast, as this helps control bleeding. Advise the Commander immediately.", variant: "danger" },
    { type: "clickToReveal", title: "Should you pull the cord to deliver the placenta?", content: "NEVER pull on the cord to assist expulsion of the afterbirth, as this may cause tearing and severe bleeding. Let it deliver naturally.", variant: "danger" },
  ],
  "fa-lesson-14-1": [
    { type: "image", src: "/images/first-aid/oxygen-mask.jpg", caption: "Oxygen administration is the primary treatment for hypoxia", alt: "Oxygen mask for hypoxia treatment" },
    { type: "image", src: "/images/first-aid/hypoxia-oxygen.jpg", caption: "Supplemental oxygen reverses hypoxia symptoms within seconds", alt: "Hypoxia and oxygen treatment" },
    { type: "image", src: "/images/fa-nblm/artifact1-img03.jpg", caption: "Aviation physiology — atmospheric pressure, cabin altitude, and hypoxia effects", alt: "Aviation physiology and hypoxia" },
    { type: "knowledgeCheck", question: "What is hypoxia?", options: ["Increased blood pressure", "Insufficient circulating oxygen", "Expansion of gases", "Dehydration"], correctAnswer: 1, explanation: "Hypoxia is insufficient circulating oxygen to supply the body's needs." },
    { type: "knowledgeCheck", question: "What is the treatment for hypoxia?", options: ["Give water", "Administer oxygen immediately", "Start CPR", "Give sugar"], correctAnswer: 1, explanation: "Administer oxygen immediately. Within seconds symptoms should cease and passenger should recover." },
  ],
  "fa-lesson-14-2": [
    { type: "image", src: "/images/first-aid/first-aid-kit.jpg", caption: "Basic First Aid Kit — located in FWD galley, no Commander's permission needed", alt: "First aid kit" },
    { type: "image", src: "/images/fa-nblm/artifact1-img01.jpg", caption: "Basic first aid kit contents and pre-flight verification requirements", alt: "Basic first aid kit contents" },
    { type: "image", src: "/images/fa-nblm/artifact1-img02.jpg", caption: "First aid kit consumables — medications, dressings, and medical supplies", alt: "First aid kit consumables" },
    { type: "image", src: "/images/fa-nblm/artifact1-img05.jpg", caption: "Administering basic medications — dosage, precautions, and contraindications", alt: "Basic medication administration" },
    { type: "image", src: "/images/fa-nblm/artifact1-img07.jpg", caption: "Medical kit organization and storage on the aircraft", alt: "Medical kit organization" },
    { type: "image", src: "/images/fa-nblm/artifact1-img10.jpg", caption: "Aeromedic kit access protocol — Commander's permission required", alt: "Aeromedic kit protocol" },
    { type: "image", src: "/images/fa-nblm/artifact1-img12.jpg", caption: "Temgesic pain relief protocol — dosage and precautions", alt: "Temgesic pain medication protocol" },
    { type: "image", src: "/images/fa-nblm/artifact1-img20.jpg", caption: "Aviation medical kit protocols — EMK contents and usage procedures", alt: "Aviation medical kit protocols" },
    { type: "knowledgeCheck", question: "Where is the Basic First Aid Kit located?", options: ["Rear galley", "Cockpit", "Forward galley container", "Under seats"], correctAnswer: 2, explanation: "The Basic First Aid Kit is in the FWD galley container." },
    { type: "knowledgeCheck", question: "Who can open the Aeromedic First Aid Kit?", options: ["Only the Captain", "Only medical professionals", "Any crew with Commander's permission", "Any passenger"], correctAnswer: 2, explanation: "Any crewmember may open this kit after obtaining Commander's permission." },
    { type: "clickToReveal", title: "Who can open the Emergency Medical Kit (EMK)?", content: "The EMK can only be opened with explicit instructions and authorization of the Commander. Drugs must not be administered except by qualified doctors, nurses, or similarly qualified personnel.", variant: "danger" },
  ],
  "fa-lesson-14-3": [
    { type: "svg", src: "/images/fa-svg/aed-procedure.svg", caption: "AED Procedure - 6-step process with contraindications and battery indicators" },
    { type: "image", src: "/images/first-aid/aed-defibrillator.jpg", caption: "AED (Automated External Defibrillator) — portable unit for treating cardiac arrest", alt: "AED defibrillator" },
    { type: "image", src: "/images/first-aid/aed-use.jpg", caption: "AED procedure — apply pads, follow voice prompts, deliver shock when advised", alt: "AED usage" },
    { type: "image", src: "/images/fa-nblm/artifact1-img15.jpg", caption: "AED contraindications and safety precautions — when NOT to use the defibrillator", alt: "AED contraindications" },
    { type: "image", src: "/images/fa-nblm/artifact1-img17.jpg", caption: "AED deployment Phase 1 — rapid patient preparation and electrode placement", alt: "AED deployment procedure" },
    { type: "knowledgeCheck", question: "What is the purpose of an AED?", options: ["Treat severe bleeding", "Treat cardiac arrest", "Administer oxygen", "Reset dislocated joints"], correctAnswer: 1, explanation: "The AED treats cardiac arrest by analysing heart rhythm and delivering electric shock." },
    { type: "knowledgeCheck", question: "Can the AED be used on children under 8?", options: ["Yes, always", "Yes, with reduced power", "No, not under 8 years or under 22kg", "Only with doctor present"], correctAnswer: 2, explanation: "The AED should not be used on children younger than 8 years or weighing less than 22kg." },
    { type: "clickToReveal", title: "What happens every minute of delay with AED?", content: "Every minute delay results in chance of survival decreasing by 7-10%. This is why CPR should be started immediately and the AED brought as quickly as possible.", variant: "warning" },
    { type: "sequence", title: "Order the AED procedure steps", steps: ["Establish cardiac arrest, do DRABC, start CPR", "Bring AED, connect electrodes, switch ON", "Apply pads correctly on chest", "Follow voice prompts - Push To Analyse", "Press Analyse button", "If advised - Stand Clear, Press Shock"], correctOrder: [0, 1, 2, 3, 4, 5] },
  ],
};

// Get enhanced content for a First Aid lesson
export function getFirstAidEnhancedContent(lessonId: string): any[] {
  return firstAidLessonEnhancements[lessonId] || [];
}
