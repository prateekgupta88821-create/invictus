from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import AuditLog
from app.audit.chain import audit_chain

router = APIRouter(prefix="/audit", tags=["Cryptographic Audit Trail"])

@router.get("")
def get_audit_trail(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    total = db.query(AuditLog).count()
    logs = db.query(AuditLog).order_by(AuditLog.sequence_num.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "sequence_num": l.sequence_num,
                "timestamp": l.timestamp.isoformat() if l.timestamp else None,
                "user_id": l.user_id,
                "action": l.action,
                "case_id": l.case_id,
                "entity_type": l.entity_type,
                "previous_value": l.previous_value,
                "new_value": l.new_value,
                "record_hash": l.record_hash,
                "previous_hash": l.previous_hash
            }
            for l in logs
        ]
    }

@router.get("/verify")
def verify_audit_integrity(db: Session = Depends(get_db)):
    result = audit_chain.verify_integrity(db)
    return result
