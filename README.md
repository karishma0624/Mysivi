# Growth Lab — Proof of Work for AI Marketing Intern at MySivi

> **"Give me a growth problem and I can use AI, data, and rapid prototyping to turn it into something testable."**

Built by **S K Karishma** ([GitHub](https://github.com/karishma0624) • [LinkedIn](https://linkedin.com/in/karishma-sivakumar)) as a dedicated hiring demo and proof-of-work for the **AI Marketing Intern** position at **MySivi**.

---

## ⚡ The 30-Second Overview

Growth Lab is an AI growth workspace designed around a single core loop:
$$\text{Learner Problem} \longrightarrow \text{AI Insight} \longrightarrow \text{Content} \longrightarrow \text{Experiment} \longrightarrow \text{Measurement} \longrightarrow \text{Iteration}$$

Rather than a generic dashboard with artificial statistics or superficial wrappers, Growth Lab models an **end-to-end growth operating system** directly aligned with MySivi's product (Arya, the AI English teacher for vernacular speakers in India):

| Job Description Requirement | Growth Lab Module | How It Proves My Competence |
| :--- | :--- | :--- |
| **1. AI agents for content generation (scripts, visuals, videos)** | **Content Studio** | 8-stage agent pipeline (`Strategist` $\to$ `HookWriter` $\to$ `Critic` $\to$ `ComplianceGuard` $\to$ `Ranker` $\to$ `ScriptDirector` $\to$ `VisualDirector` $\to$ `VideoPromptWriter`). Scores 15 hooks across 5 weighted dimensions, isolates the Top 3 with "Real Talk" badges, and renders an animated **ReelPhone** with captions, waveform scrubber, and speech synthesis. |
| **2. Making paid marketing efficient** | **Ad Lab** | Statistical experimentation engine with two-proportion z-tests for CTR and Install Rate ($p < 0.05$). Separates mathematical rigor (TypeScript engine) from qualitative LLM reasoning ("Decision" cards & "What I'd test next"). Includes an Explore / Exploit budget reallocation model. |
| **3. Helping the organic team go viral** | **Viral Lab** | Takes cultural trend formats (e.g. *POV Interview Anxiety*, *Street English vs Corporate English*) and adapts them to MySivi learning arcs, producing a 7-day multi-channel calendar, downloadable Creator Briefs, and a 6-factor heuristic Virality Checklist. |
| **LLM expertise & prompt engineering** | **Prompt Library** | Transparent "Engine Room" displaying the 13 production prompts with system directives, XML `<DATA>` boundary security, JSON Zod schemas, few-shot examples, and design rationale. |

---

## 🎨 Design System & MySivi Aesthetics

Matches the friendly, high-trust educational aesthetic of **[mysivi.ai](https://mysivi.ai)**:
- **Canvas:** Lavender-tinted background (`#F6F4FF`).
- **Cards:** Crisp white containers with `1px #ECE9F8` borders and soft 20px rounded corners.
- **Brand Gradient:** Electric Blue to Vivid Indigo (`#2F5BFF` $\to$ `#7B4DFF`).
- **Typography:** Plus Jakarta Sans (headlines) + Inter (interface) + Noto Sans (vernacular/Hinglish rendering).
- **Signature UI Elements:**
  - **ReelPhone:** 9:16 mobile canvas with Ken Burns motion, beat transitions, auto-scrolling captions, interactive waveform seeking, and optional Indian accent speech synthesis.
  - **Real Talk Stickers:** Highlighting high-relatability learner hooks.
  - **Agent Live Waveforms:** IDLE $\to$ WORKING $\to$ COMPLETE state visualization with real-time output previews.

---

## 🛡️ Honesty as a Product Feature

Every piece of synthetic or simulated data is transparently badged to reflect responsible product and marketing ethics:
- `SAMPLE RUN` — Instant, pre-filled run that works immediately with **zero API keys required**.
- `SIMULATED` — Synthetic ad performance data calculated deterministically to evaluate variant significance.
- `AI-PREDICTED, NOT REAL CAMPAIGN DATA` — Clear demarcation that LLM metrics are heuristic, not actual Meta/Google spend logs.
- `ANIMATED PREVIEW` & `ILLUSTRATED FALLBACK` — Beautiful custom vector SVG scenes representing Arya and learners without pretending to be a live video generation tool.
- **Zero Hallucinated Brand Claims:** All figures are tied directly to verified MySivi milestones: **10M+ Downloads**, **15+ Languages**, **4.7★ Play Store Rating**, **500K+ Active Community**.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- npm 9+

### 2. Installation
```bash
git clone https://github.com/karishma0624/mysivi-growth-lab.git
cd mysivi-growth-lab
npm install
```

### 3. Local Development
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. The app runs immediately with rich sample datasets.

### 4. Optional: Enable Live Gemini Generations
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Google AI Studio API key (free tier):
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_TEXT_MODEL=gemini-2.5-flash
GEMINI_IMAGE_MODEL=imagen-3.0-generate-002
ENABLE_LIVE_TEXT=true
ENABLE_LIVE_IMAGES=true
```
Run with Vercel CLI locally to execute the serverless endpoints:
```bash
npx vercel dev
```

---

## 🧪 Quality & Verification Suite

All code adheres to strict TypeScript standards with zero console errors:
```bash
# Type check (strict TypeScript, noUnusedLocals, noUnusedParameters)
npm run typecheck

# Unit tests (Stats, Scoring, Schemas, Sanitization, TTS)
npm run test

# Production build
npm run build
```

---

## 📂 Project Architecture

```
Mysivi/
├── api/                     # Vercel Serverless backend
│   ├── _lib/                # Gemini client, rate-limiting, sanitization, validation
│   ├── studio/              # ideate, evaluate, scripts, media-plan, storyboard
│   ├── ads/                 # generate, explain
│   └── viral/               # plan
├── shared/                  # Shared domain contracts (Type-safe)
│   ├── brandFacts.ts        # MySivi verified ground-truth milestones
│   ├── brandVoice.ts        # Arya persona & brand positioning rules
│   ├── schemas.ts           # Zod validation schemas
│   ├── scoring.ts           # 5-factor weighted scoring algorithm
│   └── prompts/             # 13 isolated prompt definitions
├── src/
│   ├── components/
│   │   ├── home/            # HeroBackdrop, StatRow, ModuleCards
│   │   ├── studio/          # AgentPipeline, HookBoard, ReelPhone, ScriptTimeline
│   │   ├── ads/             # AdMatrix, BudgetPlanner, ResultsTable, VerdictCard
│   │   ├── viral/           # TrendInput, AdaptationCards, CalendarGrid, CreatorBrief
│   │   ├── prompts/         # PromptViewer
│   │   └── ui/              # Button, Card, Badge, Sticker, Waveform, Tabs, etc.
│   ├── lib/
│   │   ├── stats.ts         # Two-proportion z-tests, explore/exploit math
│   │   ├── tts.ts           # Web Speech API audio synthesis
│   │   └── export.ts        # Markdown, JSON, and Prompt export formats
│   ├── data/samples/        # Deterministic sample runs & custom SVG vector scenes
│   └── pages/               # Home, Studio, AdLab, ViralLab, PromptLibrary
└── tests/                   # Vitest automated test suite
```

---

## 👩‍💻 About the Author

Built with focus and passion by **S K Karishma** for the **MySivi AI Marketing Intern** role.
- **GitHub:** [@karishma0624](https://github.com/karishma0624)
- **LinkedIn:** [linkedin.com/in/karishma-sivakumar](https://linkedin.com/in/karishma-sivakumar)
