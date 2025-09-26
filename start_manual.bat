@echo off
echo ========================================
echo    SmartSignal AI - Manual Launcher
echo ========================================
echo.

echo Starting SmartSignal AI Project...
echo.

REM Start Backend
echo [1/3] Starting Backend Server...
start "SmartSignal Backend" cmd /k "cd smart-signal-ai-mvp\backend && venv\Scripts\activate && python app.py"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [2/3] Starting Frontend Development Server...
start "SmartSignal Frontend" cmd /k "cd smart-signal-ai-mvp\frontend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Policy Engine
echo [3/3] Starting Policy Engine...
start "SmartSignal Policy Engine" cmd /k "cd smart-signal-ai-mvp\backend\policy_engine && uvicorn main:app --host 0.0.0.0 --port 8000"

echo.
echo ========================================
echo    All services started successfully!
echo ========================================
echo.
echo Backend:    http://localhost:5000
echo Frontend:   http://localhost:5173
echo Policy:     http://localhost:8000
echo.
echo ========================================
echo    Manual Window Positioning Guide
echo ========================================
echo.
echo 1. Backend Window: Move to TOP LEFT
echo 2. Frontend Window: Move to TOP RIGHT
echo 3. Policy Engine Window: Move to BOTTOM LEFT
echo.
echo Recommended sizes:
echo - Backend: 600x400 pixels
echo - Frontend: 600x400 pixels
echo - Policy: 600x400 pixels
echo.
echo Press any key to close this window...
pause >nul

