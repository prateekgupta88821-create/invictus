import os
import uuid
import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from pydantic import BaseModel

from app.db.session import get_db
from app.db.models import Inspection, ExtractedField, Violation, Business, Product, User, Evidence
from app.api.auth import get_current_user
from app.ocr.provider import ocr_provider
from app.engine.rules_engine import rules_engine
from app.engine.tamper_detector import tamper_detector
from app.audit.chain import audit_chain
from app.core.config import settings

router = APIRouter(prefix="/scans", tags=["Scans & OCR Processing"])

class ScanRequest(BaseModel):
    demo_product_id: Optional[str] = None
    image_url: Optional[str] = None
    product_category: Optional[str] = "Food"
    is_imported: Optional[bool] = False
    location_name: Optional[str] = "Delhi Inspection Unit"
    district: Optional[str] = "South East Delhi"

@router.post("/analyze")
def analyze_scan(
    req: ScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Complete end-to-end Legal Metrology compliance pipeline:
    Image -> OCR / Structured Extraction -> Deterministic Rules Engine -> Compliance Score -> Violations -> Tamper Detection -> Case Record
    """
    # 1. OCR Extraction (via Provider / Demo)
    extraction_data = ocr_provider.extract_structured(
        image_path_or_url=req.image_url or (req.demo_product_id or "abc-biscuits"),
        demo_product_id=req.demo_product_id
    )

    fields_dict = extraction_data.get("fields", {})
    product_name = extraction_data.get("product_name", "Packaged Commodity")
    manufacturer = fields_dict.get("manufacturer", {}).get("value") or "Manufacturer"
    category = extraction_data.get("category", req.product_category)
    is_imported = extraction_data.get("is_imported", req.is_imported)

    # 2. Deterministic Legal Metrology Rule Engine Evaluation
    eval_result = rules_engine.evaluate(
        fields=fields_dict,
        product_category=category,
        is_imported=is_imported
    )

    # 3. Tamper / Anomaly Analysis
    tamper_result = tamper_detector.analyze(
        image_data={"filename": req.image_url or req.demo_product_id, "label_id": req.demo_product_id},
        extracted_fields=fields_dict
    )

    # 4. Generate Case ID
    count = db.query(Inspection).count()
    case_id = f"MC-2026-{1100 + count:05d}"

    # Find or link default business
    biz = db.query(Business).filter(Business.name.ilike(f"%{manufacturer[:15]}%")).first()
    if not biz:
        biz = db.query(Business).first()

    # Find or create product
    prod = db.query(Product).filter(Product.product_name == product_name).first()
    if not prod and biz:
        prod = Product(
            business_id=biz.id,
            brand_name=extraction_data.get("brand_name", "Brand"),
            product_name=product_name,
            common_name=extraction_data.get("common_name", "Commodity"),
            category=category,
            is_imported=is_imported
        )
        db.add(prod)
        db.flush()

    inspector_id = current_user.id if current_user else None

    # 5. Persist Inspection Record
    inspection = Inspection(
        case_id=case_id,
        product_id=prod.id if prod else None,
        business_id=biz.id if biz else None,
        inspector_id=inspector_id,
        product_name_cached=product_name,
        manufacturer_cached=manufacturer,
        scan_image_url=extraction_data.get("image_url", "/demo/abc_biscuits.svg"),
        image_quality=extraction_data.get("image_quality", "GOOD"),
        image_quality_score=extraction_data.get("image_quality_score", 94.0),
        status="Under Review",
        compliance_score=eval_result["compliance_index"],
        risk_level=eval_result["risk_level"],
        inspector_notes="Automated scan processed. Ready for Legal Metrology Officer review.",
        latitude=28.6139 + random.uniform(-0.02, 0.02),
        longitude=77.2090 + random.uniform(-0.02, 0.02),
        location_name=req.location_name,
        district=req.district,
        verification_id=case_id,
        qr_generated=(eval_result["compliance_index"] >= 80),
        is_demo=(req.demo_product_id is not None)
    )
    db.add(inspection)
    db.flush()

    # 6. Persist Extracted Fields
    saved_fields = []
    for fname, fdata in fields_dict.items():
        bbox = fdata.get("bbox", [0, 0, 0, 0])
        f_record = ExtractedField(
            inspection_id=inspection.id,
            field_name=fname,
            detected_value=str(fdata.get("value")) if fdata.get("value") is not None else None,
            confidence=float(fdata.get("confidence", 0.0)),
            bbox_x=float(bbox[0]),
            bbox_y=float(bbox[1]),
            bbox_w=float(bbox[2]),
            bbox_h=float(bbox[3]),
            source_text=fdata.get("source_text", ""),
            status=fdata.get("status", "PASS")
        )
        db.add(f_record)
        saved_fields.append(f_record)

    # 7. Persist Violations
    saved_violations = []
    for v in eval_result["violations"]:
        v_record = Violation(
            inspection_id=inspection.id,
            rule_code=v["rule_code"],
            field_name=v["field_name"],
            severity=v["severity"],
            status="DETECTED",
            detected_value=v["detected_value"],
            expected_condition=v["expected_condition"],
            failure_message=v["failure_message"],
            remediation=v["remediation"],
            evidence_region=v["evidence_region"]
        )
        db.add(v_record)
        saved_violations.append(v_record)

    # 8. Cryptographic Audit Chain Log
    audit_log = audit_chain.log_action(
        db=db,
        user_id=inspector_id or "ANONYMOUS_SCANNER",
        action="SCAN_ANALYSIS_COMPLETED",
        entity_type="INSPECTION",
        entity_id=inspection.id,
        case_id=case_id,
        new_value=f"Score: {eval_result['compliance_index']}, Violations: {len(eval_result['violations'])}"
    )

    db.commit()
    db.refresh(inspection)

    return {
        "inspection_id": inspection.id,
        "case_id": case_id,
        "product_name": product_name,
        "manufacturer": manufacturer,
        "image_url": inspection.scan_image_url,
        "image_quality": inspection.image_quality,
        "image_quality_score": inspection.image_quality_score,
        "compliance_index": eval_result["compliance_index"],
        "risk_level": eval_result["risk_level"],
        "evaluations": eval_result["evaluations"],
        "violations": eval_result["violations"],
        "tamper_analysis": tamper_result,
        "raw_ocr_text": extraction_data.get("ocr_raw_text", ""),
        "extracted_fields": {
            k: {
                "value": v.get("value"),
                "confidence": v.get("confidence"),
                "bbox": v.get("bbox"),
                "source_text": v.get("source_text"),
                "status": v.get("status")
            }
            for k, v in fields_dict.items()
        },
        "audit_hash": audit_log.record_hash
    }

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Accepts file upload and saves locally or into upload storage.
    """
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = settings.UPLOAD_PATH / filename
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    
    return {
        "filename": filename,
        "url": f"/uploads/{filename}",
        "size_bytes": len(contents),
        "content_type": file.content_type
    }
