import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), nullable=False, default="OFFICER") # OFFICER, MANUFACTURER, CONSUMER, ADMIN
    badge_number = Column(String(50), nullable=True)
    department = Column(String(100), nullable=True, default="Legal Metrology Department")
    business_id = Column(String(36), ForeignKey("businesses.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    inspections = relationship("Inspection", back_populates="inspector")

class Business(Base):
    __tablename__ = "businesses"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(200), nullable=False, index=True)
    trade_name = Column(String(200), nullable=True)
    registration_number = Column(String(100), unique=True, nullable=True, index=True) # CIN/LMPC
    address = Column(Text, nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    pin_code = Column(String(20), nullable=False)
    contact_email = Column(String(150), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    risk_score = Column(Float, default=15.0) # 0 to 100
    risk_tier = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    repeat_violations_count = Column(Integer, default=0)
    total_inspections = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    products = relationship("Product", back_populates="business")
    inspections = relationship("Inspection", back_populates="business")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    business_id = Column(String(36), ForeignKey("businesses.id"), nullable=False)
    brand_name = Column(String(150), nullable=False)
    product_name = Column(String(200), nullable=False)
    common_name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False, default="Food")
    sub_category = Column(String(100), nullable=True)
    standard_pack_size = Column(String(50), nullable=True)
    declared_mrp = Column(Float, nullable=True)
    country_of_origin = Column(String(100), default="India")
    is_imported = Column(Boolean, default=False)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    business = relationship("Business", back_populates="products")
    inspections = relationship("Inspection", back_populates="product")

class Inspection(Base):
    __tablename__ = "inspections"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    case_id = Column(String(50), unique=True, nullable=False, index=True) # MC-2026-0001284
    product_id = Column(String(36), ForeignKey("products.id"), nullable=True)
    business_id = Column(String(36), ForeignKey("businesses.id"), nullable=True)
    inspector_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    product_name_cached = Column(String(200), nullable=True)
    manufacturer_cached = Column(String(200), nullable=True)
    
    scan_image_url = Column(String(500), nullable=False)
    image_quality = Column(String(30), default="GOOD") # GOOD, NEEDS_IMPROVEMENT
    image_quality_score = Column(Float, default=92.0)
    
    status = Column(String(30), default="Under Review") # Draft, Under Review, Confirmed, Resolved, Closed
    compliance_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    
    inspector_notes = Column(Text, nullable=True)
    notice_draft = Column(Text, nullable=True)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_name = Column(String(200), nullable=True)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    
    verification_id = Column(String(50), nullable=True, unique=True)
    qr_generated = Column(Boolean, default=False)
    is_demo = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    product = relationship("Product", back_populates="inspections")
    business = relationship("Business", back_populates="inspections")
    inspector = relationship("User", back_populates="inspections")
    extracted_fields = relationship("ExtractedField", back_populates="inspection", cascade="all, delete-orphan")
    violations = relationship("Violation", back_populates="inspection", cascade="all, delete-orphan")
    evidence_items = relationship("Evidence", back_populates="inspection", cascade="all, delete-orphan")

class ExtractedField(Base):
    __tablename__ = "extracted_fields"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    field_name = Column(String(100), nullable=False)
    detected_value = Column(Text, nullable=True)
    standardized_value = Column(Text, nullable=True)
    confidence = Column(Float, default=0.0) # 0.0 to 1.0
    
    # Bounding box relative coordinates [x, y, w, h] in percentages (0-100)
    bbox_x = Column(Float, default=0.0)
    bbox_y = Column(Float, default=0.0)
    bbox_w = Column(Float, default=0.0)
    bbox_h = Column(Float, default=0.0)
    
    source_text = Column(Text, nullable=True)
    status = Column(String(30), default="VERIFY") # PASS, FAIL, VERIFY, NOT_APPLICABLE
    
    inspector_override = Column(Boolean, default=False)
    override_value = Column(Text, nullable=True)
    override_note = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    inspection = relationship("Inspection", back_populates="extracted_fields")

class Violation(Base):
    __tablename__ = "violations"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    rule_code = Column(String(50), nullable=False)
    field_name = Column(String(100), nullable=False)
    severity = Column(String(30), default="major") # critical, major, moderate, minor
    status = Column(String(30), default="DETECTED") # DETECTED, CONFIRMED, REJECTED, RESOLVED
    detected_value = Column(Text, nullable=True)
    expected_condition = Column(Text, nullable=True)
    failure_message = Column(Text, nullable=False)
    remediation = Column(Text, nullable=True)
    evidence_region = Column(String(100), nullable=True)
    inspector_remarks = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    inspection = relationship("Inspection", back_populates="violations")

class Rule(Base):
    __tablename__ = "rules"
    
    id = Column(String(50), primary_key=True)
    rule_code = Column(String(50), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    field = Column(String(100), nullable=False)
    category = Column(String(50), default="core") # core, food, imported
    required = Column(Boolean, default=True)
    severity = Column(String(30), default="major")
    condition = Column(String(50), nullable=False)
    params = Column(JSON, nullable=True)
    weight = Column(Float, default=10.0)
    confidence_threshold = Column(Float, default=0.65)
    active = Column(Boolean, default=True)
    version = Column(String(50), default="LMPC-2011-v1.0")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RuleVersion(Base):
    __tablename__ = "rule_versions"
    
    id = Column(String(50), primary_key=True)
    version_code = Column(String(50), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    statute_reference = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True)
    rules_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    violation_id = Column(String(36), ForeignKey("violations.id"), nullable=True)
    image_url = Column(String(500), nullable=False)
    bbox = Column(String(100), nullable=True)
    field = Column(String(100), nullable=False)
    rule_code = Column(String(50), nullable=True)
    status = Column(String(30), default="VERIFY")
    caption = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    inspection = relationship("Inspection", back_populates="evidence_items")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    sequence_num = Column(Integer, unique=True, autoincrement=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)
    case_id = Column(String(50), nullable=True)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(100), nullable=False)
    previous_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    payload_hash = Column(String(64), nullable=False)
    previous_hash = Column(String(64), nullable=False)
    record_hash = Column(String(64), nullable=False)

class QRVerification(Base):
    __tablename__ = "qr_verifications"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    verification_id = Column(String(50), unique=True, nullable=False, index=True)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    product_name = Column(String(200), nullable=False)
    manufacturer_name = Column(String(200), nullable=False)
    compliance_score = Column(Float, nullable=False)
    verification_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(30), default="COMPLIANT")
    view_count = Column(Integer, default=0)

class Grievance(Base):
    __tablename__ = "grievances"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    grievance_number = Column(String(50), unique=True, nullable=False)
    consumer_name = Column(String(150), nullable=False)
    consumer_phone = Column(String(50), nullable=False)
    consumer_email = Column(String(150), nullable=True)
    product_name = Column(String(200), nullable=False)
    manufacturer = Column(String(200), nullable=True)
    store_name = Column(String(200), nullable=True)
    store_location = Column(String(200), nullable=True)
    violation_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    evidence_image_url = Column(String(500), nullable=True)
    status = Column(String(30), default="SUBMITTED") # SUBMITTED, UNDER_INVESTIGATION, RESOLVED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SyncQueue(Base):
    __tablename__ = "sync_queue"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    client_scan_id = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    status = Column(String(30), default="PENDING")
    retry_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
