from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from app.db.session import get_db
from app.db.models import Rule, RuleVersion
from app.engine.rules_engine import rules_engine

router = APIRouter(prefix="/rules", tags=["Legal Metrology Rules Engine Configuration"])

class RuleUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    active: Optional[bool] = None
    severity: Optional[str] = None
    weight: Optional[float] = None
    confidence_threshold: Optional[float] = None

@router.get("")
def list_rules(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Rule)
    if category:
        query = query.filter(Rule.category == category)
    rules = query.all()

    if not rules:
        # Return in-memory rules from engine
        return [
            {
                "id": r["id"],
                "rule_code": r["rule_code"],
                "name": r["name"],
                "description": r.get("description", ""),
                "field": r["field"],
                "category": r.get("category", "core"),
                "severity": r.get("severity", "major"),
                "condition": r.get("condition"),
                "weight": r.get("weight", 10.0),
                "confidence_threshold": r.get("confidence_threshold", 0.65),
                "active": r.get("active", True),
                "version": r.get("version", "LMPC-2011-v1.0")
            }
            for r in rules_engine.rules
        ]

    return [
        {
            "id": r.id,
            "rule_code": r.rule_code,
            "name": r.name,
            "description": r.description,
            "field": r.field,
            "category": r.category,
            "severity": r.severity,
            "condition": r.condition,
            "weight": r.weight,
            "confidence_threshold": r.confidence_threshold,
            "active": r.active,
            "version": r.version
        }
        for r in rules
    ]

@router.get("/versions")
def list_rule_versions(db: Session = Depends(get_db)):
    versions = db.query(RuleVersion).all()
    if not versions:
        return [{
            "version_code": "LMPC-2011-v1.0",
            "title": "Legal Metrology (Packaged Commodities) Rules, 2011 (As Amended)",
            "description": "Standard national compliance rules for packaged commodities under Rule 6.",
            "statute_reference": "The Legal Metrology Act, 2009",
            "is_active": True,
            "rules_count": len(rules_engine.rules)
        }]
    return versions

@router.patch("/{rule_code}")
def update_rule(rule_code: str, req: RuleUpdateRequest, db: Session = Depends(get_db)):
    rule = db.query(Rule).filter(Rule.rule_code == rule_code).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    if req.name is not None:
        rule.name = req.name
    if req.description is not None:
        rule.description = req.description
    if req.active is not None:
        rule.active = req.active
    if req.severity is not None:
        rule.severity = req.severity
    if req.weight is not None:
        rule.weight = req.weight
    if req.confidence_threshold is not None:
        rule.confidence_threshold = req.confidence_threshold

    db.commit()
    db.refresh(rule)

    # Reload memory rules in engine
    rules_engine.load_rules()

    return {
        "success": True,
        "rule_code": rule.rule_code,
        "active": rule.active,
        "weight": rule.weight,
        "confidence_threshold": rule.confidence_threshold
    }
