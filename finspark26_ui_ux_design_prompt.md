# AI UI/UX Design Prompt — Insider Threat & Privileged Access Detection Platform

Copy everything below into your AI design tool (Galileo AI, Uizard, v0.dev, Figma AI, etc.)

---

## PROJECT CONTEXT

Design a web application for **"SentinelIQ"** (working name) — an AI-driven Insider Threat & Privileged Access Misuse Detection platform built for banking security operations teams, developed for FinSpark'26, a national cybersecurity hackathon by Bank of Maharashtra.

**Purpose:** Help bank SOC (Security Operations Center) analysts and compliance teams detect, investigate, and respond to insider threats — misuse of privileged access by employees, contractors, vendors, or admins — in real time, using behavioral analytics and explainable risk scoring.

**Primary users:**
1. SOC Analyst — monitors alerts, investigates flagged users, takes action
2. Compliance/Audit Officer — reviews explainability, exports audit trails
3. IT/Security Admin — manages user baselines, roles, and access policies

**Design tone:** Professional, trustworthy, high-signal (not noisy), enterprise banking security software — think a blend of a SOC command center and a clean fintech dashboard. Dark theme preferred (security tools conventionally use dark UI to reduce eye strain during long monitoring sessions), with a deep navy/teal base and a single sharp accent color (amber/gold or cyan) for alerts and CTAs — similar palette energy to a banking brand, trustworthy not flashy.

---

## OVERALL STRUCTURE (Pages/Screens Needed)

### 1. Login / Authentication Screen
- Bank-branded login (logo placeholder, "SentinelIQ" product name)
- Username + password fields
- MFA/step-up authentication step (mock second factor screen) — reinforces the "risk-based authentication" theme of the product itself
- Subtle security messaging: "Protected by quantum-safe encryption" badge/microcopy

### 2. Main Dashboard (SOC Analyst home view)
This is the most important screen — the command center.
- **Top nav bar:** Product logo, search bar (search users/events), notifications bell (live alert count badge), analyst profile menu
- **Left sidebar nav:** Dashboard, Alerts, Users & Roles, Investigations, Audit Log, Reports, Settings
- **Key stat cards (top row):** Active Alerts (count), High-Risk Users (count), Avg. Detection Time, False Positive Rate (%) — each as a compact metric card with a small trend sparkline
- **Live Risk Score Heatmap/Grid:** Visual grid or list of monitored users/roles color-coded by current risk score (green → amber → red), sortable and filterable by department/role
- **Real-time Activity Feed:** Scrolling/timestamped feed of flagged events as they occur, each with a one-line summary and severity tag
- **Risk Trend Chart:** Line/area chart showing organization-wide risk score trend over the past 7/30 days

### 3. Alert Detail / Investigation View
Opens when an analyst clicks a flagged event or user.
- **User summary header:** Name (or role/ID for anonymized demo data), department, access level, current composite risk score (large, prominent number with color coding)
- **"Why was this flagged?" explainability panel:** Bulleted breakdown of contributing signals (e.g., "Accessed 3x normal data volume," "Login at unusual hour — 2:14 AM," "First-time access to Customer PII table") — this is critical since Explainable AI is a stated expected outcome
- **Behavioral timeline:** Horizontal timeline showing this user's activity over the past 24-72 hours, with the anomalous events highlighted/pinned
- **Baseline vs. Current comparison:** Side-by-side or overlay chart comparing "normal behavior baseline" vs "current session behavior" for key metrics (login time, data volume, systems accessed)
- **Action panel:** Buttons for analyst response — "Flag for Review," "Trigger Step-Up Authentication," "Suspend Access," "Mark as False Positive / Dismiss," "Escalate to Compliance"
- **Notes/comments section:** Analyst can log investigation notes (audit trail)

### 4. Users & Roles Management View
- Table/list of all monitored users with columns: Name/ID, Role, Department, Access Level, Current Risk Score, Last Activity, Status
- Filter/sort by risk level, department, role
- Click into a user to see their individual behavioral profile/baseline settings
- Toggle for "Privileged Account" tag

### 5. Audit Log / Compliance View
- Immutable, timestamped log of all system actions and alerts (for compliance/regulatory review)
- Search and filter by date range, user, event type, severity
- Export button (PDF/CSV) for regulatory reporting
- **Quantum-Safe Encryption indicator:** small badge/tooltip noting logs are secured with post-quantum cryptography (e.g., "Secured with ML-KEM/Kyber encryption") — this visually reinforces the QPC expected outcome from the problem statement

### 6. Reports & Analytics View
- Downloadable summary reports (weekly/monthly insider threat summary)
- Charts: Alerts by category, Top risky departments, False positive trend over time, Mean Time to Detect (MTTD)

### 7. Settings / Policy Configuration View
- Configure risk scoring thresholds/sensitivity
- Manage risk-based access control rules (e.g., "if risk score > 80, trigger step-up auth automatically")
- Notification preferences

---

## KEY UI COMPONENTS TO DESIGN

- Risk score badge/pill component (color-coded: green <40, amber 40-70, red >70)
- Alert severity tags (Low/Medium/High/Critical)
- Explainability card ("why flagged" reasoning list with icon per signal type)
- Behavioral timeline component (horizontal, with anomaly markers)
- Metric/stat card with sparkline
- Data table with sortable columns and inline risk indicators
- Notification/alert toast for real-time events
- Empty states (e.g., "No active alerts — all clear" state for the dashboard)

---

## VISUAL & INTERACTION NOTES

- Prioritize **scannability** — SOC analysts need to parse risk at a glance; use color, size, and position hierarchy, not walls of text
- Use **iconography** consistently for signal types (clock icon = time anomaly, database icon = data volume anomaly, lock icon = access anomaly, etc.)
- Include **micro-trust signals** throughout: "Explainable AI" badges, "Quantum-Safe" badges, timestamps on all data — since compliance/trust is core to the problem statement
- Responsive layout for desktop-first (SOC analysts work on multi-monitor desktop setups), but should degrade gracefully to tablet
- Avoid overly playful or consumer-app styling — this is enterprise security software; favor clarity and restraint over decoration

---

## DELIVERABLES REQUESTED

1. Login screen
2. Main SOC Dashboard (home)
3. Alert Detail/Investigation view
4. Users & Roles management table view
5. Audit Log view
6. A reusable component set (risk badges, alert cards, stat cards)

Please generate high-fidelity mockups for the above screens, maintaining consistent navigation, color system, and typography across all views.
