@echo off
echo ========================================
echo    SmartSignal AI - Project Launcher
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "smart-signal-ai-mvp" (
    echo Error: smart-signal-ai-mvp folder not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Starting SmartSignal AI Project...
echo.

REM Start Backend
echo [1/3] Starting Backend Server...
start "SmartSignal Backend" cmd /k "cd smart-signal-ai-mvp\backend && venv\Scripts\activate && python app.py"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [2/3] Starting Frontend Development Server...
start "SmartSignal Frontend" cmd /k "cd smart-signal-ai-mvp\frontend && npm run dev"

REM Wait for frontend to start
echo Waiting for frontend to initialize...
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
echo Press any key to close this window...
pause >nul

