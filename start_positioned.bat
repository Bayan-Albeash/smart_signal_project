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

REM Start Backend (Position: Top Left)
echo [1/3] Starting Backend Server...
start "SmartSignal Backend" cmd /k "cd smart-signal-ai-mvp\backend && venv\Scripts\activate && python app.py"
timeout /t 2 /nobreak >nul

REM Position Backend window (Top Left)
powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::AllScreens[0].WorkingArea | ForEach-Object { $_.X = 0; $_.Y = 0; $_.Width = 600; $_.Height = 400 }"

REM Start Frontend (Position: Top Right)
echo [2/3] Starting Frontend Development Server...
start "SmartSignal Frontend" cmd /k "cd smart-signal-ai-mvp\frontend && npm run dev"
timeout /t 2 /nobreak >nul

REM Position Frontend window (Top Right)
powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::AllScreens[0].WorkingArea | ForEach-Object { $_.X = 600; $_.Y = 0; $_.Width = 600; $_.Height = 400 }"

REM Start Policy Engine (Position: Bottom Left)
echo [3/3] Starting Policy Engine...
start "SmartSignal Policy Engine" cmd /k "cd smart-signal-ai-mvp\backend\policy_engine && uvicorn main:app --host 0.0.0.0 --port 8000"
timeout /t 2 /nobreak >nul

REM Position Policy Engine window (Bottom Left)
powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::AllScreens[0].WorkingArea | ForEach-Object { $_.X = 0; $_.Y = 400; $_.Width = 600; $_.Height = 400 }"

echo.
echo ========================================
echo    All services started successfully!
echo ========================================
echo.
echo Backend:    http://localhost:5000
echo Frontend:   http://localhost:5173
echo Policy:     http://localhost:8000
echo.
echo Windows positioned:
echo - Backend: Top Left
echo - Frontend: Top Right  
echo - Policy: Bottom Left
echo.
echo Press any key to close this window...
pause >nul

