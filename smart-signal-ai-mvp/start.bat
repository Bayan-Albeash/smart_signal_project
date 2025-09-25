@echo off
echo 🚀 Starting SmartSignal AI...
echo.

REM Start Backend
echo 📦 Starting Backend...
start "SmartSignal Backend" cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python app.py"

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend
echo ⚛️ Starting Frontend...
start "SmartSignal Frontend" cmd /k "cd frontend && npm install && npm run dev"

REM Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

REM Start Policy Engine
echo 🤖 Starting Policy Engine...
start "SmartSignal Policy Engine" cmd /k "cd backend\policy_engine && pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port 8000"

echo.
echo ✅ SmartSignal AI is starting up!
echo.
echo 🌐 Services will be available at:
echo    - Backend API: http://localhost:5000
echo    - Frontend: http://localhost:5173
echo    - Policy Engine: http://localhost:8000
echo.
echo Press any key to close this window...
pause >nul
