from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from app.db.session import get_db
from app.db.models import Business, Inspection, Product

router = APIRouter(prefix="/businesses", tags=["Businesses & Repeat Offenders"])

@router.get("")
def list_businesses(
    risk_tier: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Business)
    if risk_tier:
        query = query.filter(Business.risk_tier == risk_tier)
    if search:
        query = query.filter(
            (Business.name.ilike(f"%{search}%")) |
            (Business.trade_name.ilike(f"%{search}%")) |
            (Business.district.ilike(f"%{search}%"))
        )
    
    businesses = query.order_by(Business.risk_score.desc()).limit(limit).all()
    return [
        {
            "id": b.id,
            "name": b.name,
            "trade_name": b.trade_name,
            "registration_number": b.registration_number,
            "address": b.address,
            "district": b.district,
            "state": b.state,
            "pin_code": b.pin_code,
            "risk_score": b.risk_score,
            "risk_tier": b.risk_tier,
            "repeat_violations_count": b.repeat_violations_count,
            "total_inspections": b.total_inspections,
            "products_count": len(b.products)
        }
        for b in businesses
    ]

@router.get("/{id}")
def get_business(id: str, db: Session = Depends(get_db)):
    biz = db.query(Business).filter(Business.id == id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    
    inspections = db.query(Inspection).filter(Inspection.business_id == biz.id).order_by(Inspection.created_at.desc()).all()
    products = db.query(Product).filter(Product.business_id == biz.id).all()

    return {
        "id": biz.id,
        "name": biz.name,
        "trade_name": biz.trade_name,
        "registration_number": biz.registration_number,
        "address": biz.address,
        "district": biz.district,
        "state": biz.state,
        "pin_code": biz.pin_code,
        "risk_score": biz.risk_score,
        "risk_tier": biz.risk_tier,
        "repeat_violations_count": biz.repeat_violations_count,
        "total_inspections": biz.total_inspections,
        "products": [
            {"id": p.id, "name": p.product_name, "category": p.category, "mrp": p.declared_mrp}
            for p in products
        ],
        "inspections": [
            {
                "case_id": i.case_id,
                "product_name": i.product_name_cached,
                "score": i.compliance_score,
                "risk": i.risk_level,
                "status": i.status,
                "date": i.created_at.strftime("%d-%b-%Y") if i.created_at else None
            }
            for i in inspections
        ]
    }
