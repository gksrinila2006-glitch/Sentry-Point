# 🛡️ Sentry-Point

### Zero-Trust Insider Threat Correlation & Post-Quantum Secured Compliance Ledger

[![Hackathon Submission](https://img.shields.io/badge/Hackathon-FinSpark'26-blueviolet?style=for-the-badge)](https://github.com)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![Post-Quantum Cryptography](https://img.shields.io/badge/PQC-ML--KEM--768-emerald?style=flat-square&logo=shield)](https://csrc.nist.gov)

Built by **Team AltF4** for FinSpark'26 — Bank of Maharashtra's national cybersecurity innovation challenge.

---

## 💡 Elevator Pitch

Traditional bank security blocks external hackers but remains blind to **insiders holding the master keys**. **Sentry-Point** is an AI-assisted, Zero-Trust threat correlation engine and forensic workstation. It monitors privileged user sessions, correlates subtle anomalies into risk scores (0–100), offers Explainable AI (XAI) threat justifications, challenges suspicious activity with graduated adaptive controls (step-up MFA), and seals compliance records using NIST-standardized **Post-Quantum Cryptography** to defend against future offline decryption attacks.

---

## 🛑 The Problem: The Threat Inside the Vault

1. **The Insider Threat Blindspot** — Traditional security gates check credentials at entry but cannot distinguish between a regular admin doing their job and one misusing access to reach sensitive systems.
2. **The "Black-Box" AI Dilemma** — Modern security tools flag risks using machine learning but often fail to explain *why* a user was flagged, forcing analysts to act on blind trust — untenable in a regulated banking environment.
3. **The "Decrypt-Later" Risk** — Attackers can steal encrypted audit logs today, intending to decrypt them years from now once quantum computers can break current public-key cryptography ("harvest now, decrypt later").

---

## ⚡ The Solution: How Sentry-Point Works

Sentry-Point behaves like a security guard who has learned every worker's normal routine, stepping in only when a pattern breaks:

```
[ User Behavior Telemetry ]
            │
            ▼
[ Behavioral Risk Correlation Engine ] ──► (Compares current session vs. historical baseline)
            │
            ▼
[ Risk Score (0–100) ] ──► [ >40: Step-up MFA ] ──► [ >75: Auto-Quarantine ]
            │
            ▼
[ Sealed Audit Ledger ] ──► Protected with Post-Quantum Cryptography
```

1. **User Baselines** — Automatically profiles standard working hours, source subnets/IPs, and typical data/query volumes for each privileged user.
2. **Multi-Signal Correlation** — Avoids alert fatigue by triggering only when multiple weak signals occur together (e.g., bypassing a secure access gateway *and* an abnormal spike in database query volume), rather than flagging on any single anomaly.
3. **Explainable AI (XAI) Root Cause** — Every risk score is paired with a plain-language justification (e.g., *"Risk score 89 — user bypassed the PAM jump-host and attempted to modify core firewall configuration tables"*), supporting audit and compliance review.
4. **Graduated Response Controls** — Medium-risk activity triggers a step-up MFA challenge rather than an immediate lockout; only critical-risk activity results in account suspension — reducing disruption to legitimate users.
5. **Post-Quantum Sealed Logs** — Audit trails are secured using cryptographic primitives aligned with NIST's finalized post-quantum standards (**FIPS 203 / ML-KEM** for key encapsulation, and **FIPS 204 / ML-DSA** for signature integrity), protecting evidence against future decryption.

---

## 🧭 Focus Areas & Expected Outcomes Mapping

| Expected Outcome (Problem Statement) | How Sentry-Point Addresses It |
| :--- | :--- |
| Detects misuse of privileged accounts | Flags unauthorized access, configuration changes, and PAM gateway bypasses |
| Identifies insider threats in real time | Live simulation engine updates risk scores and alert feed instantly |
| Uses AI-driven behavioural analysis | Behavioral Risk Correlation Engine compares live sessions to historical baselines |
| Enables risk-based access control | Policy engine links risk thresholds to automated step-up authentication |
| Protects critical administrative systems | Analyst mitigation actions: suspend, step-up MFA, or dismiss |
| Incorporates Quantum-Proof Cryptography | Audit ledger sealed and verifiable using post-quantum cryptographic standards |

---

## 💻 Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| UI Framework | React 19 | Reactive component-based views (Dashboard, Investigation, Audit Log, Settings) |
| Build Tooling | Vite 8 | Fast dev server with Hot Module Replacement |
| Data Visualization | Chart.js 4 | Real-time risk trend graphs and stat-card sparklines |
| Iconography | Lucide React | Consistent visual language for threat/signal types |
| Code Quality | Oxlint | High-performance static analysis and linting |

---

## 🚀 Interactive Demo Flow

1. **SOC Overview** — Review active alerts, high-risk user distribution, and detection response times on the main Dashboard.
2. **Run an Attack Simulation** — Use the Simulation Lab to trigger scenarios like *Privileged Bypass* or *Data Exfiltration*, and watch the risk index and alert feed update live.
3. **Deep Forensic Investigation** — Click into a flagged user to open the investigation view: session timeline, baseline-vs-current comparison, and the XAI explainability panel.
4. **Execute a Response** — Trigger Step-up MFA or Suspend Account to see the mitigation workflow.
5. **Verify the Audit Ledger** — Open the Audit Log tab and inspect a record's cryptographic verification to see the simulated post-quantum signature check.

---

## ⚙️ How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/gksrinila2006-glitch/Sentry-Point.git
cd Sentry-Point

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```
Then open **http://localhost:5173/** in your browser.

To build a production bundle:
```bash
npm run build
```

---

## 📌 Project Status

This is a **fully functional, interactive frontend prototype** built for a hackathon timeline, using realistic simulated data to demonstrate the complete detection-to-response workflow.

- ✅ Frontend UI/UX — complete across all views
- ✅ Interactive simulation engine — functional, drives live demo scenarios
- ✅ Risk scoring logic — rule-based, demonstrating the intended ML decision architecture
- ⬜ Live backend integration — not yet connected to real Active Directory, SIEM, or transaction data sources; planned for production deployment

---

## 👥 Team AltF4

| Name | Role |
| :--- | :--- |
| Ganeshkumar P | Technical Lead & Backend |
| Srinila | Frontend Development |
| Cibivishnu | Analysis & Presentation |
| Anisha MG | Research & Documentation |

---

## 📚 References

- CISA — Insider Threat Mitigation Guide: https://www.cisa.gov/resources-tools/resources/insider-threat-mitigation-guide
- RBI — Cyber Security Framework for Banks (2016): https://www.rbi.org.in/commonperson/english/scripts/Notification.aspx?Id=1721
- NIST — Post-Quantum Cryptography Standards (FIPS 203/204): https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards

---

*Built for FinSpark'26 — Bank of Maharashtra's national cybersecurity innovation challenge.*