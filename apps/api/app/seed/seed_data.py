import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.db.models import User, Business, Product, Inspection, ExtractedField, Violation, Rule, RuleVersion, QRVerification
from app.audit.chain import audit_chain
from app.engine.rules_engine import rules_engine
from app.ocr.demo_dataset import DEMO_PRODUCTS

DEMO_USERS = [
    {
        "username": "officer_sharma",
        "email": "officer@metrocheck.gov.in",
        "password": "officer123",
        "full_name": "R. K. Sharma",
        "role": "OFFICER",
        "badge_number": "LMO-DL-2026-084",
        "department": "Department of Legal Metrology, Delhi State"
    },
    {
        "username": "manuf_abc",
        "email": "manufacturer@abcfoods.in",
        "password": "manuf123",
        "full_name": "Suresh Singhania (ABC Foods)",
        "role": "MANUFACTURER",
        "badge_number": None,
        "department": "Quality & Regulatory Compliance"
    },
    {
        "username": "consumer_citizen",
        "email": "consumer@citizen.nic.in",
        "password": "consumer123",
        "full_name": "Pooja Verma",
        "role": "CONSUMER",
        "badge_number": None,
        "department": "General Citizen"
    },
    {
        "username": "admin_gov",
        "email": "admin@metrocheck.gov.in",
        "password": "admin123",
        "full_name": "Dr. Ananya Sen",
        "role": "ADMIN",
        "badge_number": "ADM-HQ-001",
        "department": "Directorate of Legal Metrology, GoI"
    }
]

DEMO_BUSINESSES = [
    {"name": "ABC Foods India Private Limited", "trade_name": "ABC Bakes", "reg": "LMPC-DL-2018-0921", "address": "Plot 42, Okhla Phase-III, New Delhi", "district": "South East Delhi", "state": "Delhi", "pin": "110020", "risk_score": 18.0, "risk_tier": "LOW", "repeat": 0},
    {"name": "XYZ Agro Mills Limited", "trade_name": "XYZ Agro", "reg": "LMPC-RJ-2015-4412", "address": "Industrial Area, Phase II, Alwar", "district": "Alwar", "state": "Rajasthan", "pin": "301001", "risk_score": 68.0, "risk_tier": "MEDIUM", "repeat": 2},
    {"name": "Fresh Organics India Ltd", "trade_name": "Fresh Naturals", "reg": "LMPC-HP-2020-8819", "address": "Village Baddi, Distt Solan", "district": "Solan", "state": "Himachal Pradesh", "pin": "173205", "risk_score": 8.0, "risk_tier": "LOW", "repeat": 0},
    {"name": "Global Gourmet Imports LLP", "trade_name": "Global Gourmet", "reg": "LMPC-MH-2019-3382", "address": "Unit 3B, Trade Center, BKC, Mumbai", "district": "Mumbai Suburban", "state": "Maharashtra", "pin": "400051", "risk_score": 24.0, "risk_tier": "LOW", "repeat": 1},
    {"name": "Heritage Grain Traders", "trade_name": "Royal Heritage", "reg": "LMPC-PB-2017-7711", "address": "Mandi Gobindgarh, Fatehgarh Sahib", "district": "Fatehgarh Sahib", "state": "Punjab", "pin": "147301", "risk_score": 88.0, "risk_tier": "CRITICAL", "repeat": 4},
    {"name": "Amrit Beverages Pvt Ltd", "trade_name": "Amrit Tea", "reg": "LMPC-AS-2021-1205", "address": "Tea Estate Road, Guwahati", "district": "Kamrup", "state": "Assam", "pin": "781001", "risk_score": 12.0, "risk_tier": "LOW", "repeat": 0},
    {"name": "Bharat Spices & Condiments Ltd", "trade_name": "Bharat Masale", "reg": "LMPC-UP-2016-5629", "address": "Sector 62, Noida", "district": "Gautam Buddha Nagar", "state": "Uttar Pradesh", "pin": "201309", "risk_score": 42.0, "risk_tier": "MEDIUM", "repeat": 1},
    {"name": "Sunrise Dairy Products LLP", "trade_name": "Sunrise Dairy", "reg": "LMPC-HR-2022-9012", "address": "Udyog Vihar Phase 4, Gurugram", "district": "Gurugram", "state": "Haryana", "pin": "122016", "risk_score": 74.0, "risk_tier": "HIGH", "repeat": 3},
    {"name": "Deccan Detergents & Cleaners", "trade_name": "Deccan Clean", "reg": "LMPC-KA-2019-6721", "address": "Peenya Industrial Area, Bengaluru", "district": "Bengaluru Urban", "state": "Karnataka", "pin": "560058", "risk_score": 52.0, "risk_tier": "MEDIUM", "repeat": 2},
    {"name": "Patan Agro Processors Pvt Ltd", "trade_name": "Patan Grains", "reg": "LMPC-GJ-2018-3844", "address": "GIDC Estate, Ahmedabad", "district": "Ahmedabad", "state": "Gujarat", "pin": "382445", "risk_score": 82.0, "risk_tier": "HIGH", "repeat": 3},
    {"name": "Kaveri Confectionery Works", "trade_name": "Kaveri Sweets", "reg": "LMPC-TN-2020-4100", "address": "Ambattur Industrial Estate, Chennai", "district": "Chennai", "state": "Tamil Nadu", "pin": "600058", "risk_score": 28.0, "risk_tier": "LOW", "repeat": 0}
]

PRODUCTS_SEED = [
    ("ABC Butter Delite Biscuits", "Biscuits", "Food", "500 g", 120.0, False),
    ("ABC Marie Crisp Biscuits", "Biscuits", "Food", "250 g", 45.0, False),
    ("ABC Bourbon Choco Cream", "Biscuits", "Food", "150 g", 35.0, False),
    ("XYZ Refined Mustard Oil", "Mustard Oil", "Food", "1 L", 195.0, False),
    ("XYZ Pure Soybean Oil", "Soybean Oil", "Food", "1 L", 155.0, False),
    ("Fresh Glow Herbal Bath Soap", "Toilet Soap", "Personal Care", "125 g", 48.0, False),
    ("Fresh Neem & Tulsi Face Wash", "Face Wash", "Personal Care", "100 ml", 120.0, False),
    ("Swiss Delice Dark Chocolate 85%", "Dark Chocolate", "Food", "100 g", 350.0, True),
    ("Belgian Truffle Assortment", "Confectionery", "Food", "200 g", 599.0, True),
    ("Royal Heritage Basmati Rice", "Basmati Rice", "Food", "5 kg", 680.0, False),
    ("Royal Sharbati Wheat Flour", "Atta", "Food", "10 kg", 460.0, False),
    ("Amrit Premium Assam Tea", "Tea", "Food", "250 g", 140.0, False),
    ("Amrit CTC Golden Dust Tea", "Tea", "Food", "500 g", 210.0, False),
    ("Bharat Garam Masala Powder", "Spices", "Food", "100 g", 95.0, False),
    ("Bharat Kashmiri Mirch Powder", "Spices", "Food", "200 g", 160.0, False),
    ("Sunrise Pasteurised Butter", "Butter", "Food", "500 g", 275.0, False),
    ("Sunrise Cow Ghee Pouch", "Ghee", "Food", "1 L", 650.0, False),
    ("Deccan Ultra Active Detergent", "Detergent", "Household", "1 kg", 130.0, False),
    ("Deccan Floor Sanitizer Citrus", "Disinfectant", "Household", "500 ml", 90.0, False),
    ("Patan Unpolished Toor Dal", "Pulses", "Food", "1 kg", 175.0, False),
    ("Patan Moong Dal Special", "Pulses", "Food", "500 g", 92.0, False),
    ("Kaveri Mysore Pak Box", "Sweets", "Food", "400 g", 220.0, False)
]

DISTRICT_COORDINATES = {
    "Delhi": (28.6139, 77.2090),
    "South East Delhi": (28.5494, 77.2694),
    "North Delhi": (28.7041, 77.1025),
    "Noida": (28.5355, 77.3910),
    "Gurugram": (28.4595, 77.0266),
    "Faridabad": (28.4089, 77.3178),
    "Ghaziabad": (28.6692, 77.4538),
    "Mumbai Suburban": (19.0760, 72.8777),
    "Bengaluru Urban": (12.9716, 77.5946),
    "Ahmedabad": (23.0225, 72.5714),
    "Chennai": (13.0827, 80.2707),
    "Fatehgarh Sahib": (30.6436, 76.3994),
    "Alwar": (27.5530, 76.6346),
    "Solan": (30.9045, 77.0967),
    "Guwahati": (26.1445, 91.7362)
}

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    print("Seeding MetroCheck database...")

    # 1. Seed Rule Versions
    rule_ver = RuleVersion(
        id="LMPC-2011-v1.0",
        version_code="LMPC-2011-v1.0",
        title="Legal Metrology (Packaged Commodities) Rules, 2011 (As Amended)",
        description="Statutory rules framed under Section 52(2)(j) read with Section 18(1) of the Legal Metrology Act, 2009.",
        statute_reference="G.S.R. 202(E) dated 07-Mar-2011",
        is_active=True,
        rules_count=len(rules_engine.rules)
    )
    db.add(rule_ver)

    # 2. Seed Rules
    for r in rules_engine.rules:
        db_rule = Rule(
            id=r["id"],
            rule_code=r["rule_code"],
            name=r["name"],
            description=r.get("description", ""),
            field=r["field"],
            category=r.get("category", "core"),
            required=r.get("required", True),
            severity=r.get("severity", "major"),
            condition=r.get("condition", "exists_and_not_blank"),
            params=r.get("params"),
            weight=r.get("weight", 10.0),
            confidence_threshold=r.get("confidence_threshold", 0.65),
            active=r.get("active", True),
            version=r.get("version", "LMPC-2011-v1.0")
        )
        db.add(db_rule)

    # 3. Seed Businesses
    created_businesses = []
    for b in DEMO_BUSINESSES:
        biz = Business(
            name=b["name"],
            trade_name=b["trade_name"],
            registration_number=b["reg"],
            address=b["address"],
            district=b["district"],
            state=b["state"],
            pin_code=b["pin"],
            contact_email=f"compliance@{b['trade_name'].lower().replace(' ', '')}.com",
            contact_phone=f"+91-{random.randint(7000000000, 9999999999)}",
            risk_score=b["risk_score"],
            risk_tier=b["risk_tier"],
            repeat_violations_count=b["repeat"],
            total_inspections=0
        )
        db.add(biz)
        created_businesses.append(biz)
    db.flush()

    # 4. Seed Users
    created_users = []
    for u in DEMO_USERS:
        usr = User(
            username=u["username"],
            email=u["email"],
            hashed_password=get_password_hash(u["password"]),
            full_name=u["full_name"],
            role=u["role"],
            badge_number=u["badge_number"],
            department=u["department"],
            business_id=created_businesses[0].id if u["role"] == "MANUFACTURER" else None,
            is_active=True
        )
        db.add(usr)
        created_users.append(usr)
    db.flush()

    # 5. Seed Products
    created_products = []
    for idx, p in enumerate(PRODUCTS_SEED):
        biz = created_businesses[idx % len(created_businesses)]
        prod = Product(
            business_id=biz.id,
            brand_name=biz.trade_name or biz.name,
            product_name=p[0],
            common_name=p[1],
            category=p[2],
            standard_pack_size=p[3],
            declared_mrp=p[4],
            is_imported=p[5],
            country_of_origin="Switzerland" if p[5] else "India",
            image_url=f"/demo/sample_{idx+1}.svg"
        )
        db.add(prod)
        created_products.append(prod)
    db.flush()

    # 6. Seed 50 Inspections with realistic timeline over past 90 days
    officer = created_users[0]
    now = datetime.now(timezone.utc)
    
    districts_list = list(DISTRICT_COORDINATES.keys())
    statuses = ["Confirmed", "Resolved", "Under Review", "Confirmed", "Draft"]

    for i in range(1, 56):
        prod = created_products[i % len(created_products)]
        biz = prod.business
        
        # Calculate scores
        # Seed scenarios:
        # Some highly compliant (90-98), some medium (65-78), some critical (30-50)
        scenario_rand = random.random()
        if biz.risk_tier == "CRITICAL" or scenario_rand < 0.20:
            score = round(random.uniform(32.0, 56.0), 1)
            risk = "HIGH" if score > 45 else "CRITICAL"
            stat = "Confirmed"
        elif biz.risk_tier == "HIGH" or scenario_rand < 0.40:
            score = round(random.uniform(58.0, 74.0), 1)
            risk = "MEDIUM"
            stat = random.choice(["Confirmed", "Under Review"])
        else:
            score = round(random.uniform(84.0, 98.0), 1)
            risk = "LOW"
            stat = random.choice(["Resolved", "Confirmed", "Under Review"])

        case_id = f"MC-2026-{1000 + i:05d}"
        days_ago = random.randint(1, 85)
        insp_date = now - timedelta(days=days_ago, hours=random.randint(1, 23))

        dist = random.choice(districts_list)
        lat, lon = DISTRICT_COORDINATES[dist]
        # Jitter coordinates slightly
        lat += random.uniform(-0.04, 0.04)
        lon += random.uniform(-0.04, 0.04)

        insp = Inspection(
            case_id=case_id,
            product_id=prod.id,
            business_id=biz.id,
            inspector_id=officer.id,
            product_name_cached=prod.product_name,
            manufacturer_cached=biz.name,
            scan_image_url=prod.image_url or "/demo/abc_biscuits.svg",
            image_quality="GOOD" if score > 50 else "NEEDS_IMPROVEMENT",
            image_quality_score=round(random.uniform(70.0, 98.0), 1),
            status=stat,
            compliance_score=score,
            risk_level=risk,
            inspector_notes=f"Physical package inspection completed at premises in {dist}.",
            latitude=lat,
            longitude=lon,
            location_name=f"Retail Inspection Point #{100+i}",
            district=dist,
            state="Delhi" if "Delhi" in dist else "NCR/Other",
            verification_id=case_id,
            qr_generated=(score >= 80 and stat in ["Confirmed", "Resolved"]),
            created_at=insp_date,
            updated_at=insp_date
        )
        db.add(insp)
        db.flush()

        # Update business totals
        biz.total_inspections += 1

        # Seed extracted fields
        demo_fields = DEMO_PRODUCTS["abc-biscuits"]["fields"]
        for fname, fval in demo_fields.items():
            st = "PASS" if score > 60 else random.choice(["PASS", "VERIFY", "FAIL"])
            db_field = ExtractedField(
                inspection_id=insp.id,
                field_name=fname,
                detected_value=str(fval["value"]),
                confidence=fval["confidence"],
                bbox_x=fval["bbox"][0],
                bbox_y=fval["bbox"][1],
                bbox_w=fval["bbox"][2],
                bbox_h=fval["bbox"][3],
                source_text=fval.get("source_text", ""),
                status=st
            )
            db.add(db_field)

        # If score is not high, generate violations
        if score < 80:
            v_count = 1 if score >= 60 else (2 if score >= 45 else 3)
            possible_rules = [
                ("LM_MRP_001", "mrp", "critical", "MRP declaration missing taxes inclusive clause.", "Print 'MRP ₹ xx.xx (incl. of all taxes)'."),
                ("LM_DATE_001", "manufacturing_date", "major", "Date of manufacture is faint or missing MM/YYYY.", "Ensure manufacturing date is clearly legible."),
                ("LM_USP_001", "unit_sale_price", "moderate", "Unit Sale Price per g/ml missing on package.", "Declare Unit Sale Price as required by 2021 amendment."),
                ("LM_CARE_001", "consumer_care_phone", "major", "Consumer care telephone not reachable / not verified.", "Print operative helpline phone and email.")
            ]
            for v_idx in range(v_count):
                vr = possible_rules[v_idx % len(possible_rules)]
                db_v = Violation(
                    inspection_id=insp.id,
                    rule_code=vr[0],
                    field_name=vr[1],
                    severity=vr[2],
                    status="CONFIRMED" if stat == "Confirmed" else "DETECTED",
                    detected_value="₹ 120" if vr[1] == "mrp" else "Unverified",
                    expected_condition="exists_and_compliant",
                    failure_message=vr[3],
                    remediation=vr[4],
                    evidence_region=f"Region {vr[1].upper()}"
                )
                db.add(db_v)

        # Generate QR verification record if compliant
        if insp.qr_generated:
            qr = QRVerification(
                verification_id=case_id,
                inspection_id=insp.id,
                product_name=prod.product_name,
                manufacturer_name=biz.name,
                compliance_score=score,
                verification_date=insp_date,
                status="COMPLIANT",
                view_count=random.randint(5, 120)
            )
            db.add(qr)

        # Add Audit log
        audit_chain.log_action(
            db=db,
            user_id=officer.id,
            action="INSPECTION_RECORD_CREATED",
            entity_type="INSPECTION",
            entity_id=insp.id,
            case_id=case_id,
            previous_value=None,
            new_value=f"Score: {score}, Risk: {risk}, Status: {stat}"
        )

    db.commit()
    print("Database successfully seeded with businesses, products, inspections, violations, and audit chain!")
