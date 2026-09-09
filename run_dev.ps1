Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Starting METROCHECK - Legal Metrology Compliance System" -ForegroundColor Green
Write-Host "Smart India Hackathon 2026 - Problem SIH26034" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

if (-not (Test-Path ".\.venv\Scripts\python.exe")) {
    Write-Host "Setting up Python virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
    .\.venv\Scripts\pip.exe install -r apps\api\requirements.txt
}

Write-Host "Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/api; ..\..\.venv\Scripts\uvicorn.exe main:app --reload --port 8000"

Write-Host "Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web; npm run dev"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "MetroCheck is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "API Swagger Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Cyan
