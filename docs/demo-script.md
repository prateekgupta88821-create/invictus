# MetroCheck SIH 2026 Judge Demonstration Script

**Time Required:** ~3 minutes  
**Goal:** Prove this is a complete, production-grade Legal Metrology Compliance System, NOT a simple OCR demo.

---

### Step 1: Launch Guided Tour
1. Navigate to `http://localhost:3000`.
2. Notice the Indian GovTech styling (deep navy, official typography, zero flashy startup gimmicks).
3. Click the prominent gold button: **"Judge Demo Mode (3 min)"** in the top navigation bar.

---

### Step 2: Ingest Packaging & Run Quality Gate
1. Select **"ABC Biscuits"** from the demo packaging scenario bar.
2. Observe the image quality assessment: `GOOD (94%)` with sharpness and glare checks.
3. Click **"Run Legal Metrology Verification Pipeline"**.
4. Observe the progressive pipeline:
   - Image preprocessing
   - OCR & vision contour extraction
   - Bounding region detection
   - Confidence threshold scoring
   - Statutory Rule Engine evaluation

---

### Step 3: Interactive Visual Evidence & Bounding Boxes
1. On the canvas, observe the color-coded bounding boxes:
   - **Green**: Compliant mandatory declarations.
   - **Amber**: Declarations under confidence threshold requiring officer cross-examination.
   - **Red**: Statutory contraventions / missing declarations.
2. Click any declaration in the right table (e.g., `MRP`, `Net Quantity`, `Manufacturer`).
3. Notice the canvas highlights and focuses directly on the corresponding physical packaging coordinate.

---

### Step 4: Human-in-the-Loop Officer Case Review
1. Click **"Open Inspector Case & Override"**.
2. View the official inspection case `MC-2026-XXXX`.
3. Locate an amber declaration (e.g., address or price).
4. Click the **Edit (pencil)** icon to simulate an inspector correcting a field observed on the pack.
5. Save the override: note that the **Compliance Index automatically recalculates**, and a new **SHA-256 cryptographic audit record** is chained.

---

### Step 5: Official Report & Show Cause Notice
1. Click **"Download Report (PDF)"** to download the official ReportLab inspection record.
2. Click **"Draft Statutory Notice"** to view the auto-generated Legal Metrology Show Cause Notice for officer review.

---

### Step 6: Geo Risk Map & GIS Hotspots
1. Navigate to **Geo Risk Map** in the sidebar.
2. Examine the interactive Leaflet / OpenStreetMap pins across Delhi NCR, Alwar, Solan, and Punjab.
3. Filter by **High/Critical Risk** to locate repeat violator clusters.

---

### Step 7: Manufacturer & Consumer Portals
1. Switch role to **Manufacturer** in the header.
2. Open **Manufacturer Self-Check** to see the Before & After compliance progression (`72% -> 96%`).
3. Switch role to **Consumer** and visit **Verify QR Badge** (`/verify/MC-2026-01001`) to test public citizen verification and grievance lodging.
