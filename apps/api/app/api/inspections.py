from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime, timezone

from app.db.session import get_db
from app.db.models import Inspection, ExtractedField, Violation, User
from app.api.auth import get_current_user
from app.audit.chain import audit_chain
from app.engine.rules_engine import rules_engine

router = APIRouter(prefix="/inspections", tags=["Inspections & Officer Review"])

class FieldOverrideRequest(BaseModel):
    field_name: str
    override_value: str
    override_note: Optional[str] = "Inspecting officer manual field override"
    new_status: Optional[str] = "PASS"

class StatusUpdateRequest(BaseModel):
    status: str # Draft, Under Review, Confirmed, Resolved, Closed
    inspector_notes: Optional[str] = None

@router.get("")
def list_inspections(
    status: Optional[str] = None,
    risk: Optional[str] = None,
    district: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Inspection)
    if status:
        query = query.filter(Inspection.status == status)
    if risk:
        query = query.filter(Inspection.risk_level == risk)
    if district:
        query = query.filter(Inspection.district == district)
    if search:
        query = query.filter(
            (Inspection.case_id.ilike(f"%{search}%")) |
            (Inspection.product_name_cached.ilike(f"%{search}%")) |
            (Inspection.manufacturer_cached.ilike(f"%{search}%"))
        )
    
    total = query.count()
    inspections = query.order_by(Inspection.created_at.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": insp.id,
                "case_id": insp.case_id,
                "product_name": insp.product_name_cached,
                "manufacturer": insp.manufacturer_cached,
                "compliance_score": insp.compliance_score,
                "risk_level": insp.risk_level,
                "status": insp.status,
                "district": insp.district,
                "location_name": insp.location_name,
                "image_url": insp.scan_image_url,
                "created_at": insp.created_at.isoformat() if insp.created_at else None,
                "verification_id": insp.verification_id,
                "violations_count": len(insp.violations)
            }
            for insp in inspections
        ]
    }

@router.get("/{id}")
def get_inspection(id: str, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter((Inspection.id == id) | (Inspection.case_id == id)).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection case not found")

    fields = db.query(ExtractedField).filter(ExtractedField.inspection_id == insp.id).all()
    violations = db.query(Violation).filter(Violation.inspection_id == insp.id).all()

    return {
        "id": insp.id,
        "case_id": insp.case_id,
        "product_name": insp.product_name_cached,
        "manufacturer": insp.manufacturer_cached,
        "scan_image_url": insp.scan_image_url,
        "image_quality": insp.image_quality,
        "image_quality_score": insp.image_quality_score,
        "compliance_score": insp.compliance_score,
        "risk_level": insp.risk_level,
        "status": insp.status,
        "inspector_notes": insp.inspector_notes,
        "notice_draft": insp.notice_draft,
        "district": insp.district,
        "location_name": insp.location_name,
        "latitude": insp.latitude,
        "longitude": insp.longitude,
        "verification_id": insp.verification_id,
        "created_at": insp.created_at.isoformat() if insp.created_at else None,
        "fields": [
            {
                "id": f.id,
                "field_name": f.field_name,
                "detected_value": f.detected_value,
                "standardized_value": f.standardized_value,
                "confidence": f.confidence,
                "bbox": [f.bbox_x, f.bbox_y, f.bbox_w, f.bbox_h],
                "source_text": f.source_text,
                "status": f.status,
                "inspector_override": f.inspector_override,
                "override_value": f.override_value,
                "override_note": f.override_note
            }
            for f in fields
        ],
        "violations": [
            {
                "id": v.id,
                "rule_code": v.rule_code,
                "field_name": v.field_name,
                "severity": v.severity,
                "status": v.status,
                "detected_value": v.detected_value,
                "expected_condition": v.expected_condition,
                "failure_message": v.failure_message,
                "remediation": v.remediation,
                "evidence_region": v.evidence_region,
                "inspector_remarks": v.inspector_remarks
            }
            for v in violations
        ]
    }

@router.get("/{id}/fields")
def get_inspection_fields(id: str, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter((Inspection.id == id) | (Inspection.case_id == id)).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection case not found")
    
    fields = db.query(ExtractedField).filter(ExtractedField.inspection_id == insp.id).all()
    return {
        "case_id": insp.case_id,
        "fields": [
            {
                "id": f.id,
                "field_name": f.field_name,
                "detected_value": f.detected_value,
                "standardized_value": f.standardized_value,
                "confidence": f.confidence,
                "bbox": [f.bbox_x, f.bbox_y, f.bbox_w, f.bbox_h],
                "source_text": f.source_text,
                "status": f.status,
                "inspector_override": f.inspector_override,
                "override_value": f.override_value,
                "override_note": f.override_note
            }
            for f in fields
        ]
    }

@router.get("/{id}/compliance")
def get_inspection_compliance(id: str, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter((Inspection.id == id) | (Inspection.case_id == id)).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection case not found")
    
    fields = db.query(ExtractedField).filter(ExtractedField.inspection_id == insp.id).all()
    fields_dict = {
        f.field_name: {
            "value": f.override_value if f.inspector_override else f.detected_value,
            "confidence": f.confidence
        }
        for f in fields
    }
    
    is_imported = any("import" in (f.detected_value or "").lower() for f in fields)
    eval_res = rules_engine.evaluate(fields_dict, is_imported=is_imported)
    
    return {
        "case_id": insp.case_id,
        "compliance_score": insp.compliance_score,
        "risk_level": insp.risk_level,
        "status": insp.status,
        "evaluation": eval_res
    }
@router.patch("/{id}/fields/{field_name}")
def override_field(
    id: str,
    field_name: str,
    req: FieldOverrideRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    insp = db.query(Inspection).filter((Inspection.id == id) | (Inspection.case_id == id)).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    field = db.query(ExtractedField).filter(
        ExtractedField.inspection_id == insp.id,
        ExtractedField.field_name == field_name
    ).first()

    old_val = field.detected_value if field else "None"
    
    if not field:
        field = ExtractedField(
            inspection_id=insp.id,
            field_name=field_name,
            detected_value=req.override_value,
            confidence=1.0,
            status=req.new_status or "PASS",
            inspector_override=True,
            override_value=req.override_value,
            override_note=req.override_note
        )
        db.add(field)
    else:
        field.override_value = req.override_value
        field.override_note = req.override_note
        field.inspector_override = True
        field.detected_value = req.override_value
        field.confidence = 1.0
        field.status = req.new_status or "PASS"

    # Re-evaluate compliance score after field override
    all_fields = db.query(ExtractedField).filter(ExtractedField.inspection_id == insp.id).all()
    fields_dict = {
        f.field_name: {
            "value": f.override_value if f.inspector_override else f.detected_value,
            "confidence": f.confidence
        }
        for f in all_fields
    }
    eval_res = rules_engine.evaluate(fields_dict)
    insp.compliance_score = eval_res["compliance_index"]
    insp.risk_level = eval_res["risk_level"]

    # Cryptographic Audit Log
    user_id = current_user.id if current_user else "OFFICER"
    audit_chain.log_action(
        db=db,
        user_id=user_id,
        action="FIELD_VALUE_OVERRIDDEN",
        entity_type="FIELD",
        entity_id=field.id,
        case_id=insp.case_id,
        previous_value=f"{field_name}: {old_val}",
        new_value=f"{field_name}: {req.override_value} (Status: {field.status})"
    )

    db.commit()
    db.refresh(insp)

    return {
        "success": True,
        "field_name": field_name,
        "new_value": field.detected_value,
        "new_status": field.status,
        "updated_compliance_score": insp.compliance_score,
        "updated_risk_level": insp.risk_level
    }

@router.patch("/{id}/status")
def update_status(
    id: str,
    req: StatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    insp = db.query(Inspection).filter((Inspection.id == id) | (Inspection.case_id == id)).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    prev_status = insp.status
    insp.status = req.status
    if req.inspector_notes:
        insp.inspector_notes = req.inspector_notes

    # If marked compliant, enable QR verification
    if req.status in ["Confirmed", "Resolved"] and insp.compliance_score >= 80:
        insp.qr_generated = True

    user_id = current_user.id if current_user else "OFFICER"
    audit_chain.log_action(
        db=db,
        user_id=user_id,
        action="INSPECTION_STATUS_UPDATED",
        entity_type="INSPECTION",
        entity_id=insp.id,
        case_id=insp.case_id,
        previous_value=prev_status,
        new_value=f"{req.status}: {req.inspector_notes or ''}"
    )

    db.commit()
    db.refresh(insp)

    return {
        "success": True,
        "case_id": insp.case_id,
        "status": insp.status,
        "inspector_notes": insp.inspector_notes
    }

@router.post("/{id}/notice")
def generate_notice_draft(
    id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    insp = db.query(Inspection).filter((Inspection.id == id) | (Inspection.case_id == id)).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    violations = db.query(Violation).filter(Violation.inspection_id == insp.id).all()
    
    violation_lines = "\n".join([
        f"- {v.rule_code} ({v.field_name.upper()}): {v.failure_message}. Remediation: {v.remediation}"
        for v in violations
    ]) if violations else "No severe violations recorded."

    notice_text = f"""GOVERNMENT OF INDIA
DEPARTMENT OF CONSUMER AFFAIRS
LEGAL METROLOGY ENFORCEMENT DIVISION

SHOW CAUSE NOTICE DRAFT (UNDER RULE 6 OF LMPC RULES, 2011)
Case File Reference: {insp.case_id}
Date of Inspection: {insp.created_at.strftime('%d-%b-%Y') if insp.created_at else 'Current'}
Location: {insp.location_name}, {insp.district}

To:
The Principal Officer / Managing Director
{insp.manufacturer_cached}

Subject: Notice regarding statutory declaration non-compliance observed on packaged commodity: '{insp.product_name_cached}'

Sir/Madam,
During the compliance inspection conducted pursuant to Section 18 of the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011, the following deviations and statutory non-compliances were recorded:

OBSERVED CONTRAVENTIONS:
{violation_lines}

Computed MetroCheck Compliance Index: {insp.compliance_score} / 100 (Risk: {insp.risk_level})

You are hereby requested to submit your written explanation within fifteen (15) days of receipt of this notice, failing which appropriate proceedings under Section 36 of the Legal Metrology Act, 2009 may be initiated.

Authorized Legal Metrology Officer
District: {insp.district}

[IMPORTANT: This notice draft is generated for officer review only. Official issuance requires statutory verification and signature.]
"""

    insp.notice_draft = notice_text
    db.commit()

    return {
        "case_id": insp.case_id,
        "notice_draft": notice_text,
        "violations_count": len(violations)
    }
