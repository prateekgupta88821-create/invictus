import pytest
from app.engine.rules_engine import rules_engine
from app.ocr.demo_dataset import DEMO_PRODUCTS

def test_rules_engine_loads_rules():
    assert len(rules_engine.rules) >= 8
    rule_codes = [r["rule_code"] for r in rules_engine.rules]
    assert "LM_MRP_001" in rule_codes
    assert "LM_NETQTY_001" in rule_codes
    assert "LM_MANUF_001" in rule_codes

def test_evaluate_compliant_product():
    abc_fields = DEMO_PRODUCTS["abc-biscuits"]["fields"]
    result = rules_engine.evaluate(abc_fields, product_category="Food", is_imported=False)
    
    assert result["compliance_index"] >= 85.0
    assert result["risk_level"] == "LOW"
    assert result["passed_count"] >= 7
    assert len(result["violations"]) <= 1

def test_evaluate_missing_mrp():
    sample_fields = {
        "manufacturer": {"value": "Test Mills Ltd", "confidence": 0.95},
        "net_quantity": {"value": "500", "confidence": 0.95},
        "unit": {"value": "g", "confidence": 0.95},
        "manufacturing_date": {"value": "08/2026", "confidence": 0.95},
        # Missing MRP
    }
    result = rules_engine.evaluate(sample_fields)
    
    assert result["compliance_index"] < 80.0
    violation_fields = [v["field_name"] for v in result["violations"]]
    assert "mrp" in violation_fields

def test_evaluate_low_confidence_triggers_verify():
    sample_fields = {
        "manufacturer": {"value": "Test Mills Ltd", "confidence": 0.95},
        "net_quantity": {"value": "500", "confidence": 0.95},
        "unit": {"value": "g", "confidence": 0.95},
        "manufacturing_date": {"value": "08/2026", "confidence": 0.95},
        "mrp": {"value": "₹ 120", "confidence": 0.40}, # Under threshold
    }
    result = rules_engine.evaluate(sample_fields)
    mrp_eval = next((e for e in result["evaluations"] if e["field"] == "mrp"), None)
    assert mrp_eval is not None
    assert mrp_eval["status"] == "VERIFY"

def test_imported_goods_requires_country_of_origin():
    sample_fields = {
        "manufacturer": {"value": "Choco AG", "confidence": 0.95},
        "net_quantity": {"value": "100", "confidence": 0.95},
        "unit": {"value": "g", "confidence": 0.95},
        "mrp": {"value": "₹ 250", "confidence": 0.95},
        "importer": {"value": "Global Traders", "confidence": 0.90}
        # missing country_of_origin
    }
    result = rules_engine.evaluate(sample_fields, is_imported=True)
    v_codes = [v["rule_code"] for v in result["violations"]]
    assert "LM_IMP_COO_001" in v_codes
