@echo off
echo 🚀 Starting SmartSignal AI...
echo.

REM Start Backend
echo 📦 Starting Backend...
start "SmartSignal Backend" cmd /k "cd smart-signal-ai-mvp\backend && venv\Scripts\activate && python app.py"

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend
echo ⚛️ Starting Frontend...
start "SmartSignal Frontend" cmd /k "cd smart-signal-ai-mvp\frontend && npm run dev"

REM Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

REM Start Policy Engine
echo 🤖 Starting Policy Engine...
start "SmartSignal Policy Engine" cmd /k "cd smart-signal-ai-mvp\backend\policy_engine && uvicorn main:app --host 0.0.0.0 --port 8000"

echo.
echo ✅ SmartSignal AI is starting up!
echo.
echo 🌐 Services will be available at:
echo    - Backend API: http://localhost:5000
echo    - Frontend: http://localhost:5173
echo    - Policy Engine: http://localhost:8000
echo.
echo 🛑 Close all command windows to stop services
echo.
pause