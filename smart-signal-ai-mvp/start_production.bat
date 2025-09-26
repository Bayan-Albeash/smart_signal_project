@echo off
echo 🚀 Starting SmartSignal AI Production Server...
echo.

REM Build Frontend
echo 📦 Building Frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

REM Start Backend with Production Settings
echo 🔧 Starting Backend Production Server...
cd ..\backend

REM Install dependencies if needed
pip install -r requirements.txt

REM Set production environment
set FLASK_ENV=production

REM Start with gunicorn for production (if available) or fallback to Flask
where gunicorn >nul 2>nul
if %errorlevel% == 0 (
    echo Starting with Gunicorn (Production)...
    gunicorn --bind 0.0.0.0:5000 --workers 2 --timeout 120 --keep-alive 2 app:app
) else (
    echo Gunicorn not found, starting with Flask...
    python app.py
)

echo ✅ SmartSignal AI is running on http://localhost:5000
pause