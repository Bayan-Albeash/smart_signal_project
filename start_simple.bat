@echo off
echo Starting SmartSignal AI...

REM Start Backend
start "Backend" cmd /k "cd smart-signal-ai-mvp\backend && venv\Scripts\activate && python app.py"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start Frontend  
start "Frontend" cmd /k "cd smart-signal-ai-mvp\frontend && npm run dev"

echo Done! Check the opened windows.
pause

