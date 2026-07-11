// Deep content expansion for First Aid lessons

export const firstAidContentExpansion: Record<string, any[]> = {
  "fa-lesson-1-1": [
    { type: "heading", text: "The Critical First Minutes", level: 3 },
    { type: "paragraph", text: "In a medical emergency at 35,000 feet, cabin crew are the first and often only responders for potentially hours. The nearest diverting airport may be 30-60 minutes away, and even then, ground medical services need time to reach the aircraft. What happens in the first 5 minutes of a medical emergency often determines the outcome. This is why the medical assistance protocol exists — to ensure a structured, coordinated response from the very first moment." },
    { type: "paragraph", text: "The Assessor-Collector-Teller system ensures that one crew member is focused on the patient, one is getting equipment, and one is communicating with the flight deck — all simultaneously. Without this division of labor, crew would naturally all rush to the patient, leaving no one to get equipment or inform the Captain. The protocol creates parallel processing instead of sequential processing, saving critical minutes." },
    { type: "callout", variant: "warning", title: "The Captain's Role", text: "The Captain bears ultimate responsibility for all decisions, including medical diversions. The Captain's decision to divert is based on information from the cabin crew. Incomplete or delayed information can lead to a delayed diversion, which can be fatal in time-critical emergencies like heart attacks or severe allergic reactions. Clear, concise, and timely communication from cabin to flight deck is essential." },
  ],
  "fa-lesson-7-4": [
    { type: "heading", text: "CPR in the Aircraft Environment", level: 3 },
    { type: "paragraph", text: "Performing CPR on an aircraft presents unique challenges. The cabin floor is narrow and hard, making it difficult to get proper leverage for compressions. The cabin altitude (8,000 feet) means both the patient and the rescuer have reduced oxygen levels, making the CPR more physically demanding and less effective. Turbulence can make positioning difficult or dangerous. Other passengers may be distressed or interfere." },
    { type: "paragraph", text: "Despite these challenges, CPR must be started immediately if the patient has no breathing and no pulse. Every minute without CPR reduces survival chances by 7-10%. The 30:2 ratio (30 compressions to 2 breaths) should be maintained at a rate of 100-120 compressions per minute. If a second rescuer is available, switch every 2 minutes to prevent fatigue. The AED should be brought as quickly as possible — every minute of delay reduces survival by 7-10%." },
    { type: "callout", variant: "danger", title: "When to Stop CPR", text: "Continue CPR until: the patient shows signs of life (breathing, movement, coughing), the AED advises a shock and you need to pause, a qualified medical professional takes over, or you are physically exhausted and cannot continue. If there is no AED and no medical professional, continue CPR for as long as possible — even if the chances of success seem low, some patients have survived after extended CPR." },
    { type: "table", caption: "CPR Quick Reference", headers: ["Age Group", "Hand Position", "Compression Depth", "Ratio", "Starting Sequence"], rows: [
      ["Adult (8+ yr)", "Heel of both hands, breastbone", "5-6 cm (2 inches)", "30:2", "30 compressions, then 2 breaths"],
      ["Child (1-7 yr)", "Heel of ONE hand, breastbone", "4-5 cm (1.5 inches)", "30:2", "5 rescue breaths, then 30:2"],
      ["Infant (<1 yr)", "Two fingers, below nipple line", "3-4 cm (1/3 chest depth)", "30:2", "5 rescue breaths, then 30:2"],
    ]},
    { type: "paragraph", text: "The Chain of Survival — Early Access, Early CPR, Early Defibrillation, Early Advanced Care — summarizes the key steps that maximize survival from cardiac arrest. On an aircraft, cabin crew are responsible for the first three links. 'Early Access' means calling for help immediately. 'Early CPR' means starting compressions within seconds of confirming no breathing. 'Early Defibrillation' means getting the AED to the patient as quickly as possible. The fourth link, 'Early Advanced Care,' depends on diverting to an airport with medical services." },
  ],
  "fa-lesson-6-2": [
    { type: "heading", text: "Choking — A Time-Critical Emergency", level: 3 },
    { type: "paragraph", text: "Choking is one of the most common in-flight medical emergencies, often occurring during meal service. A foreign object (usually food) blocks the back of the throat, preventing breathing. Brain damage can occur within 3-4 minutes of complete airway obstruction. Death can occur within 4-6 minutes. This means cabin crew have a very narrow window to act — there is no time to wait for the AED or medical kit." },
    { type: "paragraph", text: "The universal sign of choking is hands clutching the throat. Other signs include difficulty speaking, difficulty breathing, blue skin color (cyanosis), and loss of consciousness. If the passenger can cough, encourage them to keep coughing — a coughing passenger still has some airway passage. If they cannot cough, speak, or breathe, immediate action is required." },
    { type: "callout", variant: "danger", title: "The 5-and-5 Approach", text: "For a conscious choking adult: Give 5 sharp back slaps between the shoulder blades with the flat of the hand. If this doesn't clear the obstruction, give 5 abdominal thrusts (Heimlich manoeuvre) — stand behind, interlock fingers around waist, fist above navel, pull sharply inwards and upwards. Alternate between 5 back slaps and 5 abdominal thrusts until the obstruction is cleared or the passenger becomes unconscious." },
    { type: "paragraph", text: "For infants under 1 year, the technique is different. Lay the infant along your forearm, head down. Give 5 back slaps using less pressure than for an adult. If this fails, turn the infant over and give 5 chest thrusts — place two fingers one finger-breadth below the imaginary line between the nipples, press inwards to one-third the depth of the chest. Alternate 5 back slaps and 5 chest thrusts." },
    { type: "paragraph", text: "If a choking victim becomes unconscious, the situation changes from a choking emergency to a cardiac arrest emergency. Lower the patient to the floor, open the airway, check for breathing for 10 seconds. If no breathing, start CPR immediately. Each compression may help dislodge the obstruction. Check the mouth between compressions and rescue breaths — if you see the object, remove it with a finger sweep." },
  ],
  "fa-lesson-10-1": [
    { type: "heading", text: "Burn Management in the Cabin", level: 3 },
    { type: "paragraph", text: "Burns in the aircraft cabin can result from hot beverages, galley equipment, oven burns, steam, and in more serious cases, fire. The severity of a burn depends on the temperature, duration of contact, and area affected. Small deep burns are less dangerous than large superficial burns because the total area affected determines fluid loss and infection risk." },
    { type: "paragraph", text: "The immediate treatment for any burn is COOLING. Cool water (not ice cold) should be applied for at least 10 minutes. This reduces pain, limits tissue damage, and prevents the burn from deepening. For chemical burns, flooding with water is even more critical — speed is essential to dilute and remove the chemical before it causes further damage." },
    { type: "callout", variant: "danger", title: "Never Do These with Burns", text: "NEVER burst blisters — they protect against infection. NEVER touch the burn — introduces bacteria. NEVER remove charred clothing — it may be fused to the skin. NEVER apply ointments, creams, butter, or ice — these can cause infection or further tissue damage. NEVER use adhesive dressings — they tear skin when removed." },
    { type: "table", caption: "Burn Types and Treatment Summary", headers: ["Burn Type", "Cause", "Immediate Treatment", "Special Considerations"], rows: [
      ["Dry burn", "Flame, hot equipment", "Wrap in blanket, sterile dressing", "Remove jewelry before swelling begins"],
      ["Scald", "Hot water, tea, steam", "Cold water for 10+ minutes", "Most common cabin burn type"],
      ["Chemical", "Acids, corrosive liquids", "FLOOD with water immediately, cut away clothing", "Speed is critical — every second counts"],
      ["Electrical", "Electrical current", "Break current FIRST, then check breathing/CPR", "Ensure power source is disconnected"],
      ["Cold burn", "Dry ice", "Warm gently with hands or warm water", "Do not rub — can damage frozen tissue"],
    ]},
  ],
  "fa-lesson-9-1": [
    { type: "heading", text: "Recognizing and Managing Shock", level: 3 },
    { type: "paragraph", text: "Shock is a life-threatening condition where the body's vital organs are not receiving enough oxygen due to reduced blood flow. It is not a single disease but a system failure that can result from many causes: severe bleeding, burns, fractures, heart attack, allergic reactions, dehydration, and severe pain. If untreated, shock can progress to organ failure and death." },
    { type: "paragraph", text: "The signs of shock follow a predictable pattern. The skin becomes pale, cold, and clammy as the body diverts blood from the skin to vital organs. The pulse becomes weak and rapid as the heart tries to compensate for reduced blood volume. Breathing becomes rapid and shallow as the body attempts to get more oxygen. The patient may feel anxious, dizzy, and thirsty. As shock progresses, the patient may lose consciousness." },
    { type: "callout", variant: "warning", title: "Shock Treatment Priorities", text: "1) Reassure the patient — anxiety increases oxygen demand. 2) Loosen restrictive clothing. 3) Lie the patient down and raise legs (EXCEPT for heart attack, chest injury, or head injury — recline in seat instead). 4) Cover with ONE blanket — not more, as warming causes blood vessels to dilate, worsening shock. 5) Give NOTHING by mouth (EXCEPT sips of water for burns, renal colic, vomiting, or diarrhea). 6) PA for doctor/nurse, inform Commander." },
    { type: "paragraph", text: "It is critical to understand the exceptions to the 'raise legs' rule. For a heart attack, raising legs increases blood return to the heart, which is already struggling — instead, recline the passenger in their seat. For head or chest injuries, raising legs can increase pressure in the injured area. For fractures, keep the patient in the position found to avoid worsening the injury. These exceptions are why DGR and First Aid training emphasizes understanding the REASON behind each treatment, not just memorizing the steps." },
  ],
  "fa-lesson-14-3": [
    { type: "heading", text: "AED — The Most Important Piece of Equipment", level: 3 },
    { type: "paragraph", text: "The Automated External Defibrillator (AED) is the single most important piece of emergency medical equipment on an aircraft. For the most common type of cardiac arrest (ventricular fibrillation), the ONLY effective treatment is defibrillation — an electric shock that resets the heart's electrical system. CPR alone cannot restart a fibrillating heart; it only buys time until the AED arrives." },
    { type: "paragraph", text: "The AED is designed to be used by non-medical personnel. It provides voice prompts that guide the user through each step. The device analyzes the heart rhythm and determines whether a shock is needed — the operator does not make this decision. This design means any trained cabin crew member can use the AED effectively, even under the extreme stress of a real cardiac arrest." },
    { type: "callout", variant: "danger", title: "Every Minute Counts", text: "For every minute that defibrillation is delayed, the chance of survival decreases by 7-10%. After 10 minutes without defibrillation, survival is extremely unlikely. This is why the AED must be brought to the patient IMMEDIATELY — do not wait for the full medical kit or for a doctor to respond. Start CPR and apply the AED pads as soon as possible." },
    { type: "list", ordered: true, items: [
      "Establish cardiac arrest: DRABC — no response, no breathing",
      "Start CPR immediately (30:2)",
      "Have another crew member bring the AED",
      "Switch on the AED and follow voice prompts",
      "Apply pads to bare chest (moisture-free, hair-free areas)",
      "Stop CPR when AED says 'Analyzing' — nobody touch the patient",
      "If shock advised: 'Stand clear' — press shock button when prompted",
      "After shock (or if no shock advised): resume CPR for 1 minute",
      "Continue cycles of CPR + AED analysis until signs of life or medical help arrives",
    ]},
    { type: "paragraph", text: "The AED cannot be used on children under 8 years old or weighing less than 22 kg (55 lbs). For these patients, CPR is the only option. The AED also cannot analyze accurately if the patient is moving — turbulence or a moving patient can cause the AED to prompt 'Motion detected, stop motion.' Ensure the patient is on a stable surface and the aircraft is in smooth air if possible." },
    { type: "callout", variant: "warning", title: "Electromagnetic Interference", text: "The aircraft's electromagnetic field can interfere with the AED. When using the AED onboard, the flight crew must be informed so they can limit VHF, HF, Cabin Telephone, and SATCOM usage. It is recommended to de-power Cabin Telephone and SATCOM systems during AED use. This is a CRM coordination issue — the cabin crew must communicate with the flight deck, and the flight deck must coordinate with ATC." },
  ],
};

export function getFirstAidContentExpansion(lessonId: string): any[] {
  return firstAidContentExpansion[lessonId] || [];
}
