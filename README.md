# AgriSmart AI & Hostile UI Architecture Suite

## 1. AgriSmart AI: Precision Agriculture & Crop Advisory Assistant
An enterprise-grade, full-stack agronomic decision support platform built with **React (v18)**, **Vite**, **Tailwind CSS**, **TanStack Query**, **Node.js/Express**, and **Google Gen AI SDK (`@google/genai`)**.

### Key Features
- **Executive Dashboard**: Real-time aggregated farm metrics (acres under management, active plots, critical risks, soil health index) and localized micro-climate telemetry.
- **Field Parcel Manager**: Multi-plot registration with GIS coordinates (lat/long), soil physical structures, and irrigation classification.
- **Precision Advisory Generator**: 4-step wizard with reactive sliders for soil N-P-K (ppm), pH, and organic carbon, delivering phenological crop blueprints.
- **Multimodal Visual Crop Doctor**: Foliage/stem leaf scanner with canvas compression, EXIF stripping, and Gemini 2.5 Flash Vision pathology triage with dual chemical (trade names) & bio-IPM treatment protocols.
- **Phased Growth Lifecycle Calendar**: Step-by-step phenological timeline (Germination, Vegetative, Flowering, Maturation, Post-Harvest) with irrigation and fertilization schedules.
- **Economic Outlook & Revenue Forecast**: Gross yield monetization, operational input costs, and net margin estimations per acre.
- **Dynamic PDF Export**: Client-side printable reports for agronomists and farmers.

---

## 2. Hostile UI Architecture: "UN-CONVERT" (Single-Use Gateway)
A production-ready implementation of intentional user friction, hostile UX patterns, and defensive ephemeral interfaces.

### Implemented Dark Patterns
- **Hostile Popup Block**: Sequential loop of 7 to 10 cold, high-anxiety native browser alerts (`alert()`) before execution.
- **Accidental Reset Trap**: Giant, inviting, glowing primary button that instantly wipes all textarea inputs.
- **Evasive Real Action Button**: Disguised as broken/disabled text that jumps 5–10px away on mouse hover to avoid double clicks.
- **Total Focus & Session Erasure**: Immediate cryptographic zero-fill on `blur`, `visibilitychange` (tab switch/minimize), and `beforeunload`.
- **Artificial Visual Friction**: 5-second unskippable full-screen delay spinner cycling deallocation statuses.
- **Unpolished Aesthetic**: Jarring mismatched borders, high-contrast neon palette, and 3px thin scrollbars.

---

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/agrismart_db
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Servers
```bash
# Starts both Express backend and Vite client concurrently
npm run dev

# Or start individually:
npm run server:dev  # Port 5000
npm run client:dev  # Port 3000
```

### 4. Build for Production
```bash
npm run build
```

---

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, SoilMetricsCard, EconomicsCard, etc.
│   │   ├── hooks/            # TanStack Query API hooks
│   │   ├── pages/            # Dashboard, Fields, Advisory, Diagnostics, HostileTool
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
├── server/
│   ├── controllers/          # Field, Advisory, and Diagnostic controllers
│   ├── lib/                  # Gemini SDK, agronomic prompts, fallback engine
│   ├── db.ts                 # PostgreSQL + in-memory dual-layer repository
│   ├── routes.ts             # REST API routes
│   └── index.ts              # Express application entry
├── shared/
│   ├── schema.ts             # Domain models and TypeScript interfaces
│   └── validators.ts         # Zod schemas
├── hostile.html              # Standalone dependency-free hostile single-page app
└── index.html                # Vite React app entry
```
