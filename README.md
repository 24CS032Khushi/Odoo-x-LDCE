# 🌍 GlobeTrotter Smart — Bespoke Travel Operating System & Financial Intelligence

<div align="center">

[![Odoo x LDCE Hackathon 2026](https://img.shields.io/badge/Odoo%20x%20LDCE-Hackathon%20'26-F59E0B?style=for-the-badge&logo=odoo&logoColor=white)](https://github.com)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/API%20Tests-14%2F14%20Passing-10B981?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com)

**Curated Routes. Infinite Horizons.**  
*A high-performance, intelligent travel planning and financial telemetry platform built with tactile neumorphic design, live OpenStreetMap geocoding, multi-variable health diagnostics, and India-first contextual routing.*

[Live Demo](#-judge--evaluator-demo-credentials) • [Key Features](#-core-features--innovations) • [Architecture](#-system-architecture) • [Quick Start](#-quick-start--installation) • [API Reference](#-api-specification)

</div>

---

## 🌟 Executive Summary

Traditional travel planning tools are fragmented and static: travelers juggle dozens of browser tabs, struggle with unrealistic daily pacing, face unexpected expenses in foreign currencies, and lack intelligent route continuity validation.

**GlobeTrotter Smart** reimagines the modern travel experience by integrating:
1. **✈️ Cinematic 3D Landing Experience**: Slender high-altitude private jet in flight, 4x4 overland expedition vehicle with illuminated road beams, and an automated rotating destination showcase container.
2. **🇮🇳 India Focus & Contextual Routing**: Prioritized Indian heritage & cultural hotspots (*Ahmedabad, Jaipur, Goa, Udaipur, Varanasi, Manali, Ladakh, Kerala*) with dynamic **OpenStreetMap Nominatim Live Geocoding**.
3. **🛡️ 0-to-100 Trip Health Diagnostic Engine**: Mathematical multi-variable diagnostic scoring pacing, transit feasibility, budget headroom, and schedule completeness.
4. **💰 5-Bucket INR Financial Telemetry**: Categorized expenditure tracking (Transit, Stays, Activities, Food, Buffer) with real-time **Daily Burn Velocity (₹/day)** and **Automated Savings Heuristics**.
5. **📅 Interactive Drag-and-Drop Timeline & Route Sanity Engine**: Real-time conflict resolution, timing overlap detection, and multi-day rescheduling.
6. **⚖️ Decision Intelligence Showdown Matrix**: Side-by-side trade-off comparison between draft itineraries.
7. **🔗 Public Share Storyboards & Deep Trip Cloning**: Seamless read-only sharing (`/share/:slug`) and 1-click duplication.
8. **🖼️ Tactile Frosted Design System**: High-contrast frosted glass cards (`#E2E8F0` / `#0B0F19`) guaranteeing 100% font legibility across a living HD background slideshow.

---

## 🚀 Core Features & Innovations

### 1. 🏖️ Cinematic Luxury Landing & Dual-Vibe Explorer
- **Large 3D Animated Jet**: Sleek aerodynamic private jet gliding smoothly in high altitude with glowing turbine afterburners and trailing vapor contrails.
- **Large 3D Animated 4x4 SUV**: Detailed overland adventure vehicle cruising along an asphalt highway with rotating gold wheel hubs, headlights projection beam, and suspension bounce.
- **Dynamic Hero Showcase Container**: Autoplay rotating glass container transitioning smoothly every 4.5 seconds between top destinations (*Ladakh, Goa, Varanasi, Udaipur, Manali, Kyoto*) with interactive selector dots.
- **Beaches & Mountains Visual Explorer**: 1-click vibe switcher showcasing crystal-clear 4K photography for coastal retreats and alpine summits.

### 2. 🌐 Live OpenStreetMap Geocoding & Contextual Stop Ranking
- **Live Places Search Engine**: Debounced search querying OpenStreetMap Nominatim for any city worldwide (*e.g., Ahmedabad, Surat, Jaipur, Paris, Tokyo*), auto-generating curated attractions and realistic INR costs.
- **Contextual Stop Ranking**: When creating or adding stops to a trip, the system inspects existing route milestones and prioritizes related regional destinations (*India heritage hubs ranked first*).

### 3. 🛡️ 0-to-100 Trip Health Score Diagnostic Engine
Evaluates every itinerary using 4 mathematically weighted pillars:
$$\text{Health Score} = 0.30 \times \text{Pacing} + 0.30 \times \text{Transit} + 0.25 \times \text{Budget} + 0.15 \times \text{Completeness}$$

- **Pacing**: Activity density per day (detects overloaded days $\ge 5$ items).
- **Transit Feasibility**: Travel distance vs. buffer time.
- **Budget Balance**: Spending headroom vs. ceiling limit.
- **Schedule Completeness**: Verified destination stops and scheduled milestones.

### 4. 💰 5-Bucket INR Financial Telemetry & Savings Heuristics
- **5 Standard Categorization Buckets**:
  - ✈️ **Transport & Transit**
  - 🏨 **Stays & Accommodations**
  - 🎟️ **Activities & Sightseeing**
  - 🍽️ **Meals & Dining**
  - 🛡️ **Contingency Buffer**
- **Financial Velocity Metrics**: Real-time **Daily Burn Rate in ₹/day**, total spend vs. target ceiling, and visual category donut breakdowns.
- **Automated Cost Optimization**: AI-inspired heuristics that detect high-burn categories and suggest concrete savings (*e.g., "Book inter-city transit 14 days in advance to save ~₹4,500"*).

### 5. 📅 Interactive Drag-and-Drop Itinerary Calendar
- **Drag-and-Drop Rescheduling**: Drag activities freely between days with instant database state synchronization.
- **Continuous Route Sanity Checks**: Detects timing overlaps (*e.g., 10:00–12:30 overlapping 11:00*), consecutive packed streaks, and inter-city travel conflicts with actionable fix banners.

### 6. ⚖️ Trip Comparison Matrix (Decision Intelligence)
- Side-by-side trade-off showdown between any two draft trips (*Option A vs. Option B*).
- Directly compares Health Scores, total budget limits, daily burn velocity, and sanity warning flags.

### 7. 🔗 Public Storyboard Sharing & 1-Click Deep Cloning
- Generate unique, secure public share slugs (`/share/:slug`).
- Read-only responsive view accessible on any device without logging in.
- Authenticated users can clone the entire itinerary, stops, and scheduled items into their private workspace with one click.

---

## 🛠️ System Architecture & Tech Stack

```
GlobeTrotter Smart
├── frontend/                     # React 18 SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/        # HealthScoreGauge, BudgetChart, SanityBanner
│   │   │   ├── landing/          # Luxury3DPlane, Luxury3DCar, HeroShowcaseContainer
│   │   │   ├── layout/           # Navbar, Layout, BackgroundSlideshow
│   │   │   ├── shared/           # Button, Card, Modal, FormInput, Toast
│   │   │   └── trips/            # CreateTripModal, AddStopModal, AddActivityModal
│   │   ├── context/              # AuthContext, ToastContext
│   │   ├── pages/                # Landing, Dashboard, Trips, Builder, Budget, Calendar, Compare, Profile
│   │   └── services/             # Axios API Client with JWT Interceptors
│   └── tailwind.config.js        # Tactile neumorphic tokens & luxury typography
│
└── backend/                      # Node.js Express REST API
    ├── prisma/
    │   ├── schema.prisma         # Database Schema (PostgreSQL)
    │   └── seed.js               # Database Seeder (Destinations, Demo Trips, Users)
    ├── src/
    │   ├── auth/                 # JWT Authentication & BCrypt Middleware
    │   ├── trips/                # Trips, Stops, Itinerary Items, Budget Engine
    │   ├── cities/               # Cities Controller & OpenStreetMap Geocoding Service
    │   ├── health/               # Mathematical Health Score Diagnostic Engine
    │   ├── sanity/               # Conflict & Pacing Sanity Checker
    │   └── admin/                # Platform Governance & Telemetry Analytics
    └── tests/
        └── verify-api.js         # Complete 14-Point End-to-End Test Suite
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher running locally or in cloud
- **npm** or **yarn**

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Ensure DATABASE_URL and JWT_SECRET are set in backend/.env
# Example: DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globetrotter"

# Push Prisma schema to PostgreSQL database
npx prisma db push

# Seed initial destinations, demo trips, and admin accounts
node prisma/seed.js

# Start the Express API server
npm run dev
# Backend runs on http://localhost:4000/api/v1
```

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Run Verification Test Suite
```bash
# In the backend directory, run the automated verification suite
cd backend
npm test
```
*Outputs 14/14 Passing Tests verifying JWT auth, trip creation, sanity checks, health score engine, budget categorization, and admin analytics.*

---

## 🔑 Judge & Evaluator Demo Credentials

| Account Role | Email Address | Password | Unlocked Features |
|:---|:---|:---|:---|
| **Explorer (Demo Traveler)** | `alex.explorer@globetrotter.com` | `Password123!` | Dashboard, Multi-City Trips, Builder, Budget in INR, Calendar, Compare |
| **Platform Administrator** | `admin@globetrotter.com` | `Password123!` | Admin Analytics Console (`/admin`) + All Explorer Features |

---

## 📡 API Specification

| HTTP Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/v1/auth/signup` | Register new user account | No |
| `POST` | `/api/v1/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/v1/cities` | Search & list cities (with live OSM geocoding) | Yes |
| `GET` | `/api/v1/cities/recommendations` | Get personalized destinations with passion matching | Yes |
| `GET` | `/api/v1/trips` | Retrieve user's planned travel itineraries | Yes |
| `POST` | `/api/v1/trips` | Create new multi-city travel itinerary | Yes |
| `GET` | `/api/v1/trips/:id` | Get full trip details with stops & itinerary items | Yes |
| `POST` | `/api/v1/trips/:id/stops` | Add destination stop to itinerary | Yes |
| `POST` | `/api/v1/trips/:id/itinerary-items` | Schedule activity item in day timeline | Yes |
| `GET` | `/api/v1/trips/:id/budget` | Calculate 5-bucket budget, burn rate & savings heuristics | Yes |
| `POST` | `/api/v1/trips/:id/expenses` | Log manual actual expense | Yes |
| `GET` | `/api/v1/trips/:id/health-score` | Compute 0-100 Trip Health Diagnostic Score | Yes |
| `GET` | `/api/v1/trips/:id/sanity-checks` | Check route pacing, overlaps & travel collisions | Yes |
| `PUT` | `/api/v1/trips/:id/publish` | Generate public read-only share link | Yes |
| `GET` | `/api/v1/share/:slug` | Access public read-only itinerary storyboard | No |
| `POST` | `/api/v1/trips/:id/copy` | Deep clone complete trip into user library | Yes |
| `GET` | `/api/v1/admin/analytics` | Retrieve platform-wide telemetry & charts | Admin |

---

## 🏆 Hackathon Evaluation Highlights

1. **Production Quality**: Clean separation of concerns, TypeScript-ready schemas, robust error handling, and 0 console/build errors.
2. **Indian Market Customization**: Native INR (₹) formatting, Indian destination priority sorting, and domestic transit sanity rules.
3. **UX & Visual Polish**: Bespoke luxury typography (`Playfair Display`, `Cinzel`, `Plus Jakarta Sans`), 3D animated vehicle models, and high-contrast frosted tactile cards over living HD backdrops.
4. **Algorithmic Depth**: Multi-pillar mathematical scoring for itinerary health and automated cost optimization heuristics.

---

<div align="center">

**GlobeTrotter Smart** • Built with ❤️ for the **Odoo x LDCE Hackathon 2026**  
*Empowering travelers to vibe, plan, and voyage with absolute confidence.*

</div>
