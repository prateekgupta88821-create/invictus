from fastapi import APIRouter
from app.core.config import settings
from app.engine.rules_engine import rules_engine

router = APIRouter(tags=["Health & Status"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "ai_provider": settings.AI_PROVIDER,
        "rules_loaded": len(rules_engine.rules),
        "rule_version": "LMPC-2011-v1.0"
    }
