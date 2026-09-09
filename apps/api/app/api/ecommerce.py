from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.engine.rules_engine import rules_engine

router = APIRouter(prefix="/ecommerce", tags=["E-Commerce Marketplace Compliance"])

class EcommerceScanRequest(BaseModel):
    url: str
    marketplace: Optional[str] = "Generic Marketplace"

@router.post("/analyze")
def analyze_ecommerce_listing(req: EcommerceScanRequest):
    """
    E-commerce Compliance Checker under Legal Metrology Rule 6(10) / E-commerce Rules 2017.
    Evaluates online product listings for mandatory digital pre-purchase declarations.
    Safe mock analysis pipeline.
    """
    url_lower = req.url.lower()

    # Determine simulated marketplace listing
    if "flipkart" in url_lower or "fk" in url_lower:
        marketplace = "Flipkart"
        product_title = "Organic Whole Cashews 500g Pack"
        detected_fields = {
            "mrp": {"value": "₹ 499.00 (Incl. of all taxes)", "confidence": 0.96},
            "net_quantity": {"value": "500", "confidence": 0.95},
            "unit": {"value": "g", "confidence": 0.95},
            "manufacturer": {"value": "Konkan Nut Products Pvt Ltd", "confidence": 0.90},
            "address": {"value": "Ratnagiri, Maharashtra - 415612", "confidence": 0.88},
            "country_of_origin": {"value": "India", "confidence": 0.97},
            "consumer_care_phone": {"value": "1800-444-2211", "confidence": 0.92}
        }
        missing_declarations = ["Unit Sale Price (₹/g)"]
    elif "blinkit" in url_lower or "zepto" in url_lower:
        marketplace = "Quick Commerce"
        product_title = "Farm Fresh Salted Butter 100g"
        detected_fields = {
            "mrp": {"value": "₹ 58.00", "confidence": 0.94},
            "net_quantity": {"value": "100", "confidence": 0.95},
            "unit": {"value": "g", "confidence": 0.95},
            "manufacturer": {"value": "Dairy Union Cooperative", "confidence": 0.91},
            "manufacturing_date": {"value": "08/2026", "confidence": 0.89}
        }
        missing_declarations = ["Country of Origin", "Consumer Grievance Email"]
    else:
        marketplace = "E-Commerce Portal"
        product_title = "Premium Imported Swiss Dark Chocolate 100g"
        detected_fields = {
            "mrp": {"value": "₹ 320.00", "confidence": 0.95},
            "net_quantity": {"value": "100", "confidence": 0.95},
            "unit": {"value": "g", "confidence": 0.95},
            "manufacturer": {"value": "Chocolatier Alps SA", "confidence": 0.89},
            "consumer_care_phone": {"value": "+91-22-67890123", "confidence": 0.87}
        }
        missing_declarations = ["Country of Origin (Mandatory for imported items)", "Indian Importer Address"]

    eval_res = rules_engine.evaluate(detected_fields, is_imported=("imported" in product_title.lower()))

    return {
        "url": req.url,
        "marketplace": marketplace,
        "product_title": product_title,
        "compliance_index": eval_res["compliance_index"],
        "risk_level": eval_res["risk_level"],
        "detected_declarations": [
            {"field": k.replace("_", " ").title(), "value": v["value"], "confidence": f"{int(v['confidence']*100)}%"}
            for k, v in detected_fields.items()
        ],
        "missing_declarations": missing_declarations,
        "evaluations": eval_res["evaluations"],
        "disclaimer": "Demo listing analysis under Legal Metrology E-Commerce Rules 2017. For demonstration purposes."
    }
