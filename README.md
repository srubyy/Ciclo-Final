# Ciclo — Household Waste Intelligence

**App Name:** Ciclo (from Italian/Spanish "ciclo" = cycle — circular economy, data cycles)  
**Tagline:** Track. Analyze. Reduce.  
**Project:** VESIT Dept. of IT · Group 5 · 2025-26 · SDG 12

## Stack
- React 18 + TypeScript
- Vite 7
- Tailwind CSS 3
- Zustand (with localStorage persistence)
- React Router DOM v6
- Recharts (charts/analytics)
- Framer Motion (animations)
- Lucide React (icons)

## Build
```
npm install
npm run build
```

## Features
1. **Landing Page** — Hero, features grid, SDG section
2. **Dashboard** — Stats, pie chart, weekly bar chart, recent entries
3. **Log Waste** — Daily entry form (wet / dry / recyclable in kg)
4. **Analytics** — Area/bar/pie charts with weekly/monthly toggle
5. **Tips** — Personalized waste-reduction tips from user data
6. **Learn** — Knowledge hub with articles + quick reference table
7. **Community** — Mumbai MMR benchmarks, radar chart, survey findings

## Color Palette
- Background: `#0a120d`
- Card: `#141f18`
- Primary: `#4ade80` (green-400)
- Wet Waste: `#2dd4bf` (teal)
- Dry Waste: `#f59e0b` (amber)
- Recyclable: `#60a5fa` (blue)

## Data
- Waste entries persisted in localStorage via Zustand `persist`
- Demo data: 30 days of randomized entries (`seedDemoData()`)
- Community data: hard-coded from VESIT field survey (12 households, 5 Mumbai locations)

## Key Pages
- `/` — Landing
- `/dashboard` — Main dashboard
- `/log` — Log waste entry
- `/analytics` — Detailed analytics
- `/tips` — Personalized tips
- `/learn` — Knowledge hub
- `/community` — Community benchmarks
