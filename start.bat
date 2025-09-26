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
echo.
pause