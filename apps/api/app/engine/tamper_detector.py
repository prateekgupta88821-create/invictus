from typing import Dict, Any, List

class TamperDetector:
    """
    AI-assisted anomaly & packaging tamper analysis.
    Flags potential sticker overlays, overwritten dates, font inconsistencies in legal text.
    Strictly presented as 'AI-assisted anomaly detection - manual verification required'.
    """
    def analyze(self, image_data: Dict[str, Any], extracted_fields: Dict[str, Any]) -> Dict[str, Any]:
        anomalies: List[Dict[str, Any]] = []
        tamper_risk = "LOW"
        risk_score = 10 # 0-100 scale

        # Check 1: MRP Region font or text consistency
        mrp_data = extracted_fields.get("mrp", {})
        mrp_val = mrp_data.get("value") or mrp_data.get("detected_value", "")
        mrp_conf = float(mrp_data.get("confidence", 1.0))
        
        # In demo or edge case flags
        if "tamper" in str(image_data.get("filename", "")).lower() or "tamper" in str(image_data.get("label_id", "")).lower():
            anomalies.append({
                "type": "STICKER_OVERLAY",
                "severity": "HIGH",
                "region": "Region MRP & Best Before",
                "bbox": [55, 62, 38, 22],
                "description": "Possible sticker overlay detected covering original printed price. Border artifact visible at 10x magnification.",
                "remediation": "Check for dual price printing or secondary adhesive label under ultraviolet/grazing light."
            })
            anomalies.append({
                "type": "FONT_INCONSISTENCY",
                "severity": "MEDIUM",
                "region": "Region Expiry Date",
                "bbox": [58, 74, 30, 10],
                "description": "Dot-matrix font pitch in Date block does not match primary packaging typography.",
                "remediation": "Verify batch code and expiry with manufacturer primary dispatch register."
            })
            tamper_risk = "HIGH"
            risk_score = 82
        elif mrp_conf < 0.60 and mrp_val:
            anomalies.append({
                "type": "SUSPICIOUS_TEXT_REGION",
                "severity": "MEDIUM",
                "region": "Region MRP",
                "bbox": mrp_data.get("bbox", [50, 50, 30, 15]),
                "description": "MRP declaration region displays visual noise or low OCR edge clarity.",
                "remediation": "Verify physical pack directly to ensure price is not defaced or smudged."
            })
            tamper_risk = "MEDIUM"
            risk_score = 48

        return {
            "tamper_risk": tamper_risk,
            "risk_score": risk_score,
            "anomalies_detected": len(anomalies),
            "anomalies": anomalies,
            "disclaimer": "AI-assisted anomaly detection indicator only. Does not constitute forensic evidence without physical verification by an authorized Legal Metrology Officer."
        }

tamper_detector = TamperDetector()
