@echo off
echo Starting SmartSignal AI Project...
echo.

echo 🚀 Starting Backend (Flask)...
start "Backend" cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend (React)...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ✅ Project started successfully!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend API: http://localhost:5000
echo 📡 WebSocket: ws://localhost:8765

REM Start Frontend
echo ⚛️ Starting Frontend...
start "SmartSignal Frontend" cmd /k "cd smart-signal-ai-mvp\frontend && npm install && npm run dev"

REM Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

REM Start Policy Engine
echo 🤖 Starting Policy Engine...
start "SmartSignal Policy Engine" cmd /k "cd smart-signal-ai-mvp\backend\policy_engine && uvicorn main:app --host 0.0.0.0 --port 8000"

echo.
echo ✅ SmartSignal AI is starting up!
echo.
echo 🌐 Services will be available at:
echo    Backend API: http://localhost:5000
echo    Frontend: http://localhost:5173
echo    Policy Engine: http://localhost:8000
echo.
echo 🛑 Close all command windows to stop services
>>>>>>> 1fcb6b2f409bed0d5e26988da5cb98278f55ead1
echo.
pause