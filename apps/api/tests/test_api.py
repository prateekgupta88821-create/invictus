import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "METROCHECK"

def test_get_inspections():
    res = client.get("/api/inspections")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 50
    assert len(data["items"]) > 0

def test_dashboard_summary():
    res = client.get("/api/dashboard/summary")
    assert res.status_code == 200
    kpi = res.json()["kpi"]
    assert kpi["total_inspections"] >= 50
    assert kpi["compliant"] > 0
    assert kpi["violations"] > 0

def test_dashboard_analytics():
    res = client.get("/api/dashboard/analytics")
    assert res.status_code == 200
    data = res.json()
    assert len(data["risk_distribution"]) == 4
    assert len(data["repeat_offenders"]) > 0

def test_scan_analyze_demo_product():
    res = client.post("/api/scans/analyze", json={"demo_product_id": "abc-biscuits"})
    assert res.status_code == 200
    data = res.json()
    assert data["compliance_index"] >= 80.0
    assert "extracted_fields" in data
    assert "mrp" in data["extracted_fields"]
    assert data["audit_hash"] is not None

def test_qr_verification_public():
    # Fetch first inspection
    insp_res = client.get("/api/inspections?limit=1")
    item = insp_res.json()["items"][0]
    case_id = item["case_id"]

    res = client.get(f"/api/qr/{case_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["verified"] is True
    assert data["verification_id"] == case_id

def test_audit_verify_integrity():
    res = client.get("/api/audit/verify")
    assert res.status_code == 200
    data = res.json()
    assert data["verified"] is True
    assert data["total_records"] > 0
