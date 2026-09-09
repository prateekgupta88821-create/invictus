import re
import json
from pathlib import Path
from typing import Dict, Any, List, Tuple
from app.core.config import settings

class RuleEngine:
    def __init__(self, rules_dir: Path = settings.RULES_PATH):
        self.rules_dir = rules_dir
        self.rules: List[Dict[str, Any]] = []
        self.load_rules()

    def load_rules(self):
        self.rules = []
        rule_files = ["core_rules.json", "food_rules.json", "imported_rules.json"]
        
        for rf in rule_files:
            file_path = self.rules_dir / rf
            if file_path.exists():
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        category = "core" if "core" in rf else ("food" if "food" in rf else "imported")
                        for r in data.get("rules", []):
                            r["category"] = category
                            r["version"] = data.get("version", "LMPC-2011-v1.0")
                            self.rules.append(r)
                except Exception as e:
                    print(f"Error loading rule file {rf}: {e}")
        
        # Fallback inline if files not found
        if not self.rules:
            self._load_default_fallback_rules()

    def _load_default_fallback_rules(self):
        self.rules = [
            {
                "id": "LM_MANUF_001", "rule_code": "LM_MANUF_001", "name": "Manufacturer Identity",
                "field": "manufacturer", "required": True, "severity": "critical", "condition": "exists_and_not_blank",
                "weight": 15, "confidence_threshold": 0.65, "active": True,
                "failure_message": "Manufacturer name missing", "remediation": "Print complete legal name."
            },
            {
                "id": "LM_NETQTY_001", "rule_code": "LM_NETQTY_001", "name": "Net Quantity",
                "field": "net_quantity", "required": True, "severity": "critical", "condition": "exists_numeric",
                "weight": 15, "confidence_threshold": 0.70, "active": True,
                "failure_message": "Net quantity not numeric or missing", "remediation": "Print net quantity with valid unit."
            },
            {
                "id": "LM_MRP_001", "rule_code": "LM_MRP_001", "name": "MRP Declaration",
                "field": "mrp", "required": True, "severity": "critical", "condition": "valid_mrp_syntax",
                "weight": 15, "confidence_threshold": 0.75, "active": True,
                "failure_message": "MRP declaration invalid", "remediation": "Print MRP incl. of all taxes."
            }
        ]

    def evaluate(self, fields: Dict[str, Dict[str, Any]], product_category: str = "Food", is_imported: bool = False) -> Dict[str, Any]:
        """
        Deterministic evaluation of structured fields against configured rules.
        """
        evaluations = []
        violations = []
        total_possible_weight = 0.0
        earned_weight = 0.0

        for rule in self.rules:
            if not rule.get("active", True):
                continue
            
            # Filter non-applicable categories
            category = rule.get("category", "core")
            if category == "imported" and not is_imported:
                evaluations.append({
                    "rule_code": rule["rule_code"],
                    "name": rule["name"],
                    "field": rule["field"],
                    "status": "NOT_APPLICABLE",
                    "severity": rule["severity"],
                    "message": "Applies only to imported commodities."
                })
                continue
            
            if category == "food" and product_category.lower() not in ["food", "beverages", "confectionery", "grocery"]:
                evaluations.append({
                    "rule_code": rule["rule_code"],
                    "name": rule["name"],
                    "field": rule["field"],
                    "status": "NOT_APPLICABLE",
                    "severity": rule["severity"],
                    "message": "Applies to food commodities."
                })
                continue

            field_name = rule["field"]
            target_field = fields.get(field_name, {})
            val = target_field.get("value") or target_field.get("detected_value")
            confidence = float(target_field.get("confidence", 0.0))
            
            # Check alternative fields if main field missing
            alt_fields = rule.get("alternative_fields", [])
            if not val and alt_fields:
                for alt in alt_fields:
                    alt_data = fields.get(alt, {})
                    alt_val = alt_data.get("value") or alt_data.get("detected_value")
                    if alt_val:
                        val = alt_val
                        confidence = float(alt_data.get("confidence", 0.0))
                        target_field = alt_data
                        break

            weight = float(rule.get("weight", 10.0))
            total_possible_weight += weight
            
            status, reason = self._check_condition(rule, val, confidence, fields)

            if status == "PASS":
                earned_weight += weight
            elif status == "VERIFY":
                earned_weight += (weight * 0.5) # partial credit for verify
                violations.append({
                    "rule_code": rule["rule_code"],
                    "field_name": field_name,
                    "severity": rule.get("severity", "moderate"),
                    "status": "DETECTED",
                    "detected_value": str(val) if val is not None else "Not Detected",
                    "expected_condition": rule.get("condition"),
                    "failure_message": reason or rule.get("failure_message", "Manual verification required."),
                    "remediation": rule.get("remediation", "Inspect physical pack directly."),
                    "evidence_region": f"Region {field_name.upper()}"
                })
            elif status == "FAIL":
                violations.append({
                    "rule_code": rule["rule_code"],
                    "field_name": field_name,
                    "severity": rule.get("severity", "major"),
                    "status": "DETECTED",
                    "detected_value": str(val) if val is not None else "Not Detected",
                    "expected_condition": rule.get("condition"),
                    "failure_message": reason or rule.get("failure_message", "Rule condition failed."),
                    "remediation": rule.get("remediation", "Correct declaration on label."),
                    "evidence_region": f"Region {field_name.upper()}"
                })

            evaluations.append({
                "rule_code": rule["rule_code"],
                "name": rule["name"],
                "field": field_name,
                "status": status,
                "severity": rule.get("severity", "major"),
                "detected_value": str(val) if val is not None else None,
                "confidence": confidence,
                "message": reason or ("Declaration verified compliant." if status == "PASS" else "Action required.")
            })

        # Calculate Compliance Index (0 - 100)
        compliance_index = round((earned_weight / total_possible_weight * 100), 1) if total_possible_weight > 0 else 100.0

        # Determine Risk Level
        if compliance_index >= 80:
            risk_level = "LOW"
        elif compliance_index >= 60:
            risk_level = "MEDIUM"
        elif compliance_index >= 40:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"

        return {
            "compliance_index": compliance_index,
            "risk_level": risk_level,
            "evaluations": evaluations,
            "violations": violations,
            "total_rules_checked": len(evaluations),
            "passed_count": sum(1 for e in evaluations if e["status"] == "PASS"),
            "verify_count": sum(1 for e in evaluations if e["status"] == "VERIFY"),
            "fail_count": sum(1 for e in evaluations if e["status"] == "FAIL"),
            "not_applicable_count": sum(1 for e in evaluations if e["status"] == "NOT_APPLICABLE"),
        }

    def _check_condition(self, rule: Dict[str, Any], val: Any, confidence: float, all_fields: Dict[str, Any]) -> Tuple[str, str]:
        condition = rule.get("condition")
        conf_threshold = rule.get("confidence_threshold", 0.65)
        required = rule.get("required", True)
        
        # If value is absent
        if val is None or str(val).strip() == "":
            if required:
                return "FAIL", rule.get("failure_message", "Mandatory declaration missing.")
            else:
                return "NOT_APPLICABLE", "Optional field not provided."

        str_val = str(val).strip()

        # Confidence verification check
        if confidence < conf_threshold:
            return "VERIFY", f"Detected declaration '{str_val[:30]}' has confidence ({int(confidence*100)}%) below threshold ({int(conf_threshold*100)}%). Manual inspection needed."

        # Specific deterministic rules
        if condition == "exists_and_not_blank":
            return ("PASS", "Valid") if len(str_val) > 0 else ("FAIL", "Field is blank.")

        elif condition == "exists_with_min_length":
            min_len = rule.get("params", {}).get("min_length", 8)
            if len(str_val) >= min_len:
                return "PASS", "Valid address"
            return "VERIFY", f"Address appears too brief ({len(str_val)} chars, expected >= {min_len})."

        elif condition == "exists_numeric":
            # Extract number
            match = re.search(r"\d+(\.\d+)?", str_val)
            if match:
                return "PASS", "Valid numeric quantity."
            return "FAIL", "Could not extract numeric quantity."

        elif condition == "valid_unit_symbol":
            allowed = [u.lower() for u in rule.get("params", {}).get("allowed_units", ["g", "kg", "ml", "l", "m", "units", "n"])]
            clean_unit = str_val.lower().replace(".", "").strip()
            if any(u in clean_unit for u in allowed):
                return "PASS", f"Valid unit '{str_val}'."
            return "FAIL", f"Unit '{str_val}' is not a recognized Legal Metrology standard unit."

        elif condition == "valid_month_year_format":
            # Matches MM/YYYY, MM-YYYY, MMM YYYY, etc.
            date_pattern = r"(0[1-9]|1[0-2]|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[-/\s]+(\d{4}|\d{2})"
            if re.search(date_pattern, str_val, re.IGNORECASE):
                return "PASS", "Standard date format verified."
            return "VERIFY", f"Date '{str_val}' not in clear MM/YYYY or Month Year format."

        elif condition == "valid_mrp_syntax":
            # Check for currency symbol or keyword 'mrp' or 'rs' or '₹'
            has_currency = any(x in str_val.lower() for x in ["₹", "rs", "inr", "mrp"])
            has_digits = bool(re.search(r"\d+", str_val))
            if has_currency and has_digits:
                return "PASS", "Valid MRP declaration."
            elif has_digits:
                return "VERIFY", f"Price '{str_val}' detected but currency symbol or 'incl. of taxes' needs verification."
            return "FAIL", "MRP format missing or invalid."

        elif condition == "valid_usp_syntax":
            # Unit sale price check
            if re.search(r"(per|\/)\s*(g|kg|ml|l|unit|piece)", str_val, re.IGNORECASE):
                return "PASS", "Unit sale price declared with valid unit."
            return "VERIFY", f"Unit sale price '{str_val}' lacks standard per unit representation."

        elif condition == "exists_phone_or_email":
            has_phone = bool(re.search(r"(\+?\d{1,4}[-.\s]?)?(\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4}|1800[-.\s]?\d{3}[-.\s]?\d{3,4})", str_val))
            has_email = bool(re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", str_val))
            if has_phone or has_email:
                return "PASS", "Valid consumer contact detected."
            return "VERIFY", f"Consumer care contact '{str_val}' could not be verified as valid phone or email."

        return "PASS", "Declaration verified."

# Singleton instance
rules_engine = RuleEngine()
