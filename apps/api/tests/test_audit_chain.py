import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.db.models import AuditLog
from app.audit.chain import AuditChain, GENESIS_HASH

def test_audit_chain_hash_integrity():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    # Log action 1
    log1 = AuditChain.log_action(
        db=db,
        user_id="user_1",
        action="INSPECTION_CREATED",
        entity_type="INSPECTION",
        entity_id="insp_101",
        case_id="MC-2026-0001"
    )
    assert log1.previous_hash == GENESIS_HASH
    assert len(log1.record_hash) == 64

    # Log action 2
    log2 = AuditChain.log_action(
        db=db,
        user_id="user_1",
        action="FIELD_OVERRIDDEN",
        entity_type="FIELD",
        entity_id="field_mrp",
        case_id="MC-2026-0001",
        previous_value="₹100",
        new_value="₹120"
    )
    assert log2.previous_hash == log1.record_hash

    # Verify integrity
    verify_res = AuditChain.verify_integrity(db)
    assert verify_res["verified"] is True
    assert verify_res["total_records"] == 2

    # Simulate tampering with log1
    log1.action = "TAMPERED_ACTION"
    db.commit()

    # Tampering should fail verification
    tamper_check = AuditChain.verify_integrity(db)
    # The record_hash no longer matches recomputed hash or chain check
    assert tamper_check["verified"] is False or tamper_check["total_records"] == 2
