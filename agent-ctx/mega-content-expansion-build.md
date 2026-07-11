# Mega Content Expansion — All 3 Aviation Courses

## Task ID
mega-content-expansion-build

## Summary
Created `/home/z/my-project/src/lib/mega-content-expansion.ts` — a massive content file that adds 300-500 words of professional airline training content to **109 lessons** across all 3 aviation courses:
- **DGR (Dangerous Goods Regulations):** all 28 lessons (lesson-1-1 through lesson-3-7)
- **First Aid:** all 35 lessons (fa-lesson-1-1 through fa-lesson-14-3)
- **CRM (Crew Resource Management):** 46 lessons — modules 2-6, 8-13, 15-19, 21-22 (those without existing expansion in `crm-content-expansion.ts`)

## File Statistics
- **Total lines:** 1742
- **Total lessons covered:** 109 (one knowledgeCheck per lesson minimum — 109 knowledge checks verified)
- **Content blocks per lesson:** 5 (heading + 2 paragraphs + 1 callout + 1 additional block: table/list/knowledgeCheck)
- **Word count per lesson:** ~400 words added (target was 300-500)

## ContentBlock Types Used
Each lesson expansion uses these content block types from the existing lesson renderer:
- `{ type: "paragraph", text: "..." }` — 80-150 word paragraphs with detailed explanations
- `{ type: "heading", text: "...", level: 3 }` — Sub-headings to break up content
- `{ type: "callout", variant: "info"|"warning"|"danger"|"tip"|"note", title: "...", text: "..." }` — Safety-critical info
- `{ type: "list", items: ["..."] }` — Procedures, steps, checklists
- `{ type: "table", headers: ["..."], rows: [["..."]], caption: "..." }` — Comparison tables
- `{ type: "knowledgeCheck", question: "...", options: ["..."], correctAnswer: 0, explanation: "..." }` — Inline quiz

## Content Synthesis Sources
All content is original synthesis based on authoritative aviation sources:
- ICAO (Technical Instructions Doc 9284, Emergency Response Guidance Doc 9481, Annex 6)
- IATA (Dangerous Goods Regulations)
- EASA (Air Ops Regulation EU 965/2012)
- FAA (FAR 121.542 sterile cockpit, evacuation 90-second rule)
- AHA / ERC (CPR, AED, first aid standards)
- James Reason (Swiss Cheese Model, safety culture)
- Mica Endsley (situational awareness model)
- Daniel Goleman (leadership styles)
- Bruce Tuckman (team development stages)
- Thomas-Kilmann (conflict modes)
- Hofstede (cultural dimensions)
- Historical cases: Tenerife 1977, Air Florida 90, Kegworth 1989, United 232, Avianca 052, US Airways 1549, Qantas 32, ValuJet 592, UPS 6

## Integration
Wired into `/home/z/my-project/src/components/elearning/lesson-view.tsx` at line 12 (import) and lines 322-328 (merging). The mega expansion is appended AFTER existing enhancements and content expansions:

```typescript
const mega = getMegaExpansion(lesson.id);
const enhancements = lesson.id.startsWith("fa-")
  ? [...getFirstAidEnhancedContent(lesson.id), ...getFirstAidContentExpansion(lesson.id), ...mega]
  : lesson.id.startsWith("crm-")
  ? [...getCRMEnhancedContent(lesson.id), ...getCRMContentExpansion(lesson.id), ...mega]
  : [...getEnhancedContent(lesson.id), ...getDGRContentExpansion(lesson.id), ...mega];
const enhancedContent = [...lesson.content, ...enhancements];
```

## Exported API
- `getMegaExpansion(lessonId: string): any[]` — returns expansion blocks for a lesson (or empty array)
- `getMegaExpansionLessonCount(): number` — returns total lesson count covered (109)
- `getMegaExpansionLessonIds(): string[]` — returns array of all covered lesson IDs

## Verification
- ✅ File loads correctly via `bun -e` — 109 keys, sample blocks return correctly
- ✅ ESLint: no errors or warnings in `mega-content-expansion.ts` or new code in `lesson-view.tsx`
- ✅ Dev server: 200 OK on `/`, no compile errors in dev.log
- ✅ Each lesson has at least one knowledgeCheck (109 knowledgeChecks verified)

## What This Does NOT Do
- Does NOT modify the base lesson content in `course-data.ts`, `first-aid-course-data.ts`, or `crm-course-data.ts` — those remain unchanged
- Does NOT replace existing expansions (`dgr-content-expansion.ts`, `first-aid-content-expansion.ts`, `crm-content-expansion.ts`) — those are still merged in before mega expansion
- Does NOT include the 13 CRM lessons that already have expansion content in `crm-content-expansion.ts` (1-1, 1-2, 2-1, 3-1, 4-1, 7-1, 8-1, 9-1, 10-1, 11-1, 14-1, 16-2, 20-1) — those are already covered

## Author
Z.ai Code agent — completed in a single session.
