from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Inspection, ExtractedField, Violation, AuditLog, User
from app.reports.generator import report_generator

router = APIRouter(prefix="/reports", tags=["Inspection Reports"])

@router.get("/{id}/html")
def get_report_html(id: str, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter((Inspection.id == id) | (Inspection.case_id == id)).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    fields = db.query(ExtractedField).filter(ExtractedField.inspection_id == insp.id).all()
    violations = db.query(Violation).filter(Violation.inspection_id == insp.id).all()
    inspector = insp.inspector or db.query(User).filter(User.role == "OFFICER").first()
    
    last_audit = db.query(AuditLog).filter(AuditLog.case_id == insp.case_id).order_by(AuditLog.sequence_num.desc()).first()
    audit_hash = last_audit.record_hash if last_audit else "00000000000000000000000000000000"

    report_data = {
        "case": {
            "case_id": insp.case_id,
            "product_name": insp.product_name_cached,
            "manufacturer": insp.manufacturer_cached,
            "compliance_score": insp.compliance_score,
            "risk_level": insp.risk_level,
            "status": insp.status,
            "location_name": insp.location_name,
            "district": insp.district,
            "created_at": insp.created_at.strftime("%d-%b-%Y %H:%M") if insp.created_at else None,
            "inspector_notes": insp.inspector_notes
        },
        "inspector": {
            "full_name": inspector.full_name if inspector else "Legal Metrology Officer",
            "badge_number": inspector.badge_number if inspector else "LMO-DL-2026-084"
        },
        "fields": [
            {
                "field_name": f.field_name,
                "detected_value": f.detected_value,
                "confidence": f.confidence,
                "status": f.status
            }
            for f in fields
        ],
        "violations": [
            {
                "rule_code": v.rule_code,
                "field_name": v.field_name,
                "severity": v.severity,
                "failure_message": v.failure_message,
                "remediation": v.remediation
            }
            for v in violations
        ],
        "audit_hash": audit_hash
    }

    html_content = report_generator.generate_html(report_data)
    return Response(content=html_content, media_type="text/html")

@router.get("/{id}/pdf")
def get_report_pdf(id: str, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter((Inspection.id == id) | (Inspection.case_id == id)).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    fields = db.query(ExtractedField).filter(ExtractedField.inspection_id == insp.id).all()
    violations = db.query(Violation).filter(Violation.inspection_id == insp.id).all()
    inspector = insp.inspector or db.query(User).filter(User.role == "OFFICER").first()
    
    last_audit = db.query(AuditLog).filter(AuditLog.case_id == insp.case_id).order_by(AuditLog.sequence_num.desc()).first()
    audit_hash = last_audit.record_hash if last_audit else "00000000000000000000000000000000"

    report_data = {
        "case": {
            "case_id": insp.case_id,
            "product_name": insp.product_name_cached,
            "manufacturer": insp.manufacturer_cached,
            "compliance_score": insp.compliance_score,
            "risk_level": insp.risk_level,
            "status": insp.status,
            "location_name": insp.location_name,
            "district": insp.district,
            "created_at": insp.created_at.strftime("%d-%b-%Y") if insp.created_at else None,
            "inspector_notes": insp.inspector_notes
        },
        "inspector": {
            "full_name": inspector.full_name if inspector else "Legal Metrology Officer",
            "badge_number": inspector.badge_number if inspector else "LMO-DL-2026-084"
        },
        "fields": [
            {
                "field_name": f.field_name,
                "detected_value": f.detected_value,
                "confidence": f.confidence,
                "status": f.status
            }
            for f in fields
        ],
        "violations": [
            {
                "rule_code": v.rule_code,
                "field_name": v.field_name,
                "severity": v.severity,
                "failure_message": v.failure_message,
                "remediation": v.remediation
            }
            for v in violations
        ],
        "audit_hash": audit_hash
    }

    pdf_bytes = report_generator.generate_pdf(report_data)
    headers = {
        "Content-Disposition": f'attachment; filename="MetroCheck_Report_{insp.case_id}.pdf"'
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
