#!/bin/bash

echo "🚀 Starting SmartSignal AI Production Server..."

# Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Start Backend with Production Settings
echo "🔧 Starting Backend Production Server..."
cd ../backend

# Install dependencies if needed
pip install -r requirements.txt

# Set production environment
export FLASK_ENV=production
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Start with gunicorn for production
gunicorn --bind 0.0.0.0:5000 --workers 2 --timeout 120 --keep-alive 2 app:app

echo "✅ SmartSignal AI is running on http://localhost:5000"