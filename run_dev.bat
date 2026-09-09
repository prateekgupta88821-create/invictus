@echo off
echo =========================================================
echo Starting METROCHECK - Legal Metrology Compliance System
echo Smart India Hackathon 2026 - Problem SIH26034
echo =========================================================

REM Check Python virtualenv
if not exist ".venv\Scripts\python.exe" (
    echo Creating Python virtual environment...
    python -m venv .venv
    call .\.venv\Scripts\pip.exe install -r apps\api\requirements.txt
)

echo Starting FastAPI Backend on http://localhost:8000 ...
start "MetroCheck Backend API" cmd /k "cd apps\api && ..\..\.venv\Scripts\uvicorn.exe main:app --reload --port 8000"

echo Starting Next.js Web Frontend on http://localhost:3000 ...
start "MetroCheck Web App" cmd /k "cd apps\web && npm run dev"

echo =========================================================
echo MetroCheck is launching!
echo Web UI: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo =========================================================
