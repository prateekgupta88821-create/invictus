import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone

from app.db.session import get_db
from app.db.models import QRVerification, Inspection, Grievance

router = APIRouter(prefix="/qr", tags=["QR Verification & Consumer Grievances"])

class GrievanceCreateRequest(BaseModel):
    consumer_name: str
    consumer_phone: str
    consumer_email: Optional[str] = None
    product_name: str
    manufacturer: Optional[str] = None
    store_name: Optional[str] = None
    store_location: Optional[str] = None
    violation_type: str
    description: str

@router.get("/{verification_id}")
def verify_qr(verification_id: str, db: Session = Depends(get_db)):
    """
    Public QR Verification Endpoint.
    Never exposes sensitive officer credentials or internal notes.
    """
    # Look up by verification_id or case_id
    qr = db.query(QRVerification).filter(QRVerification.verification_id == verification_id).first()
    insp = None
    if not qr:
        insp = db.query(Inspection).filter(
            (Inspection.verification_id == verification_id) | (Inspection.case_id == verification_id)
        ).first()
        if not insp:
            raise HTTPException(status_code=404, detail="No official Legal Metrology verification record found for this code.")
        
        prod_name = insp.product_name_cached
        manuf_name = insp.manufacturer_cached
        score = insp.compliance_score
        v_date = insp.created_at
        status = "COMPLIANT" if score >= 80 else ("UNDER_REVIEW" if insp.status == "Under Review" else "NON_COMPLIANT")
    else:
        qr.view_count += 1
        db.commit()
        prod_name = qr.product_name
        manuf_name = qr.manufacturer_name
        score = qr.compliance_score
        v_date = qr.verification_date
        status = qr.status

    return {
        "verified": True,
        "verification_id": verification_id,
        "product_name": prod_name,
        "manufacturer": manuf_name,
        "compliance_index": score,
        "status": status,
        "verified_on": v_date.strftime("%d %b %Y") if v_date else "05 Sep 2026",
        "jurisdiction": "Government of India - Department of Consumer Affairs",
        "legal_basis": "Legal Metrology (Packaged Commodities) Rules, 2011",
        "badge_level": "Gold Standard Compliance" if score >= 90 else ("Compliant" if score >= 80 else "Advisory Attention Required"),
        "disclaimer": "Verification is based on the official inspection record recorded in MetroCheck. Consumer discretion is advised."
    }

@router.post("/grievances")
def submit_grievance(req: GrievanceCreateRequest, db: Session = Depends(get_db)):
    gr_num = f"GR-2026-{uuid.uuid4().hex[:6].upper()}"
    g = Grievance(
        grievance_number=gr_num,
        consumer_name=req.consumer_name,
        consumer_phone=req.consumer_phone,
        consumer_email=req.consumer_email,
        product_name=req.product_name,
        manufacturer=req.manufacturer,
        store_name=req.store_name,
        store_location=req.store_location,
        violation_type=req.violation_type,
        description=req.description,
        status="SUBMITTED"
    )
    db.add(g)
    db.commit()

    return {
        "success": True,
        "grievance_number": gr_num,
        "message": "Your grievance has been lodged with the Legal Metrology Division. An officer will inspect the reported commodity."
    }
