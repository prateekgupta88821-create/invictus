# METROCHECK &bull; AI-Powered Legal Metrology Compliance System

[![SIH 2026 Problem Statement SIH26034](https://img.shields.io/badge/SIH%202026-Problem%20SIH26034-blue.svg)](https://www.sih.gov.in)
[![Statute: Legal Metrology (Packaged Commodities) Rules, 2011](https://img.shields.io/badge/Statute-LMPC%20Rules%202011%20(Rule%206)-emerald.svg)](https://consumeraffairs.nic.in)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B%20%7C%20FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14%20App%20Router-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)](https://www.typescriptlang.org)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com)

> **"Scan. Verify. Explain. Enforce."**  
> An AI-assisted compliance enforcement and intelligence platform transforming physical packaging into legally verifiable structured evidence under the **Legal Metrology (Packaged Commodities) Rules, 2011**.

---

## 🏛️ Executive Summary

Under Section 18 of the **Legal Metrology Act, 2009** and Rule 6 of the **Legal Metrology (Packaged Commodities) Rules, 2011**, every pre-packaged commodity distributed in India must bear mandatory statutory declarations—including Maximum Retail Price (inclusive of all taxes), Net Quantity in standard metric units, Complete Address of the Manufacturer/Packer, Date of Manufacture/Packing, Unit Sale Price (USP), and Consumer Grievance redressal contacts.

**MetroCheck is NOT a simple OCR demo.** It is an enterprise government-grade software system that implements a verifiable, deterministic compliance pipeline:

```
Packaging Image / Camera Capture
             ↓
Image Quality Assurance (Sharpness, Glare, Perspective)
             ↓
Pluggable OCR & Vision Abstraction (Zero-API Key Demo Mode Included)
             ↓
Structured Declaration Extraction (20+ Mandatory Rule 6 Fields)
             ↓
Bayesian Confidence Scoring (Threshold Validation)
             ↓
Deterministic Legal Metrology Rule Engine (Externalized JSON/YAML Rules)
             ↓
MetroCheck Compliance Index (0-100) & Operational Risk Tiering (LOW / MED / HIGH / CRITICAL)
             ↓
AI Anomaly & Packaging Tamper Detection (Sticker Overlays, Price Defacement)
             ↓
Interactive Visual Evidence Canvas (Color-Coded Coordinate Bounding Boxes)
             ↓
Human-in-the-Loop Officer Case Review (Overrides, Observations & Audit Chaining)
             ↓
Cryptographic SHA-256 Chained Audit Trail (Mathematical Integrity Verification)
             ↓
Statutory Inspection Record (ReportLab PDF & Printable HTML) + Show Cause Notice Draft
             ↓
Public QR Compliance Verification (/verify/:id) & Citizen Grievance Portal
```

---

## 🌟 Key Product Differentiators

### 1. Deterministic Rule Engine (No AI Hallucinations for Law)
AI is strictly prohibited from deciding statutory legality. AI/OCR merely decodes text (e.g. `MRP: ₹ 120.00`). The **Deterministic Rule Engine** (`rules/core_rules.json`, `rules/food_rules.json`, `rules/imported_rules.json`) strictly evaluates statutory conditions, metric unit legality, date formats, and 2021 Unit Sale Price amendments.

### 2. Interactive Visual Evidence Canvas
Links every statutory rule check directly to physical packaging coordinates via interactive, color-coded SVG/Canvas bounding boxes (**Green** = Compliant, **Amber** = Needs Verification, **Red** = Contravention). Clicking any declaration or violation pans and focuses the evidence region.

### 3. Human-in-the-Loop Officer Review & Show Cause Notice Drafting
Authorized Legal Metrology Officers can cross-examine extracted text, override OCR readings, and attach official remarks. The system automatically drafts a formal statutory **Show Cause Notice under Rule 6**.

### 4. Official ReportLab PDF Report Generation
Generates downloadable, government-styled Legal Metrology Inspection Records featuring official emblems, declaration tables, violation remediation schedules, and cryptographic verification stamps.

### 5. Cryptographic SHA-256 Chained Audit Trail
Every field override, status change, and violation confirmation is sequentially chained using SHA-256:  
`record_hash = SHA256(previous_hash + user_id + action + timestamp + payload_hash)`.  
Includes mathematical chain verification.

### 6. Four Dedicated Role Portals
- **Legal Metrology Officer**: Live packaging scanner, case dossiers, GIS risk heatmap.
- **Manufacturer / Packer**: Pre-market label self-check with **Before & After compliance progression** (e.g. 72% -> 96%) and QR badge certification.
- **Citizen / Consumer**: QR code verification (`/verify/:id`), store location reporting, and grievance filing.
- **Statutory Administrator**: Live rule weights tuning, threshold configuration, and statute version control (`LMPC-2011-v1.0`).

### 7. Geo-Spatial Risk Map (GIS)
Interactive OpenStreetMap + Leaflet visualizer pinning compliance hotspots, violation severity tiers, and repeat offender surveillance clusters across Delhi NCR and India.

### 8. E-Commerce Marketplace Checker
Audits online listings (Amazon, Flipkart, Blinkit, Zepto simulation) against mandatory pre-purchase digital declarations under the Consumer Protection (E-Commerce) Rules 2020 and Rule 6(10).

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ (Node 20+ recommended)
- Git

### Automated One-Click Launch (Windows)
```cmd
run_dev.bat
```
or via PowerShell:
```powershell
.\run_dev.ps1
```

---

### Manual Step-by-Step Setup

#### 1. Clone & Set Up Backend
```bash
# Create Python Virtual Environment
python -m venv .venv

# Activate Virtual Environment
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install Dependencies
pip install -r apps/api/requirements.txt

# Run Unit & API Tests
cd apps/api
pytest tests

# Start FastAPI Backend (Runs on http://localhost:8000)
python main.py
```

#### 2. Set Up Frontend
```bash
cd apps/web

# Install NPM Packages
npm install

# Start Next.js Development Server (Runs on http://localhost:3000)
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 👥 Demo Accounts & Credentials

The application includes seeded test accounts for all four roles:

| Role | Email | Password | Department / Function |
| :--- | :--- | :--- | :--- |
| **Legal Metrology Officer** | `officer@metrocheck.gov.in` | `officer123` | Department of Legal Metrology, Delhi |
| **Manufacturer / Packer** | `manufacturer@abcfoods.in` | `manuf123` | ABC Foods Quality & Compliance |
| **Citizen / Consumer** | `consumer@citizen.nic.in` | `consumer123` | Public Verification & Grievances |
| **Statutory Administrator** | `admin@metrocheck.gov.in` | `admin123` | Directorate of Legal Metrology, GoI |

*Note: You can instantly switch active roles using the role dropdown in the top header.*

---

## 🧪 3-Minute Guided Judge Tour

For evaluators and judges, click the gold **"Judge Demo Mode (3 min)"** button in the header to trigger an interactive 12-step guided tour:
1. **Scan & Ingest Package**: Selects `ABC Biscuits` with automated image quality assessment.
2. **AI / OCR Extraction**: Decodes text regions and maps 20+ packaging fields.
3. **Confidence Scoring**: Assigns Bayesian confidence scores and flags low-confidence readings.
4. **Deterministic Rule Engine**: Evaluates Rule 6 statutory conditions.
5. **Statutory Violations**: Highlights observed non-compliances and required remediation.
6. **Visual Evidence**: Pans and highlights physical bounding box coordinates on the canvas.
7. **MetroCheck Compliance Index**: Computes statutory score (e.g. 84/100) and assigns operational risk.
8. **Officer Case Review**: Demonstrates human-in-the-loop field overrides and status confirmation.
9. **Official Report Generation**: Generates official ReportLab PDF and Show Cause Notice draft.
10. **Executive Analytics**: Interactive charts tracking compliance trends and repeat violators.
11. **Geo Risk Map**: Interactive Leaflet surveillance heatmap with district risk pins.
12. **Consumer QR Badge**: Demonstrates public QR verification at `/verify/MC-2026-01001`.

---

## 🐳 Docker Container Deployment

To launch the complete stack with Docker:
```bash
docker-compose up --build
```
- Web Application: `http://localhost:3000`
- FastAPI REST Service: `http://localhost:8000`
- API Interactive Swagger: `http://localhost:8000/docs`

---

## 📜 Statutory Legal Notice & Positioning

MetroCheck is an AI-assisted packaging compliance decision-support system designed to assist authorized government inspectors. The system does not issue binding legal determinations autonomously. Final administrative enforcement notices and judicial actions remain exclusively under the authority of designated Legal Metrology Officers pursuant to the **Legal Metrology Act, 2009**.
