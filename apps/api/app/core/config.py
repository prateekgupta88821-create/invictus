import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RULES_DIR = BASE_DIR.parent.parent / "rules"
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "METROCHECK"
    TAGLINE: str = "AI-Powered Legal Metrology Compliance System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "sih2026-metrocheck-super-secret-key-change-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database: default to SQLite for zero-setup local, supports PostgreSQL via env
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/metrocheck.db")
    
    # Providers
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "demo")
    OCR_PROVIDER: str = os.getenv("OCR_PROVIDER", "demo")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    
    # Rules directory
    RULES_PATH: Path = RULES_DIR if RULES_DIR.exists() else (BASE_DIR / "rules")
    UPLOAD_PATH: Path = UPLOAD_DIR
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
