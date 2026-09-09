# MetroCheck System Architecture

**AI-Powered Legal Metrology Compliance System**  
*SIH 2026 Problem Statement SIH26034*

## 1. High-Level Pipeline

```
Physical Packaging (Camera / Image / PDF)
                ↓
Image Preprocessing & Quality Gate (Blur, Resolution, Glare, Rotation)
                ↓
Pluggable OCR & Vision Extraction (Demo Provider / PaddleOCR / Tesseract / Vision API)
                ↓
Structured Field Normalization (20+ Mandatory Rule 6 Declarations)
                ↓
Bayesian Confidence Scoring (Threshold Validation)
                ↓
Deterministic Legal Metrology Rule Engine (Externalized JSON: core, food, import)
                ↓
MetroCheck Compliance Index (0-100) & Operational Risk Tiering (LOW, MEDIUM, HIGH, CRITICAL)
                ↓
AI Anomaly & Tamper Detection (Sticker Overlays, Suspicious MRP Fonts)
                ↓
Interactive Visual Evidence Canvas (Color-Coded Bounding Boxes: Green/Amber/Red)
                ↓
Human-in-the-Loop Officer Case Review (Overrides, Notes, Statutory Confirmations)
                ↓
Cryptographic SHA-256 Chained Audit Trail (Mathematical Integrity Verification)
                ↓
Statutory Inspection Record (ReportLab PDF & Printable HTML) + Show Cause Notice Draft
                ↓
Public QR Compliance Verification (/verify/:id) & Citizen Grievance Redressal
```

## 2. Decoupled Rule Engine Philosophy

A core differentiator of MetroCheck is that **AI does NOT decide statutory legality**.

- **AI/Vision's Role**: `Detected: "MRP ₹ 120.00"` with confidence `0.94` and bounding box `[55, 54, 35, 7]`.
- **Deterministic Rule Engine's Role**: Evaluates rule `LM_MRP_001`:
  - `required`: `true`
  - `condition`: `valid_mrp_syntax`
  - `taxes_included`: `true`
  - `result`: `PASS` (or `VERIFY` if confidence is low, or `FAIL` if non-compliant).
- **Inspecting Officer's Role**: Confirms, overrides, or attaches observations, creating an immutable audit record.

## 3. Four Role Access Model (RBAC)

1. **Legal Metrology Officer**: Live inspection scanner, field override tools, violation confirmation, notice generator, GIS risk heatmap.
2. **Manufacturer / Packer**: Pre-market artwork self-check, before/after compliance audit (e.g. 72% -> 96%), SKU clearance certificates.
3. **Citizen / Consumer**: QR code packaging verification (`/verify`), violation reporting, grievance lodging with District Officers.
4. **Statutory Administrator**: LMPC-2011 rule versions, weights tuning, confidence thresholds, and national analytics.
