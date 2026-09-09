from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from app.db.session import get_db
from app.db.models import Violation

router = APIRouter(prefix="/violations", tags=["Violations Management"])

class ViolationStatusUpdate(BaseModel):
    status: str # DETECTED, CONFIRMED, REJECTED, RESOLVED
    inspector_remarks: Optional[str] = None

@router.get("")
def list_violations(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    rule_code: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Violation)
    if status:
        query = query.filter(Violation.status == status)
    if severity:
        query = query.filter(Violation.severity == severity)
    if rule_code:
        query = query.filter(Violation.rule_code == rule_code)

    violations = query.order_by(Violation.created_at.desc()).limit(limit).all()
    return [
        {
            "id": v.id,
            "inspection_id": v.inspection_id,
            "case_id": v.inspection.case_id if v.inspection else "N/A",
            "product_name": v.inspection.product_name_cached if v.inspection else "N/A",
            "manufacturer": v.inspection.manufacturer_cached if v.inspection else "N/A",
            "rule_code": v.rule_code,
            "field_name": v.field_name,
            "severity": v.severity,
            "status": v.status,
            "detected_value": v.detected_value,
            "failure_message": v.failure_message,
            "remediation": v.remediation,
            "evidence_region": v.evidence_region,
            "inspector_remarks": v.inspector_remarks,
            "created_at": v.created_at.isoformat() if v.created_at else None
        }
        for v in violations
    ]

@router.patch("/{id}")
def update_violation(id: str, req: ViolationStatusUpdate, db: Session = Depends(get_db)):
    v = db.query(Violation).filter(Violation.id == id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Violation not found")

    v.status = req.status
    if req.inspector_remarks:
        v.inspector_remarks = req.inspector_remarks

    db.commit()
    db.refresh(v)

    return {
        "success": True,
        "id": v.id,
        "status": v.status,
        "inspector_remarks": v.inspector_remarks
    }
