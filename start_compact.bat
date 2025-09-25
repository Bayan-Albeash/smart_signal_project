@echo off
echo Starting SmartSignal AI with positioned windows...

REM Start Backend (Top Left)
start "Backend" cmd /k "cd smart-signal-ai-mvp\backend && venv\Scripts\activate && python app.py"
timeout /t 3 /nobreak >nul

REM Start Frontend (Top Right)
start "Frontend" cmd /k "cd smart-signal-ai-mvp\frontend && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Policy Engine (Bottom Left)
start "Policy Engine" cmd /k "cd smart-signal-ai-mvp\backend\policy_engine && uvicorn main:app --host 0.0.0.0 --port 8000"

echo Done! Windows positioned:
echo - Backend: Top Left
echo - Frontend: Top Right
echo - Policy: Bottom Left
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo Policy: http://localhost:8000
pause

