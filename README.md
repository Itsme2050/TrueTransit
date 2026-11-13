# TrueTransit
> *“More than maps. Your true local guardian.”*

TrueTransit is an AI-powered local navigation, tourist price transparency, personal safety, and intelligent itinerary planning platform. Built for visitors navigating unfamiliar urban centers (starting with high-density reference city **Delhi, India**), it bridges the gap between basic route calculation and real-world local guardian protection.

---

## 🌟 The Core Problems TrueTransit Solves

1. **Information & Price Asymmetry**: Unfamiliar visitors are regularly overcharged for auto-rickshaws, taxis, and everyday street goods. TrueTransit provides an **Anti-Scam Fair Price Index** using official statutory meter tariffs, verified benchmarks, and community reports with statistical outlier filtering.
2. **Time-Aware Safety Asymmetry**: The shortest route is rarely the safest route at night. The **Chrono-Safety Heatmap & Routing Engine** scores urban corridors across a 24-hour time slider based on municipal street lighting, pedestrian vitality, transit proximity, and verified incidents, generating **Fastest**, **Safest**, and **Balanced** alternatives.
3. **Fragmented Planning**: Travelers juggle navigation, budgeting, and schedules. The **Gemini-Powered Smart Itinerary Planner** generates realistic schedules with itemized transport and stops, verified by a **Deterministic Budget Validator** that mathematically guarantees financial limits.
4. **Offline Emergency Resilience**: High-risk situations occur when data drops. The **Offline-First Panic Sync** provides 1-tap SOS emergency calling (`112`, `1091`, `8750871111`), pre-cached emergency medical facilities (AIIMS, Safdarjung), and conflict-free queue synchronization upon reconnection.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend API** | Node.js (v24), Express, TypeScript, Zod, Helmet, CORS, Winston Logger, JWT Auth |
| **Database & ORM** | Prisma ORM with SQLite (instant zero-daemon local run) / PostgreSQL PostGIS ready |
| **AI Integration** | Google Gemini API (`gemini-1.5-flash`) + Local Deterministic Fallback Engine |
| **Interactive Maps** | Leaflet with CartoDB Voyager & OpenStreetMap tiles (Vector Polylines & Heat Circles) |
| **Web & Mobile Client** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons (PWA Responsive) |
| **Native Mobile Scaffold**| Flutter Clean Architecture (`flutter_app/`) with Riverpod, GoRouter, flutter_map |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+)

### One-Click Launch (Windows)
Double-click `start-all.bat` in the root folder, or run:
```bash
# Terminal 1: Backend API (port 5000)
npm run dev:backend

# Terminal 2: Frontend Web App (port 3000)
npm run dev:frontend
```

### 1. Backend Setup & Startup (Manual)

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client and initialize SQLite database
npx prisma generate
npx prisma db push

# Seed realistic demonstration benchmarks (Delhi tariffs, hospitals, police, sample reports)
npx ts-node prisma/seed.ts

# Run automated engine test suite (verifies price formulas, budget validator, and safety scoring)
npm test

# Run the end-to-end API smoke suite (Journeys A–F) — requires the server to be running
npm run test:api

# Build and start the backend server (runs on port 5000)
npm run build
npm start
```

*Backend Health Endpoint*: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

### 2. Frontend Web Client Setup & Startup

```bash
cd ../frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# Start development / preview web server (runs on port 3000)
npm run dev
```

*Web Application*: Open [http://localhost:3000](http://localhost:3000) in any desktop, tablet, or mobile browser.

---

## 🧭 Principal User Journeys (Verified & Tested)

### Journey A: Auto-Rickshaw Fare Check
1. Go to the **Anti-Scam Price Index** tab.
2. Select **Delhi Auto-Rickshaw Ride**, set distance to **4.5 km**, Day Tariff.
3. Enter quoted price **₹180**.
4. The system calculates fair tariff: **₹63** (₹30 base for 1.5 km + ₹11/km * 3 km).
5. Output flags **Significantly Above Estimated Range (+186%)** with breakdown and neutral advice.

### Journey B: Evening Route Comparison
1. Go to **Chrono-Safety Map**.
2. Slide the **24-Hour Time Slider** to **21:00 (9:00 PM)**.
3. Compare routes between **Connaught Place** and **AIIMS New Delhi**:
   - **Safest Route** (10.6 km, 38 min, Score 89/100): Direct via well-lit arterial avenue with CCTV and PCR booths.
   - **Fastest Route** (9.0 km, 30 min, Score 71/100): Secondary link saving 8 minutes but traversing variable lighting.
   - **Balanced Route** (9.6 km, 33 min, Score 78/100).
   - Slide back to 12:00 and the same corridor rises from 78 to 88. Scores for hours other than the current one are labelled as modelled planning estimates, not recorded measurements.

### Journey C: Budget-Constrained AI Itinerary
1. Go to **Smart AI Itinerary**.
2. Click **Load Medical Demo Preset** (₹1,500 budget, 4 free hours, New Delhi Station to AIIMS OPD).
3. Click **Generate Validated Itinerary**.
4. The system outputs an interactive 4-stop timeline with transit (Yellow Line Metro, pre-paid auto), hygienic food, and verified total cost of **₹920** (Remaining buffer: ₹580), confirmed by the **Deterministic Budget Guard**.

### Journey D: Offline Emergency SOS
1. Click the **Offline Sim** badge in the navbar to simulate dropped connectivity.
2. Click the red **SOS** button.
3. Tap **112** (All-in-One), **1091** (Women Helpline), or **8750871111** (Tourist Police) for cellular dialing.
4. Copy/share cached GPS coordinates and view pre-cached emergency facilities (AIIMS, Safdarjung, CP Police Station).

### Journey E: Offline Reporting & Queue Sync
1. In offline mode, click **Report a Price** or **Report Safety Concern**.
2. Submit your observation. The item is saved to the local offline queue.
3. Toggle offline mode off (reconnect).
4. Click **Synchronize Now** (or observe automatic sync): pending reports are transmitted to `/api/v1/sync` and idempotently saved.

---

## 🔒 Security, Privacy & Responsible AI Principles

- **Zero Hardcoded Secrets**: All backend tokens and Gemini keys are isolated in backend environment variables (`.env`).
- **Ephemeral Geolocation**: GPS coordinates are used exclusively for on-the-fly distance queries and not permanently logged to user accounts.
- **Strict Outlier Filtering**: Community price submissions undergo Modified Z-Score / IQR outlier detection before entering baseline aggregates.
- **Deterministic Budget Guardrails**: LLM generated itineraries are subjected to deterministic mathematical validation (`sum(itemized_costs) <= total_budget`) before display.
- **Fair Disclaimers**: Disclaimers accompany all estimates, and safety scores are explicitly labeled as decision-support heuristics rather than crime predictions.

---

## ✅ Testing & Validation

Two suites, both runnable offline against the seeded SQLite database:

| Suite | Command | Covers | Needs server? |
| :--- | :--- | :--- | :--- |
| **Engine tests** | `cd backend && npm test` | Auto/taxi fare math, night surcharge, outlier detection (Z-score/IQR), deterministic budget validator, chrono-safety scoring, 3-route generation | No |
| **API smoke suite** | `cd backend && npm run test:api` | Journeys A–F over live HTTP: price search, heatmap, routes, itinerary generation + budget check, offline bootstrap, SOS, report submit, idempotent sync, auth + role gates, 400/401/403/404 error paths | Yes (`npm run dev`) |

The smoke suite exits non-zero on any failure, so both are CI-safe. Endpoints are verified to return `400` (malformed input), `401` (missing/invalid token), `403` (insufficient role) and `404` (moderating a missing report) rather than leaking a 500.

---

## 📡 API Reference (v1)

Base URL: `http://localhost:5000/api/v1`. JSON in / JSON out. Authenticate with `Authorization: Bearer <token>` (from `/auth/login` or `/auth/guest`).

### Auth
| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | — | Create account (email, password, fullName) → token + user |
| POST | `/auth/login` | — | Sign in → token + user |
| POST | `/auth/guest` | — | Anonymous, privacy-preserving token |
| GET | `/auth/me` | Bearer | Profile + preferences |

### Price Index
| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| GET | `/prices/search?itemName=&distanceKm=&timeOfDay=&quantity=&quotedPrice=` | — | Fair-price estimate (+ `comparison` when quoted) |
| POST | `/prices/compare` | — | Same estimate from a JSON body |
| GET | `/prices/categories` | — | Supported categories + benchmarks |
| POST | `/prices/reports` | Optional | Submit community price observation (rate-limited) |

### Chrono-Safety
| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| GET | `/safety/heatmap?hour=` | — | GeoJSON zone scores with evidence + disclaimer |
| POST | `/safety/routes` | — | Fastest / Safest / Balanced alternatives with waypoints |
| GET | `/safety/emergency-facilities?lat=&lng=&type=` | — | Facilities ranked by distance |
| POST | `/safety/reports` | Optional | Submit safety observation (rate-limited) |

### Itineraries, Emergency & Sync
| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| POST | `/itineraries/generate` | Optional | Validated itinerary (Gemini + fallback) |
| POST | `/itineraries/validate` | — | Deterministic budget check on supplied stops |
| GET | `/itineraries/:id` | — | Fetch a saved itinerary |
| GET | `/emergency/resources` | — | Emergency facilities + hotlines |
| GET | `/emergency/bootstrap?city=` | — | Offline bootstrap pack (hotlines, fares, advice) |
| POST | `/emergency/sos` | Optional | Dial-able SOS content + SMS template |
| POST | `/sync` | Optional | Idempotent offline replay (dedupes by `clientUuid`) |

### Admin (role `ADMIN` or `MODERATOR`)
| Method | Path | Purpose |
| :--- | :--- | :--- |
| GET | `/admin/overview` | Moderation + usage metrics |
| GET | `/admin/reports` | Pending price & safety reports |
| PATCH | `/admin/reports/price/:id` | Approve / reject / expire a price report |
| PATCH | `/admin/reports/safety/:id` | Approve / reject / expire a safety report |

Auth is enforced server-side (not just hidden in the UI); every response distinguishes verified data, modelled estimates, and demo data.

---

## 👥 Demo Credentials

- **Demo Traveler**: `traveler@truetransit.com` / `traveler123`
- **Lead Administrator / Moderator**: `admin@truetransit.com` / `admin123`
- **Guest Explorer**: Instant 1-tap guest access enabled by default.
