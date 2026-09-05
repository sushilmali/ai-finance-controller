# 🚀 AI Finance Controller

**Autonomous Financial Intelligence, Anomaly Detection & Strategic Decision Platform**  
*Target Buildathon Track: Track 4 — AI Finance Controller*

---

## 🌟 Overview & Core Value Proposition

> **Financial Data → AI Analysis → Insights → Recommendations → Better Financial Decisions**

**AI Finance Controller** is a full-stack financial management and analytics platform engineered for small businesses and individuals. It bridges raw financial transaction journals into actionable executive intelligence, predictive cash flow forecasting, automated anomaly and duplicate detection, and conversational AI decision support.

---

## ✨ Key Features

1. **Transaction Management & Ledger:**
   - Full CRUD operations (Add, Edit, Delete, View).
   - Real-time search, multi-category filters, income/expense toggles, date range selectors, and sorting.
   - Dynamic category badge icons and inline status indicators.

2. **Smart CSV Import & Validation:**
   - Drag-and-drop CSV importer with downloadable sample templates.
   - Intelligent column mapper (Date, Description, Amount, Type).
   - Instant automated categorization and anomaly re-scan upon ingestion.
   - Export filtered transactions back to CSV anytime.

3. **AI-Powered Expense Categorization:**
   - Live category inference (Salaries, Marketing, Software, Travel, Food, Utilities, Office, Rent, Healthcare, Consulting, Sales).
   - Gemini 1.5 Flash LLM integration with deterministic regex/smart-rule fallback.

4. **Statistical & AI Anomaly Detection:**
   - Multi-factor mathematical modeling (Z-scores, category historical baseline deviations >2.5x, single-transaction operational surges).
   - AI-generated root cause explanations and recommended mitigation actions.
   - Severity indicators (High, Medium, Low) with review and resolution status workflows.

5. **Duplicate Transaction Detection:**
   - Fuzzy string matching + amount tolerance within a 4-day sliding time window.
   - 1-Click duplicate review modal to inspect and remove redundant charges.

6. **Executive Financial Dashboard:**
   - 4 High-Impact KPI Cards: Total Inflow/Income, Total Outflow/Expenses, Net Balance (Margin %), and Financial Health Index.
   - Monthly Income vs. Expenses comparison (Recharts).
   - Donut chart with category distribution.
   - Top Spending Categories horizontal progress bars.
   - Recent Transactions ledger & Live Anomaly alerts banner.

7. **5-Pillar Financial Health Score (0–100):**
   - Transparent, quantifiable multi-factor scoring:
     - **Cash Flow Ratio** (30% Weight)
     - **Expense Control & Margins** (25% Weight)
     - **Spending Diversification & Stability** (20% Weight)
     - **Anomaly & Risk Exposure** (25% Weight)
   - Interactive breakdown modal with sub-scores.

8. **Predictive Cash Flow & Runway Forecast:**
   - Multi-period historical velocity analysis with weighted moving averages and exponential trend damping.
   - Projected next-month Income, Expenses, and Net Retained Buffer.
   - Visual Area chart with confidence ranges and clear methodology disclaimers.

9. **"Ask Your AI Finance Controller" (Conversational CFO):**
   - Conversational assistant strictly grounded in the user's real transactions database.
   - Instant quick-prompt pills (*"Where am I spending the most?"*, *"Find unusual expenses"*, *"Which expenses should I reduce?"*, *"Give me a financial summary"*, *"What is my financial health score?"*).
   - Formatted markdown responses with bold figures, bullet points, and actionable steps.

---

## 🛠️ Technology Stack

### Frontend
- **React.js 18** (Vite build tool)
- **Tailwind CSS** (Custom fintech dark theme, glassmorphism, glowing accents)
- **Recharts** (Area, Bar, Donut charts)
- **Lucide React** (Vector icons)
- **Canvas Confetti** (Milestone celebration feedback)

### Backend
- **Node.js & Express.js** (REST API)
- **Mongoose / MongoDB** (With high-speed zero-config memory fallback for instant offline demo)
- **Multer & CSV-Parser** (File ingestion and stream validation)
- **@google/generative-ai** (Gemini 1.5 Flash integration)

---

## 🚀 Quick Setup & Getting Started

### 1. Prerequisites
- Node.js (v18 or newer recommended)
- npm

### 2. Installation
```bash
# Clone or navigate to the project directory
cd "ai project" (or project root)

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Variables
Create a `.env` file in the `server/` directory (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_finance_controller
GEMINI_API_KEY=your_gemini_api_key_here
AI_API_KEY=
NODE_ENV=development
```
> *Note: If `GEMINI_API_KEY` is not provided, the platform automatically utilizes its built-in deterministic financial intelligence engine with 100% data grounding and zero hallucinations.*

### 4. Running the Application

**Start Backend Server:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Start Frontend Client:**
```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

---

## ⏱️ 5-Minute Buildathon Demo Walkthrough Flow

1. **Dashboard Overview:** Open `http://localhost:3000` to inspect the clean fintech dark interface.
2. **1-Click Demo Data:** Click **"Load Demo Data"** in the sidebar or banner to populate a realistic 3-month dataset.
3. **KPI Inspection:** Observe Total Inflow (₹12,45,000), Total Expenses (₹8,08,397), Net Balance (₹4,36,603), and Financial Health Score (84/100).
4. **Anomalies Detection:** Navigate to **Anomalies** -> Show the flagged **AWS Cloud Hosting Surge (₹42,000)** vs. baseline (~₹8,500) with AI root cause reasoning.
5. **Duplicate Resolution:** Open **Transactions** or click the Duplicate alert banner -> Inspect the two matching **Slack Technologies** charges.
6. **AI Insights:** Navigate to **AI Insights** -> Review the 5-pillar health score breakdown and prioritized recommendations.
7. **Forecast:** Navigate to **Forecast** -> View the historical trajectory and projected next-month cash flow.
8. **AI Finance Controller Chat:** Navigate to **AI Controller** -> Click *"Where am I spending the most?"* and *"Which expenses should I reduce?"* to showcase grounded, real-time responses.
9. **CSV Import:** Click **"Import CSV"** in the top bar, drop a sample CSV, and watch auto-categorization and metric updates in real-time.
