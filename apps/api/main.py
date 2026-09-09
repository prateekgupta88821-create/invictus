import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.seed.seed_data import seed_database

# Routers
from app.api.auth import router as auth_router
from app.api.scans import router as scans_router
from app.api.inspections import router as inspections_router
from app.api.compliance import router as compliance_router
from app.api.violations import router as violations_router
from app.api.reports import router as reports_router
from app.api.dashboard import router as dashboard_router
from app.api.businesses import router as businesses_router
from app.api.rules import router as rules_router
from app.api.qr import router as qr_router
from app.api.ecommerce import router as ecommerce_router
from app.api.audit import router as audit_router
from app.api.health import router as health_router

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Legal Metrology Compliance System for Packaged Commodities (SIH 2026 - Problem SIH26034)",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for images
settings.UPLOAD_PATH.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_PATH)), name="uploads")

# Include API Routers
app.include_router(health_router)
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(scans_router, prefix=settings.API_PREFIX)
app.include_router(inspections_router, prefix=settings.API_PREFIX)
app.include_router(compliance_router, prefix=settings.API_PREFIX)
app.include_router(violations_router, prefix=settings.API_PREFIX)
app.include_router(reports_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(businesses_router, prefix=settings.API_PREFIX)
app.include_router(rules_router, prefix=settings.API_PREFIX)
app.include_router(qr_router, prefix=settings.API_PREFIX)
app.include_router(ecommerce_router, prefix=settings.API_PREFIX)
app.include_router(audit_router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def on_startup():
    # 1. Create DB tables
    Base.metadata.create_all(bind=engine)
    # 2. Seed realistic demo data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "sih_problem": "SIH26034 - Legal Metrology Packaged Commodities Rules 2011",
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "demo_mode": settings.AI_PROVIDER == "demo"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
