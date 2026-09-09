# MetroCheck REST API Reference

Base Endpoint: `http://localhost:8000/api`

## Authentication
- `POST /api/auth/login`: Authenticate with email/username and password. Returns JWT bearer token and user role.
- `GET /api/auth/me`: Get current authenticated user details.
- `GET /api/auth/demo-users`: Retrieve seeded test credentials for all four roles.

## Packaging Scans & Pipeline
- `POST /api/scans/analyze`: Ingests packaging image or demo product ID. Executes OCR extraction, deterministic rules evaluation, tamper analysis, and persists an inspection case.
- `POST /api/scans/upload`: Multipart image upload endpoint.

## Inspections & Case Review
- `GET /api/inspections`: List inspection cases with status, risk tier, district, and text search filters.
- `GET /api/inspections/{id}`: Retrieve detailed case with all extracted fields, bounding boxes, violations, and audit history.
- `PATCH /api/inspections/{id}/fields/{field_name}`: Human-in-the-loop field override. Automatically triggers compliance score recalculation and audit chaining.
- `PATCH /api/inspections/{id}/status`: Update case status (`Draft`, `Under Review`, `Confirmed`, `Resolved`, `Closed`).
- `POST /api/inspections/{id}/notice`: Generate a formal statutory Show Cause Notice draft for officer review.

## Reports
- `GET /api/reports/{id}/pdf`: Stream official Legal Metrology Inspection Record in PDF format (generated via ReportLab).
- `GET /api/reports/{id}/html`: Render printable, high-contrast HTML inspection record.

## Dashboard & Analytics
- `GET /api/dashboard/summary`: Top KPI metrics (Total inspections, compliant count, violations, high risk, pending reviews).
- `GET /api/dashboard/analytics`: Trend graphs, violation category breakdown, risk distribution, and repeat offender rankings.

## Rules Engine Configuration
- `GET /api/rules`: List authoritative Rule 6 declarations with severities, weights, and confidence thresholds.
- `PATCH /api/rules/{rule_code}`: Modify weights, severities, or active toggle state.
- `GET /api/rules/versions`: Retrieve statute version metadata (e.g. `LMPC-2011-v1.0`).

## Consumer QR & Grievances
- `GET /api/qr/{verification_id}`: Public verification endpoint returning sanitized compliance index and verification date.
- `POST /api/qr/grievances`: Citizen grievance lodging endpoint.

## Cryptographic Audit Trail
- `GET /api/audit`: Query sequential audit logs.
- `GET /api/audit/verify`: Mathematically verify SHA-256 hash chaining integrity.
