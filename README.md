# DGR eLearning Platform

An enterprise-grade interactive eLearning platform for **Dangerous Goods Regulations (DGR)** cabin crew training, built from the Cabin Crew Training Manual Section 11 (Edition 2024).

## Features

- **Complete Course Content**: All 3 modules, 22 lessons covering ICAO Technical Instructions and IATA DGR
- **Interactive Learning**: Lessons with callouts, tables, images, and key terms
- **Voice Narration**: AI-powered text-to-speech with speed control and paragraph highlighting
- **Multi-Language**: English, French, and Arabic with full RTL support
- **Quiz Engine**: Lesson quizzes, module quizzes, and 20-question final exam
- **Flashcards**: 30+ cards covering hazard classes, codes, and terminology
- **Scenario Simulations**: 5 realistic incident scenarios with feedback
- **AI Tutor**: Course-trained assistant for answering questions
- **Progress Tracking**: XP, achievements, streaks, and detailed analytics
- **Certificate Generation**: Verifiable certificates with QR codes
- **PWA**: Offline support, installable, fast loading
- **Dark Mode**: Full dark/light theme support
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessible**: WCAG 2.2 AA compliant with keyboard navigation

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State**: Zustand with persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Chart.js + react-chartjs-2
- **QR Codes**: qrcode library
- **Voice**: Web Speech API
- **Deployment**: Cloudflare Pages

## Course Content

### Module 11.4 - Dangerous Goods Awareness
- Introduction to Dangerous Goods
- Background Information (ICAO definitions)
- Regulatory Requirements (ICAO & IATA)
- Reported Incidents (case studies)

### Module 11.5 - Transport of Dangerous Goods
- General Transport Regulations
- Terminology (17 key terms)
- DG Categories (Forbidden, Acceptable, Accepted)
- Special Load Codes (40+ codes)
- Classification - Nine Hazard Classes
- Packing (Groups I, II, III)
- Marking and Labelling
- All 9 Classes detailed with IATA codes
- Loading, Stowage, and Segregation
- Dry Ice, Polymeric Beads, Radioactive Materials
- Provisions for Passengers and Crew
- Responsibilities (Acceptance, Loading, Commander)

### Module 11.6 - NOTOC and Emergency Response
- Notification to Commander (NOTOC)
- Inspection for Damage/Leakage
- Damaged Dangerous Goods procedures
- Incident Checklists (general & cabin crew)
- Actions after Landing
- Emergency Response Drills
- Reporting Requirements (72-hour rule)
- Weapons and Ammunition transport

## Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Build for Cloudflare
bun run build:cf
```

## Deployment to Cloudflare Pages

### Option 1: GitHub Actions (Recommended)

1. Fork or push this repository to GitHub
2. Add the following secrets to your repository:
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
3. The workflow in `.github/workflows/deploy.yml` will automatically deploy on push to main

### Option 2: Direct Deployment

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build and deploy
npm run build:cf
wrangler pages deploy .next/standalone --project-name dgr-elearning
```

### Option 3: Cloudflare Dashboard

1. Go to Cloudflare Pages in your dashboard
2. Create a new project
3. Connect your GitHub repository
4. Set build command: `npm run build:cf`
5. Set output directory: `.next/standalone`

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page (SPA view router)
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── elearning/         # eLearning components
│   │   │   ├── app-shell.tsx          # Main app shell with navigation
│   │   │   ├── landing-view.tsx       # Landing page
│   │   │   ├── dashboard-view.tsx     # Student dashboard
│   │   │   ├── lesson-view.tsx        # Lesson viewer with narration
│   │   │   ├── quiz-view.tsx          # Quiz engine
│   │   │   ├── flashcards-view.tsx    # Flashcard study
│   │   │   ├── scenarios-view.tsx     # Scenario simulations
│   │   │   ├── exam-view.tsx          # Final exam
│   │   │   ├── certificate-view.tsx   # Certificate generator
│   │   │   ├── analytics-view.tsx     # Learning analytics
│   │   │   ├── glossary-view.tsx      # Glossary search
│   │   │   ├── settings-view.tsx      # User settings
│   │   │   └── aitutor-view.tsx       # AI tutor chat
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       ├── course-data.ts     # All PDF content structured
│       ├── types.ts           # TypeScript types
│       ├── store.ts           # Zustand state management
│       └── i18n.ts            # Multi-language translations
├── public/
│   ├── images/dgr/            # Extracted PDF images
│   ├── icons/                 # PWA icons
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── .github/workflows/         # CI/CD
├── wrangler.toml              # Cloudflare config
├── _headers                   # Cloudflare headers
├── _redirects                 # SPA redirects
└── next.config.ts             # Next.js config
```

## Educational Content Source

All educational content is sourced from:
- **Cabin Crew Training Manual – Section 11 - Dangerous Goods | Edition 2024**
- ICAO Technical Instructions for the Safe Transport of Dangerous Goods by Air
- IATA Dangerous Goods Regulations (DGR)

## Compliance

- ✅ WCAG 2.2 AA accessibility
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ PWA installable
- ✅ Offline support
- ✅ SEO optimized
- ✅ Cloudflare Pages ready

## License

For training purposes only. Always refer to the latest official ICAO and IATA publications for operational use.
