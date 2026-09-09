from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.engine.rules_engine import rules_engine

router = APIRouter(prefix="/compliance", tags=["Compliance Checking Engine"])

class DirectComplianceCheckRequest(BaseModel):
    fields: Dict[str, Dict[str, Any]]
    product_category: Optional[str] = "Food"
    is_imported: Optional[bool] = False

@router.post("/check")
def direct_compliance_check(req: DirectComplianceCheckRequest):
    """
    Direct stateless rule check against user-submitted or manufacturer-edited label fields.
    """
    result = rules_engine.evaluate(
        fields=req.fields,
        product_category=req.product_category,
        is_imported=req.is_imported
    )
    return result
