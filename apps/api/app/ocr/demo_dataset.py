from typing import Dict, Any

DEMO_PRODUCTS: Dict[str, Dict[str, Any]] = {
    "abc-biscuits": {
        "id": "abc-biscuits",
        "product_name": "ABC Butter Delite Biscuits",
        "common_name": "Biscuits",
        "brand_name": "ABC Bakes",
        "business_name": "ABC Foods India Private Limited",
        "category": "Food",
        "is_imported": False,
        "image_url": "/demo/abc_biscuits.svg",
        "image_quality": "GOOD",
        "image_quality_score": 94.0,
        "ocr_raw_text": (
            "ABC BUTTER DELITE BISCUITS\n"
            "Net Qty: 500 g\n"
            "Mfd. & Pkd. by: ABC Foods India Pvt Ltd,\n"
            "Plot 42, Industrial Area, Okhla Phase-III, New Delhi - 110020\n"
            "Batch No: AB-8421\n"
            "Mfg Date: 08/2026\n"
            "Best Before 6 months from packaging\n"
            "MRP ₹ 120.00 (Inclusive of all taxes)\n"
            "Unit Sale Price: ₹ 0.24 per g\n"
            "For Complaints: Customer Care Executive, 1800-200-4567, care@abcfoods.in\n"
            "Country of Origin: India\n"
            "100% Vegetarian"
        ),
        "fields": {
            "product_name": {
                "value": "ABC Butter Delite Biscuits",
                "confidence": 0.98,
                "bbox": [15, 12, 70, 10],
                "source_text": "ABC BUTTER DELITE BISCUITS",
                "status": "PASS"
            },
            "common_name": {
                "value": "Biscuits",
                "confidence": 0.94,
                "bbox": [35, 23, 30, 6],
                "source_text": "Biscuits",
                "status": "PASS"
            },
            "manufacturer": {
                "value": "ABC Foods India Pvt Ltd",
                "confidence": 0.92,
                "bbox": [15, 34, 70, 7],
                "source_text": "Mfd. & Pkd. by: ABC Foods India Pvt Ltd",
                "status": "PASS"
            },
            "address": {
                "value": "Plot 42, Industrial Area, Okhla Phase-III, New Delhi - 110020",
                "confidence": 0.89,
                "bbox": [15, 42, 70, 8],
                "source_text": "Plot 42, Industrial Area, Okhla Phase-III, New Delhi - 110020",
                "status": "PASS"
            },
            "net_quantity": {
                "value": "500",
                "confidence": 0.96,
                "bbox": [15, 54, 25, 6],
                "source_text": "Net Qty: 500 g",
                "status": "PASS"
            },
            "unit": {
                "value": "g",
                "confidence": 0.95,
                "bbox": [32, 54, 8, 6],
                "source_text": "g",
                "status": "PASS"
            },
            "mrp": {
                "value": "₹ 120.00",
                "confidence": 0.94,
                "bbox": [55, 54, 35, 7],
                "source_text": "MRP ₹ 120.00 (Inclusive of all taxes)",
                "status": "PASS"
            },
            "unit_sale_price": {
                "value": "₹ 0.24 per g",
                "confidence": 0.91,
                "bbox": [55, 62, 35, 6],
                "source_text": "Unit Sale Price: ₹ 0.24 per g",
                "status": "PASS"
            },
            "manufacturing_date": {
                "value": "08/2026",
                "confidence": 0.92,
                "bbox": [15, 64, 30, 6],
                "source_text": "Mfg Date: 08/2026",
                "status": "PASS"
            },
            "expiry_date": {
                "value": "Best Before 6 months from packaging",
                "confidence": 0.88,
                "bbox": [15, 71, 55, 6],
                "source_text": "Best Before 6 months from packaging",
                "status": "PASS"
            },
            "batch_number": {
                "value": "AB-8421",
                "confidence": 0.90,
                "bbox": [15, 78, 25, 6],
                "source_text": "Batch No: AB-8421",
                "status": "PASS"
            },
            "consumer_care_phone": {
                "value": "1800-200-4567",
                "confidence": 0.95,
                "bbox": [15, 85, 40, 6],
                "source_text": "Customer Care: 1800-200-4567",
                "status": "PASS"
            },
            "consumer_care_email": {
                "value": "care@abcfoods.in",
                "confidence": 0.92,
                "bbox": [56, 85, 35, 6],
                "source_text": "care@abcfoods.in",
                "status": "PASS"
            },
            "country_of_origin": {
                "value": "India",
                "confidence": 0.96,
                "bbox": [65, 78, 25, 6],
                "source_text": "Country of Origin: India",
                "status": "PASS"
            },
            "veg_indicator": {
                "value": "Vegetarian",
                "confidence": 0.99,
                "bbox": [82, 14, 8, 8],
                "source_text": "Green Dot Emblem",
                "status": "PASS"
            }
        }
    },
    
    "xyz-oil": {
        "id": "xyz-oil",
        "product_name": "XYZ Refined Mustard Oil",
        "common_name": "Mustard Oil",
        "brand_name": "XYZ Agro",
        "business_name": "XYZ Oil Mills Ltd",
        "category": "Food",
        "is_imported": False,
        "image_url": "/demo/xyz_oil.svg",
        "image_quality": "GOOD",
        "image_quality_score": 88.0,
        "ocr_raw_text": (
            "XYZ PURE MUSTARD OIL\n"
            "Quantity: 1 Liter\n"
            "Manufactured by: XYZ Agro Mills,\n"
            "Alwar, Rajasthan\n"
            "Pkd: 07/2026\n"
            "Batch: MZ-99\n"
            "Price: 195\n"
            "Call 9811XXXXXX for feedback"
        ),
        "fields": {
            "product_name": {
                "value": "XYZ Pure Mustard Oil",
                "confidence": 0.93,
                "bbox": [20, 15, 60, 10],
                "source_text": "XYZ PURE MUSTARD OIL",
                "status": "PASS"
            },
            "common_name": {
                "value": "Mustard Oil",
                "confidence": 0.90,
                "bbox": [30, 26, 40, 6],
                "source_text": "Mustard Oil",
                "status": "PASS"
            },
            "manufacturer": {
                "value": "XYZ Agro Mills",
                "confidence": 0.88,
                "bbox": [15, 38, 50, 7],
                "source_text": "Manufactured by: XYZ Agro Mills",
                "status": "PASS"
            },
            "address": {
                "value": "Alwar, Rajasthan",
                "confidence": 0.58,
                "bbox": [15, 46, 40, 6],
                "source_text": "Alwar, Rajasthan",
                "status": "VERIFY" # Incomplete address (missing PIN/premise)
            },
            "net_quantity": {
                "value": "1",
                "confidence": 0.85,
                "bbox": [15, 56, 20, 6],
                "source_text": "Quantity: 1 Liter",
                "status": "PASS"
            },
            "unit": {
                "value": "Liter", # should be 'l' or 'L'
                "confidence": 0.82,
                "bbox": [27, 56, 12, 6],
                "source_text": "Liter",
                "status": "PASS"
            },
            "mrp": {
                "value": "195",
                "confidence": 0.52, # Low confidence, missing "incl of taxes" and currency
                "bbox": [60, 56, 25, 7],
                "source_text": "Price: 195",
                "status": "VERIFY"
            },
            "unit_sale_price": {
                "value": None,
                "confidence": 0.0,
                "bbox": [0, 0, 0, 0],
                "source_text": "",
                "status": "FAIL" # Required for 1L package
            },
            "manufacturing_date": {
                "value": "07/2026",
                "confidence": 0.85,
                "bbox": [15, 68, 25, 6],
                "source_text": "Pkd: 07/2026",
                "status": "PASS"
            },
            "consumer_care_phone": {
                "value": "9811XXXXXX",
                "confidence": 0.55,
                "bbox": [15, 78, 45, 6],
                "source_text": "Call 9811XXXXXX for feedback",
                "status": "VERIFY"
            },
            "batch_number": {
                "value": "MZ-99",
                "confidence": 0.79,
                "bbox": [60, 68, 20, 6],
                "source_text": "Batch: MZ-99",
                "status": "PASS"
            }
        }
    },
    
    "fresh-soap": {
        "id": "fresh-soap",
        "product_name": "Fresh Glow Herbal Bath Soap",
        "common_name": "Toilet Soap",
        "brand_name": "Fresh Naturals",
        "business_name": "Fresh Organics India Ltd",
        "category": "Personal Care",
        "is_imported": False,
        "image_url": "/demo/fresh_soap.svg",
        "image_quality": "GOOD",
        "image_quality_score": 97.0,
        "ocr_raw_text": (
            "FRESH GLOW HERBAL BATH SOAP\n"
            "Net Weight: 125 g (when packed)\n"
            "Manufactured by: Fresh Organics India Ltd, Village Baddi, Distt Solan, HP - 173205\n"
            "Batch No: FG-264\n"
            "Mfg Date: 06/2026\n"
            "Use Before: 24 Months from Mfg\n"
            "MRP ₹ 48.00 (incl. of all taxes)\n"
            "Unit Sale Price: ₹ 0.38 per g\n"
            "Consumer Care cell: 1800-111-9988, care@freshglow.com\n"
            "Made in India"
        ),
        "fields": {
            "product_name": {"value": "Fresh Glow Herbal Bath Soap", "confidence": 0.98, "bbox": [15, 10, 70, 10], "source_text": "FRESH GLOW HERBAL BATH SOAP", "status": "PASS"},
            "common_name": {"value": "Toilet Soap", "confidence": 0.95, "bbox": [30, 22, 40, 6], "source_text": "Herbal Bath Soap", "status": "PASS"},
            "manufacturer": {"value": "Fresh Organics India Ltd", "confidence": 0.96, "bbox": [15, 32, 60, 7], "source_text": "Fresh Organics India Ltd", "status": "PASS"},
            "address": {"value": "Village Baddi, Distt Solan, HP - 173205", "confidence": 0.94, "bbox": [15, 40, 70, 7], "source_text": "Village Baddi, Distt Solan, HP - 173205", "status": "PASS"},
            "net_quantity": {"value": "125", "confidence": 0.97, "bbox": [15, 52, 20, 6], "source_text": "125 g", "status": "PASS"},
            "unit": {"value": "g", "confidence": 0.96, "bbox": [28, 52, 8, 6], "source_text": "g", "status": "PASS"},
            "mrp": {"value": "₹ 48.00", "confidence": 0.98, "bbox": [55, 52, 35, 7], "source_text": "MRP ₹ 48.00 (incl. of all taxes)", "status": "PASS"},
            "unit_sale_price": {"value": "₹ 0.38 per g", "confidence": 0.94, "bbox": [55, 60, 35, 6], "source_text": "Unit Sale Price: ₹ 0.38 per g", "status": "PASS"},
            "manufacturing_date": {"value": "06/2026", "confidence": 0.95, "bbox": [15, 64, 25, 6], "source_text": "Mfg Date: 06/2026", "status": "PASS"},
            "batch_number": {"value": "FG-264", "confidence": 0.94, "bbox": [60, 64, 25, 6], "source_text": "Batch No: FG-264", "status": "PASS"},
            "consumer_care_phone": {"value": "1800-111-9988", "confidence": 0.97, "bbox": [15, 78, 35, 6], "source_text": "1800-111-9988", "status": "PASS"},
            "consumer_care_email": {"value": "care@freshglow.com", "confidence": 0.95, "bbox": [52, 78, 35, 6], "source_text": "care@freshglow.com", "status": "PASS"},
            "country_of_origin": {"value": "India", "confidence": 0.98, "bbox": [35, 88, 30, 6], "source_text": "Made in India", "status": "PASS"}
        }
    },
    
    "imported-chocolate": {
        "id": "imported-chocolate",
        "product_name": "Swiss Delice Dark Chocolate 85%",
        "common_name": "Dark Chocolate",
        "brand_name": "Swiss Delice",
        "business_name": "Global Gourmet Imports LLP",
        "category": "Food",
        "is_imported": True,
        "image_url": "/demo/imported_chocolate.svg",
        "image_quality": "GOOD",
        "image_quality_score": 93.0,
        "ocr_raw_text": (
            "SWISS DELICE 85% COCOA DARK CHOCOLATE\n"
            "Net Wt: 100 g\n"
            "Manufactured by: Chocolat Delice SA, Zurich, Switzerland\n"
            "Imported & Marketed by: Global Gourmet Imports LLP, Unit 3B, Trade Center, BKC, Mumbai - 400051\n"
            "Country of Origin: Switzerland\n"
            "Month & Year of Import: 05/2026\n"
            "MRP ₹ 350.00 (Incl. of all taxes)\n"
            "Batch: CH-9912\n"
            "Consumer Helpline: customercare@globalgourmet.in, +91-22-26543210"
        ),
        "fields": {
            "product_name": {"value": "Swiss Delice Dark Chocolate 85%", "confidence": 0.97, "bbox": [15, 12, 70, 9], "source_text": "SWISS DELICE 85% COCOA", "status": "PASS"},
            "common_name": {"value": "Dark Chocolate", "confidence": 0.94, "bbox": [30, 22, 40, 6], "source_text": "Dark Chocolate", "status": "PASS"},
            "manufacturer": {"value": "Chocolat Delice SA, Zurich, Switzerland", "confidence": 0.91, "bbox": [15, 32, 70, 7], "source_text": "Chocolat Delice SA", "status": "PASS"},
            "importer": {"value": "Global Gourmet Imports LLP", "confidence": 0.93, "bbox": [15, 41, 70, 7], "source_text": "Global Gourmet Imports LLP", "status": "PASS"},
            "address": {"value": "Unit 3B, Trade Center, BKC, Mumbai - 400051", "confidence": 0.92, "bbox": [15, 49, 70, 7], "source_text": "BKC, Mumbai - 400051", "status": "PASS"},
            "country_of_origin": {"value": "Switzerland", "confidence": 0.98, "bbox": [15, 58, 40, 6], "source_text": "Country of Origin: Switzerland", "status": "PASS"},
            "import_date": {"value": "05/2026", "confidence": 0.94, "bbox": [60, 58, 30, 6], "source_text": "Month & Year of Import: 05/2026", "status": "PASS"},
            "net_quantity": {"value": "100", "confidence": 0.95, "bbox": [15, 68, 20, 6], "source_text": "100 g", "status": "PASS"},
            "unit": {"value": "g", "confidence": 0.95, "bbox": [28, 68, 8, 6], "source_text": "g", "status": "PASS"},
            "mrp": {"value": "₹ 350.00", "confidence": 0.96, "bbox": [55, 68, 35, 7], "source_text": "MRP ₹ 350.00 (Incl. of all taxes)", "status": "PASS"},
            "batch_number": {"value": "CH-9912", "confidence": 0.91, "bbox": [15, 77, 25, 6], "source_text": "Batch: CH-9912", "status": "PASS"},
            "consumer_care_phone": {"value": "+91-22-26543210", "confidence": 0.92, "bbox": [45, 77, 45, 6], "source_text": "+91-22-26543210", "status": "PASS"}
        }
    },
    
    "tampered-package": {
        "id": "tampered-package",
        "product_name": "Royal Heritage Basmati Rice",
        "common_name": "Basmati Rice",
        "brand_name": "Royal Heritage",
        "business_name": "Heritage Grain Traders",
        "category": "Food",
        "is_imported": False,
        "image_url": "/demo/tampered_rice.svg",
        "image_quality": "NEEDS_IMPROVEMENT",
        "image_quality_score": 64.0,
        "ocr_raw_text": (
            "ROYAL HERITAGE BASMATI RICE\n"
            "Net Qty: 5 kg\n"
            "Packed by: Heritage Grain Traders, Mandi Gobindgarh, Punjab\n"
            "M.R.P. ₹ 680.00 (STICKER OVERLAY DETECTED)\n"
            "[Original price underneath: ₹ 550.00]\n"
            "Date: 04/2026\n"
            "Grievance: care@heritagegrain.in"
        ),
        "fields": {
            "product_name": {"value": "Royal Heritage Basmati Rice", "confidence": 0.89, "bbox": [15, 12, 70, 10], "source_text": "ROYAL HERITAGE BASMATI RICE", "status": "PASS"},
            "common_name": {"value": "Basmati Rice", "confidence": 0.86, "bbox": [30, 24, 40, 6], "source_text": "Basmati Rice", "status": "PASS"},
            "manufacturer": {"value": "Heritage Grain Traders", "confidence": 0.84, "bbox": [15, 36, 65, 7], "source_text": "Heritage Grain Traders", "status": "PASS"},
            "address": {"value": "Mandi Gobindgarh, Punjab", "confidence": 0.62, "bbox": [15, 44, 55, 6], "source_text": "Mandi Gobindgarh, Punjab", "status": "VERIFY"},
            "net_quantity": {"value": "5", "confidence": 0.91, "bbox": [15, 54, 15, 6], "source_text": "5 kg", "status": "PASS"},
            "unit": {"value": "kg", "confidence": 0.90, "bbox": [25, 54, 8, 6], "source_text": "kg", "status": "PASS"},
            "mrp": {
                "value": "₹ 680.00",
                "confidence": 0.44, # Low confidence + anomaly
                "bbox": [55, 62, 38, 22],
                "source_text": "M.R.P. ₹ 680.00 [STICKER]",
                "status": "VERIFY"
            },
            "manufacturing_date": {"value": "04/2026", "confidence": 0.68, "bbox": [15, 65, 25, 6], "source_text": "Date: 04/2026", "status": "VERIFY"},
            "consumer_care_email": {"value": "care@heritagegrain.in", "confidence": 0.81, "bbox": [15, 76, 45, 6], "source_text": "care@heritagegrain.in", "status": "PASS"}
        }
    },
    
    "hindi-label": {
        "id": "hindi-label",
        "product_name": "अमृत प्रीमियम असम चाय (Amrit Tea)",
        "common_name": "चाय / Tea",
        "brand_name": "अमृत / Amrit",
        "business_name": "अमृत बेवरेजेस प्राइवेट लिमिटेड",
        "category": "Food",
        "is_imported": False,
        "image_url": "/demo/hindi_tea.svg",
        "image_quality": "GOOD",
        "image_quality_score": 95.0,
        "ocr_raw_text": (
            "अमृत प्रीमियम असम चाय\n"
            "शुद्ध मात्रा: २५० ग्राम (250 g)\n"
            "निर्माता: अमृत बेवरेजेस प्राइवेट लिमिटेड,\n"
            "औद्योगिक क्षेत्र, गुवाहाटी, असम - 781001\n"
            "उत्पादन माह एवं वर्ष: 08/2026\n"
            "अधिकतम खुदरा मूल्य: ₹ 140.00 (सभी कर सहित)\n"
            "इकाई विक्रय मूल्य: ₹ 0.56 प्रति ग्राम\n"
            "उपभोक्ता संपर्क: 1800-419-0022, sahayata@amritbev.in\n"
            "बैच संख्या: AT-108\n"
            "100% भारतीय चाय"
        ),
        "fields": {
            "product_name": {"value": "अमृत प्रीमियम असम चाय (Amrit Assam Tea)", "confidence": 0.97, "bbox": [15, 12, 70, 10], "source_text": "अमृत प्रीमियम असम चाय", "status": "PASS"},
            "common_name": {"value": "चाय (Tea)", "confidence": 0.94, "bbox": [35, 24, 30, 6], "source_text": "चाय / Tea", "status": "PASS"},
            "manufacturer": {"value": "अमृत बेवरेजेस प्राइवेट लिमिटेड (Amrit Beverages Pvt Ltd)", "confidence": 0.93, "bbox": [15, 34, 70, 7], "source_text": "निर्माता: अमृत बेवरेजेस", "status": "PASS"},
            "address": {"value": "औद्योगिक क्षेत्र, गुवाहाटी, असम - 781001", "confidence": 0.91, "bbox": [15, 42, 70, 8], "source_text": "गुवाहाटी, असम - 781001", "status": "PASS"},
            "net_quantity": {"value": "250", "confidence": 0.96, "bbox": [15, 54, 25, 6], "source_text": "२५० ग्राम (250 g)", "status": "PASS"},
            "unit": {"value": "g", "confidence": 0.95, "bbox": [32, 54, 8, 6], "source_text": "ग्राम / g", "status": "PASS"},
            "mrp": {"value": "₹ 140.00", "confidence": 0.95, "bbox": [55, 54, 35, 7], "source_text": "अधिकतम खुदरा मूल्य: ₹ 140.00 (सभी कर सहित)", "status": "PASS"},
            "unit_sale_price": {"value": "₹ 0.56 प्रति ग्राम", "confidence": 0.92, "bbox": [55, 62, 35, 6], "source_text": "इकाई विक्रय मूल्य: ₹ 0.56 प्रति ग्राम", "status": "PASS"},
            "manufacturing_date": {"value": "08/2026", "confidence": 0.93, "bbox": [15, 64, 30, 6], "source_text": "उत्पादन माह एवं वर्ष: 08/2026", "status": "PASS"},
            "batch_number": {"value": "AT-108", "confidence": 0.91, "bbox": [15, 74, 25, 6], "source_text": "बैच: AT-108", "status": "PASS"},
            "consumer_care_phone": {"value": "1800-419-0022", "confidence": 0.95, "bbox": [15, 84, 40, 6], "source_text": "1800-419-0022", "status": "PASS"},
            "consumer_care_email": {"value": "sahayata@amritbev.in", "confidence": 0.92, "bbox": [56, 84, 35, 6], "source_text": "sahayata@amritbev.in", "status": "PASS"},
            "country_of_origin": {"value": "भारत (India)", "confidence": 0.96, "bbox": [65, 74, 25, 6], "source_text": "100% भारतीय चाय", "status": "PASS"}
        }
    }
}
