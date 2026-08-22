# 🌍 GlobeTrotter Smart — Intelligent Journey & Financial Orchestrator

> **Built for the Odoo x LDCE Ahmedabad Hackathon '26**  
> *A high-performance, data-driven travel planning and financial intelligence platform.*

---

## 🌟 Executive Summary

**GlobeTrotter Smart** reimagines modern journey planning. Beyond generic CRUD itineraries, GlobeTrotter integrates a mathematical **Trip Health Score Engine**, **Real-Time Schedule & Route Sanity Checks**, **Automated Budget Optimization with Concrete ₹ Savings**, **Interactive Multi-Day Drag-and-Drop Timeline**, **Public Read-Only Sharing with One-Click Deep Cloning**, and an **Admin Platform Analytics Console**.

Built on a unified visual design system:
- **`--color-foam` (`#f4faf9`)**: Light, analytical background for data-dense dashboards, calendars, and tables.
- **Floating Glass Navbar (`rgba(7,20,20,0.38)` + `blur(18px)`)**: Persistent brand anchor across all authenticated and public screens.
- **`--color-ocean-teal` (`#14554f`)**: Primary brand accent, healthy score indicator, and active states.
- **Warm Alert Color (`#c0392b`)**: Exclusively reserved for genuine over-budget deficits, critical health alerts ($<50$), and schedule conflicts.

---

## 🚀 Key Feature Matrix

| Feature | Description |
| :--- | :--- |
| **🛡️ Trip Health Score Engine** | Mathematical formula evaluating 4 core pillars: Budget adherence ($35\%$), Load balance ($25\%$), Timing conflicts ($25\%$), and Buffer rest days ($15\%$) with transparent "show your work" explanations. |
| **⚠️ Route & Day Sanity Checker** | Detects timing overlaps (e.g. 10:00–12:30 overlapping 11:00), overloaded days ($\ge 5$ activities), consecutive packed streaks ($4+$ days), and multi-city collisions with inline actionable fix banners. |
| **💰 Financial Intelligence & Budget Optimizer** | 5-color category breakdown (Transport `#3b82f6`, Stay `#8b5cf6`, Activities `#14554f`, Meals `#f59e0b`, Other `#64748b`), daily spend tracking, and ranked actionable suggestions with bold ₹ savings. |
| **📅 Interactive Multi-Day Calendar** | Accordion day expansion on foam surface, conflict warning borders, drag-and-drop activity movement across days, and inline time editing with live score recalculation. |
| **🌐 Hybrid GeoDB City Search** | PostgreSQL local-first search supplemented by GeoDB Cities API with a 2.5s strict timeout and automatic caching; offline resilient. |
| **🔗 Public Sharing & Deep Trip Cloning** | Public read-only photo-hero view (`/share/:slug`) with zero authentication required and one-click deep cloning into the user's library. |
| **📊 Admin Governance Console** | Real-time platform metrics, popular destination rankings, trips timeline, and budget distribution histograms (`/admin`). |
| **👤 Enhanced Traveler Profile** | Local device file browser photo upload with instant Data URL preview and English system localization. |

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (Vite), Tailwind CSS, Recharts, Lucide Icons, React Router v6.
- **Backend**: Node.js, Express.js (REST API under `/api/v1`), Prisma ORM.
- **Database**: PostgreSQL with relations across `users`, `trips`, `trip_stops`, `cities`, `activities`, `itinerary_items`, `expenses`, `trip_health_scores`, and `saved_destinations`.
- **Security & Auth**: JWT (JSON Web Tokens), bcrypt password hashing, role-based authorization middleware (`requireAdmin`).

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance running

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js            # Seeds destinations, admin, and demo trips
node scripts/seed-indian-cities.js # Seeds deep Indian destinations
npm run dev                    # Starts backend on http://localhost:4000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev                    # Starts frontend on http://localhost:5173
```

### 3. Run Automated Verification Suites
```bash
cd backend
npm test                       # Runs complete 14-test API verification suite
node tests/test-geodb-search.js # Runs 4-test GeoDB hybrid search suite
```

---

## 🔑 Judge Demo Credentials

| Role | Email | Password | Available Features |
| :--- | :--- | :--- | :--- |
| **Traveler (Demo User)** | `alex.explorer@globetrotter.com` | `Password123!` | Healthy & Imperfect Trips, Builder, Budget, Calendar, Sharing |
| **Platform Administrator** | `admin@globetrotter.com` | `Password123!` | Admin Analytics Console (`/admin`) + Traveler Features |

---

## ⏱️ 5-Minute Presentation Flow

1. **Minute 1 — Healthy Benchmark Trip**: Log in as `alex.explorer@globetrotter.com` $\rightarrow$ Open **"Japan Golden Route"** $\rightarrow$ Show **Health Score Ring (100/100)** in Ocean Teal and 4 sub-scores $\rightarrow$ Open **Budget** with ₹57,100 Headroom.
2. **Minute 2 — Imperfect Trip & Risk Detection**: Open **"Grand Euro Rush"** $\rightarrow$ Watch Health Score drop to **35/100 (`#c0392b`)** $\rightarrow$ Inspect Colosseum & Vatican timing conflict and 4-day packed streak flags.
3. **Minute 3 — Ranked Cost-Saving Alternatives**: Open Budget $\rightarrow$ View 3 real-data suggestions (*Drop Cabaret (-₹8,500)*, *Switch to Louvre (-₹6,100)*) $\rightarrow$ Log a ₹5,000 meal expense live.
4. **Minute 4 — Calendar Drag & Drop**: Open Calendar $\rightarrow$ Drag activity from Day 1 to Day 3 $\rightarrow$ Edit Vatican time from `11:00` to `13:30` $\rightarrow$ Watch flags clear live!
5. **Minute 5 — Public Sharing, Cloning & Admin Console**: Open `/share/japan-autumn-healthy` in incognito $\rightarrow$ Click **"Copy This Trip"** $\rightarrow$ Log in as admin $\rightarrow$ Open `/admin` to inspect real platform telemetry.
